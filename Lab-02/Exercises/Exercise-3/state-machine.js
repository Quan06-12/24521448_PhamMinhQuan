
export const STATUS = {
    IDLE: "IDLE",
    LOADING: "LOADING",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR"
};

export function createInitialState() {
    return {
        status: STATUS.IDLE
    };
}

export function transition(state, event) {
    switch (event.type) {
        case "FETCH_START":
            return {
                status: STATUS.LOADING
            };

        case "FETCH_SUCCESS":
            return {
                status: STATUS.SUCCESS,
                data: event.data
            };

        case "FETCH_ERROR":
            return {
                status: STATUS.ERROR,
                error: event.error
            };

        default:
            return state;
    }
}

