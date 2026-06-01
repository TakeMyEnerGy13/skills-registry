# skills-registry

CLI tool to index and query [Claude Code](https://claude.ai/code) skills installed in `~/.claude/skills/`.

```
sr list
sr list --group
sr find <query>
sr info <name>
sr check
```

## Install

```bash
git clone https://github.com/TakeMyEnerGy13/skills-registry
cd skills-registry
npm install
npm run build
npm install -g .
```

## Commands

| Command | Description |
|---------|-------------|
| `sr list` | List all installed skills with one-line descriptions |
| `sr list --group` | Same, grouped by prefix (gsd, superpowers, vercel, etc.) |
| `sr find <query>` | Search by name or description (case-insensitive, highlights matches) |
| `sr info <name>` | Full details: description, usage hint, allowed tools, invocable flag |
| `sr check` | Validate all `SKILL.md` files — checks frontmatter, required fields |

## Skills directory

By default reads from `~/.claude/skills/`. Override with env var:

```bash
CLAUDE_SKILLS_DIR=/path/to/skills sr list
```

Each skill must live in its own subdirectory with a `SKILL.md` file containing YAML frontmatter:

```markdown
---
name: my-skill
description: What this skill does
argument-hint: <optional usage hint>
allowed-tools: Read, Edit, Bash
user-invocable: true
---
```

## Dev

```bash
npm run dev -- list        # run without building
npm run build              # compile to dist/
```
