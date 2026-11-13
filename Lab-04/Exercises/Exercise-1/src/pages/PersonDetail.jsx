import { useParams } from 'react-router';

// Detail pane for /people/:id, rendered inside PeopleLayout's <Outlet />
export default function PersonDetail({ people }) {
  // Route params are always strings, so data ids must be strings too
  const { id } = useParams();
  const person = people.find((p) => p.id === id);

  // 404 guard: an unknown id must not crash the render
  if (!person) {
    return <p role="alert">Person not found.</p>;
  }

  // Semantic key-value pairs instead of div-soup
  return (
    <>
      <h2>{person.name}</h2>
      <dl>
        <dt>Role</dt>
        <dd>{person.role}</dd>
        <dt>Team</dt>
        <dd>{person.team}</dd>
        <dt>Skills</dt>
        <dd>{person.skills.join(', ')}</dd>
      </dl>
    </>
  );
}