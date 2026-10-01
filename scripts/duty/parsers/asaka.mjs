// 朝霞地区医師会「朝霞地区四市の日曜・休日当番表」
//   10月の当番医 / 日付 | 施設名・診療科目 | 住所・電話番号
//   4 | くりはら内科クリニック / 内、消内、循内 | 新座市栗原3-10-22 / 042-438-6606 | ...
import { lines, toHalf, inferYear, ymd, normTel, mapDepts, coverDates, fileUrl } from "./util.mjs";

export default function parse({ texts, files, today }) {
  const text = texts["page.txt"];
  if (!/診療時間は午前10時〜午後4時/.test(text)) throw new Error("診療時間の記載が想定と違う");
  const ls = lines(text);
  const head = ls.findIndex(l => /^\d{1,2}月の当番医$/.test(toHalf(l)));
  if (head < 0) throw new Error("「◯月の当番医」が見つからない");
  const month = +toHalf(ls[head]).match(/^(\d+)/)[1];
  const year = inferYear(month, today);
  const end = ls.indexOf("ご利用について", head);
  if (end < 0) throw new Error("表の終わりが見つからない");
  if (ls[head + 1] !== "日付" || ls[head + 2] !== "施設名・診療科目") throw new Error("表の見出しが想定と違う");

  const source = fileUrl(files, "page.txt");
  const entries = [];
  let day = null;
  for (let i = head + 4; i < end;) {
    const l = toHalf(ls[i]);
    if (/^\d{1,2}$/.test(l)) { day = +l; i += 1; continue; }
    if (day === null) throw new Error(`日付の前に行がある: ${l}`);
    const [name, deptText, address, telText] = ls.slice(i, i + 4);
    if (!/^[0-9０-９]/.test(telText || "")) throw new Error(`4行1組になっていない: ${name}`);
    const depts = mapDepts(deptText.split(/[、,]/).map(s => s.trim()));
    if (depts.length) {
      entries.push({
        date: ymd(year, month, day), name, address, tel: normTel(telText),
        depts, start: "10:00", end: "16:00", note: `当番の診療科目：${deptText}（通常と異なる場合あり）`, source,
      });
    }
    i += 4;
  }
  if (!entries.length) throw new Error("当番が1件も読み取れない");
  return { entries, coveredDates: coverDates(entries) };
}
