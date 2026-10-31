import { ScientistDirectory } from './components/ScientistDirectory.jsx';
import styles from './App.module.css';

// App shell for Exercise 2 – Scientist & Pioneer Directory
export default function App() {
  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Pioneer Directory</h1>
      <ScientistDirectory />
    </main>
  );
}