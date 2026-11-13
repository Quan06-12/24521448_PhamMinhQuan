import { Fragment } from 'react';
import styles from '../App.module.css';

// Each message is an author/text pair inside one definition list
export default function MessageList({ messages }) {
  if (messages.length === 0) {
    return <p className={styles.muted}>No messages yet. Be the first to post.</p>;
  }

  return (
    <dl className={styles.messages}>
      {messages.map((msg) => (
        <Fragment key={msg.id}>
          <dt>
            {msg.author}{' '}
            <time dateTime={msg.timestamp} className={styles.muted}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </time>
          </dt>
          <dd>{msg.text}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
