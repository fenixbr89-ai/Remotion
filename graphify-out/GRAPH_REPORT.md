# Graph Report - Remotion  (2026-11-21)

## Corpus Check
- Corpus is ~1,578 words - fits in a single context window. You may not need a graph.

## Summary
- 91 nodes · 124 edges · 16 communities (10 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 74,916 input · 0 output

## Community Hubs (Navigation)
- TypeScript Compiler Config
- Runtime Dependencies
- Composition Entry & Root
- Graphify Agent Integration
- Package Metadata
- Logo & Atom Animation
- Remotion Dev Workflow
- Arc Geometry & React
- Dev Tooling Dependencies
- npm Scripts
- Title Animation
- ESLint Config
- Prettier
- Web Types
- TypeScript Package
- Node Engine Requirement

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 12 edges
2. `remotion` - 9 edges
3. `react` - 6 edges
4. `graphify knowledge graph (graphify-out/)` - 6 edges
5. `scripts` - 5 edges
6. `Remotion video project` - 5 edges
7. `HelloWorld()` - 4 edges
8. `Logo` - 4 edges
9. `Title` - 4 edges
10. `@remotion/cli` - 3 edges

## Surprising Connections (you probably didn't know these)
- `graphify skill (/graphify trigger)` --conceptually_related_to--> `graphify knowledge graph (graphify-out/)`  [INFERRED]
  .claude/CLAUDE.md → CLAUDE.md
- `HelloWorld()` --calls--> `Logo`  [EXTRACTED]
  src/HelloWorld.tsx → src/HelloWorld/Logo.tsx
- `HelloWorld()` --calls--> `Title`  [EXTRACTED]
  src/HelloWorld.tsx → src/HelloWorld/Title.tsx
- `LogoInner()` --calls--> `Arc()`  [EXTRACTED]
  src/HelloWorld/Logo.tsx → src/HelloWorld/Arc.tsx
- `LogoInner()` --calls--> `Atom()`  [EXTRACTED]
  src/HelloWorld/Logo.tsx → src/HelloWorld/Atom.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Remotion CLI development workflow (preview, render, upgrade)** — readme_npm_run_dev, readme_remotion_render, readme_remotion_upgrade [INFERRED 0.85]

## Communities (16 total, 6 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, jsx, lib, module, moduleResolution, noEmit (+5 more)

### Community 1 - "Runtime Dependencies"
Cohesion: 0.18
Nodes (10): dependencies, react-dom@19.3.1, remotion@^4.0.0, @remotion/cli@^4.0.0, @remotion/zod-types@^4.0.0, zod@4.6.7, react-dom, @remotion/cli (+2 more)

### Community 2 - "Composition Entry & Root"
Cohesion: 0.44
Nodes (6): remotion, HelloWorld(), HelloWorldProps, Logo, Title, RemotionRoot()

### Community 3 - "Graphify Agent Integration"
Cohesion: 0.33
Nodes (5): graphify skill (/graphify trigger), GRAPH_REPORT.md, graphify CLI (query, path, explain, section, update), graphify knowledge graph (graphify-out/), graphify-out/wiki/index.md

### Community 4 - "Package Metadata"
Cohesion: 0.29
Nodes (6): description, license, name, private, repository, version

### Community 5 - "Logo & Atom Animation"
Cohesion: 0.43
Nodes (5): Arc(), Atom(), LogoInner(), LogoProps, logoSchema

### Community 6 - "Remotion Dev Workflow"
Cohesion: 0.33
Nodes (6): Start Preview (npm run dev), Remotion company license terms, Remotion fundamentals docs, Remotion video project, Render video (npx remotion render), Upgrade Remotion (npx remotion upgrade)

### Community 7 - "Arc Geometry & React"
Cohesion: 0.40
Nodes (3): react@19.3.1, react, arcLength

### Community 8 - "Dev Tooling Dependencies"
Cohesion: 0.40
Nodes (5): devDependencies, eslint@10.12.0, @types/react@19.3.0, eslint, @types/react

### Community 9 - "npm Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, upgrade

## Knowledge Gaps
- **8 isolated node(s):** `graphify skill (/graphify trigger)`, `GRAPH_REPORT.md`, `graphify-out/wiki/index.md`, `Start Preview (npm run dev)`, `Render video (npx remotion render)` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 42 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `remotion` connect `Composition Entry & Root` to `Runtime Dependencies`, `Package Metadata`, `Logo & Atom Animation`, `Arc Geometry & React`, `Title Animation`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **What connects `graphify skill (/graphify trigger)`, `GRAPH_REPORT.md`, `graphify-out/wiki/index.md` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Arc Geometry & React` to `Title Animation`, `Package Metadata`, `Logo & Atom Animation`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `scripts` connect `npm Scripts` to `Package Metadata`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._