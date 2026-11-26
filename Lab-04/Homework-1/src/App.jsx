import { Routes, Route } from 'react-router';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import PhotoGalleryLayout from './pages/PhotoGalleryLayout.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* Filters and the open photo live in the query string, not in extra routes */}
        <Route path="gallery" element={<PhotoGalleryLayout />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}