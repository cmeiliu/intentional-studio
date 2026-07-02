#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const targets = JSON.parse(
  await readFile(new URL("../data/seo-geo-targets.json", import.meta.url), "utf8"),
);

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const baseUrl = process.env.SEO_REPORT_BASE_URL || DEFAULT_BASE_URL;

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

function getTagText(html, tagName) {
  return normalizeWhitespace(
    getTagContent(html, tagName)
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]+>/g, " "),
  );
}

function getCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return match?.[1] ?? "";
}

async function fetchPage(route) {
  const url = routeUrl(route.path);
  try {
    const res = await fetch(url, { redirect: "manual" });
    const text = await res.text();
    const title = getTagContent(text, "title");
    const h1 = getTagText(text, "h1");
    const canonical = getCanonical(text);
    return {
      path: route.path,
      status: res.status,
      title,
      titleOk: title === route.title,
      h1,
      h1Ok: route.h1 ? h1 === route.h1 : true,
      canonical,
      canonicalOk: canonical === route.canonical,
    };
  } catch (error) {
    return {
      path: route.path,
      status: "error",
      title: error.message,
      titleOk: false,
      h1: "",
      h1Ok: false,
      canonical: "",
      canonicalOk: false,
    };
  }
}

function statusIcon(value) {
  return value ? "yes" : "no";
}

function mdEscape(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

const routeResults = [];
for (const route of targets.routes) {
  routeResults.push(await fetchPage(route));
}

const lines = [
  "# SEO/GEO Evidence Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Base URL: ${baseUrl}`,
  "",
  "## Deployment Surface",
  "",
  "| Route | HTTP | Title OK | H1 OK | Canonical OK | Observed title |",
  "| --- | ---: | --- | --- | --- | --- |",
];

for (const result of routeResults) {
  lines.push(
    `| ${result.path} | ${result.status} | ${statusIcon(result.titleOk)} | ${statusIcon(
      result.h1Ok,
    )} | ${statusIcon(
      result.canonicalOk,
    )} | ${mdEscape(result.title)} |`,
  );
}

lines.push(
  "",
  "## Google Rank Targets",
  "",
  "| Query | Target URLs | Success evidence to record |",
  "| --- | --- | --- |",
);

for (const target of targets.rankTargets) {
  lines.push(
    `| ${mdEscape(target.query)} | ${target.targetUrls
      .map((url) => `[${url}](${url})`)
      .join("<br>")} | ${mdEscape(target.successEvidence)} |`,
  );
}

lines.push(
  "",
  "## AI Answer Prompts",
  "",
  "| Prompt | Answer should include | Target URLs |",
  "| --- | --- | --- |",
);

for (const prompt of targets.answerPrompts) {
  lines.push(
    `| ${mdEscape(prompt.prompt)} | ${prompt.targetAnswerIncludes
      .map(mdEscape)
      .join(", ")} | ${prompt.targetUrls.map((url) => `[${url}](${url})`).join("<br>")} |`,
  );
}

lines.push(
  "",
  "## Next Evidence Needed",
  "",
  "- Run `SEO_CHECK_BASE_URL=https://www.intentional.studio npm run seo:check` after deployment.",
  "- Submit `https://www.intentional.studio/sitemap.xml` in Google Search Console.",
  "- Request indexing for each canonical route in the deployment surface table.",
  "- Record Search Console impressions, clicks, average position, and indexed canonical weekly.",
  "- Test the AI answer prompts in ChatGPT, Perplexity, Gemini, Claude, and Google AI answers and record cited URLs.",
  "",
);

console.log(lines.join("\n"));
