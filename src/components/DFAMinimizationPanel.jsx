import { useMemo } from 'react';
import AutomatonGraph from './AutomatonGraph';

/**
 * Panel that displays DFA minimization results (transition table + graph).
 */
export default function DFAMinimizationPanel({ dfa }) {
  const transitionRows = useMemo(() => {
    if (!dfa) return [];
    const { states, alphabet, transitions, startState, acceptStates } = dfa;
    const acceptSet = new Set(acceptStates);
    return states.map(state => ({
      state,
      isStart: state === startState,
      isAccept: acceptSet.has(state),
      transitions: alphabet.map(sym => {
        const targets = transitions[state]?.[sym];
        return targets ? targets.join(', ') : '—';
      }),
    }));
  }, [dfa]);

  if (!dfa) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground min-h-[200px]">
        <span className="text-3xl" role="img" aria-label="Minimize">✂️</span>
        <span className="text-sm font-medium">Generate an ε-NFA first to see the minimized DFA.</span>
      </div>
    );
  }

  return (
    <div className="dfa-panel-content">
      <div className="dfa-sidebar">
        <div className="dfa-stats">
          <span className="dfa-stat">
            <strong>{dfa.states.length}</strong> states
          </span>
          <span className="dfa-stat-sep">·</span>
          <span className="dfa-stat">
            <strong>{dfa.acceptStates.length}</strong> accept
          </span>
        </div>
        <div className="dfa-table-wrapper">
          <table className="dfa-table">
            <thead>
              <tr>
                <th>State</th>
                {dfa.alphabet.map(sym => (
                  <th key={sym}>{sym}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transitionRows.map(row => (
                <tr key={row.state} className={row.isAccept ? 'dfa-accept-row' : ''}>
                  <td className="dfa-state-cell">
                    {row.isStart && <span className="dfa-marker dfa-start-marker">→</span>}
                    {row.isAccept && <span className="dfa-marker dfa-accept-marker">★</span>}
                    <span className="dfa-state-name">{row.state}</span>
                  </td>
                  {row.transitions.map((t, i) => (
                    <td key={i} className="dfa-transition-cell">{t}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="dfa-graph-area">
        <AutomatonGraph automaton={dfa} />
      </div>
    </div>
  );
}
