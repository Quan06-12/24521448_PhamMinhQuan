
import { createElement, renderToDOM } from "./mini-react.js";

import {
    useState,
    resetCursor,
    setRenderer
} from "./reactive-engine.js";

import { setupEventDelegation } from "./event-delegation.js";

const root = document.getElementById("app");

function TaskApp() {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Review PR", completed: false },
        { id: 2, title: "Verify AST", completed: true }
    ]);

    const [filter, setFilter] = useState("ALL");

    const visibleTasks = tasks.filter((task) => {
        if (filter === "ACTIVE") return !task.completed;
        if (filter === "COMPLETED") return task.completed;
        return true;
    });

    function addTask() {
        const newTask = {
            id: crypto.randomUUID(),
            title: `Task ${tasks.length + 1}`,
            completed: false
        };

        setTasks((previous) => [...previous, newTask]);
    }

    function toggleTask(id) {
        setTasks((previous) =>
            previous.map((task) =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    }

    return createElement(
        "section",
        { className: "task-manager" },

        createElement("h1", null, "Reactive Task Manager"),

        createElement("h2", null, `Tasks: ${tasks.length}`),

        createElement(
            "button",
            { onClick: addTask },
            "Add Task"
        ),

        createElement(
            "nav",
            { "aria-label": "Task filters" },
            ...["ALL", "ACTIVE", "COMPLETED"].map((value) =>
                createElement(
                    "button",
                    {
                        onClick: () => setFilter(value),
                        "aria-pressed": filter === value
                    },
                    value
                )
            )
        ),

        createElement(
            "ul",
            null,
            ...visibleTasks.map((task) =>
                createElement(
                    "li",
                    { key: task.id },
                    createElement(
                        "button",
                        { onClick: () => toggleTask(task.id) },
                        `${task.completed ? "✓" : "○"} ${task.title}`
                    )
                )
            )
        )
    );
}

function renderApp() {
    resetCursor();

    const vApp = TaskApp();

    root.replaceChildren(renderToDOM(vApp));
}

setupEventDelegation(root);
setRenderer(renderApp);
renderApp();
