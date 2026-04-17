import { useState } from 'react';

export default function RegexInput({ onGenerate }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onGenerate(value);
    }
  };

  const examples = ['ab*', 'a*b', '(a|b)*ab', 'a|b'];

  const handleExampleClick = (example) => {
    setValue(example);
    onGenerate(example);
  };

  return (
    <div className="regex-input-shell">
      <form onSubmit={handleSubmit} className="regex-input-form">
        <label htmlFor="regex-input" className="regex-input-label">
          Regex
        </label>
        <input
          id="regex-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. (a|b)*ab"
          className="regex-input-field"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="regex-input-button"
        >
          Generate
        </button>
      </form>
      <div className="regex-example-row">
        <span className="regex-example-label">Examples</span>
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => handleExampleClick(example)}
            className="regex-example-chip"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
