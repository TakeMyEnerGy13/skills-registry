import { scanSkills } from "../scanner.js";
const BOLD = "\x1b[1m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";
export async function infoCommand(name) {
    const skills = await scanSkills();
    const skill = skills.find((s) => s.name === name || s.dir === name || s.name.includes(name));
    if (!skill) {
        console.error(`Skill "${name}" not found. Run 'sr list' to see all skills.`);
        process.exit(1);
    }
    console.log(`\n${BOLD}${CYAN}${skill.name}${RESET}`);
    console.log(`${DIM}${skill.filePath}${RESET}\n`);
    console.log(`${BOLD}Description:${RESET}`);
    console.log(`  ${skill.description}\n`);
    if (skill.argumentHint) {
        console.log(`${BOLD}Usage:${RESET}`);
        console.log(`  /${skill.name} ${YELLOW}${skill.argumentHint}${RESET}\n`);
    }
    if (skill.allowedTools?.length) {
        console.log(`${BOLD}Allowed Tools:${RESET}`);
        console.log(`  ${skill.allowedTools.join(", ")}\n`);
    }
    if (skill.userInvocable !== undefined) {
        console.log(`${BOLD}User Invocable:${RESET} ${skill.userInvocable ? "yes" : "no"}\n`);
    }
}
