const iconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
};

function Svg({ children }) {
  return (
    <svg aria-hidden="true" {...iconProps}>
      {children}
    </svg>
  );
}

export function Icon({ name }) {
  switch (name) {
    case 'shield':
      return (
        <Svg>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </Svg>
      );
    case 'creditCard':
    case 'billing':
      return (
        <Svg>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </Svg>
      );
    case 'terminal':
      return (
        <Svg>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M7 10l3 3-3 3" />
          <path d="M12.5 16H17" />
        </Svg>
      );
    case 'logout':
      return (
        <Svg>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </Svg>
      );
    case 'dashboard':
      return (
        <Svg>
          <rect x="4" y="4" width="6" height="6" rx="1.5" />
          <rect x="14" y="4" width="6" height="6" rx="1.5" />
          <rect x="4" y="14" width="6" height="6" rx="1.5" />
          <rect x="14" y="14" width="6" height="6" rx="1.5" />
        </Svg>
      );
    case 'users':
      return (
        <Svg>
          <path d="M16 21v-1.5a4.5 4.5 0 0 0-4.5-4.5H8.5A4.5 4.5 0 0 0 4 19.5V21" />
          <circle cx="10" cy="8" r="3" />
          <path d="M20 21v-1a3.5 3.5 0 0 0-3-3.46" />
          <path d="M15.5 5.2a3 3 0 0 1 0 5.6" />
        </Svg>
      );
    case 'question':
      return (
        <Svg>
          <path d="M9.5 9a2.5 2.5 0 1 1 4 2l-1 1" />
          <path d="M12 17h.01" />
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5z" />
        </Svg>
      );
    case 'chartSquare':
      return (
        <Svg>
          <path d="M5 20V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14" />
          <path d="M8 16v-4" />
          <path d="M12 16v-7" />
          <path d="M16 16v-2" />
        </Svg>
      );
    case 'barChart':
      return (
        <Svg>
          <path d="M5 20V10" />
          <path d="M12 20V5" />
          <path d="M19 20v-7" />
        </Svg>
      );
    case 'gearSpark':
    case 'settings':
      return (
        <Svg>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 0 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 0 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 0 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a2 2 0 0 1 0 4h-.2a1 1 0 0 0-.9.6z" />
          {name === 'gearSpark' ? (
            <>
              <path d="M19 2v4" />
              <path d="M17 4h4" />
            </>
          ) : null}
        </Svg>
      );
    case 'help':
      return (
        <Svg>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.75 9a2.25 2.25 0 1 1 3.79 1.64c-.82.73-1.54 1.23-1.54 2.36" />
          <path d="M12 17h.01" />
        </Svg>
      );
    case 'calendar':
      return (
        <Svg>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4" />
          <path d="M8 3v4" />
          <path d="M3 10h18" />
        </Svg>
      );
    case 'broadcast':
      return (
        <Svg>
          <path d="M12 12a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5z" />
          <path d="M6.8 17.2a7.5 7.5 0 0 0 10.4 0" />
          <path d="M18.5 5.5a9.2 9.2 0 0 1 0 13" />
          <path d="M5.5 18.5a9.2 9.2 0 0 1 0-13" />
        </Svg>
      );
    case 'wallet':
      return (
        <Svg>
          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5z" />
          <path d="M4 9h16" />
          <path d="M15 14h3" />
          <circle cx="15" cy="14" r=".6" fill="currentColor" stroke="none" />
        </Svg>
      );
    case 'badge':
      return (
        <Svg>
          <path d="M12 3l2.4 1.2 2.7-.4 1.1 2.5 2.1 1.8-1 2.5 1 2.5-2.1 1.8-1.1 2.5-2.7-.4L12 21l-2.4-1.2-2.7.4-1.1-2.5-2.1-1.8 1-2.5-1-2.5 2.1-1.8 1.1-2.5 2.7.4z" />
          <path d="M9.5 12l1.6 1.6 3.4-3.7" />
        </Svg>
      );
    case 'trendUp':
      return (
        <Svg>
          <path d="M5 15l5-5 4 4 5-7" />
          <path d="M14 7h5v5" />
        </Svg>
      );
    case 'trendDown':
      return (
        <Svg>
          <path d="M5 9l5 5 4-4 5 7" />
          <path d="M14 17h5v-5" />
        </Svg>
      );
    case 'search':
      return (
        <Svg>
          <circle cx="11" cy="11" r="6" />
          <path d="M20 20l-4.2-4.2" />
        </Svg>
      );
    case 'more':
      return (
        <Svg>
          <circle cx="12" cy="6" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
        </Svg>
      );
    case 'chevronLeft':
      return (
        <Svg>
          <path d="M15 18l-6-6 6-6" />
        </Svg>
      );
    case 'chevronRight':
    case 'arrowRight':
      return (
        <Svg>
          <path d="M9 18l6-6-6-6" />
        </Svg>
      );
    case 'brain':
      return (
        <Svg>
          <path d="M9.5 6A3.5 3.5 0 0 1 16 7.7a3 3 0 0 1 1.7 4.6 3 3 0 0 1-2.2 5.3H14" />
          <path d="M9.5 6A3.5 3.5 0 0 0 3 7.7a3 3 0 0 0-1.7 4.6 3 3 0 0 0 2.2 5.3H5" />
          <path d="M12 4v16" />
          <path d="M8 11h4" />
          <path d="M8 15h4" />
        </Svg>
      );
    case 'code':
      return (
        <Svg>
          <path d="M9 8l-4 4 4 4" />
          <path d="M15 8l4 4-4 4" />
        </Svg>
      );
    case 'edit':
      return (
        <Svg>
          <path d="M4 20l4.5-1 9-9a2.1 2.1 0 0 0-3-3l-9 9z" />
          <path d="M13.5 6.5l3 3" />
        </Svg>
      );
    case 'analytics':
      return (
        <Svg>
          <path d="M4 19V9" />
          <path d="M10 19V5" />
          <path d="M16 19v-8" />
          <path d="M22 19V3" />
        </Svg>
      );
    case 'document':
      return (
        <Svg>
          <path d="M8 3h6l5 5v13H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path d="M14 3v6h6" />
          <path d="M10 13h6" />
          <path d="M10 17h4" />
        </Svg>
      );
    case 'mic':
      return (
        <Svg>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0" />
          <path d="M12 18v3" />
        </Svg>
      );
    case 'chat':
      return (
        <Svg>
          <path d="M7 18l-4 3V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z" />
          <path d="M8 10h8" />
          <path d="M8 14h5" />
        </Svg>
      );
    case 'roadmap':
      return (
        <Svg>
          <path d="M4 17c4 0 4-10 8-10s4 10 8 10" />
          <circle cx="4" cy="17" r="1.5" />
          <circle cx="12" cy="7" r="1.5" />
          <circle cx="20" cy="17" r="1.5" />
        </Svg>
      );
    case 'bell':
      return (
        <Svg>
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </Svg>
      );
    case 'calculator':
      return (
        <Svg>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="16" y1="14" x2="16" y2="18" />
          <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
        </Svg>
      );
    case 'book':
      return (
        <Svg>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </Svg>
      );
    case 'layers':
      return (
        <Svg>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </Svg>
      );
    case 'target':
      return (
        <Svg>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </Svg>
      );
    case 'user':
      return (
        <Svg>
          <circle cx="12" cy="8" r="4" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </Svg>
      );
    case 'spark':
      return (
        <Svg>
          <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" />
          <path d="M19 3v4" />
          <path d="M17 5h4" />
          <path d="M5 16v3" />
          <path d="M3.5 17.5h3" />
        </Svg>
      );
    case 'video':
      return (
        <Svg>
          <rect x="3" y="6" width="12" height="12" rx="2" />
          <path d="M15 10l6-3v10l-6-3z" />
        </Svg>
      );
    case 'history':
      return (
        <Svg>
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 3v6h6" />
          <path d="M12 7v5l3 2" />
        </Svg>
      );
    case 'mail':
    case 'email':
      return (
        <Svg>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </Svg>
      );
    case 'phone':
      return (
        <Svg>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </Svg>
      );
    case 'mapPin':
    case 'location':
      return (
        <Svg>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </Svg>
      );
    case 'plus':
      return (
        <Svg>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </Svg>
      );
    case 'folder':
      return (
        <Svg>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </Svg>
      );
    case 'plusCircle':
      return (
        <Svg>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </Svg>
      );
    case 'close':
      return (
        <Svg>
          <path d="M6 6l12 12" />
          <path d="M18 6l-12 12" />
        </Svg>
      );
    case 'share':
      return (
        <Svg>
          <circle cx="18" cy="5" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="19" r="2" />
          <path d="M8 11l8-5" />
          <path d="M8 13l8 5" />
        </Svg>
      );
    case 'download':
      return (
        <Svg>
          <path d="M12 3v12" />
          <path d="M7 10l5 5 5-5" />
          <path d="M4 20h16" />
        </Svg>
      );
    case 'upload':
      return (
        <Svg>
          <path d="M12 15V3" />
          <path d="M7 8l5-5 5 5" />
          <path d="M4 20h16" />
        </Svg>
      );
    case 'paperclip':
      return (
        <Svg>
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </Svg>
      );
    case 'send':
      return (
        <Svg>
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </Svg>
      );
    case 'trendingUp':
      return (
        <Svg>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </Svg>
      );
    case 'briefcase':
      return (
        <Svg>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </Svg>
      );
    case 'rocket':
    case 'project':
      return (
        <Svg>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.54 1.62-2.46l4.47-4.47 5.38-5.38a2.5 2.5 0 0 1 3.54 3.54l-5.38 5.38-4.47 4.47c-.92.36-1.75.91-2.46 1.62z" />
          <circle cx="15" cy="9" r="1" />
          <path d="M9 12l-3 3" />
          <path d="M12 9l3-3" />
        </Svg>
      );
    case 'bulb':
      return (
        <Svg>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M8 14a6 6 0 1 1 8 0c-1 1-1.5 1.8-1.8 4H9.8c-.3-2.2-.8-3-1.8-4z" />
        </Svg>
      );
    case 'bot':
      return (
        <Svg>
          <rect x="5" y="8" width="14" height="10" rx="3" />
          <path d="M12 3v3" />
          <path d="M9 13h.01" />
          <path d="M15 13h.01" />
          <path d="M8 18v2" />
          <path d="M16 18v2" />
        </Svg>
      );
    case 'warning':
      return (
        <Svg>
          <path d="M12 3l10 18H2z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </Svg>
      );
    case 'graduation':
      return (
        <Svg>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </Svg>
      );
    case 'pencil':
      return (
        <Svg>
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </Svg>
      );
    case 'sparkles':
      return (
        <Svg>
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
          <path d="M19 15l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
        </Svg>
      );
    case 'building':
      return (
        <Svg>
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
        </Svg>
      );
    case 'landmark':
      return (
        <Svg>
          <line x1="3" y1="22" x2="21" y2="22" />
          <line x1="6" y1="18" x2="6" y2="11" />
          <line x1="10" y1="18" x2="10" y2="11" />
          <line x1="14" y1="18" x2="14" y2="11" />
          <line x1="18" y1="18" x2="18" y2="11" />
          <polygon points="12 2 20 7 4 7 12 2" />
        </Svg>
      );
    case 'sigma':
      return (
        <Svg>
          <path d="M18 4H6l6 8-6 8h12" />
        </Svg>
      );
    case 'language':
      return (
        <Svg>
          <path d="M5 8h14M12 4v4M6 8c0 4 2.5 7.5 6 9M18 8c0 3-1.5 5.5-4 7M14 14l3 5M21 19l-3-5" />
        </Svg>
      );
    case 'play':
      return (
        <Svg>
          <polygon points="5 3 19 12 5 21 5 3" />
        </Svg>
      );
    case 'bug':
      return (
        <Svg>
          <rect x="8" y="6" width="8" height="14" rx="4" />
          <path d="M6 10h4M14 10h4M6 14h4M14 14h4M10 2l-2 4M14 2l2 4" />
        </Svg>
      );
    case 'expand':
      return (
        <Svg>
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </Svg>
      );
    case 'clock':
      return (
        <Svg>
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 6 12 12 16 14" />
        </Svg>
      );
    case 'trophy':
      return (
        <Svg>
          <path d="M8 21h8M12 17v4M6 4h12a2 2 0 0 1 2 2v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V6a2 2 0 0 1 2-2z" />
          <path d="M4 6H2a2 2 0 0 0-2 2v1a3 3 0 0 0 3 3h1M20 6h2a2 2 0 0 1 2 2v1a3 3 0 0 1-3 3h-1" />
        </Svg>
      );
    case 'shieldCheck':
      return (
        <Svg>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </Svg>
      );
    case 'alertCircle':
      return (
        <Svg>
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </Svg>
      );
    case 'refresh':
      return (
        <Svg>
          <path d="M23 4v6h-6" />
          <path d="M1 20v-6h6" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </Svg>
      );
    case 'linkedin':
      return (
        <Svg>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </Svg>
      );
    case 'checkCircle':
      return (
        <Svg>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </Svg>
      );
    case 'globe':
      return (
        <Svg>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </Svg>
      );
    case 'sun':
      return (
        <Svg>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </Svg>
      );
    case 'moon':
      return (
        <Svg>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </Svg>
      );
    case 'menu':
      return (
        <Svg>
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </Svg>
      );
    default:
      return null;
  }
}



