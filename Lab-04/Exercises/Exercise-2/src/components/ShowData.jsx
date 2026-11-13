import { Fragment } from 'react';
import styles from './Form.module.css';

// Semantic key-value inspector instead of a raw JSON.stringify dump
export default function ShowData({ data }) {
  return (
    <section className={styles.inspector} aria-labelledby="inspector-title">
      <h2 id="inspector-title">Submitted data</h2>
      <dl className={styles.list}>
        {Object.entries(data).map(([key, value]) => (
          <Fragment key={key}>
            <dt>{key}</dt>
            <dd>{String(value)}</dd>
          </Fragment>
        ))}
      </dl>
    </section>
  );
}
