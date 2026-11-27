import { useEffect, useRef, useState } from 'react';
import { Heart, Pause, Play, Volume2, VolumeX } from 'lucide-react';

export function ReelCard({ reel, onEndorsed }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current
            ?.play()
            .then(() => setIsPlaying(true))
            .catch(() => {
              setMuted(true);
              setIsPlaying(false);
            });
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.75 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => setMuted(true));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <article ref={containerRef} className="reel-card">
      <video
        ref={videoRef}
        className="reel-video"
        src={reel.videoUrl}
        muted={muted}
        loop
        playsInline
      />

      <div className="reel-overlay">
        <div className="reel-meta">
          <span className="evidence-tag">{reel.playerTag}</span>
          <h2>{reel.title}</h2>
          <div className="ticker-viewport" aria-label="Telemetry ticker">
            <div className="ticker-track">
              <span>
                {reel.fps} FPS • Vertical Recoil: {reel.verticalRecoilDeg}° • #JusticeForHimassTanVuu •&nbsp;
              </span>
              <span aria-hidden="true">
                {reel.fps} FPS • Vertical Recoil: {reel.verticalRecoilDeg}° • #JusticeForHimassTanVuu •&nbsp;
              </span>
            </div>
          </div>
        </div>

        <div className="reel-actions">
          <button
            type="button"
            className="touch-btn"
            aria-pressed={isPlaying}
            aria-label="Toggle reel playback"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            type="button"
            className="touch-btn"
            aria-pressed={muted}
            aria-label="Toggle mute"
            onClick={() => setMuted((m) => !m)}
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <button
            type="button"
            className="touch-btn"
            aria-label={`Endorse ${reel.title}`}
            onClick={() => onEndorsed(reel._id)}
          >
            <Heart size={20} /> {reel.endorsements}
          </button>
        </div>
      </div>
    </article>
  );
}