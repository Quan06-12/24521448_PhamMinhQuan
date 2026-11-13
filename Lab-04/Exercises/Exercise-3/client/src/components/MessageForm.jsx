import { useId, useState } from 'react';
import styles from '../App.module.css';

const MAX_TEXT_LENGTH = 500;

// Client-side rules mirror the server (validation parity)
function validate({ author, text }) {
  const errors = {};
  if (!author.trim()) errors.author = 'Author is required.';
  if (!text.trim()) errors.text = 'Message is required.';
  else if (text.trim().length > MAX_TEXT_LENGTH) errors.text = `Max ${MAX_TEXT_LENGTH} characters.`;
  return errors;
}

export default function MessageForm({ onSubmit }) {
  const [values, setValues] = useState({ author: '', text: '' });
  const [attempted, setAttempted] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState(null);

  const authorId = useId();
  const textId = useId();

  // Derived during render, never synced through an effect hook
  const errors = attempted ? validate(values) : {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttempted(true);
    if (Object.keys(validate(values)).length > 0) return;

    setSending(true);
    setServerError(null);
    try {
      await onSubmit({ author: values.author.trim(), text: values.text.trim() });
      setValues((prev) => ({ ...prev, text: '' }));
      setAttempted(false);
    } catch (err) {
      // Surface server rejections (400, network down) instead of an unhandled rejection
      setServerError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} className={styles.form}>
      <p className={styles.field}>
        <label htmlFor={authorId}>Author</label>
        <input
          id={authorId}
          name="author"
          value={values.author}
          onChange={handleChange}
          aria-invalid={errors.author ? 'true' : undefined}
          aria-describedby={errors.author ? `${authorId}-error` : undefined}
          className={styles.input}
        />
        {errors.author && <span id={`${authorId}-error`} role="alert" className={styles.error}>{errors.author}</span>}
      </p>
      <p className={styles.field}>
        <label htmlFor={textId}>Message</label>
        <textarea
          id={textId}
          name="text"
          rows={3}
          value={values.text}
          onChange={handleChange}
          aria-invalid={errors.text ? 'true' : undefined}
          aria-describedby={errors.text ? `${textId}-error` : undefined}
          className={styles.input}
        />
        {errors.text && <span id={`${textId}-error`} role="alert" className={styles.error}>{errors.text}</span>}
      </p>
      {serverError && <p role="alert" className={styles.error}>Server: {serverError}</p>}
      <p className={styles.actions}>
        <button type="submit" disabled={sending} className={styles.primary}>
          {sending ? 'Posting…' : 'Post message'}
        </button>
      </p>
    </form>
  );
}
