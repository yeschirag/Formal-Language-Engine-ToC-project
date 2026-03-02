export default function ComingSoonPanel({ title }) {
  return (
    <div
      style={{
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '200px',
        background: 'rgba(255, 255, 255, 0.03)',
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', color: '#e4e4e7', fontSize: '15px', fontWeight: 600 }}>
        {title}
      </h3>
      <span style={{
        margin: 0,
        color: '#71717a',
        fontSize: '12px',
        fontWeight: 500,
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '4px 14px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        Coming Soon
      </span>
    </div>
  );
}
