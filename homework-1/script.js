// ===== 1. SELECT ELEMENTS =====

const themeButton = document.querySelector("#theme-btn");
const themeIcon = document.querySelector("#theme-icon");
const themeLabel = document.querySelector("#theme-label");


// ===== 2. APPLY THEME =====

function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-theme", isDark);

    themeButton.setAttribute("aria-pressed", String(isDark));

    themeIcon.textContent = isDark ? "☀️" : "🌙";
    themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";
}


// ===== 3. LOAD SAVED THEME =====

const savedTheme = localStorage.getItem("theme");

applyTheme(savedTheme === "dark" ? "dark" : "light");


// ===== 4. HANDLE CLICK EVENT =====

themeButton.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");

    const newTheme = isDark ? "light" : "dark";

    applyTheme(newTheme);

    localStorage.setItem("theme", newTheme);
});