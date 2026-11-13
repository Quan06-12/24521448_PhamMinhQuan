import styles from '../App.module.css';

// Toggle buttons; aria-pressed exposes the selected channel to screen readers
export default function ChannelSwitcher({ channels, current, onChange }) {
  return (
    <nav aria-label="Forum channels">
      <ul className={styles.channels}>
        {channels.map((channel) => (
          <li key={channel.id}>
            <button
              type="button"
              aria-pressed={channel.id === current}
              className={channel.id === current ? styles.channelActive : styles.channel}
              onClick={() => onChange(channel.id)}
            >
              {channel.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
