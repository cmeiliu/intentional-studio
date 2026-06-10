#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);

function usage() {
  console.error('Usage: npm run sim -- <lane-or-path> [--base-url http://127.0.0.1:8000] [--timeout-ms 5000] [--json]');
}

if (args.length === 0 || args[0].startsWith('--')) {
  usage();
  process.exit(2);
}

const lane = args.shift();
const passthrough = [];
let baseUrl = process.env.SIM_BASE_URL || 'http://127.0.0.1:3000';
let timeoutMs = null;
let printJson = false;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === '--base-url') {
    baseUrl = args[i + 1];
    i += 1;
  } else if (arg === '--timeout-ms') {
    timeoutMs = args[i + 1];
    i += 1;
  } else if (arg === '--json') {
    printJson = true;
  } else {
    passthrough.push(arg);
  }
}

if (passthrough.length > 0) {
  console.error(`Unknown argument(s): ${passthrough.join(' ')}`);
  usage();
  process.exit(2);
}

const scenarioPath = lane.endsWith('.yaml') || lane.endsWith('.yml') || lane.includes('/')
  ? lane
  : path.join('lanes', `${lane}.scenario.yaml`);

const laneName = path.basename(scenarioPath).replace(/\.scenario\.ya?ml$/i, '').replace(/\.ya?ml$/i, '');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.join('.sim-out', `${laneName}-${timestamp}`);

const runnerArgs = [
  path.join(repoRoot, 'scripts', 'pebbled-sim.mjs'),
  '--scenario',
  scenarioPath,
  '--base-url',
  baseUrl,
  '--out',
  outDir
];

if (timeoutMs) {
  runnerArgs.push('--timeout-ms', timeoutMs);
}
if (printJson) {
  runnerArgs.push('--json');
}

const child = spawn(process.execPath, runnerArgs, {
  cwd: repoRoot,
  stdio: 'inherit'
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.error(`Simulation interrupted by ${signal}`);
    process.exit(130);
  }
  process.exit(code ?? 1);
});
