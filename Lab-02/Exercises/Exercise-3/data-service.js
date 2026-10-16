
const sampleData = [
    { id: 1, title: "React Architecture" },
    { id: 2, title: "Virtual DOM" },
    { id: 3, title: "State Machines" }
];

export async function fetchFeed(shouldFail = false) {
    // Simulate network latency
    await new Promise((resolve) => {
        setTimeout(resolve, 1500);
    });

    // Simulate a server error
    if (shouldFail) {
        throw new Error("Failed to fetch data from server");
    }

    // Return sample data
    return sampleData;
}
