// 坂戸鶴ヶ島医師会「令和◯年度眼科在宅当番表」（年度ごとのPDF）
//   4 月 19 日    櫻井   裕         若葉・さくらいクリニック
//   医療機関の住所・電話番号 / 坂戸眼科医院  049-283-4303  坂戸市関間1-1-15
// 診療時間は 9:00〜17:00（休憩時間を含む）。月に1回の日曜日と、連休・年末年始の1日。
import { toHalf, reiwa, ymd, coverDates } from "./util.mjs";

export default function parse({ texts, files }) {
  if (!/診療時間：午前9時から午後5時（休憩時間を含む）/.test(texts["page.txt"])) throw new Error("診療時間の記載が想定と違う");
  const pdf = files.find(f => /眼科在宅当番表/.test(f.label || ""));
  if (!pdf) throw new Error("眼科在宅当番表のPDFがない");
  const text = toHalf(texts[pdf.file]);
  const fy = /令和(\d+)年度眼科在宅当番表/.exec(text);
  if (!fy) throw new Error("年度が見つからない");
  const year = reiwa(+fy[1]);
  const [table, list] = text.split("医療機関の住所・電話番号");
  if (!list) throw new Error("住所・電話番号の一覧がない");
  const clinics = {};
  for (const l of list.split("\n")) {
    const m = /^\s*(\S+)\s+(0\d{1,4}-\d{1,4}-\d{4})\s+(.+?)\s*$/.exec(l);
    if (m) clinics[m[1]] = { tel: m[2], address: m[3] };
  }
  const entries = [];
  for (const l of table.split("\n")) {
    const m = /^\s*(?:◎\s+)?(\d{1,2})\s*月\s*(\d{1,2})\s*日\s+.+\s(\S+)\s*$/.exec(l);
    if (!m) continue;
    const c = clinics[m[3]];
    if (!c) throw new Error(`住所・電話番号が分からない医療機関: ${m[3]}`);
    entries.push({
      date: ymd(+m[1] >= 4 ? year : year + 1, +m[1], +m[2]), name: m[3], address: c.address, tel: c.tel,
      depts: ["眼科"], start: "09:00", end: "17:00",
      note: "坂戸鶴ヶ島医師会の眼科在宅当番（休憩時間あり）。受診前に必ず電話で確認を。", source: pdf.url,
    });
  }
  if (entries.length < 8) throw new Error(`当番の件数が少なすぎる（${entries.length}件）`);
  return { entries, coveredDates: coverDates(entries) };
}
