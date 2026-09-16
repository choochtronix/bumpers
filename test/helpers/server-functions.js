import { readFileSync } from "node:fs";
import vm from "node:vm";

// Exercise legacy server functions without starting a listener or loading real credentials.
export function serverFunctions(names, globals = {}) {
  const source = readFileSync(new URL("../../server.js", import.meta.url), "utf8");
  const context = vm.createContext({ URL, URLSearchParams, Date, console, ...globals });
  vm.runInContext(names.map((name) => {
    const match = source.match(new RegExp(`^(?:async )?function ${name}\\([^]*?^\\}`, "m"));
    if (!match) throw new Error(`Missing server function: ${name}`);
    return match[0];
  }).join("\n"), context);
  return context;
}
