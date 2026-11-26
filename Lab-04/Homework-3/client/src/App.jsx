import { Routes, Route } from 'react-router';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import DossierPage from './pages/DossierPage.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* Multi-route dossier navigation: one dynamic segment for every player */}
        <Route path="dossier/:playerId" element={<DossierPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}