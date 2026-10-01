// 川口市「日曜祝日当番医当番表」
//   月日 | 病院・診療所名 | 診療科目 | 所在地 | 電話番号
//   9月27日（日曜日） | 東川口病院 | 内科系・外科系 | 東川口2-10-8 | 048-295-1000 | …
// 診療時間は 9時〜17時（途中に休憩あり）。
import { lines, toHalf, inferYear, ymd, normTel, mapDepts, coverDates } from "./util.mjs";

export default function parse({ texts, files, today }) {
  const f = files.find(x => x.label === "日曜祝日当番医当番表");
  if (!f) throw new Error("当番表のページがない");
  const ls = lines(texts[f.file]);
  if (!ls.includes("診療時間は9時〜17時となっております。(うち休憩時間があります。)")) throw new Error("診療時間の記載が想定と違う");
  const head = ls.indexOf("月日");
  if (head < 0 || ls.slice(head, head + 5).join(",") !== "月日,病院・診療所名,診療科目,所在地,電話番号") throw new Error("表の見出しが想定と違う");
  const entries = [];
  let date = null;
  for (let i = head + 5; i < ls.length;) {
    if (/^※「リハ」|^関連リンク/.test(ls[i])) break;
    const m = /^(\d{1,2})月(\d{1,2})日[(（]/.exec(toHalf(ls[i]));
    if (m) { date = ymd(inferYear(+m[1], today), +m[1], +m[2]); i += 1; continue; }
    if (!date) throw new Error(`日付の前に行がある: ${ls[i]}`);
    const [name, subj, addr, tel] = ls.slice(i, i + 4);
    if (!/^0\d/.test(toHalf(tel || ""))) throw new Error(`4行1組になっていない: ${name}`);
    const depts = mapDepts(subj.split("・").map(s => s.replace(/系$/, "")));
    if (depts.length) {
      entries.push({
        date, name, address: `川口市${addr}`, tel: normTel(tel), depts, start: "09:00", end: "17:00",
        note: `診療科目：${subj}。途中に休憩時間があります。必ず事前に電話を。`, source: f.url,
      });
    }
    i += 4;
  }
  if (!entries.length) throw new Error("当番が1件も読み取れない");
  return { entries, coveredDates: coverDates(entries) };
}
