# Skills Registry — Plan

## Architecture
Single TypeScript file entry point + two modules:
- `src/index.ts` — CLI entry, command routing via commander
- `src/scanner.ts` — reads `~/.claude/skills/`, parses SKILL.md frontmatter
- `src/commands/` — one file per command (list, info, find, check)

## Task Breakdown

### T1: Project scaffold
- `package.json` with `bin` field, `type: module`, commander dep
- `tsconfig.json` — ES2022 target, NodeNext modules
- Build script: `tsc` → `dist/`

### T2: scanner.ts
- Read all subdirs of skills dir
- For each: read `SKILL.md`, parse YAML frontmatter (manual: split on `---`, parse key: value lines)
- Return `Skill[]` typed objects

### T3: list command
- Print all skills compact: `name  — description (first sentence)`
- `--group` flag groups by prefix

### T4: info command
- Print all parsed fields for one skill, formatted

### T5: find command
- Filter skills where name or description contains query (case-insensitive)
- Bold the match in output (ANSI codes)

### T6: check command
- Validate required fields, report issues

### T7: build + local test
- Compile, run against real `~/.claude/skills/`, verify output

## Phases
1. T1 + T2 — foundation
2. T3 + T4 — primary commands
3. T5 + T6 — secondary commands
4. T7 — verify
