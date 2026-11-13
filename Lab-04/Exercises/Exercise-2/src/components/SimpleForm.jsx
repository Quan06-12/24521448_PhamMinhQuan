import { useState } from 'react';
import { FormContext } from '../context/FormContext.js';
import { validateForm } from '../utils/validateForm.js';
import InputField from './InputField.jsx';
import ShowData from './ShowData.jsx';
import styles from './Form.module.css';

const INITIAL_VALUES = { name: '', email: '', password: '', confirm: '' };

export default function SimpleForm() {
  // Only real user input lives in state
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Derived during render in a single pass: zero effect waterfall
  const errors = validateForm(values);
  const errorCount = Object.keys(errors).length;
  const isValid = errorCount === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Errors appear after the user leaves a field (or tries to submit)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAttempted(true);
    if (!isValid) return;
    // Never expose the password in the inspector
    setSubmittedData({
      name: values.name.trim(),
      email: values.email.trim(),
      passwordLength: values.password.length,
      submittedAt: new Date().toLocaleString(),
    });
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setTouched({});
    setAttempted(false);
    setSubmittedData(null);
  };

  return (
    <section className={styles.card} aria-labelledby="form-title">
      <h1 id="form-title">Account Registration</h1>

      {/* React 19: the context object itself is the provider */}
      <FormContext value={{ values, errors, touched, attempted, handleChange, handleBlur }}>
        <form noValidate onSubmit={handleSubmit} className={styles.form}>
          <InputField name="name" label="Full name" autoComplete="name" />
          <InputField name="email" label="Email" type="email" autoComplete="email" />
          <InputField name="password" label="Password" type="password" autoComplete="new-password" />
          <InputField name="confirm" label="Confirm password" type="password" autoComplete="new-password" />

          <output className={isValid ? styles.ok : styles.pending}>
            {isValid ? 'All fields are valid.' : `${errorCount} field(s) need attention.`}
          </output>

          <p className={styles.actions}>
            <button type="submit" className={styles.primary}>Submit</button>
            <button type="button" onClick={handleReset}>Reset</button>
          </p>
        </form>
      </FormContext>

      {submittedData && <ShowData data={submittedData} />}
    </section>
  );
}
