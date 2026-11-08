import { INITIAL_DROPS } from './domain/drops.js';
import { DropCard } from './components/DropCard.jsx';
import styles from './App.module.css';

// App shell for Homework 3 - PVS Airdrop Arena
export default function App() {
  return (
    <main className={styles.app}>
      <h1 className={styles.title}>PVS Airdrop Arena</h1>
      <section aria-labelledby="drops-heading">
        <h2 id="drops-heading">Airdrops</h2>
        <ul className={styles.drops} role="list">
          {INITIAL_DROPS.map((drop) => (
            <li key={drop.id}>
              <DropCard drop={drop} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
