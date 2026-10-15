// ===== T-02: POLYPHONIC AUDIO ENGINE =====

function playSound(soundPath) {
    const audio = new Audio(soundPath);

    audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
    });
}
// ===== CONNECT DRUM PADS =====

const drumPads = document.querySelectorAll(".drum-pad");

drumPads.forEach((pad) => {
    pad.addEventListener("click", () => {
        const soundPath = pad.dataset.sound;

        playSound(soundPath);
    });
});