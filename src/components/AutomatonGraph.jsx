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
  const SPACING_X = 200;
  const SPACING_Y = 140;
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
        border: isAccept ? '3px double #6366f1' : '2px solid #3b82f6',
        borderRadius: '50%',
        width: 70,
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isStart ? '#1e3a8a' : isAccept ? '#1e40af' : 'hsl(224, 71%, 8%)',
        fontSize: '13px',
        fontWeight: isStart || isAccept ? 'bold' : '600',
        color: '#f1f5f9',
        boxShadow: isStart || isAccept ? '0 0 20px rgba(99, 102, 241, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.3)',
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
    const isSelfLoop = from === to;
    edges.push({
      id: key,
      source: from,
      target: to,
      label: labels.join(', '),
      type: isSelfLoop ? 'default' : 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1', width: 20, height: 20 },
      style: {
        stroke: '#6366f1',
        strokeWidth: 2.5,
      },
      labelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        fill: '#e0e7ff',
        fontFamily: 'monospace',
      },
      labelBgStyle: {
        fill: 'hsl(224, 71%, 4%)',
        fillOpacity: 0.95,
        rx: 4,
        ry: 4,
      },
      labelBgPadding: [8, 6],
      animated: labels.includes('ε'),
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
      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
        <span className="text-3xl" role="img" aria-label="Search">🔍</span>
        <span className="text-sm font-medium">Enter a regex and click Generate to see the ε-NFA.</span>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.2 }}
        attributionPosition="bottom-left"
        minZoom={0.2}
        maxZoom={2}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background color="#334155" gap={20} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
