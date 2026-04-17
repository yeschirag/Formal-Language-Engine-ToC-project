import { assign, createMachine } from 'xstate';
import { validateRegex } from '../algorithms/regexValidator';
import { regexToPostfix } from '../algorithms/regexToPostfix';
import { thompsonConstruction } from '../algorithms/thompsonConstruction';
import { nfaToDfa } from '../algorithms/nfaToDfa';
import { minimizeDfa } from '../algorithms/dfaMinimization';

const resetContext = {
  regex: '',
  error: '',
  nfa: null,
  dfa: null,
  minDfa: null,
};

const buildPipeline = assign(({ event }) => {
  const regex = (event.regex ?? '').trim();

  if (!regex) {
    return {
      ...resetContext,
      error: 'Regex cannot be empty.',
    };
  }

  const validation = validateRegex(regex);
  if (!validation.valid) {
    return {
      ...resetContext,
      regex,
      error: validation.error,
    };
  }

  try {
    const postfix = regexToPostfix(regex);
    const nfa = thompsonConstruction(postfix);
    const dfa = nfaToDfa(nfa);
    const minDfa = minimizeDfa(dfa);

    return {
      regex,
      error: '',
      nfa,
      dfa,
      minDfa,
    };
  } catch (err) {
    return {
      ...resetContext,
      regex,
      error: err instanceof Error ? err.message : 'Failed to build automata pipeline from regex.',
    };
  }
});

export const regexPipelineMachine = createMachine({
  id: 'regexPipeline',
  initial: 'idle',
  context: resetContext,
  states: {
    idle: {},
  },
  on: {
    GENERATE: { actions: buildPipeline },
    RESET: { actions: assign(() => resetContext) },
  },
});
