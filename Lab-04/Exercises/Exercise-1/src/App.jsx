import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import Layout from './components/Layout.jsx';
import DetailSkeleton from './components/DetailSkeleton.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import PeopleLayout from './pages/PeopleLayout.jsx';
import { people } from './data/people.js';

// Code-split: PersonDetail loads in its own chunk on first visit to /people/:id
// (declared at module level so it is created once, not on every render)
const PersonDetail = lazy(() => import('./pages/PersonDetail.jsx'));

export default function App() {
  return (
    <Routes>
      {/* Pathless layout route: Layout renders, children go into <Outlet /> */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        {/* Nested master-detail: PeopleLayout renders the list + its own <Outlet /> */}
        <Route path="people" element={<PeopleLayout people={people} />}>
          <Route index element={<p>Select a person from the list.</p>} />
          <Route
            path=":id"
            element={
              // Skeleton fallback while the lazy chunk downloads
              <Suspense fallback={<DetailSkeleton />}>
                <PersonDetail people={people} />
              </Suspense>
            }
          />
        </Route>

        {/* Catch-all for unknown URLs */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}