import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "docs", "figma-code-map.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const errors = [];
const nodeIds = new Set();
let targetCount = 0;

if (manifest.schemaVersion !== 1) {
  errors.push(`Unsupported map schema version: ${manifest.schemaVersion}`);
}

if (!manifest.figma?.fileKey || !Array.isArray(manifest.components)) {
  errors.push("Map must include a Figma file key and components array.");
}

for (const component of manifest.components || []) {
  const label = component.key || component.name || "unnamed component";
  if (!/^\d+:\d+$/.test(component.nodeId || "")) {
    errors.push(`${label}: invalid Figma node ID ${component.nodeId || "(missing)"}`);
  } else if (nodeIds.has(component.nodeId)) {
    errors.push(`${label}: duplicate Figma node ID ${component.nodeId}`);
  } else {
    nodeIds.add(component.nodeId);
  }

  if (!Array.isArray(component.implementation) || !component.implementation.length) {
    errors.push(`${label}: no implementation targets`);
    continue;
  }

  for (const target of component.implementation) {
    targetCount += 1;
    const sourcePath = path.join(root, target.file || "");
    if (!target.file || !fs.existsSync(sourcePath)) {
      errors.push(`${label}: missing source file ${target.file || "(unspecified)"}`);
      continue;
    }

    const source = fs.readFileSync(sourcePath, "utf8");
    for (const anchor of target.anchors || []) {
      if (!source.includes(anchor)) {
        errors.push(`${label}: ${target.file} is missing anchor ${JSON.stringify(anchor)}`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `Figma code map checks passed: ${manifest.components.length} components, `
  + `${targetCount} source targets.`,
);
