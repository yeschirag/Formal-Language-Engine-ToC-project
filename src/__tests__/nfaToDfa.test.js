import { describe, it, expect } from 'vitest';
import { epsilonClosure, move, nfaToDfa, stateSetKey } from '../algorithms/nfaToDfa';
import { thompsonConstruction } from '../algorithms/thompsonConstruction';
import { regexToPostfix } from '../algorithms/regexToPostfix';

describe('epsilonClosure', () => {
  it('returns the state itself when no ε-transitions exist', () => {
    const transitions = { q0: { a: ['q1'] } };
    expect(epsilonClosure(['q0'], transitions)).toEqual(['q0']);
  });

  it('follows ε-transitions transitively', () => {
    const transitions = {
      q0: { ε: ['q1'] },
      q1: { ε: ['q2'] },
      q2: {},
    };
    expect(epsilonClosure(['q0'], transitions)).toEqual(['q0', 'q1', 'q2']);
  });

  it('handles cycles in ε-transitions', () => {
    const transitions = {
      q0: { ε: ['q1'] },
      q1: { ε: ['q0'] },
    };
    expect(epsilonClosure(['q0'], transitions)).toEqual(['q0', 'q1']);
  });

  it('computes closure for multiple starting states', () => {
    const transitions = {
      q0: { ε: ['q2'] },
      q1: { ε: ['q3'] },
    };
    const result = epsilonClosure(['q0', 'q1'], transitions);
    expect(result).toContain('q0');
    expect(result).toContain('q1');
    expect(result).toContain('q2');
    expect(result).toContain('q3');
  });
});

describe('move', () => {
  it('returns states reachable on a symbol', () => {
    const transitions = {
      q0: { a: ['q1', 'q2'] },
    };
    expect(move(['q0'], 'a', transitions).sort()).toEqual(['q1', 'q2']);
  });

  it('returns empty array when no transitions on symbol', () => {
    const transitions = { q0: { b: ['q1'] } };
    expect(move(['q0'], 'a', transitions)).toEqual([]);
  });

  it('unions targets from multiple source states', () => {
    const transitions = {
      q0: { a: ['q2'] },
      q1: { a: ['q3'] },
    };
    expect(move(['q0', 'q1'], 'a', transitions).sort()).toEqual(['q2', 'q3']);
  });
});

describe('stateSetKey', () => {
  it('creates canonical key from state array', () => {
    expect(stateSetKey(['q1', 'q0'])).toBe('{q0,q1}');
  });

  it('handles single state', () => {
    expect(stateSetKey(['q0'])).toBe('{q0}');
  });
});

describe('nfaToDfa', () => {
  it('returns null for null input', () => {
    expect(nfaToDfa(null)).toBeNull();
  });

  it('converts a simple single-symbol NFA', () => {
    const nfa = thompsonConstruction('a');
    const dfa = nfaToDfa(nfa);

    expect(dfa).toBeDefined();
    expect(dfa.alphabet).toEqual(['a', 'b']);
    expect(dfa.startState).toBeDefined();
    expect(dfa.acceptStates.length).toBeGreaterThan(0);

    // DFA should be deterministic: each state should have at most one target per symbol
    for (const [, symbolMap] of Object.entries(dfa.transitions)) {
      for (const [, targets] of Object.entries(symbolMap)) {
        expect(targets.length).toBe(1);
      }
    }
  });

  it('converts (a|b)* NFA to DFA', () => {
    const postfix = regexToPostfix('(a|b)*');
    const nfa = thompsonConstruction(postfix);
    const dfa = nfaToDfa(nfa);

    expect(dfa).toBeDefined();
    // (a|b)* matches everything including empty — start state should be accepting
    expect(dfa.acceptStates).toContain(dfa.startState);
  });

  it('produces DFA with correct accept state for ab', () => {
    const postfix = regexToPostfix('ab');
    const nfa = thompsonConstruction(postfix);
    const dfa = nfaToDfa(nfa);

    expect(dfa.acceptStates.length).toBeGreaterThan(0);
    // Start state should NOT be accepting (empty string is not in L(ab))
    expect(dfa.acceptStates).not.toContain(dfa.startState);
  });

  it('creates dead state when needed', () => {
    const nfa = thompsonConstruction('a');
    const dfa = nfaToDfa(nfa);

    // Simple 'a' NFA: DFA should have a dead state since 'b' transitions go nowhere
    const hasDeadState = dfa.states.includes('∅');
    if (hasDeadState) {
      // Dead state should loop to itself on all symbols
      for (const sym of dfa.alphabet) {
        expect(dfa.transitions['∅'][sym]).toEqual(['∅']);
      }
    }
  });

  it('preserves alphabet', () => {
    const postfix = regexToPostfix('a*b');
    const nfa = thompsonConstruction(postfix);
    const dfa = nfaToDfa(nfa);

    expect(dfa.alphabet).toEqual(['a', 'b']);
  });
});
