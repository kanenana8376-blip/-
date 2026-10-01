// 秩父郡市医師会「休日急患当番病医院」の初期救急の表
//   9月27日 | 医師会休日診療所 / (内・小 ※事前に…) / (地図) / 秩父市熊木町 2-19 | 0494-23-8561 | 小鹿野中央病院 / (内) / …
// 医師会休日診療所は 9:00〜17:00（受付16:30まで）、ほかの当番医療機関は 9:00〜18:00。
import { lines, toHalf, inferYear, ymd, normTel, mapDepts, coverDates, fileUrl } from "./util.mjs";

export default function parse({ texts, files, today }) {
  const text = texts["page.txt"];
  if (!/医師会休日診療所の診療時間は午前9時～午後5時まで。（受付終了時間 午後4時30分）/.test(text)
    || !/青字で書かれている、医療機関の診療時間は午前9時～午後6時まで。/.test(text)) {
    throw new Error("診療時間の記載が想定と違う");
  }
  const ls = lines(text);
  const start = ls.findIndex(l => l.startsWith("初期救急医療"));
  const end = ls.findIndex(l => l.startsWith("二次救急医療"));
  if (start < 0 || end < start) throw new Error("初期救急の表が見つからない");
  const head = ls.indexOf("月日", start);
  if (head < 0 || ls.slice(head, head + 4).join(",") !== "月日,医療機関名,所在地,電話番号") throw new Error("表の見出しが想定と違う");

  const source = fileUrl(files, "page.txt");
  const entries = [];
  let date = null;
  for (let i = head + 4; i < end;) {
    const m = /^(\d{1,2})月(\d{1,2})日$/.exec(toHalf(ls[i]));
    if (m) { date = ymd(inferYear(+m[1], today), +m[1], +m[2]); i += 1; continue; }
    if (!date) throw new Error(`日付の前に行がある: ${ls[i]}`);
    const [name, deptText, mapText, address, telText] = ls.slice(i, i + 5);
    const dm = /^\(([^)※]+?)\s*(?:※[^)]*)?\)$/.exec(toHalf(deptText));
    if (!dm || mapText !== "(地図)") throw new Error(`5行1組になっていない: ${name}`);
    const depts = mapDepts(dm[1].split("・").map(s => s.trim()));
    const center = name === "医師会休日診療所";
    if (depts.length) {
      entries.push({
        date, name: center ? "秩父郡市医師会休日診療所" : name, address, tel: normTel(telText),
        depts, start: "09:00", end: center ? "17:00" : "18:00",
        note: center ? "受付は16時30分まで。事前に電話を。" : `診療科目：${dm[1]}。必ず電話で確認してから受診を。`,
        source,
      });
    }
    i += 5;
  }
  if (!entries.length) throw new Error("当番が1件も読み取れない");
  return { entries, coveredDates: coverDates(entries) };
}
