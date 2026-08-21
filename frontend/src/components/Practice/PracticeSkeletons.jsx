export function PracticeFullSkeleton() {
  return (
    <div className="practice-skeleton-wrapper" style={{ padding: '24px', opacity: 0.7 }}>
      <div style={{ height: '40px', background: '#e2e8f0', borderRadius: '8px', marginBottom: '24px', width: '40%' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: '500px' }}>
        <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '20px' }}>
          <div style={{ height: '24px', background: '#cbd5e1', borderRadius: '6px', width: '60%', marginBottom: '16px' }} />
          <div style={{ height: '16px', background: '#cbd5e1', borderRadius: '4px', width: '90%', marginBottom: '8px' }} />
          <div style={{ height: '16px', background: '#cbd5e1', borderRadius: '4px', width: '75%', marginBottom: '8px' }} />
        </div>
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px' }}>
          <div style={{ height: '24px', background: '#334155', borderRadius: '6px', width: '30%', marginBottom: '16px' }} />
          <div style={{ height: '300px', background: '#0f172a', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  );
}
