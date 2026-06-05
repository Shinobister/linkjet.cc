import { promises as fs } from "fs";
import path from "path";
import type { HistoryItem } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "links.json");

interface LinksStore {
  links: Record<string, HistoryItem>;
}

async function readStore(): Promise<LinksStore> {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return { links: {} };
  }
}

async function writeStore(store: LinksStore): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export async function getLinkBySlug(
  slug: string
): Promise<HistoryItem | null> {
  const store = await readStore();
  return store.links[slug] ?? null;
}

export async function saveLink(item: HistoryItem): Promise<void> {
  const store = await readStore();
  store.links[item.slug] = item;
  await writeStore(store);
}
