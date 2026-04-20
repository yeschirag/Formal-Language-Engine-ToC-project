# Formal Language Engine

Formal Language Engine is an interactive Theory of Computation playground focused on regular languages and finite automata workflows.

It helps you move across the core conversion pipeline:

- Regex -> epsilon-NFA (Thompson Construction)
- epsilon-NFA -> DFA (Subset Construction)
- DFA -> Minimized DFA (Partition Refinement)
- Finite Automaton -> Regex (State Elimination)

## Live Demo

Production deployment:

https://toc.yeschirag.dev

## What This Project Solves

Instead of treating automata as static exam diagrams, this app lets you:

- Build and inspect graphs interactively
- View transition tables and graph output together
- Validate regex inputs before conversion
- Compare intermediate and final automata step by step

## Feature Modules

### 1. Regex to epsilon-NFA

- Input a regex over alphabet a,b with operators |, *, and parentheses.
- Validates structure and symbols first.
- Converts infix regex to postfix.
- Builds epsilon-NFA using Thompson fragments.

### 2. epsilon-NFA to DFA

- Uses epsilon-closure plus move transitions.
- Builds DFA states as sets of NFA states.
- Adds dead state when transitions are missing.
- Shows both table and graph output.

### 3. DFA Minimization

- Removes unreachable states.
- Splits equivalence classes iteratively.
- Produces minimized deterministic automaton.

### 4. FA to Regex Playground

- Interactive editor for states, start/accept markers, and transitions.
- Converts current FA to regex using state elimination.
- Useful for reverse reasoning and verification.

## Core Architecture

### UI Layer

- React + React Router for page-based workflows.
- React Flow for graph rendering.
- Shared graph renderer and node/edge components for consistent visuals.

### State Management

- XState machine for regex pipeline flow:
	validate -> postfix -> NFA -> DFA -> minimized DFA
- XState machine for FA editor operations:
	add/remove state, set start/accept, add/remove transition, generate regex

### Algorithms Layer

Located in src/algorithms:

- regexValidator.js
- regexToPostfix.js
- thompsonConstruction.js
- nfaToDfa.js
- dfaMinimization.js
- faToRegex.js

### Data Model

Automata are represented with a common structure (via createAutomaton), including:

- states
- alphabet
- transitions
- startState
- acceptStates

## Routes

- / : Landing page
- /regex-to-nfa : Regex to epsilon-NFA
- /nfa-to-dfa : epsilon-NFA to DFA
- /dfa-minimization : DFA minimization
- /fa-to-regex : FA to Regex playground

## Tech Stack

- React 19
- Vite 7
- React Router 7
- XState 5 + @xstate/react
- @xyflow/react (React Flow)
- Tailwind utility layer + custom CSS
- Vitest + Testing Library

## Favicon

- The app favicon is configured as fav.jpeg.
- Source file is kept at project root and copied to public/fav.jpeg for static serving.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm run test
```

## Test Coverage (Algorithm-Focused)

Current test suite files:

- src/__tests__/regexValidator.test.js
- src/__tests__/regexToPostfix.test.js
- src/__tests__/thompsonConstruction.test.js
- src/__tests__/nfaToDfa.test.js
- src/__tests__/dfaMinimization.test.js
- src/__tests__/faToRegex.test.js
- src/__tests__/abStarPattern.test.js

## Project Structure

```text
src/
	algorithms/        Theory of computation conversion logic
	components/        Panels, graphs, controls, and interaction UI
	models/            Shared automaton model helpers
	__tests__/         Unit tests for validators and algorithms
public/
	fav.jpeg           Public favicon file used by index.html
```

## Notes and Constraints

- Regex validation currently accepts alphabet a,b.
- Operators supported: |, *, (, )
- epsilon transitions are represented as epsilon in UI and epsilon symbol internally.

## License

This project is intended for educational and portfolio use.
