# Skills Registry — Spec

## Goal
CLI tool on TypeScript that indexes and queries Claude Code skills installed in `~/.claude/skills/`.

## Problem
86 skills installed, no way to discover them without manually browsing directories or reading CLAUDE.md skill lists. No search, no grouping, no dependency visualization.

## Users
Single user (Artem). Runs locally via `npx skills-registry` or a global `sr` alias.

## Functional Requirements

### FR1: list
`sr list [--group]`
- Outputs all skills: name + first sentence of description
- `--group` flag: groups by prefix (gsd-*, personal, plugin, other)
- Default: alphabetical, compact (one skill per line)

### FR2: info
`sr info <name>`
- Full SKILL.md frontmatter: name, description, argument-hint, allowed-tools, user-invocable
- Shows which file it lives in

### FR3: find
`sr find <query>`
- Case-insensitive substring match across name + description
- Highlights the match in output

### FR4: check
`sr check`
- Validates all SKILL.md files: required fields (name, description) present, non-empty
- Reports missing or invalid files

### FR5: deps (stretch goal)
`sr deps [name]`
- Scans SKILL.md body for `/skill-name` invocation patterns
- Shows a dependency graph (text-based)

## Non-Functional Requirements
- Zero config — reads skills path from env `CLAUDE_SKILLS_DIR` or defaults to `~/.claude/skills/`
- Fast: <200ms for `list` on 100 skills
- No external runtime deps beyond Node builtins (yaml parsing: manual, it's simple frontmatter)

## Out of Scope
- Updating/installing skills (separate concern)
- GUI
- Remote registry queries

## Success Criteria
- `sr list` returns all 86 skills in <200ms
- `sr find obsidian` returns the obsidian-notes skill
- `sr check` correctly flags a skill missing the `name` field
