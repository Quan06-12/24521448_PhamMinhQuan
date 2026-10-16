
export function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: String(text),
            children: []
        }
    };
}

export function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...(props || {}),
            children: children
                .flat(Infinity)
                .filter((child) =>
                    child !== null &&
                    child !== undefined &&
                    child !== false
                )
                .map((child) =>
                    typeof child === "object"
                        ? child
                        : createTextElement(child)
                )
        }
    };
}

export function renderToDOM(vNode) {
    // Step 1: Create real DOM node
    const dom = vNode.type === "TEXT_ELEMENT"
        ? document.createTextNode(vNode.props.nodeValue)
        : document.createElement(vNode.type);
        dom.__vnode = vNode;

    // Step 2: Assign properties and event listeners
    Object.keys(vNode.props)
        .filter((key) =>
            key !== "children" && key !== "nodeValue"
        )
        .forEach((name) => {
            if (!name.startsWith("on")) {
    dom[name] = vNode.props[name];
}
        });

    // Step 3: Render child nodes recursively
    vNode.props.children.forEach((child) => {
        dom.appendChild(renderToDOM(child));
    });

    return dom;
}
