import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import { useMachine } from '@xstate/react';
import '@xyflow/react/dist/style.css';
import { Button } from './ui/Button';
import BorderGlow from './BorderGlow';
import StateNode from './nodes/StateNode';
import TransitionEdge from './edges/TransitionEdge';
import { buildAutomatonEdges, buildAutomatonNodes, classifyFA } from './flowUtils';
import { faEditorMachine } from './faEditorMachine';

const nodeTypes = { stateNode: StateNode };
const edgeTypes = { transition: TransitionEdge };
const GLOW_CARD_PROPS = {
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

export default function FAToRegexPlayground() {
  const navigate = useNavigate();
  const [machineState, send] = useMachine(faEditorMachine);
  const safeContext = machineState?.context ?? {
    states: ['q0', 'q1'],
    startState: 'q0',
    acceptStates: ['q1'],
    transitions: { q0: { a: ['q1'] } },
    newStateName: '',
    transFrom: 'q0',
    transSymbol: 'a',
    transTo: 'q1',
    result: null,
    error: '',
    showControls: true,
  };
  const safeSend = typeof send === 'function' ? send : () => {};
  const {
    states,
    startState,
    acceptStates,
    transitions,
    newStateName,
    transFrom,
    transSymbol,
    transTo,
    result,
    error,
    showControls,
  } = safeContext;

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const prevNodesRef = useRef([]);

  useEffect(() => {
    const nextNodes = buildAutomatonNodes(states ?? [], startState, acceptStates ?? [], prevNodesRef.current, 'orbit');
    prevNodesRef.current = nextNodes;
    setNodes(nextNodes);
    setEdges(buildAutomatonEdges(transitions ?? {}));
  }, [states, startState, acceptStates, transitions, setNodes, setEdges]);

  const faType = useMemo(() => classifyFA(states ?? [], transitions ?? {}), [states, transitions]);

  const transitionList = useMemo(() => {
    const list = [];
    for (const [from, symbolMap] of Object.entries(transitions ?? {})) {
      for (const [sym, targets] of Object.entries(symbolMap)) {
        for (const to of targets) {
          list.push({ from, sym, to });
        }
      }
    }
    return list;
  }, [transitions]);

  return (
    <div className="app-container app-shell">
      <BorderGlow className="app-header panel-glow" {...GLOW_CARD_PROPS}>
        <div className="app-nav">
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            Back Home
          </Button>
          <div className="app-nav-right">
            <button
              className="fa-panel-toggle"
              onClick={() => safeSend({ type: 'TOGGLE_CONTROLS' })}
              aria-label="Toggle controls panel"
            >
              {showControls ? 'Hide Panel' : 'Show Panel'}
            </button>
          </div>
        </div>
        <h1 className="app-title">FA to Regex Converter</h1>
        <p className="app-subtitle">
          Build a finite automaton and generate its regular expression
        </p>
        <div className="app-chip-row">
          <span className="app-chip">{states.length} states</span>
          <span className="app-chip">{transitionList.length} transitions</span>
          <span className="app-chip">{faType}</span>
          <span className="app-chip">XState-driven editor</span>
        </div>
      </BorderGlow>

      <main className="fa-regex-layout">
        <BorderGlow className={`fa-controls-panel panel panel-glow ${showControls ? '' : 'fa-controls-hidden'}`} {...GLOW_CARD_PROPS}>
          <section className="fa-section">
            <h3 className="fa-section-title">States</h3>

            <div className="fa-add-row">
              <input
                className="fa-input"
                value={newStateName}
                onChange={e => safeSend({ type: 'NEW_STATE_NAME_CHANGED', value: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && safeSend({ type: 'ADD_STATE' })}
                placeholder="e.g. q2"
                aria-label="New state name"
              />
              <Button size="sm" onClick={() => safeSend({ type: 'ADD_STATE' })}>
                Add
              </Button>
            </div>

            <ul className="fa-state-list">
              {states.map(s => (
                <li key={s} className="fa-state-item">
                  <span className="fa-state-name">{s}</span>
                  <div className="fa-state-actions">
                    <button
                      className={`fa-badge-btn ${startState === s ? 'active-start' : ''}`}
                      onClick={() => safeSend({ type: 'SET_START_STATE', state: s })}
                      title="Set as start state"
                    >
                      {startState === s ? 'Start State' : 'Start'}
                    </button>
                    <button
                      className={`fa-badge-btn ${acceptStates.includes(s) ? 'active-accept' : ''}`}
                      onClick={() => safeSend({ type: 'TOGGLE_ACCEPT_STATE', state: s })}
                      title="Toggle accept state"
                    >
                      {acceptStates.includes(s) ? 'Accept State' : 'Accept'}
                    </button>
                    <button
                      className="fa-remove-btn"
                      onClick={() => safeSend({ type: 'REMOVE_STATE', state: s })}
                      title={`Remove state ${s}`}
                      aria-label={`Remove state ${s}`}
                    >
                      x
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="fa-section">
            <h3 className="fa-section-title">Transitions</h3>

            <div className="fa-transition-form">
              <select
                className="fa-select"
                value={transFrom}
                onChange={e => safeSend({ type: 'TRANS_FROM_CHANGED', value: e.target.value })}
                aria-label="From state"
              >
                {states.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <input
                className="fa-input fa-symbol-input"
                value={transSymbol}
                onChange={e => safeSend({ type: 'TRANS_SYMBOL_CHANGED', value: e.target.value })}
                placeholder="a or eps"
                aria-label="Transition symbol"
              />

              <button
                type="button"
                className="fa-epsilon-btn"
                onClick={() => safeSend({ type: 'TRANS_SYMBOL_CHANGED', value: 'eps' })}
                title="Use epsilon transition"
              >
                eps
              </button>

              <select
                className="fa-select"
                value={transTo}
                onChange={e => safeSend({ type: 'TRANS_TO_CHANGED', value: e.target.value })}
                aria-label="To state"
              >
                {states.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <Button size="sm" onClick={() => safeSend({ type: 'ADD_TRANSITION' })}>
                Add
              </Button>
            </div>
            <p className="fa-transition-hint">Tip: use eps (or epsilon) for epsilon transitions.</p>

            {transitionList.length > 0 && (
              <ul className="fa-transition-list">
                {transitionList.map(({ from, sym, to }, i) => (
                  <li key={`${from}-${sym}-${to}-${i}`} className="fa-transition-item">
                    <span className="fa-transition-label">
                      <span className="fa-trans-state">{from}</span>
                      <span className="fa-trans-arrow">
                        &nbsp;-<sup>{sym}</sup>-&gt;&nbsp;
                      </span>
                      <span className="fa-trans-state">{to}</span>
                    </span>
                    <button
                      className="fa-remove-btn"
                      onClick={() => safeSend({ type: 'REMOVE_TRANSITION', from, symbol: sym, to })}
                      aria-label={`Remove transition ${from} -${sym}-> ${to}`}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {error && <p className="error-message">{error}</p>}

          <Button className="fa-generate-btn" onClick={() => safeSend({ type: 'GENERATE_REGEX' })}>
            Generate Regex
          </Button>

          {result !== null && (
            <div className="fa-result">
              <span className="fa-result-label">Generated Regex:</span>
              <span className="fa-result-value">{result}</span>
            </div>
          )}
        </BorderGlow>

        <BorderGlow className="panel fa-graph-panel panel-glow" {...GLOW_CARD_PROPS}>
          <h2 className="panel-title">
            FA Graph
            <span className="panel-title-legend">
              <span className="legend-dot legend-start"></span> Start
              <span className="legend-dot legend-accept"></span> Accept
              <span className="legend-dot legend-normal"></span> Normal
            </span>
          </h2>
          {states.length > 0 && (
            <div className="fa-state-info">
              <span className="fa-state-info-item fa-info-start">
                Start: <strong>{startState || '-'}</strong>
              </span>
              <span className="fa-state-info-item fa-info-accept">
                Accept: <strong>{acceptStates.length > 0 ? acceptStates.join(', ') : '-'}</strong>
              </span>
              <span className="fa-state-info-item fa-info-type">
                Type: <strong>{faType}</strong>
              </span>
            </div>
          )}
          <div className="panel-content">
            {states.length === 0 ? (
              <div className="graph-empty-state">
                <div className="graph-empty-icon" role="img" aria-label="Graph">
                  []
                </div>
                <h3>Add states first</h3>
                <p>The React Flow canvas will render your automaton here once the machine has states.</p>
              </div>
            ) : (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                fitViewOptions={{ padding: 0.3, maxZoom: 1.4 }}
                nodesDraggable
                nodesConnectable={false}
                elementsSelectable
                minZoom={0.2}
                maxZoom={2}
                attributionPosition="bottom-left"
                className="automaton-flow"
              >
                <Background color="hsl(var(--border))" gap={24} size={1.3} variant="dots" />
                <Controls showInteractive={false} />
              </ReactFlow>
            )}
          </div>
        </BorderGlow>
      </main>
    </div>
  );
}
