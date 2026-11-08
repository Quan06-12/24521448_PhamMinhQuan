import styles from './App.module.css';

// App shell for the bonus exercise - the analyzer is mounted in later slices
export default function App() {
  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Situationship Analyzer</h1>
      <p className={styles.intro}>Hẹn Hò Nhưng Không Yêu — một máy trạng thái thay cho mớ boolean.</p>
    </main>
  );
}
