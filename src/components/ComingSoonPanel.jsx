export default function ComingSoonPanel({ title }) {
  return (
    <div
      style={{
        border: '2px dashed #cbd5e1',
        borderRadius: '12px',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '200px',
        background: '#f8fafc',
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', color: '#475569', fontSize: '16px' }}>
        {title}
      </h3>
      <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
        Coming Soon
      </p>
    </div>
  );
}
