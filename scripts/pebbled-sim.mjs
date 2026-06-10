#!/usr/bin/env node
import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import YAML from 'yaml';

const RUNNER_ID = 'intentional-studio-local-playwright';
const SUPPORTED_SCHEMA = 'pebbled.scenario.v1';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      throw new Error(`Unexpected argument: ${arg}`);
    }
    const key = arg.slice(2);
    if (key === 'json') {
      args.json = true;
      continue;
    }
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }
    args[key] = value;
    i += 1;
  }
  return args;
}

function requireArg(args, name) {
  if (!args[name]) {
    throw new Error(`Missing required --${name}`);
  }
  return args[name];
}

function isLoopbackUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (!['http:', 'https:'].includes(url.protocol)) return false;
  const host = url.hostname.toLowerCase();
  return host === 'localhost' || host === '::1' || host === '[::1]' || host.startsWith('127.');
}

function joinUrl(baseUrl, route = '/') {
  if (/^https?:\/\//i.test(route)) {
    return route;
  }
  const normalizedRoute = route.startsWith('/') ? route.slice(1) : route;
  return new URL(normalizedRoute, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).toString();
}

function validateScenario(scenario) {
  if (!scenario || typeof scenario !== 'object') {
    throw new Error('Scenario must be a YAML object');
  }
  if (scenario.schema !== SUPPORTED_SCHEMA) {
    throw new Error(`Unsupported scenario schema: ${scenario.schema}`);
  }
  for (const field of ['id', 'title', 'persona', 'goal', 'app', 'steps']) {
    if (!(field in scenario)) {
      throw new Error(`Scenario missing required field: ${field}`);
    }
  }
  if (!scenario.app?.startPath) {
    throw new Error('Scenario missing app.startPath');
  }
  if (!Array.isArray(scenario.steps) || scenario.steps.length === 0) {
    throw new Error('Scenario steps must be a non-empty array');
  }
  const seen = new Set();
  scenario.steps.forEach((step, index) => {
    for (const field of ['id', 'label', 'action']) {
      if (!step[field]) {
        throw new Error(`Step ${index} missing required field: ${field}`);
      }
    }
    if (seen.has(step.id)) {
      throw new Error(`Duplicate step id: ${step.id}`);
    }
    seen.add(step.id);
  });
}

function screenshotName(index, stepId) {
  const cleanId = String(stepId).replace(/[^a-z0-9_-]+/gi, '-').replace(/^-|-$/g, '') || 'step';
  return `${String(index + 1).padStart(2, '0')}-${cleanId}.png`;
}

function defaultChromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ].filter(Boolean);

  return candidates.find((candidate) => {
    try {
      return fsSync.statSync(candidate).isFile();
    } catch {
      return false;
    }
  });
}

function assertSafeOutDir(outDir) {
  const resolved = path.resolve(outDir);
  const cwd = process.cwd();
  const parent = path.dirname(resolved);
  const unsafe = new Set([path.parse(resolved).root, cwd, path.dirname(cwd), process.env.HOME].filter(Boolean));
  if (unsafe.has(resolved) || parent === resolved) {
    throw new Error(`Refusing unsafe --out directory: ${outDir}`);
  }
}

async function appendLog(logFile, event) {
  await fs.appendFile(logFile, `${JSON.stringify({ ts: new Date().toISOString(), ...event })}\n`);
}

async function expectText(page, text, timeoutMs) {
  await page.getByText(text, { exact: false }).first().waitFor({ state: 'visible', timeout: timeoutMs });
}

async function runExpectation(page, expect, timeoutMs) {
  if (!expect) return;
  if (expect.text) {
    await expectText(page, expect.text, timeoutMs);
  }
  if (expect.selectorVisible) {
    await page.locator(expect.selectorVisible).first().waitFor({ state: 'visible', timeout: timeoutMs });
  }
  if (expect.urlIncludes) {
    const current = page.url();
    if (!current.includes(expect.urlIncludes)) {
      throw new Error(`Expected URL to include "${expect.urlIncludes}", got "${current}"`);
    }
  }
}

async function runStep(page, step, baseUrl, timeoutMs) {
  switch (step.action) {
    case 'goto': {
      const target = step.url ? step.url : joinUrl(baseUrl, step.path);
      if (!isLoopbackUrl(target)) {
        throw new Error(`Refusing to navigate to non-loopback URL: ${target}`);
      }
      await page.goto(target, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
      break;
    }
    case 'fill':
      await page.locator(step.selector).first().fill(step.value ?? '', { timeout: timeoutMs });
      break;
    case 'click':
      await page.locator(step.selector).first().click({ timeout: timeoutMs });
      break;
    case 'waitForText':
    case 'assertText':
      await expectText(page, step.text, timeoutMs);
      break;
    case 'waitForSelector':
    case 'assertSelector':
      await page.locator(step.selector).first().waitFor({ state: 'visible', timeout: timeoutMs });
      break;
    case 'assertUrl': {
      const current = page.url();
      if (!current.includes(step.urlIncludes)) {
        throw new Error(`Expected URL to include "${step.urlIncludes}", got "${current}"`);
      }
      break;
    }
    default:
      throw new Error(`Unsupported action: ${step.action}`);
  }

  await runExpectation(page, step.expect, timeoutMs);
}

async function scanEvidence(outDir) {
  const findings = [];
  const patterns = [
    { name: 'bearer-token', re: /bearer\s+[a-z0-9._~+/=-]{20,}/i },
    { name: 'github-token', re: /gh[pousr]_[a-z0-9_]{30,}/i },
    { name: 'openai-key', re: /sk-[a-z0-9]{20,}/i },
    { name: 'anthropic-key', re: /sk-ant-[a-z0-9_-]{20,}/i },
    { name: 'google-key', re: /AIza[0-9A-Za-z_-]{20,}/ },
    { name: 'vercel-token', re: /\bvercel_[a-z0-9]{20,}\b/i },
    { name: 'resend-key', re: /re_[a-z0-9]{20,}/i },
    { name: 'neon-connection', re: /postgres(?:ql)?:\/\/[^@\s]+@[^/\s]+\/\S+/i }
  ];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (/\.(json|ndjson|txt|log|yaml|yml)$/i.test(entry.name)) {
        const text = await fs.readFile(fullPath, 'utf8');
        for (const pattern of patterns) {
          if (pattern.re.test(text)) {
            findings.push({ file: path.relative(outDir, fullPath), pattern: pattern.name });
          }
        }
      }
    }
  }

  await walk(outDir);
  return findings.length > 0
    ? { status: 'failed', findings }
    : { status: 'passed', findings: [] };
}

async function writeVerdict(outDir, verdict) {
  await fs.writeFile(path.join(outDir, 'verdict.json'), `${JSON.stringify(verdict, null, 2)}\n`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const scenarioPath = requireArg(args, 'scenario');
  const baseUrl = requireArg(args, 'base-url');
  const outDir = requireArg(args, 'out');
  const timeoutOverride = args['timeout-ms'] ? Number(args['timeout-ms']) : null;
  assertSafeOutDir(outDir);

  if (!isLoopbackUrl(baseUrl)) {
    throw new Error(`--base-url must be a loopback URL, got ${baseUrl}`);
  }

  const start = Date.now();
  const scenarioText = await fs.readFile(scenarioPath, 'utf8');
  const scenario = YAML.parse(scenarioText);
  validateScenario(scenario);

  const timeoutMs = timeoutOverride ?? scenario.defaults?.timeoutMs ?? 5000;
  const screenshotsDir = path.join(outDir, 'screenshots');
  const logsDir = path.join(outDir, 'logs');
  const logFile = path.join(logsDir, 'runner.ndjson');
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(screenshotsDir, { recursive: true });
  await fs.mkdir(logsDir, { recursive: true });

  const chromePath = defaultChromePath();
  if (!chromePath) {
    throw new Error('System Chrome was not found. Set CHROME_PATH to the Chrome executable.');
  }

  const stepResults = [];
  let failingStepIndex = null;
  let failingStepId = null;
  let error = null;
  let browser;

  try {
    browser = await chromium.launch({
      executablePath: chromePath,
      headless: true
    });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

    if (scenario.steps[0]?.action !== 'goto') {
      await page.goto(joinUrl(baseUrl, scenario.app.startPath), {
        waitUntil: 'domcontentloaded',
        timeout: timeoutMs
      });
    }

    for (let i = 0; i < scenario.steps.length; i += 1) {
      const step = scenario.steps[i];
      const stepStart = Date.now();
      const screenshot = path.join('screenshots', screenshotName(i, step.id));
      try {
        await appendLog(logFile, { type: 'step:start', step: step.id, action: step.action });
        await runStep(page, step, baseUrl, timeoutMs);
        await page.screenshot({ path: path.join(outDir, screenshot), fullPage: true });
        stepResults.push({
          id: step.id,
          label: step.label,
          action: step.action,
          verdict: 'pass',
          durationMs: Date.now() - stepStart,
          screenshot
        });
        await appendLog(logFile, { type: 'step:pass', step: step.id });
      } catch (stepError) {
        await page.screenshot({ path: path.join(outDir, screenshot), fullPage: true }).catch(() => {});
        failingStepIndex = i;
        failingStepId = step.id;
        error = stepError.message;
        stepResults.push({
          id: step.id,
          label: step.label,
          action: step.action,
          verdict: 'fail',
          durationMs: Date.now() - stepStart,
          screenshot,
          error
        });
        await appendLog(logFile, { type: 'step:fail', step: step.id, error });
        break;
      }
    }
  } finally {
    if (browser) await browser.close();
  }

  let verdict = {
    schema: 'pebbled.runner-verdict.v1',
    runner: RUNNER_ID,
    scenario: {
      id: scenario.id,
      path: scenarioPath,
      schema: scenario.schema
    },
    verdict: error ? 'fail' : 'pass',
    failingStepIndex,
    failingStepId,
    error,
    durationMs: Date.now() - start,
    evidenceDir: outDir,
    steps: stepResults,
    safety: { status: 'pending', findings: [] }
  };

  await writeVerdict(outDir, verdict);
  const safety = await scanEvidence(outDir);
  verdict = { ...verdict, safety };
  await writeVerdict(outDir, verdict);

  if (args.json) {
    process.stdout.write(`${JSON.stringify(verdict, null, 2)}\n`);
  }

  if (safety.status === 'failed') {
    process.exitCode = 3;
  } else {
    process.exitCode = verdict.verdict === 'pass' ? 0 : 1;
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`pebbled-sim setup failed: ${message}`);
  process.exitCode = 2;
});
