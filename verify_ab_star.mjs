import { regexToPostfix } from './src/algorithms/regexToPostfix.js';
import { thompsonConstruction } from './src/algorithms/thompsonConstruction.js';

const regex = 'ab*';
console.log(`Testing regex: ${regex}`);
console.log('Expected: should match "a", "ab", "abb", "abbb", etc.');

const postfix = regexToPostfix(regex);
console.log(`Postfix: ${postfix}`);

const nfa = thompsonConstruction(postfix);

// Verify 'b' transition exists
let bTransitionCount = 0;
for (const [state, trans] of Object.entries(nfa.transitions)) {
  if (trans.b) {
    bTransitionCount++;
    console.log(`✓ Found 'b' transition: ${state} --b--> [${trans.b.join(', ')}]`);
  }
}

if (bTransitionCount === 0) {
  console.log('✗ ERROR: No "b" transition found!');
  process.exit(1);
} else {
  console.log(`✓ SUCCESS: Found ${bTransitionCount} 'b' transition(s) in NFA`);
}

// Display all transitions
console.log('\nComplete NFA structure:');
console.log(`States: ${nfa.states.length} total -`, nfa.states.join(', '));
console.log(`Start: ${nfa.startState}`);
console.log(`Accept: ${nfa.acceptStates.join(', ')}`);
console.log('\nAll transitions:');
for (const [state, trans] of Object.entries(nfa.transitions)) {
  for (const [symbol, targets] of Object.entries(trans)) {
    console.log(`  ${state} --${symbol}--> [${targets.join(', ')}]`);
  }
}
