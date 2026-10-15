// ===== T-02: AUDIO ENGINE =====

function playSound(soundPath) {
    const audio = new Audio(soundPath);

    audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
    });
}


// ===== T-03: VISUAL FEEDBACK =====

function activatePad(pad) {
    pad.classList.add("active");

    setTimeout(() => {
        pad.classList.remove("active");
    }, 150);
}


// ===== SELECT DRUM PADS =====

const drumPads = document.querySelectorAll(".drum-pad");


// ===== MOUSE EVENTS =====

drumPads.forEach((pad) => {
    pad.addEventListener("click", () => {
        playSound(pad.dataset.sound);
        activatePad(pad);
    });
});


// ===== KEYBOARD EVENTS =====

window.addEventListener("keydown", (event) => {
    if (event.repeat) {
        return;
    }

    const pressedKey = event.key.toLowerCase();

    const selectedPad = Array.from(drumPads).find((pad) => {
        return pad.dataset.key === pressedKey;
    });

    if (!selectedPad) {
        return;
    }

    playSound(selectedPad.dataset.sound);
    activatePad(selectedPad);
});