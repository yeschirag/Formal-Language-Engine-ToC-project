import { MarkerType } from '@xyflow/react';

const GRID_SPACING_X = 250;
const GRID_SPACING_Y = 190;

function getPositionForLayout(index, total, layout) {
  if (layout === 'orbit') {
    if (total === 1) return { x: 200, y: 180 };
    const radius = Math.max(150, total * 50);
    const angle = (2 * Math.PI * index) / total - Math.PI / 2;
    return {
      x: radius + 80 + radius * Math.cos(angle),
      y: radius + 80 + radius * Math.sin(angle),
    };
  }

  const cols = Math.max(3, Math.ceil(Math.sqrt(total || 1)));
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {
    x: col * GRID_SPACING_X + 50,
    y: row * GRID_SPACING_Y + 50,
  };
}

export function getStateType(state, startState, acceptStates) {
  const isStart = state === startState;
  const isAccept = acceptStates.includes(state);

  if (isStart && isAccept) return 'startAccept';
  if (isStart) return 'start';
  if (isAccept) return 'accept';
  return 'normal';
}

export function buildAutomatonNodes(states, startState, acceptStates, prevNodes = [], layout = 'grid') {
  const positionMap = new Map(prevNodes.map(node => [node.id, node.position]));

  return states.map((state, index) => ({
    id: state,
    type: 'stateNode',
    data: { label: state, stateType: getStateType(state, startState, acceptStates) },
    position: positionMap.get(state) ?? getPositionForLayout(index, states.length, layout),
  }));
}

export function buildAutomatonEdges(transitions, options = {}) {
  const {
    stroke = 'hsl(var(--foreground) / 0.58)',
    markerColor = 'hsl(var(--foreground) / 0.7)',
    animatedLabels = ['ε'],
  } = options;

  const edgeMap = new Map();

  for (const [fromState, symbolMap] of Object.entries(transitions ?? {})) {
    for (const [symbol, targets] of Object.entries(symbolMap ?? {})) {
      for (const toState of targets ?? []) {
        const key = `${fromState}->${toState}`;
        if (edgeMap.has(key)) {
          edgeMap.get(key).labels.push(symbol);
        } else {
          edgeMap.set(key, { from: fromState, to: toState, labels: [symbol] });
        }
      }
    }
  }

  return Array.from(edgeMap, ([key, { from, to, labels }]) => {
    const isSelfLoop = from === to;

    return {
      id: key,
      source: from,
      target: to,
      type: 'transition',
      sourceHandle: isSelfLoop ? 'top-src' : undefined,
      targetHandle: isSelfLoop ? 'top' : undefined,
      data: { label: labels.join(', '), isSelfLoop, symbols: labels },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: markerColor,
        width: 16,
        height: 16,
      },
      style: { stroke, strokeWidth: 2 },
      animated: labels.some(label => animatedLabels.includes(label)),
    };
  });
}

export function buildAutomatonFlow(automaton, prevNodes = [], options = {}) {
  if (!automaton) return { nodes: [], edges: [] };

  const { states = [], transitions = {}, startState, acceptStates = [] } = automaton;
  const nodes = buildAutomatonNodes(states, startState, acceptStates, prevNodes, options.layout ?? 'grid');
  const edges = buildAutomatonEdges(transitions, options);

  return { nodes, edges };
}

export function classifyFA(states, transitions) {
  const allSymbols = new Set();

  for (const symbolMap of Object.values(transitions ?? {})) {
    for (const symbol of Object.keys(symbolMap ?? {})) {
      if (symbol === 'ε' || symbol === 'epsilon') return 'NFA';
      allSymbols.add(symbol);
    }
  }

  for (const state of states ?? []) {
    const symbolMap = transitions?.[state] ?? {};
    for (const symbol of allSymbols) {
      const targets = symbolMap[symbol] ?? [];
      if (targets.length !== 1) return 'NFA';
    }
  }

  return allSymbols.size > 0 ? 'DFA' : 'NFA';
}