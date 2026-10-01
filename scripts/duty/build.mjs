// duty-raw/ に保存した当番表の文字から当番医を取り出し、emergency-duty.js を書き出す。
// 地域ごとの読み取り処理は parsers/ にあり、parsers/index.mjs に登録したものだけが使われる。
//
// 使い方: node scripts/duty/build.mjs [duty-raw のディレクトリ] [出力ファイル]
//
// 安全のため:
// - 読み取り処理が失敗した、または形式のおかしい当番を1件でも返した情報元は、丸ごと使わない
//   （その地域は画面で「当番情報なし」になり、#7119 へ案内される）。
// - 今日から7日分だけを書き出す。

import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import parsers from "./parsers/index.mjs";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const RAW = process.argv[2] || path.join(HERE, "../../duty-raw");
const OUT = process.argv[3] || path.join(HERE, "../../emergency-duty.js");
const DAYS = 7;
const DEPTS = new Set(["内科", "小児科", "外科", "整形外科", "歯科", "耳鼻咽喉科", "眼科", "皮膚科", "産婦人科", "精神科"]);

// 日本時間の日付 "YYYY-MM-DD"
export function jstDate(d = new Date(), addDays = 0) {
  const t = new Date(d.getTime() + 9 * 3600 * 1000 + addDays * 86400 * 1000);
  return t.toISOString().slice(0, 10);
}
function jstIso(d = new Date()) {
  return new Date(d.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 19) + "+09:00";
}

export function checkEntry(e) {
  const bad = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date || "")) bad.push("date");
  if (!e.name || typeof e.name !== "string") bad.push("name");
  if (!Array.isArray(e.depts) || !e.depts.length || !e.depts.every(d => DEPTS.has(d))) bad.push("depts");
  for (const k of ["start", "end"]) {
    const m = /^(\d{2}):(\d{2})$/.exec(e[k] || "");
    if (!m || +m[1] > 23 || +m[2] > 59) bad.push(k);
  }
  if (e.tel && !/^[0-9][0-9-]{8,13}$/.test(e.tel)) bad.push("tel");
  if (!/^https?:\/\//.test(e.source || "")) bad.push("source");
  return bad;
}

async function loadSource(id) {
  const dir = path.join(RAW, id);
  const meta = JSON.parse(await readFile(path.join(dir, "files.json"), "utf8"));
  const texts = {};
  for (const name of await readdir(dir)) {
    if (name.endsWith(".txt")) texts[name] = await readFile(path.join(dir, name), "utf8");
  }
  return { meta, texts };
}

async function main() {
  const now = new Date();
  const today = jstDate(now);
  const inWindow = new Set(Array.from({ length: DAYS }, (_, i) => jstDate(now, i)));
  const sources = JSON.parse(await readFile(path.join(HERE, "sources.json"), "utf8"));

  const entries = [];
  const coverage = {};
  for (const src of sources) {
    const parse = parsers[src.id];
    if (!parse) continue;
    let result;
    try {
      const { meta, texts } = await loadSource(src.id);
      result = parse({ texts, files: meta.files, source: src, today });
    } catch (e) {
      console.log(`SKIP ${src.id}: ${e.message}`);
      continue;
    }
    const mine = (result.entries || []).map(e => ({ area: src.area, ...e }));
    const problems = mine.map(e => [e, checkEntry(e)]).filter(([, bad]) => bad.length);
    if (problems.length) {
      console.log(`SKIP ${src.id}: ${problems.length} invalid entries, e.g. ${JSON.stringify(problems[0][0])} (${problems[0][1].join(",")})`);
      continue;
    }
    const covered = (result.coveredDates || []).filter(d => inWindow.has(d));
    entries.push(...mine.filter(e => inWindow.has(e.date)));
    for (const d of covered) {
      coverage[d] = coverage[d] || [];
      if (!coverage[d].includes(src.area)) coverage[d].push(src.area);
    }
    console.log(`ok   ${src.id}: ${mine.filter(e => inWindow.has(e.date)).length} entries, ${covered.length} days`);
  }

  entries.sort((a, b) => (a.date + a.start + a.area).localeCompare(b.date + b.start + b.area));
  const data = { updatedAt: jstIso(now), coverage, entries };
  const body = `// 毎日更新する当番医の情報（emergency-tool.html が読み込む）
// このファイルは scripts/duty/build.mjs が自動で書き出す。手で直さないこと。
// 形式の説明は emergency-duty-update.md を参照。
window.DUTY_DATA = ${JSON.stringify(data, null, 2)};
`;
  await writeFile(OUT, body);
  console.log(`${entries.length} entries written for ${today}`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
