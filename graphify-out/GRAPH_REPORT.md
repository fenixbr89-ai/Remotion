# Graph Report - Remotion  (2026-11-20)

## Corpus Check
- Corpus is ~1,265 words - fits in a single context window. You may not need a graph.

## Summary
- 88 nodes · 128 edges · 13 communities (8 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.8)
- Token cost: 81,347 input · 0 output

## Community Hubs (Navigation)
- TypeScript Config
- HelloWorld Composition
- Runtime Dependencies
- Animated Logo Components
- README Workflow & Resources
- Package Metadata
- Lint & Type Dev Deps
- NPM Scripts
- ESLint Config
- Prettier Formatter
- Web Type Definitions
- TypeScript Compiler
- Node Engine Requirement

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 12 edges
2. `remotion` - 9 edges
3. `Remotion Video (README)` - 9 edges
4. `react` - 6 edges
5. `scripts` - 5 edges
6. `Remotion` - 5 edges
7. `HelloWorld()` - 4 edges
8. `Logo` - 4 edges
9. `Title` - 4 edges
10. `@remotion/cli` - 3 edges

## Surprising Connections (you probably didn't know these)
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
- **Remotion Project CLI Workflow** — readme_install_dependencies, readme_start_preview, readme_render_video, readme_upgrade_remotion [EXTRACTED 1.00]
- **Remotion Support Resources** — readme_remotion_fundamentals, readme_remotion_discord, readme_remotion_issue_tracker [INFERRED 0.85]

## Communities (13 total, 5 thin omitted)

### Community 0 - "TypeScript Config"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, jsx, lib, module, moduleResolution, noEmit (+5 more)

### Community 1 - "HelloWorld Composition"
Cohesion: 0.29
Nodes (8): remotion, HelloWorld(), HelloWorldProps, Logo, Title, TitleProps, titleSchema, RemotionRoot()

### Community 2 - "Runtime Dependencies"
Cohesion: 0.17
Nodes (11): dependencies, react@19.3.1, react-dom@19.3.1, remotion@^4.0.0, @remotion/cli@^4.0.0, @remotion/zod-types@^4.0.0, zod@4.6.7, react-dom (+3 more)

### Community 3 - "Animated Logo Components"
Cohesion: 0.29
Nodes (7): react, Arc(), arcLength, Atom(), LogoInner(), LogoProps, logoSchema

### Community 4 - "README Workflow & Resources"
Cohesion: 0.36
Nodes (10): Install Dependencies (npm install), Remotion, Remotion Company License, Remotion Discord Server, Remotion Fundamentals Docs, Remotion GitHub Issue Tracker, Remotion Video (README), Render Video (npx remotion render) (+2 more)

### Community 5 - "Package Metadata"
Cohesion: 0.29
Nodes (6): description, license, name, private, repository, version

### Community 6 - "Lint & Type Dev Deps"
Cohesion: 0.40
Nodes (5): devDependencies, eslint@10.12.0, @types/react@19.3.0, eslint, @types/react

### Community 7 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, upgrade

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `remotion` connect `HelloWorld Composition` to `Runtime Dependencies`, `Animated Logo Components`, `Package Metadata`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Animated Logo Components` to `HelloWorld Composition`, `Runtime Dependencies`, `Package Metadata`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `scripts` connect `NPM Scripts` to `Package Metadata`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._