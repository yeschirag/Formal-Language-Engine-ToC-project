export default function ComingSoonPanel({ title }) {
  return (
    <div
      style={{
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '20px',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '200px',
        background: 'rgba(255, 255, 255, 0.35)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.12)',
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '16px', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
        {title}
      </h3>
      <span style={{
        margin: 0,
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '13px',
        fontWeight: 500,
        background: 'rgba(255, 255, 255, 0.25)',
        padding: '4px 14px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}>
        Coming Soon
      </span>
    </div>
  );
}
