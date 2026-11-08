import { useDropClaims } from './hooks/useDropClaims.js';
import { DropCard } from './components/DropCard.jsx';
import { Leaderboard } from './components/Leaderboard.jsx';
import { KillFeed } from './components/KillFeed.jsx';
import { ClaimNotice } from './components/ClaimNotice.jsx';
import styles from './App.module.css';

// App shell for Homework 3 - PVS Airdrop Arena
export default function App() {
  const { drops, inFlight, notice, claim } = useDropClaims();

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>PVS Airdrop Arena</h1>
      <section aria-labelledby="drops-heading">
        <h2 id="drops-heading">Airdrops</h2>
        <ClaimNotice notice={notice} />
        <ul className={styles.drops} role="list">
          {drops.map((drop) => (
            <li key={drop.id}>
              <DropCard drop={drop} isClaiming={Boolean(inFlight[drop.id])} onClaim={claim} />
            </li>
          ))}
        </ul>
      </section>
      <Leaderboard />
      <KillFeed />
    </main>
  );
}
