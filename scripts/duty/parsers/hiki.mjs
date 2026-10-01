// 比企医師会「休日在宅当番の予定表」（祝日・振替休日・年末年始のみ。日曜日は当番なし）
//   2026/4/29 | 祝(水) | シャローム病院内、外 | 25-2979 | 東松山市松山1496 |
// 医療機関名の後ろに診療科目の略号が区切りなしで続く。
import { lines, toHalf, ymd, normTel, mapDepts, coverDates, fileUrl } from "./util.mjs";

const TOKEN = "(?:美容皮|心療内|消内|産婦|アレ|小|内|外|整|皮|循|眼|耳|呼)";
const NAME_DEPTS = new RegExp(`^(.*?)(${TOKEN}(?:、${TOKEN})*)$`);

export default function parse({ texts, files }) {
  const text = texts["page.txt"];
  if (!/※診療時間 午前9:00 ～ 午後5:00/.test(text)) throw new Error("診療時間の記載が想定と違う");
  const ls = lines(text);
  const head = ls.indexOf("月日 | 曜日等 | 医療機関名 / 診療科目 | 電話 | 所在地");
  if (head < 0) throw new Error("当番表の見出しが見つからない");
  const source = fileUrl(files, "page.txt");
  const entries = [];
  for (let i = head + 1; i < ls.length && !ls[i].startsWith("※診療時間"); i += 5) {
    const [dateText, dayText, nameText, telText, address] = ls.slice(i, i + 5).map(toHalf);
    const d = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.exec(dateText);
    if (!d || !/^(祝|振替|休)\(.\)$/.test(dayText)) throw new Error(`5行1組になっていない: ${dateText} ${dayText}`);
    const m = NAME_DEPTS.exec(nameText);
    if (!m || !m[1]) throw new Error(`医療機関名と診療科目を分けられない: ${nameText}`);
    const depts = mapDepts(m[2].split("、"));
    if (!depts.length) continue;
    entries.push({
      date: ymd(+d[1], +d[2], +d[3]), name: m[1].trim(), address: address.replace(/^「/, ""),
      tel: normTel(telText, "0493"), depts, start: "09:00", end: "17:00",
      note: `診療科目：${m[2]}`, source,
    });
  }
  if (!entries.length) throw new Error("当番が1件も読み取れない");
  return { entries, coveredDates: coverDates(entries) };
}
