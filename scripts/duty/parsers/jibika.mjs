// 埼玉県「耳鼻咽喉科 休日救急診療」の当番表（半年ごとのPDF。東地区・西地区の2段組み）
//   令和8年10月・11月の当番表
//   ４日 日 彩の国東大宮メディカルセンター さいたま市北区土呂町１５２２ 048-665-6111 坂戸八幡耳鼻咽喉科クリニック 坂戸市… 049-284-8734
// 住所は折り返して前後の行にはみ出すことがあるので、空行で区切った1日分の塊ごとに読む。
// 東地区の医療機関名は日付の行の曜日の直後、西地区の医療機関名は1つ目の電話番号の直後にある。
// 診察時間は 9:00〜17:00。県内全域（area: "all"）として扱う。
import { toHalf, reiwa, ymd, normTel, coverDates } from "./util.mjs";

const TEL = /0\d{1,4}-\d{1,4}-\d{3,4}/g;
const CLINIC = /科|医院|クリニック|病院|診療所|センター/;
// 医療機関名と住所が空白なしでつながっていることがあるので、市町村名の手前で切る
const PLACES = ["さいたま市", "川越市", "熊谷市", "川口市", "行田市", "秩父市", "所沢市", "飯能市", "加須市", "本庄市",
  "東松山市", "春日部市", "狭山市", "羽生市", "鴻巣市", "深谷市", "上尾市", "草加市", "越谷市", "蕨市", "戸田市",
  "入間市", "朝霞市", "志木市", "和光市", "新座市", "桶川市", "久喜市", "北本市", "八潮市", "富士見市", "三郷市",
  "蓮田市", "坂戸市", "幸手市", "鶴ヶ島市", "日高市", "吉川市", "ふじみ野市", "白岡市", "北足立郡", "入間郡", "比企郡",
  "秩父郡", "児玉郡", "大里郡", "南埼玉郡", "北葛飾郡", "伊奈町", "三芳町", "毛呂山町", "越生町", "滑川町", "嵐山町",
  "小川町", "川島町", "吉見町", "鳩山町", "ときがわ町", "横瀬町", "皆野町", "長瀞町", "小鹿野町", "美里町", "神川町",
  "上里町", "寄居町", "宮代町", "杉戸町", "松伏町"];
function cutName(token) {
  let cut = token.length;
  for (const p of PLACES) {
    const i = token.indexOf(p);
    if (i > 0 && i < cut) cut = i;
  }
  return token.slice(0, cut);
}

// 空行で区切った塊に分け、1つの塊に日付の行が2つ以上あればそこでも分ける
// （日付の行より前にはみ出した住所の行は、その塊の最初の日に含める）
const DATE_LINE = /^\s*(?:\d{1,2}月\s*)?\d{1,2}日\s+[月火水木金土日]\s/;
function blocks(text) {
  const out = [];
  for (const block of text.split(/\n\s*\n/)) {
    let cur = [];
    let seenDate = false;
    for (const line of block.split("\n")) {
      if (DATE_LINE.test(line) && seenDate) { out.push(cur.join(" ")); cur = []; }
      if (DATE_LINE.test(line)) seenDate = true;
      cur.push(line);
    }
    out.push(cur.join(" "));
  }
  return out.map(b => b.replace(/\s+/g, " "));
}

function parseTable(text, source) {
  const head = /令和(\d+)年(\d{1,2})月・(?:令和(\d+)年)?(\d{1,2})月の当番表/.exec(text);
  if (!head) throw new Error("当番表の見出しが想定と違う");
  const y1 = reiwa(+head[1]), m1 = +head[2], m2 = +head[4];
  const y2 = head[3] ? reiwa(+head[3]) : (m2 < m1 ? y1 + 1 : y1);
  const entries = [];
  let month = m1, year = y1, lastDay = 0;
  for (const flat of blocks(text.slice(head.index))) {
    const d = /(?:^| )(?:\d{1,2}月 )?(\d{1,2})日 ([月火水木金土日]) (\S+)/.exec(flat);
    if (!d) continue;
    const day = +d[1];
    if (day < lastDay) { month = m2; year = y2; }
    lastDay = day;
    const tels = [...flat.matchAll(TEL)];
    if (tels.length !== 2) throw new Error(`電話番号が2つない: ${flat.slice(0, 60)}`);
    const east = cutName(d[3]);
    const west = cutName(flat.slice(tels[0].index + tels[0][0].length).trim().split(" ")[0]);
    // 東西で同じ医療機関のとき（元日など）は1件にする
    const pair = east === west ? [[east, tels[0][0], "東・西"]] : [[east, tels[0][0], "東"], [west, tels[1][0], "西"]];
    for (const [name, tel, side] of pair) {
      if (!CLINIC.test(name) || /\d/.test(name)) throw new Error(`医療機関名が読めない: ${name}`);
      entries.push({
        date: ymd(year, month, day), name, tel: normTel(tel), depts: ["耳鼻咽喉科"], start: "09:00", end: "17:00",
        note: `耳鼻咽喉科の休日救急（県の${side}地区の当番）。当番が変わることもあるので、必ず事前に電話を。`, source,
      });
    }
  }
  if (!entries.length) throw new Error("当番が1件も読み取れない");
  return entries;
}

export default function parse({ texts, files }) {
  const pdfs = files.filter(f => /^当番表（/.test(f.label || ""));
  if (!pdfs.length) throw new Error("当番表のPDFがない");
  const entries = [];
  for (const f of pdfs) {
    const text = toHalf(texts[f.file]);
    if (!/診察時間:9:00 ～ 17:00/.test(text)) throw new Error("診察時間の記載が想定と違う");
    // 1つのPDFに2か月ごとの表が複数入っている
    const parts = text.split(/(?=令和\d+年\d{1,2}月・(?:令和\d+年)?\d{1,2}月の当番表)/).filter(p => /^令和\d+年\d{1,2}月・/.test(p));
    for (const part of parts) entries.push(...parseTable(part, f.url));
  }
  return { entries, coveredDates: coverDates(entries) };
}
