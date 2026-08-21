import { useState, useEffect } from 'react';
import { Icon } from '../Icon.jsx';

export function CareerSelectorModal({ isOpen, onClose, selectedTrack, onSelectTrack, tracks = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTracks = tracks.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="career-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="career-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="career-modal-card"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 id="career-modal-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Select Your Target Career Track
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>
              Tailors coding topics and aptitude drills to your domain.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close career selector"
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            ✕
          </button>
        </div>

        {/* SEARCH BAR */}
        <div style={{ padding: '12px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <input
            type="text"
            placeholder="Search 16 career tracks (e.g. Data Science, Cyber Security)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
        </div>

        {/* GRID OF TRACKS */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '12px',
          }}
        >
          {filteredTracks.map((track) => {
            const isSelected = selectedTrack === track.name;
            return (
              <div
                key={track.id || track.name}
                onClick={() => {
                  onSelectTrack(track.name);
                  onClose();
                }}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #256cf0' : '1px solid #e2e8f0',
                  background: isSelected ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isSelected ? '#256cf0' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#256cf0',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Icon name={track.icon || 'briefcase'} />
                  </div>
                  {isSelected && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#256cf0', background: '#dbeafe', padding: '2px 8px', borderRadius: '12px' }}>
                      Active
                    </span>
                  )}
                </div>

                <div>
                  <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block' }}>{track.name}</strong>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.3 }}>
                    {track.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
