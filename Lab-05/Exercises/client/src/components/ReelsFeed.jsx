import { useEffect, useState } from 'react';
import { ReelCard } from './ReelCard';
import '../styles/Reels.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function ReelsFeed() {
  const [reels, setReels] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/api/v2/reels`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setReels(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      });
    return () => controller.abort();
  }, []);

  const handleEndorse = async (id) => {
    const res = await fetch(`${API_BASE}/api/v2/reels/${id}/endorse`, {
      method: 'PATCH',
    });
    if (!res.ok) return;
    const updated = await res.json();
    setReels((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
  };

  return (
    <section className="reels-feed" aria-label="60fps Handcam Reels">
      {reels.map((reel) => (
        <ReelCard key={reel._id} reel={reel} onEndorsed={handleEndorse} />
      ))}
    </section>
  );
}