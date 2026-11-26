import { NavLink, Outlet } from 'react-router';
import styles from './Layout.module.css';

// v7 active styling: className receives a callback with { isActive }
const linkClass = ({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link);

export default function Layout() {
  return (
    <>
      {/* Skip link: first focusable element, jumps past the navigation */}
      <a href="#main" className={styles.skip}>Skip to content</a>
      <header className={styles.header}>
        <nav aria-label="Main">
          <ul className={styles.menu}>
            {/* `end` stops "/" from matching every nested URL */}
            <li><NavLink to="/" end className={linkClass}>Home</NavLink></li>
            <li><NavLink to="/gallery" className={linkClass}>Evidence gallery</NavLink></li>
          </ul>
        </nav>
      </header>
      {/* id="main" is the skip link target */}
      <main id="main" className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}