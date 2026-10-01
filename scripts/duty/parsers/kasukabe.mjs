// 春日部市「春日部市休日当番医・休日当番薬局（10月4日）」（日付ごとのページ）
//   診療時間は、午前9時～正午、午後2時～午後5時です
//   （内科系）みくに中央クリニック / 所在地：春日部市中央1-56-18 / 電話：048-737-5400 / 診療科目：内科
import { lines, toHalf, inferYear, ymd, normTel, mapDepts, coverDates } from "./util.mjs";

const KIND = { "内科系": "内科", "小児科系": "小児科", "外科系": "外科" };

export default function parse({ texts, files, today }) {
  const pages = files.filter(f => /^link-\d+\.txt$/.test(f.file) && /休日当番医.*（\d{1,2}月\d{1,2}日）$/.test(f.label || ""));
  if (!pages.length) throw new Error("日付ごとの当番ページがない");
  const entries = [];
  for (const f of pages) {
    const [, mo, da] = /（(\d{1,2})月(\d{1,2})日）$/.exec(f.label).map(Number);
    const date = ymd(inferYear(mo, today), mo, da);
    const ls = lines(texts[f.file]);
    if (!ls.includes("診療時間は、午前9時～正午、午後2時～午後5時です")) throw new Error(`診療時間の記載が想定と違う: ${f.label}`);
    const intro = ls.findIndex(l => l.startsWith("休日当番医は、"));
    const start = intro < 0 ? -1 : ls.indexOf("休日当番医", intro);
    const end = start < 0 ? -1 : ls.indexOf("休日当番薬局", start);
    if (start < 0 || end < start) throw new Error(`当番医の欄が見つからない: ${f.label}`);
    let n = 0;
    for (let i = start; i < end; i++) {
      const m = /^（(内科系|小児科系|外科系)）(.+)$/.exec(ls[i]);
      if (!m) continue;
      const [addr, tel, subj] = ls.slice(i + 1, i + 4);
      if (!addr.startsWith("所在地：") || !tel.startsWith("電話：") || !subj.startsWith("診療科目：")) {
        throw new Error(`当番医の形が想定と違う: ${ls[i]}`);
      }
      const subjects = subj.slice(5);
      const depts = [KIND[m[1]], ...mapDepts(subjects.split("、"))].filter((d, k, a) => a.indexOf(d) === k);
      for (const [s, e] of [["09:00", "12:00"], ["14:00", "17:00"]]) {
        entries.push({
          date, name: m[2], address: toHalf(addr.slice(4)), tel: normTel(tel.slice(3)), depts, start: s, end: e,
          note: `${m[1]}の当番。診療科目：${subjects}。受付時間は医療機関により異なるので、必ず電話を。`, source: f.url,
        });
      }
      n += 1;
    }
    if (!n) throw new Error(`当番医が読み取れない: ${f.label}`);
  }
  // 当番ページがある日だけを「確認できた日」とし、その間の平日も当番なしとして扱う
  return { entries, coveredDates: coverDates(entries) };
}
