import { Routes, Route } from 'react-router';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import PeopleLayout from './pages/PeopleLayout.jsx';
import PersonDetail from './pages/PersonDetail.jsx';
import { people } from './data/people.js';

export default function App() {
  return (
    <Routes>
      {/* Pathless layout route: Layout renders, children go into <Outlet /> */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        {/* Nested master-detail: PeopleLayout renders the list + its own <Outlet /> */}
        <Route path="people" element={<PeopleLayout people={people} />}>
          <Route index element={<p>Select a person from the list.</p>} />
          <Route path=":id" element={<PersonDetail people={people} />} />
        </Route>

        {/* Catch-all for unknown URLs */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}