import { Routes, Route } from 'react-router';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      {/* Pathless layout route: Layout renders, children go into <Outlet /> */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* Placeholder until PeopleLayout exists (next commit) */}
        <Route path="people" element={<p>People directory coming next.</p>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}