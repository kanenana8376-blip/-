// 所沢市「休日急患当番医一覧（所沢市医師会）」
//   9月6日 / (日) | こぶしクリニック / 内科・糖尿病内科 | こぶし町1番17号101 / 04-2993-5866 | ...
import { lines, toHalf, inferYear, ymd, normTel, mapDepts, coverDates, fileUrl } from "./util.mjs";

export default function parse({ texts, files, today }) {
  const text = texts["page.txt"];
  if (!/診療時間\n午前9時から午後5時/.test(text)) throw new Error("診療時間の記載が想定と違う");
  const ls = lines(text);
  const head = ls.indexOf("休日急患当番医一覧（所沢市医師会）");
  if (head < 0 || ls.slice(head + 1, head + 6).join(",") !== "診療日,診療機関名,診療科目,所在地,電話") {
    throw new Error("当番表の見出しが想定と違う");
  }
  const source = fileUrl(files, "page.txt");
  const entries = [];
  let date = null;
  let i = head + 6;
  for (; i < ls.length;) {
    const l = toHalf(ls[i]);
    const m = /^(\d{1,2})月(\d{1,2})日$/.exec(l);
    if (m) {
      if (!/^\((日|祝|休|月|火|水|木|金|土)\)$/.test(toHalf(ls[i + 1]))) throw new Error(`曜日の行がない: ${l}`);
      date = ymd(inferYear(+m[1], today), +m[1], +m[2]);
      i += 2;
      continue;
    }
    if (/^（注）|^急な発熱/.test(ls[i])) break;
    if (!date) throw new Error(`日付の前に行がある: ${l}`);
    const [name, deptText, address, telText] = ls.slice(i, i + 4);
    if (!/^0\d/.test(toHalf(telText || ""))) throw new Error(`4行1組になっていない: ${name}`);
    const depts = mapDepts(deptText.split("・"));
    const fee = /\(注\)$/.test(toHalf(name));
    if (depts.length) {
      entries.push({
        date, name: name.replace(/[（(]注[)）]$/, ""), address: `所沢市${address}`, tel: normTel(telText),
        depts, start: "09:00", end: "17:00",
        note: `診療科目：${deptText}${fee ? "。紹介状がない場合は選定療養費がかかります" : ""}`,
        source,
      });
    }
    i += 4;
  }
  if (!entries.length) throw new Error("当番が1件も読み取れない");
  return { entries, coveredDates: coverDates(entries) };
}
