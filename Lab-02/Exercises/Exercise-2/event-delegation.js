
export function setupEventDelegation(rootContainer) {
    const supportedEvents = ["click", "input", "keydown"];

    supportedEvents.forEach((eventType) => {
        rootContainer.addEventListener(eventType, (event) => {
            let target = event.target;

            const handlerProp =
                "on" +
                eventType.charAt(0).toUpperCase() +
                eventType.slice(1);

            while (target && target !== rootContainer) {
                if (
                    target.__vnode &&
                    typeof target.__vnode.props[handlerProp] === "function"
                ) {
                    target.__vnode.props[handlerProp](event);
                    break;
                }

                target = target.parentElement;
            }
        });
    });
}
