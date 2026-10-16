
import {
    createInitialState,
    transition
} from "./state-machine.js";

import { fetchFeed } from "./data-service.js";

const root = document.getElementById("app");

let state = createInitialState();
let shouldFail = false;
let requestId = 0;

// Update state and refresh UI
function dispatch(event) {
    state = transition(state, event);
    renderApp();
}

// Load data from the mock service

async function loadData(delay = 1500) {
    const currentRequest = ++requestId;

    dispatch({ type: "FETCH_START" });

    try {
        const items = await fetchFeed(shouldFail, delay);

        if (currentRequest !== requestId) {
            console.log("Ignored outdated request:", currentRequest);
            return;
        }

        dispatch({
            type: "FETCH_SUCCESS",
            data: items
        });

    } catch (error) {
        if (currentRequest !== requestId) {
            console.log("Ignored outdated error:", currentRequest);
            return;
        }

        dispatch({
            type: "FETCH_ERROR",
            error: error.message
        });
    }
}


// Render UI based on state
function renderApp() {
    root.replaceChildren();

    const container = document.createElement("section");
    container.className = "data-feed";

    const heading = document.createElement("h1");
    heading.textContent = "Data Feed App";
    container.appendChild(heading);

    if (state.status === "IDLE") {
        const button = document.createElement("button");
        button.textContent = "Load Data";
        button.addEventListener("click", () => loadData());
        container.appendChild(button);
    }

    if (state.status === "LOADING") {
        const statusText = document.createElement("p");
        statusText.textContent = "Loading data...";
        container.appendChild(statusText);

        const skeleton = document.createElement("div");
        skeleton.className = "skeleton";
        skeleton.setAttribute("aria-hidden", "true");
        container.appendChild(skeleton);
    }

    if (state.status === "SUCCESS") {
        const list = document.createElement("ul");

        state.data.forEach((item) => {
            const row = document.createElement("li");
            row.textContent = item.title;
            list.appendChild(row);
        });

        container.appendChild(list);
    }

    if (state.status === "ERROR") {
        const errorMessage = document.createElement("p");
        errorMessage.className = "error";
        errorMessage.setAttribute("role", "alert");
        errorMessage.textContent = state.error;
        container.appendChild(errorMessage);

        const retryButton = document.createElement("button");
        retryButton.textContent = "Retry Connection";
        retryButton.addEventListener("click", () => loadData());
        container.appendChild(retryButton);
    }

    // Test mode selector
    const testLabel = document.createElement("label");
    const testCheckbox = document.createElement("input");

    testCheckbox.type = "checkbox";
    testCheckbox.checked = shouldFail;

    testCheckbox.addEventListener("change", (event) => {
        shouldFail = event.target.checked;
    });

    testLabel.appendChild(testCheckbox);
    testLabel.appendChild(
        document.createTextNode(" Simulate Server Error")
    );

    container.appendChild(testLabel);
    root.appendChild(container);
}

renderApp();

async function testRaceCondition() {
    console.log("Starting race condition test...");

    // Request A: Slow
    const requestA = loadData(3000);

    // Request B: Fast, started after A
    const requestB = loadData(500);

    await Promise.all([requestA, requestB]);

    console.assert(
        state.status === "SUCCESS",
        "Race condition test failed"
    );

    console.log("Final state:", state.status);
}



