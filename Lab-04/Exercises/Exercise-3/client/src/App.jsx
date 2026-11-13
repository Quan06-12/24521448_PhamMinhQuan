import { useState } from 'react';
import { useForumMessages } from './hooks/useForumMessages.js';
import ChannelSwitcher from './components/ChannelSwitcher.jsx';
import MessageList from './components/MessageList.jsx';
import MessageSkeleton from './components/MessageSkeleton.jsx';
import MessageForm from './components/MessageForm.jsx';
import styles from './App.module.css';

const CHANNELS = [
  { id: 'nasa', label: 'NASA' },
  { id: 'esports-tribunal', label: 'Esports Tribunal' },
  { id: 'notNasa', label: 'Not NASA' },
];

export default function App() {
  const [channelId, setChannelId] = useState(CHANNELS[0].id);
  const { messages, loading, error, postMessage } = useForumMessages(channelId);
  const channelLabel = CHANNELS.find((c) => c.id === channelId).label;

  return (
    <main className={styles.main}>
      <header>
        <h1>Forum Channels</h1>
        <ChannelSwitcher channels={CHANNELS} current={channelId} onChange={setChannelId} />
      </header>

      <section className={styles.panel} aria-labelledby="channel-title">
        <h2 id="channel-title">#{channelLabel}</h2>
        {loading && <MessageSkeleton />}
        {error && (
          <p role="alert" className={styles.error}>
            Could not load messages: {error}
          </p>
        )}
        {!loading && !error && <MessageList messages={messages} />}
      </section>

      {/* key resets the form state when the channel changes */}
      <MessageForm key={channelId} onSubmit={postMessage} />
    </main>
  );
}
