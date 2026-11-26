import styles from './Deck.module.css';

// Presentational card: one fictional profile. Extra props (pointer handlers, style) are spread on.
export default function ProfileCard({ profile, style, label, ...rest }) {
  return (
    <article
      className={styles.card}
      // Per-profile accent colour drives the border and avatar ring
      style={{ '--accent': profile.accent, ...style }}
      aria-labelledby={`profile-${profile._id}`}
      {...rest}
    >
      {/* Drag feedback stamp (visual only; the result is announced by the status line) */}
      {label && <p className={styles.stamp} aria-hidden="true">{label}</p>}
      <p className={styles.avatar} aria-hidden="true">{profile.avatar}</p>
      <h2 id={`profile-${profile._id}`} className={styles.name}>
        {profile.name}, {profile.age}
      </h2>
      <p className={styles.city}>{profile.city}</p>
      <p className={styles.bio}>{profile.bio}</p>
      <ul className={styles.tags} aria-label="Interests">
        {profile.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      {profile.redFlag && (
        <p className={styles.redFlag}>
          <span aria-hidden="true">🚩</span> {profile.redFlag}
        </p>
      )}
    </article>
  );
}