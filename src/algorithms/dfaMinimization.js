import { createAutomaton } from '../models/Automaton.js';

/**
 * Minimizes a DFA using Hopcroft's Partition Refinement algorithm.
 *
 * The algorithm works by:
 * 1. Creating an initial partition: {accept states} ∪ {non-accept states}
 * 2. Iteratively refining partitions by distinguishing states that transition
 *    to different partition groups on the same symbol
 * 3. Building the minimized DFA from the final equivalence classes
 *
 * @param {Object} dfa - DFA automaton object (must be deterministic)
 * @returns {Object} Minimized DFA automaton object
 */
export function minimizeDfa(dfa) {
  if (!dfa) return null;

  const { states, alphabet, transitions, startState, acceptStates } = dfa;

  if (states.length === 0) return dfa;

  // Remove unreachable states first
  const reachable = findReachableStates(states, transitions, startState, alphabet);
  const reachableStates = states.filter(s => reachable.has(s));
  const reachableAccept = acceptStates.filter(s => reachable.has(s));

  if (reachableStates.length === 0) return dfa;

  // Step 1: Initial partition — {accept states} ∪ {non-accept states}
  const acceptSet = new Set(reachableAccept);
  const nonAccept = reachableStates.filter(s => !acceptSet.has(s));

  let partitions = [];
  if (reachableAccept.length > 0) partitions.push(reachableAccept);
  if (nonAccept.length > 0) partitions.push(nonAccept);

  if (partitions.length === 0) return dfa;

  // Step 2: Refine partitions until stable
  let changed = true;
  while (changed) {
    changed = false;
    const newPartitions = [];

    for (const group of partitions) {
      if (group.length <= 1) {
        newPartitions.push(group);
        continue;
      }

      // Try to split this group
      const splits = splitGroup(group, partitions, transitions, alphabet);
      if (splits.length > 1) {
        changed = true;
      }
      newPartitions.push(...splits);
    }

    partitions = newPartitions;
  }

  // Step 3: Build minimized DFA from partitions
  // Map each state to its partition representative (first element)
  const stateToRep = {};
  for (const group of partitions) {
    const rep = group.sort()[0]; // Use first state as representative
    for (const s of group) {
      stateToRep[s] = rep;
    }
  }

  const minStates = [...new Set(Object.values(stateToRep))].sort();
  const minTransitions = {};
  const minAcceptStates = [];
  const minStartState = stateToRep[startState];

  const acceptSetCheck = new Set(reachableAccept);

  for (const rep of minStates) {
    // Build transitions for this representative
    if (transitions[rep]) {
      minTransitions[rep] = {};
      for (const symbol of alphabet) {
        const targets = transitions[rep]?.[symbol];
        if (targets && targets.length > 0) {
          const mappedTarget = stateToRep[targets[0]];
          if (mappedTarget !== undefined) {
            minTransitions[rep][symbol] = [mappedTarget];
          }
        }
      }
    }

    // Check if this representative's group contains any accept state
    if (acceptSetCheck.has(rep)) {
      minAcceptStates.push(rep);
    }
  }

  return createAutomaton(
    minStates,
    alphabet,
    minTransitions,
    minStartState,
    minAcceptStates
  );
}

/**
 * Splits a group of states based on their transition behavior relative
 * to the current partitions.
 *
 * Two states are in the same sub-group if, for every symbol, they both
 * transition to states in the same partition.
 *
 * @param {string[]} group - Group of states to potentially split
 * @param {string[][]} partitions - Current set of partitions
 * @param {Object} transitions - DFA transitions
 * @param {string[]} alphabet - DFA alphabet
 * @returns {string[][]} Array of sub-groups (1 group if no split needed)
 */
function splitGroup(group, partitions, transitions, alphabet) {
  // Create a mapping from state to its partition index
  const stateToPartition = {};
  for (let i = 0; i < partitions.length; i++) {
    for (const s of partitions[i]) {
      stateToPartition[s] = i;
    }
  }

  // Create signature for each state in the group
  const signatureMap = new Map();

  for (const state of group) {
    const sig = alphabet
      .map(symbol => {
        const targets = transitions[state]?.[symbol];
        if (!targets || targets.length === 0) return -1;
        return stateToPartition[targets[0]] ?? -1;
      })
      .join(',');

    if (!signatureMap.has(sig)) {
      signatureMap.set(sig, []);
    }
    signatureMap.get(sig).push(state);
  }

  return [...signatureMap.values()];
}

/**
 * Finds all states reachable from the start state via BFS.
 *
 * @param {string[]} states - All states
 * @param {Object} transitions - Transition function
 * @param {string} startState - Start state
 * @param {string[]} alphabet - Input alphabet
 * @returns {Set<string>} Set of reachable state names
 */
function findReachableStates(states, transitions, startState, alphabet) {
  const visited = new Set();
  const queue = [startState];
  visited.add(startState);

  while (queue.length > 0) {
    const current = queue.shift();
    for (const symbol of alphabet) {
      const targets = transitions[current]?.[symbol] || [];
      for (const t of targets) {
        if (!visited.has(t)) {
          visited.add(t);
          queue.push(t);
        }
      }
    }
  }

  return visited;
}
