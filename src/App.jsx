import { useState } from 'react';
import './App.css';
import RegexInput from './components/RegexInput';
import AutomatonGraph from './components/AutomatonGraph';
import ComingSoonPanel from './components/ComingSoonPanel';
import FAToRegexPlayground from './components/FAToRegexPlayground';
import { Button } from './components/ui/Button';
import { GlowCard } from './components/ui/GlowCard';
import StarField from './components/ui/StarField';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { validateRegex } from './algorithms/regexValidator';
import { regexToPostfix } from './algorithms/regexToPostfix';
import { thompsonConstruction } from './algorithms/thompsonConstruction';

function LandingPage({ onLaunch, onFaToRegex }) {
  return (
    <div className="landing-page">
      <StarField />
      <div className="absolute top-4 right-6 z-10">
        <ThemeToggle />
      </div>
      <div className="landing-hero animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
          Theory of Computation
        </p>
        <h1 className="landing-title">
          Formal Language{' '}
          <span className="landing-title-accent">Engine</span>
        </h1>
        <p className="landing-tagline">
          Explore the foundations of computation — visualize regular expressions,
          automata, and language transformations in an interactive simulator.
        </p>
        <Button size="lg" onClick={onLaunch}>
          Launch Simulator →
        </Button>
      </div>

      <div className="landing-features">
        <GlowCard className="animate-fade-in-delay-1 landing-card-clickable" onClick={onLaunch}>
          <div className="feature-icon">🔤</div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Regex to ε-NFA</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Convert regular expressions to epsilon-NFA using Thompson&apos;s Construction algorithm.</p>
          <span className="landing-card-badge">Open →</span>
        </GlowCard>
        <GlowCard className="animate-fade-in-delay-2 landing-card-clickable" onClick={onFaToRegex}>
          <div className="feature-icon">🔁</div>
          <h3 className="text-sm font-semibold text-foreground mb-1">FA to Regex</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Build a finite automaton interactively and generate its equivalent regular expression via state elimination.</p>
          <span className="landing-card-badge">Open →</span>
        </GlowCard>
        <GlowCard className="animate-fade-in-delay-3">
          <div className="feature-icon">⚙️</div>
          <h3 className="text-sm font-semibold text-foreground mb-1">DFA Conversion</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Transform ε-NFA into deterministic finite automata with subset construction.</p>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border mt-2 inline-block">Coming Soon</span>
        </GlowCard>
        <GlowCard className="animate-fade-in-delay-4">
          <div className="feature-icon">✂️</div>
          <h3 className="text-sm font-semibold text-foreground mb-1">DFA Minimization</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Minimize DFA states using partition refinement for optimal automata.</p>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border mt-2 inline-block">Coming Soon</span>
        </GlowCard>
      </div>
    </div>
  );
}

function Simulator() {
  const [automaton, setAutomaton] = useState(null);
  const [currentRegex, setCurrentRegex] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState('landing');

  const handleGenerate = (regex) => {
    setError('');
    setAutomaton(null);
    setCurrentRegex('');

    const validation = validateRegex(regex);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    const postfix = regexToPostfix(regex);
    const nfa = thompsonConstruction(postfix);
    setAutomaton(nfa);
    setCurrentRegex(regex);
  };

  if (view === 'landing') {
    return (
      <LandingPage
        onLaunch={() => setView('regex-to-nfa')}
        onFaToRegex={() => setView('fa-to-regex')}
      />
    );
  }

  if (view === 'fa-to-regex') {
    return <FAToRegexPlayground onBack={() => setView('landing')} />;
  }

  return (
    <div className="app-container">
      <StarField />
      <header className="app-header">
        <div className="app-nav">
          <Button variant="outline" size="sm" onClick={() => setView('landing')}>
            ← Home
          </Button>
          <ThemeToggle />
        </div>
        <h1 className="app-title">Formal Language Engine</h1>
        <p className="app-subtitle">Phase 1: Regular Expression → ε-NFA</p>
        <div className="input-section">
          <RegexInput onGenerate={handleGenerate} />
          {error && <p className="error-message">{error}</p>}
          {currentRegex && (
            <div className="regex-display">
              <span className="regex-display-label">Input Regex:</span>
              <span className="regex-display-value">{currentRegex}</span>
            </div>
          )}
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
