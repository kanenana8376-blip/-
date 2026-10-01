// 加須市「加須市の休日当番医表」
//   月日 | 当番病院 | 住所 | 電話番号 | 診療科目
//   8月30日(日曜日) | 中田病院 | 加須市元町6番8号 | 0480-61-3122 | 整形外科・内科
// 実施時間は 9:00〜18:00。
import { lines, toHalf, inferYear, ymd, normTel, mapDepts, coverDates, fileUrl } from "./util.mjs";

export default function parse({ texts, files, today }) {
  const ls = lines(texts["page.txt"]);
  if (!ls.includes("午前9時から午後6時まで")) throw new Error("実施時間の記載が想定と違う");
  // 見出しはページに2回出てくるので、表の列名が続く方を使う
  const head = ls.findIndex((l, i) => l === "加須市の休日当番医表" && ls[i + 1] === "月日");
  if (head < 0 || ls.slice(head + 1, head + 6).join(",") !== "月日,当番病院,住所,電話番号,診療科目") throw new Error("表の見出しが想定と違う");
  const source = fileUrl(files, "page.txt");
  const entries = [];
  for (let i = head + 6; i + 4 < ls.length; i += 5) {
    const m = /^(\d{1,2})月(\d{1,2})日\(.曜日\)$/.exec(toHalf(ls[i]));
    if (!m) break;
    const [name, address, tel, subj] = ls.slice(i + 1, i + 5);
    const depts = mapDepts(subj.split("・"));
    if (!depts.length) throw new Error(`診療科目が読めない: ${subj}`);
    entries.push({
      date: ymd(inferYear(+m[1], today), +m[1], +m[2]), name, address, tel: normTel(tel),
      depts, start: "09:00", end: "18:00", note: `休日当番病院。診療科目：${subj}。必ず事前に電話を。`, source,
    });
  }
  if (!entries.length) throw new Error("当番が1件も読み取れない");
  return { entries, coveredDates: coverDates(entries) };
}
