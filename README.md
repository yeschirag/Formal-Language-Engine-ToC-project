# Formal Language Engine

Interactive Theory of Computation playground for exploring regex and finite automata transformations.

## Live Demo

The project is deployed at: **https://toc.yeschirag.dev**

## Modules

- Regex to epsilon-NFA (Thompson Construction)
- epsilon-NFA to DFA (Subset Construction)
- DFA Minimization
- FA to Regex playground (state elimination workflow)

## Tech Stack

- React + Vite
- React Router
- XState
- React Flow (`@xyflow/react`)
- Tailwind-based component styling + custom CSS
- Vitest + Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build

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

## Project Structure

```text
src/
	algorithms/        Core ToC transformation algorithms
	components/        UI panels, graph views, shared controls
	models/            Automaton data models
	__tests__/         Unit tests for algorithms and validators
```
