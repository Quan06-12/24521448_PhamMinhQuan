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
const projectList = document.getElementById("project-list");
const projectEmpty = document.getElementById("project-empty");
const projectError = document.getElementById("project-error");
const retryProjects = document.getElementById("retry-projects");

let projectState = "live";

function renderProjectState() {

    projectList.hidden = true;
    projectEmpty.hidden = true;
    projectError.hidden = true;

    if (projectState === "live") {
        projectList.hidden = false;
    }

    if (projectState === "empty") {
        projectEmpty.hidden = false;
    }

    if (projectState === "error") {
        projectError.hidden = false;
    }
}

retryProjects.addEventListener("click", function () {

    projectState = "live";

    renderProjectState();

});

renderProjectState();