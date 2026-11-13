import { NavLink, Outlet } from 'react-router';
import styles from './PeopleLayout.module.css';

const linkClass = ({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link);

// Master list on the left, detail pane (<Outlet />) on the right
export default function PeopleLayout({ people }) {
  return (
    <section className={styles.grid} aria-labelledby="people-title">
      <nav aria-labelledby="people-title">
        <h1 id="people-title" className={styles.title}>People</h1>
        <ul className={styles.list}>
          {people.map((p) => (
            <li key={p.id}>
              {/* Relative path: resolves to /people/:id */}
              <NavLink to={p.id} className={linkClass}>{p.name}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <article className={styles.detail}>
        <Outlet />
      </article>
    </section>
  );
}