import { regexToPostfix } from './src/algorithms/regexToPostfix.js';
import { thompsonConstruction } from './src/algorithms/thompsonConstruction.js';

// Test different regexes
const testCases = ['a', 'b', 'ab', 'a*', 'b*', 'ab*', 'a*b'];

for (const regex of testCases) {
  console.log(`\n=== Testing: ${regex} ===`);
  const postfix = regexToPostfix(regex);
  const nfa = thompsonConstruction(postfix);
  
  // Collect actual symbols used in transitions
  const actualSymbols = new Set();
  for (const trans of Object.values(nfa.transitions)) {
    for (const symbol of Object.keys(trans)) {
      if (symbol !== 'ε') {
        actualSymbols.add(symbol);
      }
    }
  }
  
  console.log('  Alphabet in NFA:', nfa.alphabet);
  console.log('  Actual symbols used:', Array.from(actualSymbols).sort());
  
  // Check if all used symbols are in alphabet
  for (const sym of actualSymbols) {
    if (!nfa.alphabet.includes(sym)) {
      console.log(`  ⚠️  Symbol '${sym}' used but not in alphabet!`);
    }
  }
}
