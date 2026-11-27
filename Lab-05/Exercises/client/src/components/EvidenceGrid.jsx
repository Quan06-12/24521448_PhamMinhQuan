import { useMemo } from 'react';
import { useAppDispatch, useAppState } from '../context/AppProvider';
import '../styles/EvidenceGrid.css';

export function EvidenceGrid() {
  const { evidenceList, filterTag, currentPage, pageSize } = useAppState();
  const dispatch = useAppDispatch();

  const filtered = useMemo(
    () => evidenceList.filter((item) => !filterTag || item.tag === filterTag),
    [evidenceList, filterTag]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filtered.slice(startIdx, startIdx + pageSize);
  }, [filtered, safePage, pageSize]);

  return (
    <section className="evidence-container" aria-label="Evidence Archive">
      <div className="evidence-grid">
        {paginated.map((item) => (
          <article key={item._id} className="evidence-card">
            <span className="evidence-tag">{item.tag}</span>
            <h3>{item.title}</h3>
            <p>{item.fps} FPS • Recoil {item.verticalRecoilDeg}°</p>
          </article>
        ))}
      </div>

      <nav className="pagination-bar" aria-label="Pagination">
        <button
          type="button"
          className="touch-btn"
          disabled={safePage <= 1}
          onClick={() => dispatch({ type: 'SET_PAGE', payload: safePage - 1 })}
        >
          Prev
        </button>
        <span>
          Page {safePage} / {totalPages}
        </span>
        <button
          type="button"
          className="touch-btn"
          disabled={safePage >= totalPages}
          onClick={() => dispatch({ type: 'SET_PAGE', payload: safePage + 1 })}
        >
          Next
        </button>
      </nav>
    </section>
  );
}