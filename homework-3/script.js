// ===== T-02: COUNTDOWN ENGINE =====

// Event: December 31, 2026, 17:00 Vietnam time
// Equivalent UTC: December 31, 2026, 10:00 UTC

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
    }
}


// ===== START COUNTDOWN =====

updateCountdown();

if (Date.now() < eventTimestamp) {
    countdownInterval = setInterval(updateCountdown, 1000);
}