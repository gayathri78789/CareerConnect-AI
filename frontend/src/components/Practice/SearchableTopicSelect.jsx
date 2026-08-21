import { useState, useEffect, useRef } from 'react';
import { Icon } from '../Icon.jsx';

export function SearchableTopicSelect({ selectedTopic, onSelectTopic, topics = [], careerTrack = 'Software Engineering' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('careerprep_recent_topic_searches') || '[]');
    } catch {
      return [];
    }
  });
  const [favoriteTopics, setFavoriteTopics] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('careerprep_favorite_topics') || '[]');
    } catch {
      return ['Arrays', 'Trees', 'System Design'];
    }
  });

  const wrapperRef = useRef(null);

  // Debounce search term by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTopics = ['All', ...topics].filter((t) =>
    t.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleSelect = (topic) => {
    onSelectTopic(topic);
    setIsOpen(false);
    setSearchTerm('');

    if (topic !== 'All' && !recentSearches.includes(topic)) {
      const updated = [topic, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      localStorage.setItem('careerprep_recent_topic_searches', JSON.stringify(updated));
    }
  };

  const toggleFavorite = (e, topic) => {
    e.stopPropagation();
    let updated;
    if (favoriteTopics.includes(topic)) {
      updated = favoriteTopics.filter((t) => t !== topic);
    } else {
      updated = [...favoriteTopics, topic];
    }
    setFavoriteTopics(updated);
    localStorage.setItem('careerprep_favorite_topics', JSON.stringify(updated));
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredTopics.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredTopics.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredTopics.length) {
        handleSelect(filteredTopics[activeIndex]);
      } else if (filteredTopics.length > 0) {
        handleSelect(filteredTopics[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="searchable-topic-container"
      style={{ position: 'relative', minWidth: '240px' }}
      onKeyDown={handleKeyDown}
    >
      <div
        className="topic-select-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          background: '#ffffff',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#1e293b',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icon name="search" />
          <span>{selectedTopic || 'All Topics'}</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>▼</span>
      </div>

      {isOpen && (
        <div
          className="topic-select-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            zIndex: 50,
            maxHeight: '340px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* SEARCH INPUT BAR */}
          <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="text"
              placeholder={`Search ${careerTrack} topics...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '0.9rem' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* RECENT / FAVORITE CHIPS */}
          {recentSearches.length > 0 && !searchTerm && (
            <div style={{ padding: '6px 10px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Recent: </span>
              {recentSearches.map((rec) => (
                <button
                  key={rec}
                  type="button"
                  onClick={() => handleSelect(rec)}
                  style={{
                    background: '#e2e8f0',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '0.75rem',
                    marginRight: '4px',
                    cursor: 'pointer',
                    color: '#334155',
                  }}
                >
                  {rec}
                </button>
              ))}
            </div>
          )}

          {/* TOPIC OPTIONS LIST */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic, idx) => {
                const isSelected = selectedTopic === topic;
                const isFav = favoriteTopics.includes(topic);
                const isHighlighted = idx === activeIndex;

                return (
                  <div
                    key={topic}
                    onClick={() => handleSelect(topic)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    style={{
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: isHighlighted ? '#f1f5f9' : isSelected ? '#eff6ff' : 'transparent',
                      color: isSelected ? '#256cf0' : '#1e293b',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 700 : 500,
                    }}
                  >
                    <span>{topic}</span>
                    {topic !== 'All' && (
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(e, topic)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: isFav ? '#d97706' : '#cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      >
                        {isFav ? '★' : '☆'}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '12px', fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center' }}>
                No matching topic found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
