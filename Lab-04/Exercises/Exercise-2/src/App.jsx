import SimpleForm from './components/SimpleForm.jsx';
import styles from './components/Form.module.css';

// Single-page shell for the context-driven form engine
export default function App() {
  return (
    <main className={styles.main}>
      <SimpleForm />
    </main>
  );
}
