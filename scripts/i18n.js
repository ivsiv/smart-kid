const I18N = {
    en: {
        "nav.home": "Home",
        "footer.credits": "Created for young learners",
        "grades.1st grade": "1st Grade",
        "grades.2nd grade": "2nd Grade",
        "grades.3rd grade": "3rd Grade",
        "subjects.Maths": "Maths",
        "scripts.simple_arithmetic": "Addition, Subtraction, Multiplication & Division",
        "arithmetic.seed": "Seed",
        "arithmetic.regenerate": "⟳",
        "arithmetic.digits1": "Digits (1st number)",
        "arithmetic.digits2": "Digits (2nd number)",
        "arithmetic.ops": "Operations",
        "arithmetic.submit": "Check",
        "arithmetic.correct": "Correct",
        "arithmetic.incorrect": "Wrong",
        "arithmetic.scratchpad": "Scratch Pad",
        "arithmetic.size": "Size",
        "arithmetic.history": "History",
        "arithmetic.remainder": "remainder",
        "arithmetic.maxresult": "Max result",
        "arithmetic.nolimit": "∞ no limit",
        "arithmetic.from": "from",
        "arithmetic.to": "to"
    },
    cs: {
        "nav.home": "Domů",
        "footer.credits": "Vytvořeno pro malé studenty",
        "grades.1st grade": "1. třída",
        "grades.2nd grade": "2. třída",
        "grades.3rd grade": "3. třída",
        "subjects.Maths": "Matematika",
        "scripts.simple_arithmetic": "Sčítání, odčítání, násobení a dělení",
        "arithmetic.seed": "Seed",
        "arithmetic.regenerate": "⟳",
        "arithmetic.digits1": "Číslice (1. číslo)",
        "arithmetic.digits2": "Číslice (2. číslo)",
        "arithmetic.ops": "Operace",
        "arithmetic.submit": "Zkontrolovat",
        "arithmetic.correct": "Správně",
        "arithmetic.incorrect": "Špatně",
        "arithmetic.scratchpad": "Pomocný papír",
        "arithmetic.size": "Rozměr",
        "arithmetic.history": "Historie",
        "arithmetic.remainder": "zbytek",
        "arithmetic.maxresult": "Max výsledek",
        "arithmetic.nolimit": "∞ bez omezení",
        "arithmetic.from": "od",
        "arithmetic.to": "do"
    },
    sk: {
        "nav.home": "Domov",
        "footer.credits": "Vytvorené pre mladých študentov",
        "grades.1st grade": "1. ročník",
        "grades.2nd grade": "2. ročník",
        "grades.3rd grade": "3. ročník",
        "subjects.Maths": "Matematika",
        "scripts.simple_arithmetic": "Sčítanie, odčítanie, násobenie a delenie",
        "arithmetic.seed": "Seed",
        "arithmetic.regenerate": "⟳",
        "arithmetic.digits1": "Číslice (1. číslo)",
        "arithmetic.digits2": "Číslice (2. číslo)",
        "arithmetic.ops": "Operácie",
        "arithmetic.submit": "Skontrolovať",
        "arithmetic.correct": "Správne",
        "arithmetic.incorrect": "Zle",
        "arithmetic.scratchpad": "Pomocný papier",
        "arithmetic.size": "Veľkosť",
        "arithmetic.history": "História",
        "arithmetic.remainder": "zvyšok",
        "arithmetic.maxresult": "Max výsledok",
        "arithmetic.nolimit": "∞ bez obmedzenia",
        "arithmetic.from": "od",
        "arithmetic.to": "do"
    },
    uk: {
        "nav.home": "Головна",
        "footer.credits": "Створено для юних учнів",
        "grades.1st grade": "1-й клас",
        "grades.2nd grade": "2-й клас",
        "grades.3rd grade": "3-й клас",
        "subjects.Maths": "Математика",
        "scripts.simple_arithmetic": "Додавання, віднімання, множення та ділення",
        "arithmetic.seed": "Seed",
        "arithmetic.regenerate": "⟳",
        "arithmetic.digits1": "Цифри (1-е число)",
        "arithmetic.digits2": "Цифри (2-е число)",
        "arithmetic.ops": "Операції",
        "arithmetic.submit": "Перевірити",
        "arithmetic.correct": "Правильно",
        "arithmetic.incorrect": "Неправильно",
        "arithmetic.scratchpad": "Чернетка",
        "arithmetic.size": "Розмір",
        "arithmetic.history": "Історія",
        "arithmetic.remainder": "залишок",
        "arithmetic.maxresult": "Макс результат",
        "arithmetic.nolimit": "∞ без обмежень",
        "arithmetic.from": "від",
        "arithmetic.to": "до"
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
