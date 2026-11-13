import { NavLink, Outlet } from 'react-router';
import styles from './Layout.module.css';

// v7 active styling: className receives a callback with { isActive }
const linkClass = ({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link);

export default function Layout() {
  return (
    <>
      <header className={styles.header}>
        <nav aria-label="Main">
          <ul className={styles.menu}>
            {/* `end` stops "/" from matching every nested URL */}
            <li><NavLink to="/" end className={linkClass}>Home</NavLink></li>
            <li><NavLink to="/people" className={linkClass}>People</NavLink></li>
          </ul>
        </nav>
      </header>
      {/* Child routes render here */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}