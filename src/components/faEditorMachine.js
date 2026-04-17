import { assign, createMachine } from 'xstate';
import { faToRegex } from '../algorithms/faToRegex';

const initialStates = ['q0', 'q1'];

function cloneTransitions(transitions) {
  const nextTransitions = {};

  for (const [from, symbolMap] of Object.entries(transitions)) {
    nextTransitions[from] = {};
    for (const [symbol, targets] of Object.entries(symbolMap)) {
      nextTransitions[from][symbol] = [...targets];
    }
  }

  return nextTransitions;
}

function pruneTransitions(transitions, removedState) {
  const nextTransitions = {};

  for (const [from, symbolMap] of Object.entries(transitions)) {
    if (from === removedState) continue;

    const nextSymbolMap = {};
    for (const [symbol, targets] of Object.entries(symbolMap)) {
      const nextTargets = targets.filter(target => target !== removedState);
      if (nextTargets.length > 0) nextSymbolMap[symbol] = nextTargets;
    }

    if (Object.keys(nextSymbolMap).length > 0) {
      nextTransitions[from] = nextSymbolMap;
    }
  }

  return nextTransitions;
}

function dedupeTargetTargets(targets, targetState) {
  if (targets.includes(targetState)) return targets;
  return [...targets, targetState];
}

function normalizeSelection(states, selectedState) {
  if (states.includes(selectedState)) return selectedState;
  return states[0] ?? '';
}

function normalizeTransitionSymbol(symbol) {
  const value = (symbol ?? '').trim();
  const lowered = value.toLowerCase();
  if (lowered === 'eps' || lowered === 'epsilon' || value === 'ϵ' || value === 'λ') {
    return 'ε';
  }
  return value;
}

const setField = fieldName =>
  assign(({ event }) => ({
    [fieldName]: event.value,
    error: '',
  }));

const addState = assign(({ context, event }) => {
  const rawName = (event.value ?? context.newStateName).trim();

  if (!rawName) {
    return {
      error: 'State name cannot be empty.',
      result: null,
    };
  }

  if (context.states.includes(rawName)) {
    return {
      error: `State "${rawName}" already exists.`,
      result: null,
    };
  }

  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(rawName)) {
    return {
      error: 'State name must start with a letter and contain only letters, digits, or underscores.',
      result: null,
    };
  }

  const nextStates = [...context.states, rawName];

  return {
    states: nextStates,
    newStateName: '',
    error: '',
    result: null,
    transFrom: context.transFrom || rawName,
    transTo: context.transTo || rawName,
  };
});

const removeState = assign(({ context, event }) => {
  const removedState = event.state;

  if (context.states.length <= 1) {
    return {
      error: 'FA must have at least one state.',
      result: null,
    };
  }

  const nextStates = context.states.filter(state => state !== removedState);
  const fallbackState = nextStates[0] ?? '';
  const nextTransitions = pruneTransitions(context.transitions, removedState);

  return {
    states: nextStates,
    startState: context.startState === removedState ? fallbackState : context.startState,
    acceptStates: context.acceptStates.filter(state => state !== removedState),
    transitions: nextTransitions,
    transFrom: normalizeSelection(nextStates, context.transFrom === removedState ? fallbackState : context.transFrom),
    transTo: normalizeSelection(nextStates, context.transTo === removedState ? fallbackState : context.transTo),
    error: '',
    result: null,
  };
});

const toggleAcceptState = assign(({ context, event }) => {
  const state = event.state;

  return {
    acceptStates: context.acceptStates.includes(state)
      ? context.acceptStates.filter(item => item !== state)
      : [...context.acceptStates, state],
    error: '',
    result: null,
  };
});

const setStartState = assign(({ context, event }) => {
  if (!context.states.includes(event.state)) {
    return { error: 'Select an existing start state.' };
  }

  return {
    startState: event.state,
    error: '',
    result: null,
  };
});

const addTransition = assign(({ context, event }) => {
  const from = event.from ?? context.transFrom;
  const to = event.to ?? context.transTo;
  const symbol = normalizeTransitionSymbol(event.symbol ?? context.transSymbol);

  if (!from || !to) {
    return {
      error: 'Select from and to states.',
      result: null,
    };
  }

  if (!symbol) {
    return {
      error: 'Symbol cannot be empty.',
      result: null,
    };
  }

  if (symbol.length !== 1) {
    return {
      error: 'Symbol must be exactly one character (e.g. a, b, 0).',
      result: null,
    };
  }

  const nextTransitions = cloneTransitions(context.transitions);
  if (!nextTransitions[from]) nextTransitions[from] = {};
  if (!nextTransitions[from][symbol]) nextTransitions[from][symbol] = [];
  nextTransitions[from][symbol] = dedupeTargetTargets(nextTransitions[from][symbol], to);

  return {
    transitions: nextTransitions,
    error: '',
    result: null,
  };
});

const removeTransition = assign(({ context, event }) => {
  const { from, symbol, to } = event;
  const nextTransitions = cloneTransitions(context.transitions);

  if (!nextTransitions[from]?.[symbol]) {
    return {};
  }

  const nextTargets = nextTransitions[from][symbol].filter(target => target !== to);

  if (nextTargets.length === 0) {
    delete nextTransitions[from][symbol];
    if (Object.keys(nextTransitions[from]).length === 0) delete nextTransitions[from];
  } else {
    nextTransitions[from][symbol] = nextTargets;
  }

  return {
    transitions: nextTransitions,
    error: '',
    result: null,
  };
});

const generateRegex = assign(({ context }) => {
  if (!context.startState) {
    return {
      error: 'Set a start state first.',
      result: null,
    };
  }

  if (context.acceptStates.length === 0) {
    return {
      error: 'Add at least one accept state.',
      result: null,
    };
  }

  try {
    const regex = faToRegex({
      states: context.states,
      transitions: context.transitions,
      startState: context.startState,
      acceptStates: context.acceptStates,
    });

    return {
      error: '',
      result: regex,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to generate regex from this automaton.',
      result: null,
    };
  }
});

export const faEditorMachine = createMachine({
  id: 'faEditor',
  initial: 'ready',
  context: {
    states: initialStates,
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
  },
  states: {
    ready: {},
  },
  on: {
    NEW_STATE_NAME_CHANGED: { actions: setField('newStateName') },
    TRANS_FROM_CHANGED: { actions: setField('transFrom') },
    TRANS_SYMBOL_CHANGED: { actions: setField('transSymbol') },
    TRANS_TO_CHANGED: { actions: setField('transTo') },
    TOGGLE_CONTROLS: {
      actions: assign(({ context }) => ({
        showControls: !context.showControls,
      })),
    },
    ADD_STATE: { actions: addState },
    REMOVE_STATE: { actions: removeState },
    SET_START_STATE: { actions: setStartState },
    TOGGLE_ACCEPT_STATE: { actions: toggleAcceptState },
    ADD_TRANSITION: { actions: addTransition },
    REMOVE_TRANSITION: { actions: removeTransition },
    GENERATE_REGEX: { actions: generateRegex },
  },
});