# AI Failure Mode Audit — Homework 3

**Project:** Resilient Event Hub  
**Application:** Tech Innovation Summit 2026  
**Technologies:** HTML5, CSS3, Vanilla JavaScript  
**Development Method:** AI-assisted implementation with atomic Git commits and manual testing

## 1. Introduction

This report examines three defects introduced or left unresolved during AI-assisted development of the Resilient Event Hub. The defects were identified through code review, Git history comparison, browser testing, and Chrome DevTools.

Each case documents the original problem, diagnostic method, corrective implementation, and verification outcome.

## 2. Defect 1 — Missing Double-submit Protection

### Description

The initial AI-generated registration handler did not prevent repeated submissions while an asynchronous registration request was being processed.

Although the form entered the `submitting` state, the original implementation did not disable the submit button or check whether another submission was already in progress.

This created a risk of overlapping asynchronous registration operations.

### Evidence

- Original implementation: commit `97c0a27` — `feat(hw3): implement registration form state machine`
- Corrective implementation: commit `191aa33` — `fix(hw3): prevent double submit and secure inputs`
- A Git diff confirmed that the original handler lacked submission protection.

### Diagnostic Method

The original form submission event listener was reviewed to identify whether repeated submission events could initiate additional operations.

The review showed that each submission proceeded directly to `simulateRegistration()` without checking the current form state.

### Refactored Solution

A state guard was introduced:

```javascript
if (formState === "submitting") {
    return;
}
```

The submit button was also disabled while the form was processing:

```javascript
submitButton.disabled = formState === "submitting";
```

Together, these changes protect the interface and the event handler from duplicate submissions.

### Verification

Manual testing confirmed that repeated clicks on **Register Now** were blocked during the `submitting` state.

After processing completed, the form displayed either a success or error result according to the simulated request.

**Result: PASS**

## 3. Defect 2 — Insufficient Input Validation

### Description

The initial AI-assisted registration form relied on basic HTML validation without explicitly normalizing user input.

The original implementation did not trim whitespace from the full-name field before accepting the submission.

Consequently, a name containing only whitespace could satisfy the minimum-length requirement without providing a meaningful name.

### Evidence

- Original implementation: commit `97c0a27`
- Corrective implementation: commit `191aa33`
- The corrective Git diff introduced explicit input validation and normalization.

### Diagnostic Method

The validation logic was compared across the two commits.

The original JavaScript contained no `trim()` operation or explicit validation of the normalized name.

A whitespace-only name was selected as a test case to verify the updated input-handling logic.

### Refactored Solution

The application now normalizes input values:

```javascript
const name = nameInput.value.trim();
const email = emailInput.value.trim();
```

It also validates the trimmed name:

```javascript
if (name.length < 2) {
    return false;
}
```

Email input is checked using browser validity constraints.

### Verification

The registration form was tested with a full name containing only whitespace and a valid email address.

The updated form rejected the invalid name and prevented the registration process from entering the `submitting` state.

**Result: PASS**

## 4. Defect 3 — Reset Button Initialization Error

### Description

During the AI-assisted implementation of the missing `success → idle` reset transition, the AI instructions did not clearly establish the correct order for declaring the `resetButton` variable.

The application attempted to access `resetButton` before its initialization, resulting in a JavaScript `ReferenceError`.

This interrupted the initialization of the registration form.

### Evidence

Chrome DevTools displayed the following error:

```text
Uncaught ReferenceError:
Cannot access 'resetButton' before initialization

at updateFormState (script.js:76:1)
at script.js:107:1
```

The error was observed after implementing the reset functionality.

The browser also showed that the **Reset Form** button was not visible in the expected location.

### Diagnostic Method

The Console error was examined to identify the failing function and line numbers.

The initialization sequence was then reviewed. The `updateFormState("idle")` call occurred before the `resetButton` variable was initialized.

This revealed a variable initialization-order defect.

### Refactored Solution

All form-related DOM elements were declared before initializing the state machine:

```javascript
const registrationForm = document.querySelector("#registration-form");
const submitButton = document.querySelector("#submit-btn");
const resetButton = document.querySelector("#reset-btn");
const formMessage = document.querySelector("#form-message");
```

The HTML was updated to include:

```html
<button type="reset" id="reset-btn">
    Reset Form
</button>
```

The reset event handler was also implemented to restore the form to the `idle` state while preventing resets during an active submission.

### Verification

After replacing the affected code and reloading the page, the **Reset Form** button appeared and operated correctly.

The reset functionality was confirmed by manual testing.

**Result: PASS**

## 5. Reflection

This lab demonstrated the importance of independently reviewing AI-generated code instead of assuming that every generated implementation is correct.

Three important lessons were identified.

First, asynchronous code requires explicit state protection. The initial registration handler did not prevent repeated submissions, illustrating how a seemingly functional interface can still contain behavioral defects.

Second, basic browser validation does not replace application-specific validation. Input normalization and explicit checks improved the reliability of registration data.

Third, AI-generated modifications can introduce integration errors when new variables or components are inserted into existing code without considering execution order.

Atomic Git commits helped isolate changes and compare implementations before and after refactoring. Chrome DevTools provided evidence for runtime errors, while manual testing confirmed the behavior of the corrected application.

## 6. Conclusion

The three documented defects were addressed through state protection, input validation, and correct JavaScript initialization.

The final implementation includes a drift-free UTC countdown, an asynchronous registration state machine, double-submit prevention, input validation, and reset functionality.

The development process highlights the value of Git-based code review, reproducible testing, and human verification when working with AI-generated software.