const themeButton = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.classList.add("light-theme");

    themeButton.textContent = "🌙 Dark Mode";
    themeButton.setAttribute("aria-pressed", "true");
} else {
    document.body.classList.remove("light-theme");

    themeButton.textContent = "☀ Light Mode";
    themeButton.setAttribute("aria-pressed", "false");
}

themeButton.addEventListener("click", function () {

    document.body.classList.toggle("light-theme");

    if (document.body.classList.contains("light-theme")) {

        localStorage.setItem("theme", "light");

        themeButton.textContent = "🌙 Dark Mode";
        themeButton.setAttribute("aria-pressed", "true");

    } else {

        localStorage.setItem("theme", "dark");

        themeButton.textContent = "☀ Light Mode";
        themeButton.setAttribute("aria-pressed", "false");

    }

});
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (contactForm.checkValidity()) {
        formStatus.textContent = "Message submitted successfully.";
        contactForm.reset();
    } else {
        formStatus.textContent = "Please complete all required fields.";
        contactForm.reportValidity();
    }

});