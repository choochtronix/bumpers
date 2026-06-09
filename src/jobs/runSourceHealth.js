import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { appendSourceHealthLogs } from "../lib/sourceHealthStore.js";
import { getCheckableSources } from "../sources/sourceRegistry.js";
import { runSourceHealthAgent } from "../agents/sourceHealthAgent.js";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const HEALTH_FILE = join(ROOT, "data", "agent-source-health.json");

const result = await runSourceHealthAgent({
  sources: getCheckableSources(),
  checkSource: async (source) => ({
    listingsFound: 0,
    errorMessage: `No CLI adapter wired for ${source.id}. Use /api/jobs/source-health for live connector checks.`,
  }),
});

await appendSourceHealthLogs(HEALTH_FILE, result.logs);
console.log(JSON.stringify(result, null, 2));
