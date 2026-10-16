
import { createElement, renderToDOM } from "./mini-react.js";

const vApp = createElement(
    "main",
    { id: "root-view" },

    createElement(
        "header",
        { className: "hero" },
        createElement("h1", null, "Mini React Engine"),
       
createElement("p", null, "My first Virtual DOM"),

createElement(
    "p",
    null,
    "<script>alert(1)</script>"
)

    ),

    createElement(
        "button",
        {
            onClick: () => console.log("Ping")
        },
        "Click Me"
    )
);

const root = document.getElementById("app");

root.replaceChildren(renderToDOM(vApp));

console.assert(
    root.querySelector("button") !== null,
    "Mount Failed"
);
