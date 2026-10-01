// 吉川市「小児の初期救急に関する情報」の平日夜間の小児時間外診療の当番
//   9月 / 24日（木曜日）さくら医院、電話：048-982-5511、吉川市中央3-16-12 / 26日（土曜日）診療はありません
// 受付は月〜金曜日の19時〜21時。
import { lines, toHalf, inferYear, ymd, normTel, coverDates } from "./util.mjs";

export default function parse({ texts, files, today }) {
  const f = files.find(x => /^小児の初期救急に関する情報/.test(x.label || ""));
  if (!f) throw new Error("小児の初期救急のページがない");
  const ls = lines(texts[f.file]).map(toHalf);
  if (!ls.includes("月曜日から金曜日の午後7時から午後9時まで(診療時間:午後9時30分まで)")) throw new Error("受付時間の記載が想定と違う");
  const entries = [];
  const covered = [];
  let month = null;
  for (const l of ls) {
    const mh = /^(\d{1,2})月​?$/.exec(l);
    if (mh) { month = +mh[1]; continue; }
    const m = /^(\d{1,2})日\((.)曜日\)(.*)$/.exec(l);
    if (!m) continue;
    if (!month) throw new Error(`月が分からない行: ${l}`);
    const date = ymd(inferYear(month, today), month, +m[1]);
    covered.push(date);
    if (m[3] === "診療はありません") continue;
    const r = /^(.+?)、電話:([\d-]+)、(.+)$/.exec(m[3]);
    if (!r) throw new Error(`当番の形が想定と違う: ${l}`);
    entries.push({
      date, name: r[1], address: r[3], tel: normTel(r[2]), depts: ["小児科"], start: "19:00", end: "21:00",
      note: "平日夜間の小児時間外（初期救急）診療。時間は受付時間です（診療は21時30分まで）。前もって電話で子どもの状態を伝えてから受診を。",
      source: f.url,
    });
  }
  if (!covered.length) throw new Error("当番が1件も読み取れない");
  return { entries, coveredDates: coverDates(covered.map(date => ({ date }))) };
}
