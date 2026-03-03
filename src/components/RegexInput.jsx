import { useState } from 'react';

export default function RegexInput({ onGenerate }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <label
        htmlFor="regex-input"
        className="text-sm font-medium text-muted-foreground whitespace-nowrap"
      >
        Regex (a, b):
      </label>
      <input
        id="regex-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. (a|b)*ab"
        className="flex-1 px-3.5 py-2.5 text-sm font-mono rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="px-5 py-2.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
      >
        Generate
      </button>
    </form>
  );
}
