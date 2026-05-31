#!/usr/bin/env node
import { Command } from "commander";
import { listCommand } from "./commands/list.js";
import { infoCommand } from "./commands/info.js";
import { findCommand } from "./commands/find.js";
import { checkCommand } from "./commands/check.js";

const program = new Command();

program
  .name("sr")
  .description("Claude Code Skills Registry — index and query installed skills")
  .version("1.0.0");

program
  .command("list")
  .description("List all installed skills")
  .option("-g, --group", "Group by prefix (gsd, superpowers, vercel, etc.)")
  .action((opts) => listCommand(opts));

program
  .command("info <name>")
  .description("Show detailed info for a skill")
  .action((name) => infoCommand(name));

program
  .command("find <query>")
  .description("Search skills by name or description")
  .action((query) => findCommand(query));

program
  .command("check")
  .description("Validate all SKILL.md files for required fields")
  .action(() => checkCommand());

program.parse();
