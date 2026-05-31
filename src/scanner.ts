import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";

export interface Skill {
  name: string;
  description: string;
  argumentHint?: string;
  allowedTools?: string[];
  userInvocable?: boolean;
  dir: string;
  filePath: string;
}

export function getSkillsDir(): string {
  return process.env.CLAUDE_SKILLS_DIR ?? join(homedir(), ".claude", "skills");
}

function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const result: Record<string, unknown> = {};
  const lines = match[1].split("\n");
  let currentKey = "";
  let listItems: string[] = [];
  let inList = false;

  for (const line of lines) {
    const listMatch = line.match(/^  - (.+)$/);
    if (listMatch && inList) {
      listItems.push(listMatch[1]);
      continue;
    }
    if (inList) {
      result[currentKey] = listItems;
      inList = false;
      listItems = [];
    }

    const kvMatch = line.match(/^(\S[^:]*?):\s*("(.*?)"|'(.*?)'|(.*))$/);
    if (!kvMatch) continue;

    const key = kvMatch[1].trim();
    const raw = (kvMatch[3] ?? kvMatch[4] ?? kvMatch[5] ?? "").trim();

    if (raw === "") {
      currentKey = key;
      inList = true;
      listItems = [];
    } else if (raw === "true") {
      result[key] = true;
    } else if (raw === "false") {
      result[key] = false;
    } else {
      result[key] = raw;
    }
  }

  if (inList) result[currentKey] = listItems;

  return result;
}

export async function scanSkills(): Promise<Skill[]> {
  const skillsDir = getSkillsDir();
  const entries = await readdir(skillsDir, { withFileTypes: true });
  const skills: Skill[] = [];

  await Promise.all(
    entries.map(async (entry) => {
      if (!entry.isDirectory()) return;

      const skillPath = join(skillsDir, entry.name, "SKILL.md");
      try {
        const s = await stat(skillPath);
        if (!s.isFile()) return;

        const content = await readFile(skillPath, "utf-8");
        const fm = parseFrontmatter(content);

        const skill: Skill = {
          name: typeof fm.name === "string" ? fm.name : entry.name,
          description: typeof fm.description === "string" ? fm.description : "",
          dir: entry.name,
          filePath: skillPath,
        };

        if (typeof fm["argument-hint"] === "string") skill.argumentHint = fm["argument-hint"];
        if (Array.isArray(fm["allowed-tools"])) skill.allowedTools = fm["allowed-tools"] as string[];
        if (typeof fm["user-invocable"] === "boolean") skill.userInvocable = fm["user-invocable"];

        skills.push(skill);
      } catch {
        // No SKILL.md — skip silently
      }
    })
  );

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

export function firstSentence(text: string): string {
  const s = text.replace(/\n/g, " ").trim();
  const dot = s.search(/[.!?]/);
  return dot !== -1 && dot < 120 ? s.slice(0, dot + 1) : s.slice(0, 100);
}

export function groupByPrefix(skills: Skill[]): Map<string, Skill[]> {
  const groups = new Map<string, Skill[]>();

  for (const skill of skills) {
    const dash = skill.name.indexOf("-");
    const prefix = dash !== -1 ? skill.name.slice(0, dash) : "other";
    const key =
      prefix === "gsd" ? "gsd (GSD workflow)" :
      prefix === "gstack" ? "gstack" :
      prefix === "superpowers" ? "superpowers" :
      prefix === "vercel" ? "vercel" :
      prefix === "figma" ? "figma" :
      skill.userInvocable ? "user-invocable" : "other";

    const bucket = groups.get(key) ?? [];
    bucket.push(skill);
    groups.set(key, bucket);
  }

  return groups;
}
