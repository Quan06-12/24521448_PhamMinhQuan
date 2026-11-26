import { NavLink, Outlet } from 'react-router';
import { useJson } from '../hooks/useJson.js';
import styles from './Layout.module.css';

const linkClass = ({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link);

// Shared shell: the dossier list is fetched once here and shared with child routes via Outlet context
export default function Layout() {
  const list = useJson('/dossiers');

  return (
    <>
      <a href="#main" className={styles.skip}>Skip to content</a>
      <header className={styles.header}>
        <nav aria-label="Main">
          <ul className={styles.menu}>
            <li><NavLink to="/" end className={linkClass}>Tribunal</NavLink></li>
            {/* One link per dossier, built from the API */}
            {list.data?.map((d) => (
              <li key={d.playerId}>
                <NavLink to={`/dossier/${d.playerId}`} className={linkClass}>{d.handle}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="main" className={styles.main}>
        <Outlet context={list} />
      </main>
      <footer className={styles.footer}>
        Fictional case-study data from the Lab 04 brief. It does not describe real events or sanctions.
      </footer>
    </>
  );
}