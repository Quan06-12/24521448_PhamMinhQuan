
let stateStore = [];
let cursor = 0;

let triggerRender = () => {};

export function setRenderer(rerenderFn) {
    triggerRender = rerenderFn;
}

export function resetCursor() {
    cursor = 0;
}

export function useState(initialValue) {
    const currentCursor = cursor;

    if (currentCursor >= stateStore.length) {
        stateStore[currentCursor] = initialValue;
    }

    const setState = (nextValue) => {
        const previousValue = stateStore[currentCursor];

        const resolvedValue =
            typeof nextValue === "function"
                ? nextValue(previousValue)
                : nextValue;

        if (!Object.is(previousValue, resolvedValue)) {
            stateStore[currentCursor] = resolvedValue;
            triggerRender();
        }
    };

    cursor++;

    return [stateStore[currentCursor], setState];
}
