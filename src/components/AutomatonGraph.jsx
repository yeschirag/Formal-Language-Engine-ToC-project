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
        border: isAccept ? '3px double #2563eb' : '2px solid #64748b',
        borderRadius: '50%',
        width: 60,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isStart ? '#dbeafe' : isAccept ? '#fef3c7' : '#fff',
        fontSize: '12px',
        fontWeight: isStart || isAccept ? 'bold' : 'normal',
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
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#64748b' },
      labelStyle: { fontSize: 12, fontWeight: 'bold' },
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
        Enter a regex and click Generate to see the ε-NFA.
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
        <Background color="#e2e8f0" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
