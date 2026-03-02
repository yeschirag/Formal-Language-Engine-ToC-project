import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

/**
 * Converts an Automaton object to React Flow nodes and edges.
 */
function automatonToFlow(automaton) {
  if (!automaton) return { nodes: [], edges: [] };

  const { states, transitions, startState, acceptStates } = automaton;
  const SPACING_X = 160;
  const SPACING_Y = 100;
  const COLS = Math.max(3, Math.ceil(Math.sqrt(states.length)));

  const nodes = states.map((state, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const isStart = state === startState;
    const isAccept = acceptStates.includes(state);

    let label = state;
    if (isStart && isAccept) label = `→ ${state} ★`;
    else if (isStart) label = `→ ${state}`;
    else if (isAccept) label = `${state} ★`;

    return {
      id: state,
      data: { label },
      position: { x: col * SPACING_X + 50, y: row * SPACING_Y + 50 },
      style: {
        border: isAccept ? '3px double #818cf8' : '2px solid #3f3f46',
        borderRadius: '50%',
        width: 60,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isStart ? '#1e1b4b' : isAccept ? '#312e81' : '#18181b',
        fontSize: '12px',
        fontWeight: isStart || isAccept ? 'bold' : 'normal',
        color: '#e4e4e7',
      },
    };
  });

  const edges = [];
  const edgeMap = new Map();

  for (const [fromState, symbolMap] of Object.entries(transitions)) {
    for (const [symbol, targets] of Object.entries(symbolMap)) {
      for (const toState of targets) {
        const key = `${fromState}->${toState}`;
        if (edgeMap.has(key)) {
          edgeMap.get(key).labels.push(symbol);
        } else {
          edgeMap.set(key, { from: fromState, to: toState, labels: [symbol] });
        }
      }
    }
  }

  for (const [key, { from, to, labels }] of edgeMap) {
    edges.push({
      id: key,
      source: from,
      target: to,
      label: labels.join(', '),
      type: from === to ? 'default' : 'default',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
      style: { stroke: '#6366f1' },
      labelStyle: { fontSize: 12, fontWeight: 'bold', fill: '#a1a1aa' },
      labelBgStyle: { fill: '#18181b', fillOpacity: 0.8 },
    });
  }

  return { nodes, edges };
}

export default function AutomatonGraph({ automaton }) {
  const { nodes, edges } = useMemo(
    () => automatonToFlow(automaton),
    [automaton]
  );

  if (!automaton) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#52525b',
        gap: '8px',
      }}>
        <span style={{ fontSize: '32px' }} role="img" aria-label="Search">🔍</span>
        <span style={{ fontWeight: 500, color: '#71717a' }}>Enter a regex and click Generate to see the ε-NFA.</span>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#27272a" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
