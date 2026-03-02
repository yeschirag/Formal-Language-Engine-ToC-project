import { useState } from 'react';
import './App.css';
import RegexInput from './components/RegexInput';
import AutomatonGraph from './components/AutomatonGraph';
import ComingSoonPanel from './components/ComingSoonPanel';
import { validateRegex } from './algorithms/regexValidator';
import { regexToPostfix } from './algorithms/regexToPostfix';
import { thompsonConstruction } from './algorithms/thompsonConstruction';

function LandingPage({ onLaunch }) {
  return (
    <div className="landing-page">
      <div className="landing-hero">
        <h1 className="landing-title">Formal Language Engine</h1>
        <p className="landing-tagline">
          Explore the foundations of computation — visualize regular expressions,
          automata, and language transformations in an interactive simulator.
        </p>
        <button className="landing-cta" onClick={onLaunch}>
          Launch Simulator →
        </button>
      </div>

      <div className="landing-features">
        <div className="feature-card">
          <div className="feature-icon">🔤</div>
          <h3>Regex to ε-NFA</h3>
          <p>Convert regular expressions to epsilon-NFA using Thompson&apos;s Construction algorithm.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚙️</div>
          <h3>DFA Conversion</h3>
          <p>Transform ε-NFA into deterministic finite automata with subset construction.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✂️</div>
          <h3>DFA Minimization</h3>
          <p>Minimize DFA states using partition refinement for optimal automata.</p>
        </div>
      </div>
    </div>
  );
}

function Simulator() {
  const [automaton, setAutomaton] = useState(null);
  const [error, setError] = useState('');
  const [showLanding, setShowLanding] = useState(true);

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

  if (showLanding) {
    return <LandingPage onLaunch={() => setShowLanding(false)} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-nav">
          <button className="back-button" onClick={() => setShowLanding(true)}>
            ← Home
          </button>
          <div />
        </div>
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

function App() {
  return <Simulator />;
}

export default App;
