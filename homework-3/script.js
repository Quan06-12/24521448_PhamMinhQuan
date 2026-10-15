
"use strict";

// ========================================
// T-02: DRIFT-FREE COUNTDOWN ENGINE
// ========================================

// December 31, 2026, 17:00 Vietnam time.
// December 31, 2026, 10:00 UTC.

const EVENT_DATE = "2026-12-31T10:00:00Z";
const eventTimestamp = Date.parse(EVENT_DATE);

const daysElement = document.querySelector("#days");
const hoursElement = document.querySelector("#hours");
const minutesElement = document.querySelector("#minutes");
const secondsElement = document.querySelector("#seconds");
const countdownMessage = document.querySelector("#countdown-message");

let countdownInterval;


// ===== FORMAT TIME =====

function formatTime(value) {
    return String(value).padStart(2, "0");
}


// ===== UPDATE COUNTDOWN =====

function updateCountdown() {
    const remaining = Math.max(
        0,
        eventTimestamp - Date.now()
    );

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining / 3600000) % 24);
    const minutes = Math.floor((remaining / 60000) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    daysElement.textContent = formatTime(days);
    hoursElement.textContent = formatTime(hours);
    minutesElement.textContent = formatTime(minutes);
    secondsElement.textContent = formatTime(seconds);

    if (remaining === 0) {
        clearInterval(countdownInterval);
        countdownMessage.textContent = "The event has started!";
    } else {
        countdownMessage.textContent = "";
    }
}


// ===== INITIALIZE COUNTDOWN =====

updateCountdown();

if (Date.now() < eventTimestamp) {
    countdownInterval = setInterval(updateCountdown, 1000);
}


// ========================================
// T-03: FORM STATE MACHINE
// ========================================

// Declare ALL elements before initializing state.

const registrationForm = document.querySelector("#registration-form");
const submitButton = document.querySelector("#submit-btn");
const resetButton = document.querySelector("#reset-btn");
const formMessage = document.querySelector("#form-message");
const nameInput = document.querySelector("#full-name");
const emailInput = document.querySelector("#email");

const validStates = [
    "idle",
    "submitting",
    "success",
    "error"
];

const allowedTransitions = {
    idle: ["submitting", "error"],
    submitting: ["success", "error"],
    success: ["idle", "submitting", "error"],
    error: ["idle", "submitting"]
};

let formState = "idle";


// ===== UPDATE FORM STATE =====

function updateFormState(newState) {
    if (!validStates.includes(newState)) {
        console.error("Invalid form state:", newState);
        return;
    }

    if (formState !== newState) {
        const allowed = allowedTransitions[formState];

        if (!allowed.includes(newState)) {
            console.error(
                "Invalid form transition:",
                formState,
                "->",
                newState
            );
            return;
        }
    }

    formState = newState;

    const isSubmitting = formState === "submitting";

    submitButton.disabled = isSubmitting;
    resetButton.disabled = isSubmitting;

    if (formState === "idle") {
        submitButton.textContent = "Register Now";
        formMessage.textContent = "Ready to register";
    }

    if (formState === "submitting") {
        submitButton.textContent = "Submitting...";
        formMessage.textContent = "Processing registration...";
    }

    if (formState === "success") {
        submitButton.textContent = "Register Now";
        formMessage.textContent = "Registration successful!";
    }

    if (formState === "error") {
        submitButton.textContent = "Try Again";
        formMessage.textContent =
            "Registration failed. Please try again.";
    }

    formMessage.dataset.state = formState;
}


// ===== INITIALIZE FORM =====

updateFormState("idle");


// ========================================
// T-04: INPUT VALIDATION
// ========================================

function validateRegistration() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (name.length < 2) {
        return false;
    }

    if (!emailInput.validity.valid || email === "") {
        return false;
    }

    return true;
}


// ========================================
// SIMULATED REGISTRATION REQUEST
// ========================================

// This demo does NOT send data to a real server.

function simulateRegistration() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const isSuccessful = Math.random() >= 0.3;

            if (isSuccessful) {
                resolve();
            } else {
                reject(new Error("Simulated server error"));
            }
        }, 1500);
    });
}


// ========================================
// SECURE FORM SUBMISSION
// ========================================

registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Prevent duplicate submissions.

    if (formState === "submitting") {
        return;
    }

    // Validate data.

    if (!validateRegistration()) {
        updateFormState("error");

        formMessage.textContent =
            "Please enter a valid name and email.";

        return;
    }

    // Normalize input values.

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    nameInput.value = name;
    emailInput.value = email;

    // Start simulated submission.

    updateFormState("submitting");

    try {
        await simulateRegistration();

        updateFormState("success");

    } catch (error) {
        console.error("Registration error:", error.message);

        updateFormState("error");
    }
});


// ========================================
// RESET FORM
// ========================================

registrationForm.addEventListener("reset", (event) => {
    // Do not reset during an active request.

    if (formState === "submitting") {
        event.preventDefault();
        return;
    }

    updateFormState("idle");
});
