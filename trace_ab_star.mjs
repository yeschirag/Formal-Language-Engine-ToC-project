import { regexToPostfix, insertConcatenation } from './src/algorithms/regexToPostfix.js';
import { thompsonConstruction } from './src/algorithms/thompsonConstruction.js';

const regex = 'ab*';
console.log('=== Tracing regex: ab* ===');
console.log('Step 1 - Insert concatenation:');
const withConcat = insertConcatenation(regex);
console.log('  Result:', withConcat);

console.log('\nStep 2 - Convert to postfix:');
const postfix = regexToPostfix(regex);
console.log('  Result:', postfix);

console.log('\nStep 3 - Thompson construction:');
const nfa = thompsonConstruction(postfix);
console.log('  States:', nfa.states);
console.log('  Start state:', nfa.startState);
console.log('  Accept states:', nfa.acceptStates);
console.log('  Alphabet:', nfa.alphabet);
console.log('\n  Transitions:');
for (const [state, trans] of Object.entries(nfa.transitions)) {
  console.log(`    ${state}:`, trans);
}

// Check if 'b' transition exists
let hasBTransition = false;
for (const [state, trans] of Object.entries(nfa.transitions)) {
  if (trans.b) {
    hasBTransition = true;
    console.log(`\n  ✓ Found 'b' transition from state ${state}:`, trans.b);
  }
}
if (!hasBTransition) {
  console.log('\n  ✗ ERROR: No "b" transition found in NFA!');
}
