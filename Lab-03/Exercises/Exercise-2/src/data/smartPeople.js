// Normalized dataset (slide 18): every record has a stable string id used as the React key.
// Frozen so accidental in-place mutation (push, sort, item.iq = ...) throws instead of
// silently keeping the same reference and skipping a re-render.
export const SMART_PEOPLE = Object.freeze([
  Object.freeze({ id: 'sp-1', name: 'Johann Goethe', age: 82, iq: 210 }),
  Object.freeze({ id: 'sp-2', name: 'Albert Einstein', age: 76, iq: 205 }),
  Object.freeze({ id: 'sp-3', name: 'Leonardo da Vinci', age: 67, iq: 180 }),
  Object.freeze({ id: 'sp-4', name: 'Isaac Newton', age: 84, iq: 190 }),
  Object.freeze({ id: 'sp-5', name: 'James Maxwell', age: 48, iq: 190 }),
  Object.freeze({ id: 'sp-6', name: 'William Sidis', age: 46, iq: 200 }),
]);