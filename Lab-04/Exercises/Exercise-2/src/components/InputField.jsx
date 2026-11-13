import { useId } from 'react';
import { useFormContext } from '../context/FormContext.js';
import styles from './Form.module.css';

// Reads everything from context: no prop drilling, no local state sync
export default function InputField({ name, label, type = 'text', ...rest }) {
  const { values, errors, touched, attempted, handleChange, handleBlur } = useFormContext();

  // Stable unique ids for label binding and error linking
  const id = useId();
  const errorId = `${id}-error`;

  // Error is shown only after blur or a submit attempt
  const error = touched[name] || attempted ? errors[name] : undefined;

  return (
    <p className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={styles.input}
        {...rest}
      />
      {error && (
        <span id={errorId} role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </p>
  );
}
