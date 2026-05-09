async function initListedWords(container) {
    const ALL_LETTERS = ['B', 'L', 'M', 'P', 'S', 'V', 'Z'];
    let activeLetters = [...ALL_LETTERS];
    const sentencePool = {};

    let seed = Math.floor(Math.random() * 10000);
    let difficulty = 0; // 0=easy, 1=medium, 2=hard
    let correct = 0, incorrect = 0;
    let history = [];
    let rng = null;
    let currentItem = null;
    let currentGaps = null;
    let checked = false;

    function mulberry32(a) {
        return function () {
            a |= 0; a = a + 0x6D2B79F5 | 0;
            var t = Math.imul(a ^ a >>> 15, 1 | a);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    async function loadAll() {
        for (const letter of ALL_LETTERS) {
            try {
                const resp = await fetch(`scripts/czech/listed_words/${letter}.md`);
                const text = await resp.text();
                sentencePool[letter] = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);
            } catch (e) {
                sentencePool[letter] = [];
            }
        }
    }

    // Each call consumes exactly 3 RNG values to keep the sequence stable
    // regardless of difficulty setting changes.
    function pickNextItem() {
        const avail = activeLetters.filter(l => (sentencePool[l] || []).length > 0);
        if (avail.length === 0) {
            rng(); rng(); rng();
            return null;
        }
        const letter = avail[Math.floor(rng() * avail.length)];
        const pool = sentencePool[letter];
        const sentence = pool[Math.floor(rng() * pool.length)];
        const extraGapRand = rng(); // consumed always; used only in medium mode
        return { letter, sentence, extraGapRand };
    }

    const IY = new Set(['i', 'y', 'í', 'ý']);

    function findMainGaps(sentence, mainLetter) {
        const lower = mainLetter.toLowerCase();
        const upper = mainLetter.toUpperCase();
        const positions = new Set();
        for (let i = 0; i < sentence.length - 1; i++) {
            const c = sentence[i];
            if ((c === lower || c === upper) && IY.has(sentence[i + 1])) {
                positions.add(i + 1);
            }
        }
        return positions;
    }

    function computeGaps(sentence, mainLetter, diff, extraGapRand) {
        const gaps = findMainGaps(sentence, mainLetter);

        if (diff === 1) { // medium: add one extra i/y from anywhere else
            const others = [];
            for (let i = 0; i < sentence.length; i++) {
                if (IY.has(sentence[i]) && !gaps.has(i)) others.push(i);
            }
            if (others.length > 0) {
                gaps.add(others[Math.floor(extraGapRand * others.length)]);
            }
        } else if (diff === 2) { // hard: hide every i/y in the sentence
            for (let i = 0; i < sentence.length; i++) {
                if (IY.has(sentence[i])) gaps.add(i);
            }
        }
        return gaps;
    }

    // 'i' and 'í' belong to the i-family; 'y' and 'ý' to the y-family.
    function charBase(c) {
        const l = c.toLowerCase();
        return (l === 'i' || l === 'í') ? 'i' : 'y';
    }

    // Returns the [iLabel, yLabel] button pair matching the form of the hidden character.
    // e.g. 'í' → ['í','ý'],  'I' → ['I','Y'],  'Í' → ['Í','Ý']
    const BUTTON_PAIRS = {
        'i': ['i','y'], 'y': ['i','y'],
        'í': ['í','ý'], 'ý': ['í','ý'],
        'I': ['I','Y'], 'Y': ['I','Y'],
        'Í': ['Í','Ý'], 'Ý': ['Í','Ý'],
    };
    function buttonPair(actual) {
        return BUTTON_PAIRS[actual] || ['i', 'y'];
    }

    function esc(c) {
        return c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c;
    }

    function buildSentenceHTML(sentence, gaps) {
        let html = '';
        for (let i = 0; i < sentence.length; i++) {
            if (gaps.has(i)) {
                const actual = sentence[i];
                const [iLabel, yLabel] = buttonPair(actual);
                html +=
                    `<span class="lw-gap" data-actual="${actual}" data-selected="">` +
                    `<span class="lw-gap-btns">` +
                    `<button class="lw-gap-btn" data-val="${iLabel}">${iLabel}</button>` +
                    `<button class="lw-gap-btn" data-val="${yLabel}">${yLabel}</button>` +
                    `</span>` +
                    `<span class="lw-gap-slot">_</span>` +
                    `</span>`;
            } else {
                html += esc(sentence[i]);
            }
        }
        return html;
    }

    const DIFF_KEYS = ['lw.easy', 'lw.medium', 'lw.hard'];

    function render() {
        rng = mulberry32(seed);
        for (let i = 0; i < history.length; i++) pickNextItem(); // advance past answered items
        currentItem = pickNextItem();
        checked = false;

        if (!currentItem) {
            container.innerHTML = `<div class="lw-container"><p style="text-align:center;color:#888">${t('lw.no_letters')}</p></div>`;
            return;
        }

        currentGaps = computeGaps(currentItem.sentence, currentItem.letter, difficulty, currentItem.extraGapRand);
        const sentHTML = buildSentenceHTML(currentItem.sentence, currentGaps);

        container.innerHTML = `
        <div class="lw-container">
            <div class="seed-row">
                <label>${t('lw.seed')}:</label>
                <input type="number" id="lw-seed" value="${seed}">
                <button id="lw-reseed">${t('lw.regenerate')}</button>
            </div>
            <div class="lw-letters-row">
                <label>${t('lw.letters')}:</label>
                <div class="lw-letters">
                    ${ALL_LETTERS.map(l =>
                        `<label class="lw-letter-label">
                            <input type="checkbox" value="${l}" ${activeLetters.includes(l) ? 'checked' : ''}>
                            ${l}
                        </label>`
                    ).join('')}
                </div>
            </div>
            <div class="lw-diff-row">
                <label>${t('lw.difficulty')}: <span id="lw-diff-label" class="range-val">${t(DIFF_KEYS[difficulty])}</span></label>
                <input type="range" id="lw-difficulty" min="0" max="2" step="1" value="${difficulty}">
                <div class="lw-diff-ticks">
                    <span>${t('lw.easy')}</span><span>${t('lw.medium')}</span><span>${t('lw.hard')}</span>
                </div>
            </div>
            <div class="lw-sentence-card">
                <div class="lw-letter-badge">${currentItem.letter}</div>
                <div class="lw-sentence">${sentHTML}</div>
            </div>
            <div class="submit-score-row">
                <button id="lw-check">${t('lw.check')}</button>
                <div class="score">
                    <span class="correct">✓ ${correct}</span>
                    <span class="incorrect">✗ ${incorrect}</span>
                </div>
            </div>
            <div class="history-section">
                <label>${t('lw.history')}</label>
                <div id="lw-history">${renderHistory()}</div>
            </div>
        </div>`;

        document.getElementById('lw-seed').addEventListener('change', e => {
            seed = parseInt(e.target.value) || 0;
            history = []; correct = 0; incorrect = 0;
            render();
        });
        document.getElementById('lw-reseed').addEventListener('click', () => {
            seed = Math.floor(Math.random() * 10000);
            history = []; correct = 0; incorrect = 0;
            render();
        });
        container.querySelectorAll('.lw-letters input[type=checkbox]').forEach(cb => {
            cb.addEventListener('change', () => {
                activeLetters = [...container.querySelectorAll('.lw-letters input:checked')].map(c => c.value);
                history = []; correct = 0; incorrect = 0;
                render();
            });
        });
        document.getElementById('lw-difficulty').addEventListener('input', e => {
            difficulty = parseInt(e.target.value);
            document.getElementById('lw-diff-label').textContent = t(DIFF_KEYS[difficulty]);
            // Difficulty applies from the next sentence; current sentence is unaffected.
        });
        document.getElementById('lw-check').addEventListener('click', checkOrNext);

        attachGapEvents();
    }

    function attachGapEvents() {
        container.querySelectorAll('.lw-gap').forEach(gapEl => {
            gapEl.querySelectorAll('.lw-gap-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (checked) return;
                    gapEl.dataset.selected = btn.dataset.val;
                    gapEl.querySelectorAll('.lw-gap-btn').forEach(b => b.classList.remove('lw-selected'));
                    btn.classList.add('lw-selected');
                    gapEl.querySelector('.lw-gap-slot').textContent = btn.dataset.val;
                });
            });
        });
    }

    function checkOrNext() {
        if (checked) {
            render();
            return;
        }
        checked = true;

        let allCorrect = true;
        container.querySelectorAll('.lw-gap').forEach(gapEl => {
            const actual = gapEl.dataset.actual;
            const selected = gapEl.dataset.selected;
            const isOk = selected !== '' && charBase(selected) === charBase(actual);
            if (!isOk) allCorrect = false;

            const slot = gapEl.querySelector('.lw-gap-slot');
            slot.textContent = actual; // always reveal the correct character
            gapEl.classList.add(isOk ? 'lw-gap-ok' : 'lw-gap-fail');
        });

        history.push({ ok: allCorrect, text: currentItem.sentence, letter: currentItem.letter });
        if (allCorrect) correct++; else incorrect++;

        container.querySelector('.correct').textContent = `✓ ${correct}`;
        container.querySelector('.incorrect').textContent = `✗ ${incorrect}`;
        const histEl = document.getElementById('lw-history');
        if (histEl) histEl.innerHTML = renderHistory();

        document.getElementById('lw-check').textContent = t('lw.next');
    }

    function renderHistory() {
        return history.slice().reverse().map(h =>
            `<div class="history-item ${h.ok ? 'ok' : 'fail'}">[${h.letter}] ${h.text}</div>`
        ).join('');
    }

    container.innerHTML = `<p style="text-align:center;padding:32px;color:#888">${t('lw.loading')}</p>`;
    await loadAll();
    render();
}

window._initScript = initListedWords;
