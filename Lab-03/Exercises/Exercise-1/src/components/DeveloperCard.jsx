import { Fragment, useId, useState } from 'react';
import { SkillBadge } from './SkillBadge.jsx';
import styles from './DeveloperCard.module.css';

// Default data lives at module level: one stable reference, not a new object per render
const DEFAULT_METRICS = { commits: 512, vdomNodes: 0, a11yScore: 100 };
const DEFAULT_SKILLS = [{ id: 'sk-1', name: 'React 19 Fiber', tier: 'Core' }];

// Human-readable labels for metric keys (falls back to the raw key)
const METRIC_LABELS = { commits: 'Commits', vdomNodes: 'VDOM nodes', a11yScore: 'A11y score' };

// "Pham Minh Quan" -> "PQ" (first + last word), used when the avatar fails to load
function getInitials(fullName) {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/**
 * Semantic developer / pro-gamer profile card. Zero div elements by contract.
 * ES6 default parameters replace the removed defaultProps API.
 */
export function DeveloperCard({
  fullName = 'Tran Vinh Khiem',
  role = 'Senior Systems Architect • UIT S3T',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240',
  metrics = DEFAULT_METRICS,
  skills = DEFAULT_SKILLS,
}) {
  const headingId = useId(); // unique per card: two cards never share an id
  const [avatarFailed, setAvatarFailed] = useState(false);

  // Only HTTPS images are allowed; anything else falls back to initials
  const canShowAvatar = avatarUrl.startsWith('https://') && !avatarFailed;

    return (
    <article className={styles.card} aria-labelledby={headingId}>
      <header className={styles.header}>
        {canShowAvatar ? (
          <img
            className={styles.avatar}
            src={avatarUrl}
            alt={`Portrait of ${fullName}`}
            width="64"
            height="64"              /* explicit size reserves space: zero CLS */
            onError={() => setAvatarFailed(true)}
          />
        ) : (
          <span className={styles.initials} role="img" aria-label={`Initials of ${fullName}`}>
            {getInitials(fullName)}
          </span>
        )}
        <hgroup className={styles.title}>
          <h2 id={headingId}>{fullName}</h2>
          <p>{role}</p>
        </hgroup>
      </header>

      {/* Key-value metadata: <dl>, never repeated <h1> tags (legacy slide 22 bug) */}
      <dl className={styles.metrics}>
        {Object.entries(metrics).map(([key, value]) => (
          <Fragment key={key}>
            <dt>{METRIC_LABELS[key] ?? key}</dt>
            <dd>{value}</dd>
          </Fragment>
        ))}
      </dl>

      <ul className={styles.skills} aria-label="Engineered skills" role="list">
        {skills.map((skill) => (
          <SkillBadge key={skill.id} name={skill.name} tier={skill.tier} className={styles.skill} />
        ))}
      </ul>
    </article>
  );
}