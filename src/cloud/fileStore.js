import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";

const locks = new Map();
export async function updateJsonFile(path, update, fallback = {}) {
  const previous = locks.get(path) || Promise.resolve();
  const task = previous.catch(() => {}).then(async () => {
    let value;
    try { value = JSON.parse(await readFile(path, "utf8")); }
    catch (error) { if (error.code !== "ENOENT") throw error; value = fallback; }
    const next = await update(value);
    if (next.conflict) return next;
    await mkdir(dirname(path), { recursive: true });
    const temp = `${path}.${randomUUID()}.tmp`;
    await writeFile(temp, JSON.stringify(next), { mode: 0o600 });
    await rename(temp, path);
    return next;
  });
  locks.set(path, task);
  try { return await task; } finally { if (locks.get(path) === task) locks.delete(path); }
}

export function mergeSavedSearchMutation(current, incoming) {
  if ((current.revision || 0) !== incoming.revision) return { conflict: true };
  const records = new Map((current.profiles || []).map((item) => [item.id, item]));
  for (const profile of incoming.profiles) if (!records.get(profile.id)?.deletedAt) records.set(profile.id, profile);
  for (const id of incoming.deletedIds || []) records.set(id, {
    ...(records.get(id) || { id, name: "Deleted search", terms: [] }),
    deletedAt: records.get(id)?.deletedAt || new Date().toISOString(), alertsEnabled: false,
  });
  return { ...incoming, revision: incoming.revision + 1, profiles: [...records.values()] };
}
