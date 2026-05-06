const I18N = {
    en: {
        "nav.home": "Home",
        "footer.credits": "Created for young learners",
        "grades.1st grade": "1st Grade",
        "grades.2nd grade": "2nd Grade",
        "grades.3rd grade": "3rd Grade",
        "subjects.Maths": "Maths",
        "scripts.simple_algebra": "Addition, Subtraction, Multiplication & Division",
        "algebra.seed": "Seed",
        "algebra.regenerate": "⟳",
        "algebra.digits1": "Digits (1st number)",
        "algebra.digits2": "Digits (2nd number)",
        "algebra.ops": "Operations",
        "algebra.submit": "Check",
        "algebra.correct": "Correct",
        "algebra.incorrect": "Wrong",
        "algebra.scratchpad": "Scratch Pad",
        "algebra.size": "Size",
        "algebra.history": "History",
        "algebra.remainder": "remainder",
        "algebra.maxresult": "Max result",
        "algebra.nolimit": "∞ no limit",
        "algebra.from": "from",
        "algebra.to": "to"
    },
    cs: {
        "nav.home": "Domů",
        "footer.credits": "Vytvořeno pro malé studenty",
        "grades.1st grade": "1. třída",
        "grades.2nd grade": "2. třída",
        "grades.3rd grade": "3. třída",
        "subjects.Maths": "Matematika",
        "scripts.simple_algebra": "Sčítání, odčítání, násobení a dělení",
        "algebra.seed": "Seed",
        "algebra.regenerate": "⟳",
        "algebra.digits1": "Číslice (1. číslo)",
        "algebra.digits2": "Číslice (2. číslo)",
        "algebra.ops": "Operace",
        "algebra.submit": "Zkontrolovat",
        "algebra.correct": "Správně",
        "algebra.incorrect": "Špatně",
        "algebra.scratchpad": "Pomocný papír",
        "algebra.size": "Rozměr",
        "algebra.history": "Historie",
        "algebra.remainder": "zbytek",
        "algebra.maxresult": "Max výsledek",
        "algebra.nolimit": "∞ bez omezení",
        "algebra.from": "od",
        "algebra.to": "do"
    }
};

let currentLang = localStorage.getItem("smart-kid-lang") || "en";

function t(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem("smart-kid-lang", lang);
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("#lang-switcher button").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });
}
