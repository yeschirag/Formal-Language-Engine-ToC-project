import { useState } from 'react';

export default function RegexInput({ onGenerate }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <label htmlFor="regex-input" style={{ fontWeight: 600, color: '#a1a1aa', whiteSpace: 'nowrap', fontSize: '14px' }}>
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
          fontSize: '15px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          fontFamily: 'monospace',
          outline: 'none',
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#fafafa',
          transition: 'all 0.2s ease',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: 600,
          background: '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: 'inherit',
          boxShadow: '0 0 20px -5px rgba(99, 102, 241, 0.4)',
        }}
      >
        Generate
      </button>
    </form>
  );
}
