import { createAutomaton } from '../models/Automaton.js';

const EPSILON = 'ε';

/**
 * Computes the ε-closure of a set of states.
 * The ε-closure is the set of all states reachable from the input states
 * by following only ε-transitions (including the states themselves).
 *
 * @param {string[]} states - Array of state names
 * @param {Object} transitions - Transition function { state: { symbol: [targets] } }
 * @returns {string[]} Sorted array of states in the ε-closure
 */
export function epsilonClosure(states, transitions) {
  const closure = new Set(states);
  const stack = [...states];

  while (stack.length > 0) {
    const current = stack.pop();
    const epsTargets = transitions[current]?.[EPSILON] || [];
    for (const target of epsTargets) {
      if (!closure.has(target)) {
        closure.add(target);
        stack.push(target);
      }
    }
  }

  return [...closure].sort();
}

/**
 * Computes the set of states reachable from a set of states on a given symbol
 * (without following ε-transitions — that is done separately).
 *
 * @param {string[]} states - Array of state names
 * @param {string} symbol - Input symbol
 * @param {Object} transitions - Transition function
 * @returns {string[]} Array of reachable states
 */
export function move(states, symbol, transitions) {
  const result = new Set();
  for (const state of states) {
    const targets = transitions[state]?.[symbol] || [];
    for (const t of targets) {
      result.add(t);
    }
  }
  return [...result];
}

/**
 * Converts an ε-NFA to a DFA using the Subset Construction algorithm.
 *
 * @param {Object} automaton - ε-NFA automaton object from Thompson's construction
 * @returns {Object} DFA automaton object
 */
export function nfaToDfa(automaton) {
  if (!automaton) return null;

  const { transitions, startState, acceptStates, alphabet } = automaton;

  // Filter out ε from the alphabet for DFA transitions
  const dfaAlphabet = alphabet.filter(s => s !== EPSILON);

  // Start state of DFA = ε-closure({startState})
  const startClosure = epsilonClosure([startState], transitions);
  const startKey = stateSetKey(startClosure);

  // BFS / worklist to discover all DFA states
  const dfaTransitions = {};
  const dfaStatesMap = new Map(); // key → sorted state array
  const worklist = [startClosure];
  dfaStatesMap.set(startKey, startClosure);

  while (worklist.length > 0) {
    const current = worklist.shift();
    const currentKey = stateSetKey(current);

    if (!dfaTransitions[currentKey]) {
      dfaTransitions[currentKey] = {};
    }

    for (const symbol of dfaAlphabet) {
      // move then ε-close
      const moved = move(current, symbol, transitions);
      if (moved.length === 0) {
        // Transition goes to dead state (handled below)
        continue;
      }
      const nextClosure = epsilonClosure(moved, transitions);
      const nextKey = stateSetKey(nextClosure);

      dfaTransitions[currentKey][symbol] = [nextKey];

      if (!dfaStatesMap.has(nextKey)) {
        dfaStatesMap.set(nextKey, nextClosure);
        worklist.push(nextClosure);
      }
    }
  }

  // Check if we need a dead state (any state missing a transition for some symbol)
  let needsDead = false;
  for (const [key] of dfaStatesMap) {
    for (const symbol of dfaAlphabet) {
      if (!dfaTransitions[key]?.[symbol]) {
        needsDead = true;
        break;
      }
    }
    if (needsDead) break;
  }

  const DEAD = '∅';
  if (needsDead) {
    dfaStatesMap.set(DEAD, []);
    dfaTransitions[DEAD] = {};
    for (const symbol of dfaAlphabet) {
      dfaTransitions[DEAD][symbol] = [DEAD];
    }
    // Fill in missing transitions pointing to dead state
    for (const [key] of dfaStatesMap) {
      if (!dfaTransitions[key]) dfaTransitions[key] = {};
      for (const symbol of dfaAlphabet) {
        if (!dfaTransitions[key][symbol]) {
          dfaTransitions[key][symbol] = [DEAD];
        }
      }
    }
  }

  // Determine DFA accept states: any DFA state whose NFA state set
  // contains at least one original accept state
  const nfaAcceptSet = new Set(acceptStates);
  const dfaAcceptStates = [];
  for (const [key, nfaStates] of dfaStatesMap) {
    if (nfaStates.some(s => nfaAcceptSet.has(s))) {
      dfaAcceptStates.push(key);
    }
  }

  const dfaStates = [...dfaStatesMap.keys()];

  return createAutomaton(
    dfaStates,
    dfaAlphabet,
    dfaTransitions,
    startKey,
    dfaAcceptStates
  );
}

/**
 * Creates a canonical string key for a set of NFA states.
 * @param {string[]} states - Sorted array of state names
 * @returns {string} Key like "{q0,q1,q2}"
 */
export function stateSetKey(states) {
  return `{${[...states].sort().join(',')}}`;
}
