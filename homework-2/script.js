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
        recordBeat(pad.dataset.key);
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
    recordBeat(selectedPad.dataset.key);
});
// ===== T-04: RECORDER STATE =====

const recordButton = document.querySelector("#record-btn");
const stopButton = document.querySelector("#stop-btn");
const replayButton = document.querySelector("#replay-btn");
const recorderStatus = document.querySelector("#recorder-status");

let recorderState = "idle";
let recordedBeats = [];
let recordingStartTime = 0;
let playbackTimers = [];
// ===== START RECORDING =====

function startRecording() {
    if (recorderState !== "idle") {
        return;
    }

    recordedBeats = [];
    recordingStartTime = performance.now();
    recorderState = "recording";

    recorderStatus.textContent = "Recording...";
    recordButton.disabled = true;
    replayButton.disabled = true;
    stopButton.disabled = false;
}

recordButton.addEventListener("click", startRecording);
// ===== RECORD A BEAT =====

function recordBeat(key) {
    if (recorderState !== "recording") {
        return;
    }

    const timestamp = performance.now() - recordingStartTime;

    recordedBeats.push({
        key: key,
        time: timestamp
    });
}
// ===== STOP RECORDING OR PLAYBACK =====

function stopRecorder() {
    if (recorderState === "recording") {
        recorderState = "idle";
        recorderStatus.textContent =
            `Recording saved: ${recordedBeats.length} beats`;
    }

    if (recorderState === "playing") {
        playbackTimers.forEach((timer) => {
            clearTimeout(timer);
        });

        playbackTimers = [];
        recorderState = "idle";
        recorderStatus.textContent = "Playback stopped";
    }

    recordButton.disabled = false;
    replayButton.disabled = recordedBeats.length === 0;
    stopButton.disabled = true;
}

stopButton.addEventListener("click", stopRecorder);
// ===== REPLAY RECORDED BEATS =====

function replayBeats() {
    if (recorderState !== "idle") {
        return;
    }

    if (recordedBeats.length === 0) {
        recorderStatus.textContent = "No beats recorded";
        return;
    }

    recorderState = "playing";
    recorderStatus.textContent = "Replaying...";

    recordButton.disabled = true;
    replayButton.disabled = true;
    stopButton.disabled = false;

    const lastBeatTime = recordedBeats[recordedBeats.length - 1].time;

    recordedBeats.forEach((beat) => {
        const timer = setTimeout(() => {
            const selectedPad = Array.from(drumPads).find((pad) => {
                return pad.dataset.key === beat.key;
            });

            if (!selectedPad) {
                return;
            }

            playSound(selectedPad.dataset.sound);
            activatePad(selectedPad);
        }, beat.time);

        playbackTimers.push(timer);
    });

    const finishTimer = setTimeout(() => {
        recorderState = "idle";
        playbackTimers = [];

        recorderStatus.textContent = "Playback completed";

        recordButton.disabled = false;
        replayButton.disabled = false;
        stopButton.disabled = true;
    }, lastBeatTime + 200);

    playbackTimers.push(finishTimer);
}

replayButton.addEventListener("click", replayBeats);
// ===== INITIAL BUTTON STATE =====

stopButton.disabled = true;
replayButton.disabled = true;