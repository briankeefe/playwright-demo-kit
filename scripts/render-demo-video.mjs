import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const artifactsDir = path.join(root, "demo-artifacts");

function collectWebmFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectWebmFiles(full));
    else if (entry.isFile() && full.endsWith(".webm")) out.push(full);
  }
  return out;
}

if (!fs.existsSync(artifactsDir)) {
  console.error("demo-artifacts directory not found");
  process.exit(1);
}

const candidates = collectWebmFiles(artifactsDir)
  .map((file) => ({ file, mtimeMs: fs.statSync(file).mtimeMs }))
  .sort((a, b) => b.mtimeMs - a.mtimeMs);

if (!candidates.length) {
  console.error("No .webm demo video found");
  process.exit(1);
}

const input = candidates[0].file;
const output = path.join(path.dirname(input), "video-hq.mp4");

const result = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-i",
    input,
    "-vf",
    "scale=1080:-2:flags=lanczos",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-b:v",
    "10M",
    "-maxrate",
    "12M",
    "-bufsize",
    "20M",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    output,
  ],
  { stdio: "inherit" },
);

if (result.status !== 0) process.exit(result.status ?? 1);

console.log(`HQ video ready: ${output}`);
