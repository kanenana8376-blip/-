// 各地域の当番表ページと、そこからリンクされているPDFを取得し、
// 文字に変換して duty-raw/<id>/ に保存する。
// GitHub Actions で毎日実行する（.github/workflows/update-duty.yml）。
//
// 使い方: node scripts/duty/fetch.mjs [出力先ディレクトリ]
// PDFの文字変換には pdftotext（poppler-utils）を使う。

import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";

const run = promisify(execFile);
const HERE = path.dirname(new URL(import.meta.url).pathname);
const OUT = process.argv[2] || path.join(HERE, "../../duty-raw");
const SOURCES = JSON.parse(await readFile(path.join(HERE, "sources.json"), "utf8"));

const USER_AGENT = "saitama-emergency-tool/1.0 (daily on-duty clinic list; +https://github.com/kanenana8376-blip/-)";
const TIMEOUT_MS = 30000;
const MAX_PDFS_PER_SOURCE = 6;
const MAX_BYTES = 15 * 1024 * 1024;
// PDFのうち、当番表らしいものだけを取りに行く
const PDF_HINT = /当番|休日|夜間|急患|救急|輪番|toban|touban|kyujitsu|kyuujitu|kyujitu|yakan|kyukan|kyuukan/i;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const sha256 = buf => createHash("sha256").update(buf).digest("hex");

async function get(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: ctrl.signal, redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_BYTES) throw new Error(`too large (${buf.length} bytes)`);
    return { buf, type: res.headers.get("content-type") || "", finalUrl: res.url };
  } finally {
    clearTimeout(timer);
  }
}

function decodeHtml(buf, contentType) {
  let charset = (/charset=([\w-]+)/i.exec(contentType) || [])[1];
  if (!charset) {
    const head = buf.subarray(0, 4096).toString("latin1");
    charset = (/<meta[^>]+charset=["']?([\w-]+)/i.exec(head) || [])[1];
  }
  charset = (charset || "utf-8").toLowerCase();
  if (["shift-jis", "sjis", "x-sjis", "windows-31j", "cp932"].includes(charset)) charset = "shift_jis";
  try {
    return new TextDecoder(charset).decode(buf);
  } catch {
    return new TextDecoder("utf-8").decode(buf);
  }
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

// 表の構造が分かるよう、セルは " | "、行は改行にして本文だけを残す
export function htmlToText(html) {
  let s = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|noscript|svg|header|footer|nav)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(td|th)>/gi, " | ")
    .replace(/<\/(p|div|tr|li|h[1-6]|table|caption|dt|dd|section|article)>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  s = decodeEntities(s);
  return s
    .split("\n")
    .map(l => l.replace(/[ \t　]+/g, " ").trim())
    .filter(l => l && l !== "|")
    .join("\n") + "\n";
}

export function pdfLinks(html, baseUrl) {
  const base = new URL(baseUrl);
  const links = [];
  const re = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    let url;
    try { url = new URL(decodeEntities(m[1]), base); } catch { continue; }
    if (!/\.pdf($|\?)/i.test(url.pathname + url.search)) continue;
    if (url.hostname !== base.hostname) continue;
    const label = decodeEntities(m[2].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
    if (!PDF_HINT.test(label) && !PDF_HINT.test(url.pathname)) continue;
    if (!links.some(l => l.url === url.href)) links.push({ url: url.href, label });
  }
  return links.slice(0, MAX_PDFS_PER_SOURCE);
}

async function pdfToText(buf) {
  const file = path.join(tmpdir(), `duty-${process.pid}-${Date.now()}.pdf`);
  await writeFile(file, buf);
  try {
    const { stdout } = await run("pdftotext", ["-layout", "-enc", "UTF-8", file, "-"], { maxBuffer: 32 * 1024 * 1024 });
    return stdout;
  } finally {
    await rm(file, { force: true });
  }
}

async function fetchSource(src) {
  const dir = path.join(OUT, src.id);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  const files = [];
  const errors = [];

  const page = await get(src.url);
  const html = decodeHtml(page.buf, page.type);
  const pageText = htmlToText(html);
  await writeFile(path.join(dir, "page.txt"), `# ${src.name}\n# ${page.finalUrl}\n\n${pageText}`);
  files.push({ file: "page.txt", url: page.finalUrl, sha256: sha256(pageText) });

  let n = 0;
  for (const link of pdfLinks(html, page.finalUrl)) {
    n += 1;
    await sleep(1000);
    try {
      const pdf = await get(link.url);
      const text = await pdfToText(pdf.buf);
      const name = `pdf-${n}.txt`;
      await writeFile(path.join(dir, name), `# ${link.label}\n# ${link.url}\n\n${text}`);
      files.push({ file: name, url: link.url, label: link.label, sha256: sha256(text) });
    } catch (e) {
      errors.push(`${link.url}: ${e.message}`);
    }
  }
  await writeFile(path.join(dir, "files.json"), JSON.stringify({ source: src, files, errors }, null, 2) + "\n");
  return { files, errors };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const status = [];
  for (const src of SOURCES) {
    try {
      const { files, errors } = await fetchSource(src);
      status.push({ id: src.id, area: src.area, ok: true, files: files.length, errors });
      console.log(`ok   ${src.id} (${files.length} files${errors.length ? `, ${errors.length} errors` : ""})`);
    } catch (e) {
      status.push({ id: src.id, area: src.area, ok: false, error: e.message });
      console.log(`FAIL ${src.id}: ${e.message}`);
    }
    await sleep(1000);
  }
  await writeFile(path.join(OUT, "status.json"), JSON.stringify({ fetchedAt: new Date().toISOString(), sources: status }, null, 2) + "\n");
  const failed = status.filter(s => !s.ok).length;
  console.log(`${status.length - failed}/${status.length} sources fetched`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
