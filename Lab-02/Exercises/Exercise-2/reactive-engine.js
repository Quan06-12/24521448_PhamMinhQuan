
let stateStore = [];
let cursor = 0;

let triggerRender = () => {};

export function setRenderer(rerenderFn) {
    triggerRender = rerenderFn;
}

export function resetCursor() {
    cursor = 0;
}
