import { DeveloperCard } from './components/DeveloperCard.jsx';
import styles from './App.module.css';

// Card data defined once at module level (stable references)
const MY_METRICS = { commits: 13, vdomNodes: 0, a11yScore: 100 };
const MY_SKILLS = [
  { id: 'sk-react', name: 'React 19', tier: 'Core' },
  { id: 'sk-a11y', name: 'WCAG 2.2 AA', tier: 'Core' },
  { id: 'sk-css', name: 'CSS Modules', tier: 'Core' },
  { id: 'sk-audio', name: 'Web Audio API', tier: 'Awareness' },
];

// App shell for Exercise 1 – Semantic DeveloperCard
export default function App() {
  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Developer Card</h1>
            <DeveloperCard
        fullName="Pham Minh Quan"
        role="Student 24521448 • UIT"
     
        metrics={MY_METRICS}
        skills={MY_SKILLS}
      />
      {/* Second card uses only defaults: proves ES6 default params work */}
      <DeveloperCard />
    </main>
  );
}