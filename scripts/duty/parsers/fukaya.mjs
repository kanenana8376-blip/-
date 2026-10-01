// 深谷市「休日・夜間診療」の眼科・耳鼻咽喉科在宅当番医日程
//   10月4日（日曜日） / 清水眼科医院 / 寄居町大字寄居1057－3 / 電話：048－581－0378 / 午前9時～12時 / 午後2時～午後4時
// 診療科は医療機関名（眼科・耳鼻咽喉科）で決める。記載のない日は在宅当番なし。
import { lines, toHalf, inferYear, ymd, normTel, coverDates, fileUrl } from "./util.mjs";

const HOURS = /^(午前|午後)(\d{1,2})時(?:(\d{1,2})分)?～(午前|午後)?(\d{1,2})時(?:(\d{1,2})分)?$/;
const pad = n => String(n).padStart(2, "0");
function hhmm(ampm, h, m) {
  const hour = ampm === "午後" && +h < 12 ? +h + 12 : +h;
  return `${pad(hour)}:${pad(m || 0)}`;
}

export default function parse({ texts, files, today }) {
  const ls = lines(texts["page.txt"]);
  const head = ls.indexOf("眼科・耳鼻咽喉科在宅当番医日程");
  if (head < 0 || ls.slice(head + 1, head + 4).join(",") !== "日程,眼科医療機関名,耳鼻咽喉科医療機関名") throw new Error("当番表の見出しが想定と違う");
  const end = ls.indexOf("記載のない日は、在宅当番はありません。", head);
  if (end < 0) throw new Error("表の終わりが見つからない");
  const source = fileUrl(files, "page.txt");
  const entries = [];
  const dates = [];
  for (let i = head + 4; i < end;) {
    const m = /^(\d{1,2})月(\d{1,2})日\((.)曜日\)$/.exec(toHalf(ls[i]));
    if (!m) throw new Error(`日付の行ではない: ${ls[i]}`);
    const date = ymd(inferYear(+m[1], today), +m[1], +m[2]);
    dates.push({ date });
    const [name, address, telLine] = ls.slice(i + 1, i + 4);
    const dept = /眼科/.test(name) ? "眼科" : /耳鼻/.test(name) ? "耳鼻咽喉科" : null;
    if (!dept || !/^電話:/.test(toHalf(telLine))) throw new Error(`当番の形が想定と違う: ${name}`);
    let j = i + 4;
    const slots = [];
    for (; j < end; j++) {
      const h = HOURS.exec(toHalf(ls[j]));
      if (!h) break;
      slots.push([hhmm(h[1], h[2], h[3]), hhmm(h[4] || h[1], h[5], h[6])]);
    }
    if (!slots.length) throw new Error(`診療時間がない: ${name}`);
    for (const [start, endTime] of slots) {
      entries.push({
        date, name, address: toHalf(address), tel: normTel(toHalf(telLine).slice(3)), depts: [dept], start, end: endTime,
        note: `${dept}の在宅当番医（日曜・祝日）。受診前に必ず電話で確認を。`, source,
      });
    }
    i = j;
  }
  if (!entries.length) throw new Error("当番が1件も読み取れない");
  return { entries, coveredDates: coverDates(dates) };
}
