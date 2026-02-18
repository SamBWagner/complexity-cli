# complexity-cli

A CLI tool for managing project complexity and knowledge maps. Perfect for
tracking what developers need to know to work on your project, with AI-friendly
workflows.

## Installation

### Local Development

```bash
npm install
npm run build
npm link
```

### From npm (Coming Soon)

```bash
npm install -g complexity-cli
```

## Usage

### Initialize a Complexity Map

Create a new `COMPLEXITY.md` file in your project:

```bash
complexity init --name "My Project"
```

Or run without flags to be prompted for the project name:

```bash
complexity init
```

### Add Concepts

Add technologies, frameworks, or concepts to your complexity map:

```bash
# Basic usage
complexity add "TypeScript" 3 backend

# Without area (will use "___" as placeholder)
complexity add "TypeScript" 3

# Using --level flag
complexity add "TypeScript" --level 3 backend
```

**Criticality Levels:**

- `3` = Critical: Can't do meaningful work without it
- `2` = Important: Will encounter regularly; gaps will slow you down
- `1` = Situational: Comes up occasionally or is abstracted away

### List Concepts

View all concepts in your complexity map:

```bash
complexity list
```

The `list` command automatically searches upward through directories (stopping
at git repo root) to find `COMPLEXITY.md`, so you can run it from any
subdirectory.

### Update Concepts

Modify existing concepts:

```bash
# Update level
complexity update "TypeScript" --level 2

# Update area
complexity update "TypeScript" --area "frontend"

# Update name
complexity update "TypeScript" --name "TypeScript/JavaScript"

# Update multiple properties
complexity update "TypeScript" --level 3 --area "fullstack"
```

### Remove Concepts

Remove a concept from the map:

```bash
complexity remove "TypeScript"

# Skip confirmation prompt
complexity remove "TypeScript" --force
```

### Get AI Prompt

Generate a prompt for AI tools to help analyze your project:

```bash
complexity prompt
```

This outputs a comprehensive prompt that instructs an AI to:

- Analyze your project's complexity
- Use the `complexity` CLI to maintain consistency
- Consider all relevant technologies and concepts

## Features

- **Simple CLI**: Easy-to-use commands for managing complexity documentation
- **Validation**: Duplicate detection and confirmation for new areas
- **Auto-formatting**: Automatically updates all sections and statistics
- **Sorting**: Concepts sorted by criticality (3→1), then alphabetically
- **Git-aware**: `complexity list` searches upward to git repo root
- **AI-friendly**: Designed to be used by AI agents for analysis

## File Format

The tool generates and maintains a `COMPLEXITY.md` file with:

- **Summary Statistics**: Total concepts, areas, and breakdown by criticality
- **Tiered Sections**: What you NEED, SHOULD, and EVENTUALLY learn
- **Full Reference Table**: Complete sortable table of all concepts

Example output:

```markdown
# Project Complexity & Knowledge Map

A guide to what you need to know to work on My Project, broken into three tiers.

> **5 technologies/concepts** across 3 areas **2 critical** **2 important** **1
> situational**

---

## **What you NEED to know to do any meaningful work**

- Node.js
- TypeScript

## **What you SHOULD know to be very helpful**

- React
- PostgreSQL

## **What you should EVENTUALLY learn for specific areas**

- Docker

---

## Full Reference

| Topic      | Area     | Criticality (1-3) |
| ---------- | -------- | ----------------- |
| Node.js    | backend  | 3                 |
| TypeScript | backend  | 3                 |
| PostgreSQL | backend  | 2                 |
| React      | frontend | 2                 |
| Docker     | devops   | 1                 |
```

## License

MIT
