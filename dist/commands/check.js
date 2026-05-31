import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { getSkillsDir } from "../scanner.js";
const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";
export async function checkCommand() {
    const skillsDir = getSkillsDir();
    const entries = await readdir(skillsDir, { withFileTypes: true });
    const issues = [];
    let checked = 0;
    await Promise.all(entries.map(async (entry) => {
        if (!entry.isDirectory())
            return;
        const skillPath = join(skillsDir, entry.name, "SKILL.md");
        try {
            const s = await stat(skillPath);
            if (!s.isFile()) {
                issues.push({ dir: entry.name, severity: "error", message: "SKILL.md missing" });
                return;
            }
            const content = await readFile(skillPath, "utf-8");
            const normalized = content.replace(/\r\n/g, "\n");
            const hasFrontmatter = /^---\n[\s\S]*?\n---/.test(normalized);
            if (!hasFrontmatter) {
                issues.push({ dir: entry.name, severity: "error", message: "No YAML frontmatter (---) found" });
                checked++;
                return;
            }
            if (!/^name:\s*.+/m.test(normalized)) {
                issues.push({ dir: entry.name, severity: "error", message: "Missing required field: name" });
            }
            const descMatch = normalized.match(/^description:\s*["']?(.+?)["']?\s*$/m);
            if (!descMatch || descMatch[1].trim().length < 10) {
                issues.push({ dir: entry.name, severity: "warn", message: "Missing or very short description" });
            }
            checked++;
        }
        catch {
            issues.push({ dir: entry.name, severity: "error", message: "Could not read SKILL.md" });
        }
    }));
    const errors = issues.filter((i) => i.severity === "error");
    const warnings = issues.filter((i) => i.severity === "warn");
    if (issues.length === 0) {
        console.log(`\n${GREEN}${BOLD}✓ All ${checked} skills passed validation${RESET}`);
        return;
    }
    if (errors.length > 0) {
        console.log(`\n${RED}${BOLD}Errors (${errors.length}):${RESET}`);
        for (const issue of errors) {
            console.log(`  ${RED}✗${RESET} ${BOLD}${issue.dir}${RESET}${DIM} — ${issue.message}${RESET}`);
        }
    }
    if (warnings.length > 0) {
        console.log(`\n${YELLOW}${BOLD}Warnings (${warnings.length}):${RESET}`);
        for (const issue of warnings) {
            console.log(`  ${YELLOW}⚠${RESET} ${BOLD}${issue.dir}${RESET}${DIM} — ${issue.message}${RESET}`);
        }
    }
    console.log(`\n${DIM}Checked ${checked} skills. ${errors.length} error(s), ${warnings.length} warning(s).${RESET}`);
    if (errors.length > 0)
        process.exit(1);
}
