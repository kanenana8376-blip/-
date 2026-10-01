// 毛呂山町「越生町・毛呂山町地区在宅当番医日程表」（年度ごとのPDF、1行1件）
//   1    4月29日   水     昭和の日    街かどのクリニック   ２９８－５３５７ 毛呂山町川角７－１   内科
// 電話番号は市外局番（049）を省いて書かれている。診療時間は 9:00〜12:00。
import { toHalf, reiwa, ymd, normTel, mapDepts, coverDates } from "./util.mjs";

const ROW = /^\s*\d+\s+(\d{1,2})月(\d{1,2})日\s+[月火水木金土日]\s+(.+?)\s+(\d{3}-\d{4})\s+(\S+)\s+(\S+)\s*$/;

export default function parse({ texts, files }) {
  if (!/診療時間は、午前9時から正午までです。/.test(texts["page.txt"])) throw new Error("診療時間の記載が想定と違う");
  const pdf = files.find(f => /在宅当番医日程/.test(f.label || ""));
  if (!pdf) throw new Error("在宅当番医日程のPDFがない");
  const text = toHalf(texts[pdf.file]);
  const fy = /令和\s*(\d+)\s*年度/.exec(text);
  if (!fy) throw new Error("年度が見つからない");
  const year = reiwa(+fy[1]);
  const entries = [];
  for (const line of text.split("\n")) {
    if (!/^\s*\d+\s+\d{1,2}月/.test(line)) continue;
    const m = ROW.exec(line);
    if (!m) throw new Error(`行の形が想定と違う: ${line.trim()}`);
    const [, mo, da, before, tel, address, subj] = m;
    // 祝日名の後ろの最後の語が医療機関名（医療機関名に空白は含まれない）
    const name = before.trim().split(/\s+/).pop();
    const depts = mapDepts(subj.split("・"));
    if (!depts.length) continue;
    entries.push({
      date: ymd(+mo >= 4 ? year : year + 1, +mo, +da), name, address, tel: normTel(tel, "049"),
      depts, start: "09:00", end: "12:00",
      note: `在宅当番医。診療科目：${subj}。急な変更もあるので当日電話で確認を。`, source: pdf.url,
    });
  }
  if (entries.length < 10) throw new Error(`当番の件数が少なすぎる（${entries.length}件）`);
  return { entries, coveredDates: coverDates(entries) };
}
