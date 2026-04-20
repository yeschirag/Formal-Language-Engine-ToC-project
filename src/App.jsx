import { useCallback, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import RegexInput from './components/RegexInput';
import AutomatonGraph from './components/AutomatonGraph';
import DFAConversionPanel from './components/DFAConversionPanel';
import DFAMinimizationPanel from './components/DFAMinimizationPanel';
import FAToRegexPlayground from './components/FAToRegexPlayground';
import { regexPipelineMachine } from './components/regexPipelineMachine';
import { Button } from './components/ui/Button';
import Shuffle from './components/Shuffle';
import CurvedLoop from './components/CurvedLoop';
import TargetCursor from './components/TargetCursor';
import BorderGlow from './components/BorderGlow';
import DotFieldBackground from './components/DotFieldBackground';

const PANEL_GLOW_PROPS = {
  edgeSensitivity: 30,
  glowColor: '40 80 80',
  backgroundColor: 'hsl(var(--card) / 0.24)',
  borderRadius: 26,
  glowRadius: 36,
  glowIntensity: 1,
  coneSpread: 25,
  animated: false,
  colors: ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity: 0.18,
};

function useRegexPipeline() {
  const [machineState, send] = useMachine(regexPipelineMachine);
  const { nfa, dfa, minDfa, regex, error } = machineState.context;

  const handleGenerate = useCallback((value) => {
    send({ type: 'GENERATE', regex: value });
  }, [send]);

  return {
    automaton: nfa,
    dfa,
    minDfa,
    currentRegex: regex,
    error,
    handleGenerate,
  };
}

function RegexPageHeader({ navigate, title, subtitle, onGenerate, error, currentRegex }) {
  return (
    <BorderGlow className="app-header panel-glow" {...PANEL_GLOW_PROPS}>
      <div className="app-nav">
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          ← Home
        </Button>
      </div>
      <h1 className="app-title">{title}</h1>
      <p className="app-subtitle">{subtitle}</p>
      <div className="input-section">
        <RegexInput onGenerate={onGenerate} />
        {error && <p className="error-message">{error}</p>}
        {currentRegex && (
          <div className="regex-display">
            <span className="regex-display-label">Input Regex:</span>
            <span className="regex-display-value">{currentRegex}</span>
          </div>
        )}
      </div>
    </BorderGlow>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <TargetCursor
        spinDuration={1.3}
        hideDefaultCursor
        parallaxOn={false}
        hoverDuration={0.45}
      />
      <div className="landing-page app-shell" style={{ position: 'relative', zIndex: 10 }}>
        <div className="landing-topbar">
          <div className="landing-brand">Formal Language Engine</div>
        </div>

        <div className="landing-headline animate-fade-in">
          <div className="landing-curve-wrap">
            <CurvedLoop 
              marqueeText="Welcome to Formal Language Engine ✦ Theory of Computation ✦ Regular Expressions ✦"
              speed={0.85}
              curveAmount={300}
              direction="left"
              interactive={true}
              className="landing-curved-text"
            />
          </div>

          <div className="landing-title-wrap">
            <Shuffle 
              text="Formal Language Engine"
              tag="h1"
              className="landing-title"
              duration={0.5}
              shuffleDirection="right"
              shuffleTimes={1}
              ease="power3.out"
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
            />
          </div>
        </div>

        <div className="landing-hero animate-fade-in">
          <p className="landing-kicker">Theory of computation, rebuilt for exploration</p>

          <p className="landing-tagline">
            Explore regular expressions, automata, and language transformations in a cleaner workspace built for inspection instead of presentation noise.
          </p>

          <div className="landing-actions">
            <Button size="lg" className="cursor-target" onClick={() => navigate('/regex-to-nfa')}>
              Launch simulator
            </Button>
            <Button variant="outline" size="lg" className="cursor-target" onClick={() => navigate('/fa-to-regex')}>
              Open FA builder
            </Button>
          </div>
        </div>

        <div className="landing-features">
          <BorderGlow
            className="cursor-target animate-fade-in-delay-1 landing-card-clickable landing-card cursor-pointer"
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="hsl(var(--card) / 0.24)"
            borderRadius={28}
            glowRadius={40}
            glowIntensity={1}
            coneSpread={25}
            animated={false}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
            fillOpacity={0.18}
            onClick={() => navigate('/regex-to-nfa')}
          >
            <div style={{ padding: '2em' }}>
              <div className="feature-icon">🔤</div>
              <h3>Regex to ε-NFA</h3>
              <p>Convert regular expressions to epsilon-NFA using Thompson&apos;s construction, then inspect the output graph.</p>
              <span className="landing-card-badge">Open</span>
            </div>
          </BorderGlow>

          <BorderGlow
            className="cursor-target animate-fade-in-delay-2 landing-card-clickable landing-card cursor-pointer"
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="hsl(var(--card) / 0.24)"
            borderRadius={28}
            glowRadius={40}
            glowIntensity={1}
            coneSpread={25}
            animated={false}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
            fillOpacity={0.18}
            onClick={() => navigate('/fa-to-regex')}
          >
            <div style={{ padding: '2em' }}>
              <div className="feature-icon">🔁</div>
              <h3>FA to Regex</h3>
              <p>Build a machine directly on the canvas and generate its equivalent regular expression via state elimination.</p>
              <span className="landing-card-badge">Open</span>
            </div>
          </BorderGlow>

          <BorderGlow
            className="cursor-target animate-fade-in-delay-3 landing-card-clickable landing-card cursor-pointer"
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="hsl(var(--card) / 0.24)"
            borderRadius={28}
            glowRadius={40}
            glowIntensity={1}
            coneSpread={25}
            animated={false}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
            fillOpacity={0.18}
            onClick={() => navigate('/nfa-to-dfa')}
          >
            <div style={{ padding: '2em' }}>
              <div className="feature-icon">⚙️</div>
              <h3>ε-NFA to DFA</h3>
              <p>Transform ε-NFA into deterministic automata using subset construction and inspect the resulting machine.</p>
              <span className="landing-card-badge">Open</span>
            </div>
          </BorderGlow>

          <BorderGlow
            className="cursor-target animate-fade-in-delay-4 landing-card-clickable landing-card cursor-pointer"
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="hsl(var(--card) / 0.24)"
            borderRadius={28}
            glowRadius={40}
            glowIntensity={1}
            coneSpread={25}
            animated={false}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
            fillOpacity={0.18}
            onClick={() => navigate('/dfa-minimization')}
          >
            <div style={{ padding: '2em' }}>
              <div className="feature-icon">✂️</div>
              <h3>DFA Minimization</h3>
              <p>Minimize DFA states using partition refinement and compare the reduced graph side by side.</p>
              <span className="landing-card-badge">Open</span>
            </div>
          </BorderGlow>
        </div>
      </div>
    </>
  );
}

function RegexToNFA() {
  const navigate = useNavigate();
  const { automaton, currentRegex, error, handleGenerate } = useRegexPipeline();

  return (
    <div className="app-container app-shell">
      <RegexPageHeader
        navigate={navigate}
        title="Regex to ε-NFA"
        subtitle="Thompson Construction"
        onGenerate={handleGenerate}
        error={error}
        currentRegex={currentRegex}
      />

      <main className="main-layout">
        <BorderGlow className="panel graph-panel nfa-panel panel-glow" {...PANEL_GLOW_PROPS}>
          <h2 className="panel-title">
            ε-NFA (Thompson Construction)
            <span className="panel-title-legend">
              <span className="legend-dot legend-start"></span> Start
              <span className="legend-dot legend-accept"></span> Accept
              <span className="legend-dot legend-normal"></span> Normal
            </span>
          </h2>
          {automaton && (
            <div className="fa-state-info">
              <span className="fa-state-info-item fa-info-start">
                ▶ Start: <strong>{automaton.startState}</strong>
              </span>
              <span className="fa-state-info-item fa-info-accept">
                ★ Accept: <strong>{automaton.acceptStates.join(', ')}</strong>
              </span>
              <span className="fa-state-info-item fa-info-type">
                Type: <strong>ε-NFA</strong>
              </span>
            </div>
          )}
          <div className="panel-content">
            <AutomatonGraph automaton={automaton} />
          </div>
        </BorderGlow>
      </main>
    </div>
  );
}

function DFAConversionPage() {
  const navigate = useNavigate();
  const { automaton, dfa, currentRegex, error, handleGenerate } = useRegexPipeline();

  return (
    <div className="app-container app-shell">
      <RegexPageHeader
        navigate={navigate}
        title="ε-NFA to DFA"
        subtitle="Step 1: build ε-NFA from regex, Step 2: subset construction to DFA"
        onGenerate={handleGenerate}
        error={error}
        currentRegex={currentRegex}
      />

      <main className="main-layout">
        <BorderGlow className="panel graph-panel nfa-panel panel-glow" {...PANEL_GLOW_PROPS}>
          <h2 className="panel-title">
            Step 1 · ε-NFA (Thompson Construction)
            <span className="panel-title-legend">
              <span className="legend-dot legend-start"></span> Start
              <span className="legend-dot legend-accept"></span> Accept
              <span className="legend-dot legend-normal"></span> Normal
            </span>
          </h2>
          {automaton && (
            <div className="fa-state-info">
              <span className="fa-state-info-item fa-info-start">
                ▶ Start: <strong>{automaton.startState}</strong>
              </span>
              <span className="fa-state-info-item fa-info-accept">
                ★ Accept: <strong>{automaton.acceptStates.join(', ')}</strong>
              </span>
              <span className="fa-state-info-item fa-info-type">
                Type: <strong>ε-NFA</strong>
              </span>
            </div>
          )}
          <div className="panel-content">
            <AutomatonGraph automaton={automaton} />
          </div>
        </BorderGlow>

        <BorderGlow className="panel graph-panel panel-glow" {...PANEL_GLOW_PROPS}>
          <h2 className="panel-title">DFA (Subset Construction)</h2>
          <div className="panel-content">
            <DFAConversionPanel automaton={dfa} />
          </div>
        </BorderGlow>
      </main>
    </div>
  );
}

function DFAMinimizationPage() {
  const navigate = useNavigate();
  const { dfa, minDfa, currentRegex, error, handleGenerate } = useRegexPipeline();

  return (
    <div className="app-container app-shell">
      <RegexPageHeader
        navigate={navigate}
        title="DFA Minimization"
        subtitle="Step 1: build DFA from regex, Step 2: minimize the DFA"
        onGenerate={handleGenerate}
        error={error}
        currentRegex={currentRegex}
      />

      <main className="main-layout">
        <BorderGlow className="panel graph-panel panel-glow" {...PANEL_GLOW_PROPS}>
          <h2 className="panel-title">Step 1 · DFA (Subset Construction)</h2>
          <div className="panel-content">
            <DFAConversionPanel automaton={dfa} />
          </div>
        </BorderGlow>

        <BorderGlow className="panel graph-panel panel-glow" {...PANEL_GLOW_PROPS}>
          <h2 className="panel-title">Step 2 · Minimized DFA</h2>
          <div className="panel-content">
            <DFAMinimizationPanel dfa={minDfa} />
          </div>
        </BorderGlow>
      </main>
    </div>
  );
}

function App() {
  return (
    <>
      <DotFieldBackground />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/regex-to-nfa" element={<RegexToNFA />} />
        <Route path="/nfa-to-dfa" element={<DFAConversionPage />} />
        <Route path="/dfa-conversion" element={<DFAConversionPage />} />
        <Route path="/dfa-minimization" element={<DFAMinimizationPage />} />
        <Route path="/fa-to-regex" element={<FAToRegexPlayground />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
