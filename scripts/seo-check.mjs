#!/usr/bin/env node

import http from "node:http";
import https from "node:https";
import { readFile } from "node:fs/promises";

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const targets = JSON.parse(
  await readFile(new URL("../data/seo-geo-targets.json", import.meta.url), "utf8"),
);
const CANONICAL_ORIGIN = targets.canonicalOrigin;
const APEX_HOST = targets.apexHost;

const baseUrl = process.env.SEO_CHECK_BASE_URL || DEFAULT_BASE_URL;
const liveMode = new URL(baseUrl).hostname === "www.intentional.studio";

const routes = targets.routes;
const externalEntityUrls = targets.externalEntityUrls;

function fail(message) {
  throw new Error(message);
}

function routeUrl(path) {
  return new URL(path, baseUrl).toString();
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function getTagContent(html, tagName) {
  const match = html.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, "i"));
  return match ? decodeHtmlEntities(normalizeWhitespace(match[1])) : "";
}

function getCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return match?.[1] ?? "";
}

function getJsonLdText(html) {
  const matches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return matches.map((match) => match[1]).join("\n");
}

async function fetchText(url, options = {}) {
  const res = await fetch(url, { redirect: "manual", ...options });
  const text = await res.text();
  return { res, text };
}

async function checkPage(route) {
  const { res, text } = await fetchText(routeUrl(route.path));
  if (res.status !== 200) fail(`${route.path}: expected HTTP 200, got ${res.status}`);

  const title = getTagContent(text, "title");
  if (title !== route.title) fail(`${route.path}: expected title "${route.title}", got "${title}"`);

  const canonical = getCanonical(text);
  if (canonical !== route.canonical) {
    fail(`${route.path}: expected canonical "${route.canonical}", got "${canonical}"`);
  }

  for (const requiredText of route.text) {
    if (!text.includes(requiredText)) fail(`${route.path}: missing visible text "${requiredText}"`);
  }

  const jsonLd = getJsonLdText(text);
  if (!jsonLd) fail(`${route.path}: missing JSON-LD`);
  for (const type of route.jsonLd) {
    if (!jsonLd.includes(type)) fail(`${route.path}: JSON-LD missing "${type}"`);
  }

  for (const url of externalEntityUrls) {
    if (!text.includes(url)) fail(`${route.path}: missing entity reference ${url}`);
  }

  return { path: route.path, title, canonical };
}

async function checkSitemap() {
  const { res, text } = await fetchText(routeUrl("/sitemap.xml"));
  if (res.status !== 200) fail(`/sitemap.xml: expected HTTP 200, got ${res.status}`);
  for (const route of routes) {
    const sitemapUrl = route.path === "/" ? `${CANONICAL_ORIGIN}/` : route.canonical;
    if (!text.includes(`<loc>${sitemapUrl}</loc>`)) {
      fail(`/sitemap.xml: missing ${sitemapUrl}`);
    }
  }
}

async function checkRobots() {
  const { res, text } = await fetchText(routeUrl("/robots.txt"));
  if (res.status !== 200) fail(`/robots.txt: expected HTTP 200, got ${res.status}`);
  if (!text.includes(`Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`)) {
    fail("/robots.txt: missing canonical sitemap URL");
  }
  if (!text.includes(`Host: ${CANONICAL_ORIGIN}`)) {
    fail("/robots.txt: missing canonical host");
  }
}

async function checkLlmsTxt() {
  const { res, text } = await fetchText(routeUrl("/llms.txt"));
  if (res.status !== 200) fail(`/llms.txt: expected HTTP 200, got ${res.status}`);
  for (const route of routes) {
    if (!text.includes(route.canonical)) fail(`/llms.txt: missing ${route.canonical}`);
  }
  for (const url of externalEntityUrls) {
    if (!text.includes(url)) fail(`/llms.txt: missing entity reference ${url}`);
  }
}

async function checkHeaders() {
  const res = await fetch(routeUrl("/answers"), { method: "HEAD", redirect: "manual" });
  if (res.headers.get("x-content-type-options") !== "nosniff") {
    fail("/answers: missing X-Content-Type-Options header");
  }
  if (res.headers.get("referrer-policy") !== "strict-origin-when-cross-origin") {
    fail("/answers: missing Referrer-Policy header");
  }
}

async function checkApexRedirect() {
  const url = new URL(routeUrl("/ai-training"));
  if (liveMode) {
    const res = await fetch("https://intentional.studio/ai-training", {
      method: "HEAD",
      redirect: "manual",
    });
    if (![301, 308].includes(res.status)) {
      fail(`live apex redirect: expected 301/308, got ${res.status}`);
    }
    const location = res.headers.get("location") ?? "";
    if (location !== `${CANONICAL_ORIGIN}/ai-training`) {
      fail(`live apex redirect: expected ${CANONICAL_ORIGIN}/ai-training, got ${location}`);
    }
    return;
  }

  if (!["127.0.0.1", "localhost"].includes(url.hostname)) {
    console.warn("Skipping apex redirect check: SEO_CHECK_BASE_URL is not loopback.");
    return;
  }

  const redirect = await new Promise((resolve, reject) => {
    const client = url.protocol === "https:" ? https : http;
    const req = client.request({
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: "HEAD",
      headers: {
        Host: url.port ? `${APEX_HOST}:${url.port}` : APEX_HOST,
      },
    }, (res) => {
      res.resume();
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          location: res.headers.location,
        });
      });
    });
    req.on("error", reject);
    req.end();
  });

  if (redirect.status !== 308) fail(`apex redirect: expected 308, got ${redirect.status}`);
  const location = redirect.location ?? "";
  const expected = url.port
    ? `http://www.intentional.studio:${url.port}/ai-training`
    : `${CANONICAL_ORIGIN}/ai-training`;
  if (location !== expected && location !== `${CANONICAL_ORIGIN}/ai-training`) {
    fail(`apex redirect: expected ${expected}, got ${location}`);
  }
}

async function main() {
  const results = [];
  for (const route of routes) {
    results.push(await checkPage(route));
  }
  await checkSitemap();
  await checkRobots();
  await checkLlmsTxt();
  await checkHeaders();
  await checkApexRedirect();

  console.log(`SEO/GEO check passed for ${baseUrl}`);
  for (const result of results) {
    console.log(`- ${result.path}: ${result.title}`);
  }
}

main().catch((error) => {
  console.error(`SEO/GEO check failed: ${error.message}`);
  process.exit(1);
});
