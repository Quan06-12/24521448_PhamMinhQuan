import { Routes, Route } from 'react-router';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      {/* Pathless layout route: shared header + <Outlet /> */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* Placeholder until PhotoGalleryLayout exists (Step 4) */}
        <Route path="gallery" element={<h1>Evidence gallery</h1>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}