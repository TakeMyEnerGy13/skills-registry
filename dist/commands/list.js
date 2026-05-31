import { scanSkills, firstSentence, groupByPrefix } from "../scanner.js";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";
export async function listCommand(options) {
    const skills = await scanSkills();
    if (options.group) {
        const groups = groupByPrefix(skills);
        for (const [label, bucket] of [...groups.entries()].sort()) {
            console.log(`\n${BOLD}${CYAN}── ${label} (${bucket.length})${RESET}`);
            for (const skill of bucket) {
                const desc = firstSentence(skill.description);
                console.log(`  ${BOLD}${skill.name}${RESET}${DIM} — ${desc}${RESET}`);
            }
        }
        console.log(`\n${DIM}Total: ${skills.length} skills${RESET}`);
    }
    else {
        const nameWidth = Math.min(40, Math.max(...skills.map((s) => s.name.length)) + 2);
        for (const skill of skills) {
            const padded = skill.name.padEnd(nameWidth);
            const desc = firstSentence(skill.description);
            console.log(`${BOLD}${padded}${RESET}${DIM}${desc}${RESET}`);
        }
        console.log(`\n${DIM}${skills.length} skills in ${process.env.CLAUDE_SKILLS_DIR ?? "~/.claude/skills"}${RESET}`);
    }
}
