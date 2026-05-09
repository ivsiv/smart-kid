let settings = null;
let navState = { grade: null, subject: null, script: null };

document.addEventListener("DOMContentLoaded", async () => {
    const resp = await fetch("settings.json");
    settings = await resp.json();
    setLang(currentLang);
    renderGrades();
    setupLangSwitcher();
});

function setupLangSwitcher() {
    document.querySelectorAll("#lang-switcher button").forEach(btn => {
        btn.addEventListener("click", () => {
            setLang(btn.dataset.lang);
            rerender();
        });
    });
}

function rerender() {
    if (navState.script) return; // script pages manage their own i18n
    if (navState.subject) renderScripts(navState.grade, navState.subject);
    else if (navState.grade) renderSubjects(navState.grade);
    else renderGrades();
}

function updateBreadcrumb() {
    const bc = document.getElementById("breadcrumb");
    let parts = [`<a href="#" data-nav="home">${t("nav.home")}</a>`];
    if (navState.grade) {
        parts.push(`<a href="#" data-nav="grade">${t("grades." + navState.grade)}</a>`);
    }
    if (navState.subject) {
        parts.push(`<a href="#" data-nav="subject">${t("subjects." + navState.subject)}</a>`);
    }
    bc.innerHTML = parts.join("");
    bc.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", e => {
            e.preventDefault();
            const nav = a.dataset.nav;
            if (nav === "home") { navState = { grade: null, subject: null, script: null }; renderGrades(); }
            else if (nav === "grade") { navState.subject = null; navState.script = null; renderSubjects(navState.grade); }
            else if (nav === "subject") { navState.script = null; renderScripts(navState.grade, navState.subject); }
        });
    });
}

function renderGrades() {
    navState = { grade: null, subject: null, script: null };
    updateBreadcrumb();
    const main = document.getElementById("content");
    const grades = Object.keys(settings);
    main.innerHTML = `<div class="btn-grid">${grades.map(g =>
        `<button class="btn" data-grade="${g}">${t("grades." + g)}</button>`
    ).join("")}</div>`;
    main.querySelectorAll("[data-grade]").forEach(btn => {
        btn.addEventListener("click", () => {
            navState.grade = btn.dataset.grade;
            renderSubjects(btn.dataset.grade);
        });
    });
}

function renderSubjects(grade) {
    navState.subject = null;
    navState.script = null;
    updateBreadcrumb();
    const main = document.getElementById("content");
    const subjects = Object.keys(settings[grade]);
    main.innerHTML = `<div class="btn-grid">${subjects.map(s =>
        `<button class="btn" data-subject="${s}">${t("subjects." + s)}</button>`
    ).join("")}</div>`;
    main.querySelectorAll("[data-subject]").forEach(btn => {
        btn.addEventListener("click", () => {
            navState.subject = btn.dataset.subject;
            renderScripts(grade, btn.dataset.subject);
        });
    });
}

function renderScripts(grade, subject) {
    navState.script = null;
    updateBreadcrumb();
    const main = document.getElementById("content");
    const scripts = settings[grade][subject];
    const keys = Object.keys(scripts);
    main.innerHTML = `<div class="btn-grid">${keys.map(k =>
        `<button class="btn" data-script="${k}">${t("scripts." + k)}</button>`
    ).join("")}</div>`;
    main.querySelectorAll("[data-script]").forEach(btn => {
        btn.addEventListener("click", () => {
            navState.script = btn.dataset.script;
            loadScript(scripts[btn.dataset.script]);
        });
    });
}

function loadScript(src) {
    updateBreadcrumb();
    const main = document.getElementById("content");
    main.innerHTML = "";
    // Clear previously loaded init functions so the correct one is detected after load
    window.initArithmetic = undefined;
    window.initListedWords = undefined;
    window._initScript = undefined;
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => {
        if (typeof window._initScript === "function") { window._initScript(main); return; }
        if (typeof initArithmetic === "function") initArithmetic(main);
        else if (typeof initListedWords === "function") initListedWords(main);
    };
    document.body.appendChild(s);
}
