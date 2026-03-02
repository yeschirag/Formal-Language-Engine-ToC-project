import { useState } from 'react';

export default function RegexInput({ onGenerate }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <label htmlFor="regex-input" style={{ fontWeight: 'bold', color: '#334155', whiteSpace: 'nowrap' }}>
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
          padding: '8px 12px',
          fontSize: '16px',
          border: '2px solid #cbd5e1',
          borderRadius: '8px',
          fontFamily: 'monospace',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '8px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Generate
      </button>
    </form>
  );
}
