import { useState } from 'react';
import './App.css';
import RegexInput from './components/RegexInput';
import AutomatonGraph from './components/AutomatonGraph';
import ComingSoonPanel from './components/ComingSoonPanel';
import { validateRegex } from './algorithms/regexValidator';
import { regexToPostfix } from './algorithms/regexToPostfix';
import { thompsonConstruction } from './algorithms/thompsonConstruction';

function App() {
  const [automaton, setAutomaton] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = (regex) => {
    setError('');
    setAutomaton(null);

    const validation = validateRegex(regex);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    const postfix = regexToPostfix(regex);
    const nfa = thompsonConstruction(postfix);
    setAutomaton(nfa);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Formal Language Engine</h1>
        <p className="app-subtitle">Theory of Computation — Phase 1: Regular Expression → ε-NFA</p>
        <div className="input-section">
          <RegexInput onGenerate={handleGenerate} />
          {error && <p className="error-message">{error}</p>}
        </div>
      </header>

      <main className="main-layout">
        <section className="panel nfa-panel">
          <h2 className="panel-title">ε-NFA (Thompson Construction)</h2>
          <div className="panel-content">
            <AutomatonGraph automaton={automaton} />
          </div>
        </section>

        <aside className="side-panels">
          <div className="side-panel">
            <ComingSoonPanel title="DFA Conversion" />
          </div>
          <div className="side-panel">
            <ComingSoonPanel title="DFA Minimization" />
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
