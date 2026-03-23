import { describe, it, expect } from 'vitest';
import { minimizeDfa } from '../algorithms/dfaMinimization';
import { nfaToDfa } from '../algorithms/nfaToDfa';
import { thompsonConstruction } from '../algorithms/thompsonConstruction';
import { regexToPostfix } from '../algorithms/regexToPostfix';
import { createAutomaton } from '../models/Automaton';

describe('minimizeDfa', () => {
  it('returns null for null input', () => {
    expect(minimizeDfa(null)).toBeNull();
  });

  it('does not increase state count', () => {
    const postfix = regexToPostfix('(a|b)*ab');
    const nfa = thompsonConstruction(postfix);
    const dfa = nfaToDfa(nfa);
    const minDfa = minimizeDfa(dfa);

    expect(minDfa).toBeDefined();
    expect(minDfa.states.length).toBeLessThanOrEqual(dfa.states.length);
  });

  it('preserves the alphabet', () => {
    const postfix = regexToPostfix('a*b');
    const nfa = thompsonConstruction(postfix);
    const dfa = nfaToDfa(nfa);
    const minDfa = minimizeDfa(dfa);

    expect(minDfa.alphabet).toEqual(dfa.alphabet);
  });

  it('preserves determinism', () => {
    const postfix = regexToPostfix('(a|b)*ab');
    const nfa = thompsonConstruction(postfix);
    const dfa = nfaToDfa(nfa);
    const minDfa = minimizeDfa(dfa);

    for (const [, symbolMap] of Object.entries(minDfa.transitions)) {
      for (const [, targets] of Object.entries(symbolMap)) {
        expect(targets.length).toBe(1);
      }
    }
  });

  it('merges equivalent states in a DFA with redundant states', () => {
    // Build a DFA with two equivalent non-accept states
    // q0 -a-> q1, q0 -b-> q2, q1 and q2 both -a-> q3, both -b-> q3, q3 is accept
    const dfa = createAutomaton(
      ['q0', 'q1', 'q2', 'q3'],
      ['a', 'b'],
      {
        q0: { a: ['q1'], b: ['q2'] },
        q1: { a: ['q3'], b: ['q3'] },
        q2: { a: ['q3'], b: ['q3'] },
        q3: { a: ['q3'], b: ['q3'] },
      },
      'q0',
      ['q3']
    );

    const minDfa = minimizeDfa(dfa);

    // q1 and q2 are equivalent — should be merged
    expect(minDfa.states.length).toBeLessThan(dfa.states.length);
    expect(minDfa.states.length).toBe(3); // q0, {q1,q2} merged, q3
  });

  it('does not merge non-equivalent states', () => {
    // q0 (start, non-accept) -a-> q1 (accept), q0 -b-> q0
    // q1 -a-> q1, q1 -b-> q0
    const dfa = createAutomaton(
      ['q0', 'q1'],
      ['a', 'b'],
      {
        q0: { a: ['q1'], b: ['q0'] },
        q1: { a: ['q1'], b: ['q0'] },
      },
      'q0',
      ['q1']
    );

    const minDfa = minimizeDfa(dfa);
    // Already minimal — states should stay the same
    expect(minDfa.states.length).toBe(2);
  });

  it('handles single-state DFA', () => {
    const dfa = createAutomaton(
      ['q0'],
      ['a', 'b'],
      { q0: { a: ['q0'], b: ['q0'] } },
      'q0',
      ['q0']
    );

    const minDfa = minimizeDfa(dfa);
    expect(minDfa.states.length).toBe(1);
    expect(minDfa.acceptStates).toEqual(['q0']);
  });

  it('full pipeline: regex → NFA → DFA → minimized DFA', () => {
    const postfix = regexToPostfix('(a|b)*ab');
    const nfa = thompsonConstruction(postfix);
    const dfa = nfaToDfa(nfa);
    const minDfa = minimizeDfa(dfa);

    // The minimal DFA for (a|b)*ab has exactly 4 states (including dead state)
    // or 3 states without dead state depending on representation
    expect(minDfa).toBeDefined();
    expect(minDfa.startState).toBeDefined();
    expect(minDfa.acceptStates.length).toBeGreaterThan(0);
    expect(minDfa.states.length).toBeLessThanOrEqual(dfa.states.length);
  });
});
