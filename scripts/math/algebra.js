function initAlgebra(container) {
    let seed = Math.floor(Math.random() * 10000);
    let d1 = { min: 1, max: 1 };
    let d2 = { min: 1, max: 1 };
    // maxResult: 0 = no limit; otherwise cap the result
    let maxResult = 0;
    const MAX_RESULT_STEPS = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 0]; // 0 = ∞
    let maxResultStep = 9; // default = ∞
    let ops = ["+"];
    let correct = 0, incorrect = 0;
    let history = [];
    let rng = mulberry32(seed);
    let gridSize = 5;

    function mulberry32(a) {
        return function() {
            a |= 0; a = a + 0x6D2B79F5 | 0;
            var t = Math.imul(a ^ a >>> 15, 1 | a);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    function randInt(min, max) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    function generateTask() {
        const numDigits1 = randInt(d1.min, d1.max);
        const numDigits2 = randInt(d2.min, d2.max);
        const min1 = numDigits1 === 1 ? 1 : Math.pow(10, numDigits1 - 1);
        const max1 = Math.pow(10, numDigits1) - 1;
        const min2 = numDigits2 === 1 ? 1 : Math.pow(10, numDigits2 - 1);
        const max2 = Math.pow(10, numDigits2) - 1;
        const op = ops[Math.floor(rng() * ops.length)];
        let a = randInt(min1, max1);
        let b = randInt(min2, max2);

        if (op === "-" && a < b) [a, b] = [b, a];
        if (op === "/" && b === 0) b = 1;

        // Enforce max result (up to 30 retries to stay in range)
        const limit = MAX_RESULT_STEPS[maxResultStep];
        if (limit > 0) {
            let tries = 0;
            while (tries < 30) {
                const res = computeResultRaw(a, b, op);
                if (res <= limit) break;
                a = randInt(min1, Math.min(max1, limit));
                b = randInt(min2, Math.min(max2, limit));
                if (op === "-" && a < b) [a, b] = [b, a];
                if (op === "/" && b === 0) b = 1;
                tries++;
            }
        }

        return { a, b, op };
    }

    function computeResultRaw(a, b, op) {
        switch (op) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            case "/": return Math.floor(a / b);
        }
    }

    function computeAnswer(task) {
        switch (task.op) {
            case "+": return { result: task.a + task.b, remainder: null };
            case "-": return { result: task.a - task.b, remainder: null };
            case "*": return { result: task.a * task.b, remainder: null };
            case "/": return { result: Math.floor(task.a / task.b), remainder: task.a % task.b };
        }
    }

    function opSymbol(op) {
        return op === "*" ? "×" : op === "/" ? "÷" : op;
    }

    function maxResultLabel() {
        const v = MAX_RESULT_STEPS[maxResultStep];
        return v === 0 ? t("algebra.nolimit") : String(v);
    }

    let currentTask = null;

    function render() {
        rng = mulberry32(seed);
        // skip past already answered tasks
        for (let i = 0; i < history.length; i++) generateTask();
        currentTask = generateTask();

        const showRemainder = currentTask.op === "/";

        container.innerHTML = `
        <div class="algebra-container">
            <div class="seed-row">
                <label>${t("algebra.seed")}:</label>
                <input type="number" id="alg-seed" value="${seed}">
                <button id="alg-reseed">${t("algebra.regenerate")}</button>
            </div>
            <div>
                <label>${t("algebra.digits1")}: <span class="range-val">${d1.min}–${d1.max}</span></label>
                <div class="dual-range">
                    <span>${t("algebra.from")}</span>
                    <input type="range" id="alg-d1-min" min="1" max="4" value="${d1.min}">
                    <span>${t("algebra.to")}</span>
                    <input type="range" id="alg-d1-max" min="1" max="4" value="${d1.max}">
                </div>
            </div>
            <div>
                <label>${t("algebra.digits2")}: <span class="range-val">${d2.min}–${d2.max}</span></label>
                <div class="dual-range">
                    <span>${t("algebra.from")}</span>
                    <input type="range" id="alg-d2-min" min="1" max="4" value="${d2.min}">
                    <span>${t("algebra.to")}</span>
                    <input type="range" id="alg-d2-max" min="1" max="4" value="${d2.max}">
                </div>
            </div>
            <div>
                <label>${t("algebra.maxresult")}: <span class="range-val" id="maxresult-val">${maxResultLabel()}</span></label>
                <input type="range" id="alg-maxresult" min="0" max="9" step="1" value="${maxResultStep}">
            </div>
            <div>
                <label>${t("algebra.ops")}:</label>
                <div class="ops-select">
                    <label><input type="checkbox" value="+" ${ops.includes("+")?"checked":""}> +</label>
                    <label><input type="checkbox" value="-" ${ops.includes("-")?"checked":""}> −</label>
                    <label><input type="checkbox" value="*" ${ops.includes("*")?"checked":""}> ×</label>
                    <label><input type="checkbox" value="/" ${ops.includes("/")?"checked":""}> ÷</label>
                </div>
            </div>
            <div class="task-display">${currentTask.a} ${opSymbol(currentTask.op)} ${currentTask.b} = ?${showRemainder ? ` (${t("algebra.remainder")}: ?)` : ""}</div>
            <div class="answer-row">
                <input type="number" id="alg-answer" placeholder="?" inputmode="numeric">
                ${showRemainder ? `<input type="number" id="alg-remainder" placeholder="${t("algebra.remainder")}" inputmode="numeric">` : ""}
            </div>
            <div class="submit-score-row">
                <button id="alg-submit">${t("algebra.submit")}</button>
                <div class="score">
                    <span class="correct">✓ ${correct}</span>
                    <span class="incorrect">✗ ${incorrect}</span>
                </div>
            </div>
            <div class="scratchpad-section">
                <label>${t("algebra.scratchpad")}</label>
                <div class="scratchpad-controls">
                    <label>${t("algebra.size")}:</label>
                    <select id="grid-size">${[5,6,7,8].map(n=>`<option value="${n}" ${n===gridSize?"selected":""}>${n}×${n}</option>`).join("")}</select>
                </div>
                <div class="scratchpad-grid" id="scratchpad" style="grid-template-columns:repeat(${gridSize},36px)"></div>
            </div>
            <div class="history-section">
                <label>${t("algebra.history")}</label>
                <div id="alg-history">${history.map(h=>`<div class="history-item ${h.ok?"ok":"fail"}">${h.text}</div>`).join("")}</div>
            </div>
        </div>`;

        // Build scratchpad
        const pad = document.getElementById("scratchpad");
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement("input");
            cell.className = "cell";
            cell.maxLength = 1;
            cell.inputMode = "numeric";
            cell.addEventListener("focus", () => cell.select());
            cell.addEventListener("input", () => {
                if (cell.value.length >= 1) {
                    const next = pad.children[i + 1];
                    if (next) next.focus();
                }
            });
            pad.appendChild(cell);
        }

        // Events
        document.getElementById("alg-seed").addEventListener("change", e => {
            seed = parseInt(e.target.value) || 0;
            history = []; correct = 0; incorrect = 0;
            render();
        });
        document.getElementById("alg-reseed").addEventListener("click", () => {
            seed = Math.floor(Math.random() * 10000);
            history = []; correct = 0; incorrect = 0;
            render();
        });

        function updateD1Label() {
            container.querySelector("#alg-d1-min").closest("div").querySelector(".range-val").textContent = `${d1.min}–${d1.max}`;
        }
        function updateD2Label() {
            container.querySelector("#alg-d2-min").closest("div").querySelector(".range-val").textContent = `${d2.min}–${d2.max}`;
        }

        document.getElementById("alg-d1-min").addEventListener("input", e => {
            d1.min = parseInt(e.target.value);
            if (d1.min > d1.max) { d1.max = d1.min; document.getElementById("alg-d1-max").value = d1.max; }
            updateD1Label();
        });
        document.getElementById("alg-d1-max").addEventListener("input", e => {
            d1.max = parseInt(e.target.value);
            if (d1.max < d1.min) { d1.min = d1.max; document.getElementById("alg-d1-min").value = d1.min; }
            updateD1Label();
        });
        document.getElementById("alg-d2-min").addEventListener("input", e => {
            d2.min = parseInt(e.target.value);
            if (d2.min > d2.max) { d2.max = d2.min; document.getElementById("alg-d2-max").value = d2.max; }
            updateD2Label();
        });
        document.getElementById("alg-d2-max").addEventListener("input", e => {
            d2.max = parseInt(e.target.value);
            if (d2.max < d2.min) { d2.min = d2.max; document.getElementById("alg-d2-min").value = d2.min; }
            updateD2Label();
        });

        document.getElementById("alg-maxresult").addEventListener("input", e => {
            maxResultStep = parseInt(e.target.value);
            document.getElementById("maxresult-val").textContent = maxResultLabel();
        });

        document.querySelectorAll(".ops-select input").forEach(cb => {
            cb.addEventListener("change", () => {
                const selected = [...document.querySelectorAll(".ops-select input:checked")].map(c => c.value);
                if (selected.length > 0) ops = selected;
            });
        });
        document.getElementById("grid-size").addEventListener("change", e => {
            gridSize = parseInt(e.target.value);
            render();
        });
        document.getElementById("alg-submit").addEventListener("click", submit);
        document.getElementById("alg-answer").addEventListener("keydown", e => {
            if (e.key === "Enter") submit();
        });
    }

    function submit() {
        const ansEl = document.getElementById("alg-answer");
        const remEl = document.getElementById("alg-remainder");
        const userAns = parseInt(ansEl.value);
        const expected = computeAnswer(currentTask);
        let isCorrect = userAns === expected.result;
        if (currentTask.op === "/" && remEl) {
            const userRem = parseInt(remEl.value);
            isCorrect = isCorrect && userRem === expected.remainder;
        }

        const text = `${currentTask.a} ${opSymbol(currentTask.op)} ${currentTask.b} = ${ansEl.value}${remEl ? " r" + (remEl.value||"?") : ""} ${isCorrect ? "✓" : "✗ (" + expected.result + (expected.remainder !== null ? " r" + expected.remainder : "") + ")"}`;
        history.push({ ok: isCorrect, text });
        if (isCorrect) correct++; else incorrect++;
        render();
        document.getElementById("alg-answer").focus();
    }

    render();
}
