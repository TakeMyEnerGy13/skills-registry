import { scanSkills, firstSentence } from "../scanner.js";

const BOLD = "\x1b[1m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

function highlight(text: string, query: string): string {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    text.slice(0, idx) +
    YELLOW + BOLD + text.slice(idx, idx + query.length) + RESET +
    text.slice(idx + query.length)
  );
}

export async function findCommand(query: string) {
  const skills = await scanSkills();
  const q = query.toLowerCase();

  const matches = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    console.log(`No skills found matching "${query}".`);
    return;
  }

  console.log(`\nFound ${matches.length} skill(s) matching "${YELLOW}${query}${RESET}":\n`);

  const nameWidth = Math.min(40, Math.max(...matches.map((s) => s.name.length)) + 2);

  for (const skill of matches) {
    const name = highlight(skill.name, query).padEnd(nameWidth + (YELLOW.length + BOLD.length + RESET.length) * (skill.name.toLowerCase().includes(q) ? 1 : 0));
    const desc = highlight(firstSentence(skill.description), query);
    console.log(`${BOLD}${name}${RESET}${DIM}${desc}${RESET}`);
  }
}
