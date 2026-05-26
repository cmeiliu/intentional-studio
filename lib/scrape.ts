import * as cheerio from "cheerio";

export type SiteSnapshot = {
  url: string;
  title: string;
  description: string;
  bodyText: string;
};

export async function scrapeSite(rawUrl: string): Promise<SiteSnapshot> {
  const url = normalizeUrl(rawUrl);
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; IntentionalStudioBot/0.1; +https://intentional.studio)",
    },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    return { url, title: "", description: "", bodyText: "" };
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  $("script, style, noscript, svg, iframe").remove();

  const title = $("title").first().text().trim();
  const description =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    "";

  const bodyText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);

  return { url, title, description, bodyText };
}

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Empty URL");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
