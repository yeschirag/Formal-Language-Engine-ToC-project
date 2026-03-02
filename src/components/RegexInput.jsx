import { useState } from 'react';

export default function RegexInput({ onGenerate }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <label htmlFor="regex-input" style={{ fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', textShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
        Regex (a, b):
      </label>
      <input
        id="regex-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. (a|b)*ab"
        style={{
          flex: 1,
          padding: '10px 14px',
          fontSize: '16px',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderRadius: '12px',
          fontFamily: 'monospace',
          outline: 'none',
          background: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1)',
          color: '#1e293b',
          transition: 'all 0.25s ease',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '10px 28px',
          fontSize: '16px',
          fontWeight: 600,
          background: 'rgba(255, 255, 255, 0.55)',
          color: '#4f46e5',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          borderRadius: '12px',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1)',
          transition: 'all 0.25s ease',
          fontFamily: 'inherit',
        }}
      >
        Generate
      </button>
    </form>
  );
}
