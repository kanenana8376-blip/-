// 入間市「休日当番病院一覧表」
//   10月4日 / （日曜日） | 小林病院 | 内科 | 宮寺2417 | 04-2934-5121 | 豊岡整形外科病院 | 外科 | …
// 表の結合のせいで、診療科目が抜けた行や、病院名が抜けた行がある。
// 形が揃わない日は推測せずに丸ごと使わない（その日は「確認できた日」に入れない）。
// 診療時間は 9:00〜12:00、13:00〜17:00。
import { lines, toHalf, inferYear, ymd, normTel, mapDepts, coverDates, fileUrl } from "./util.mjs";

export default function parse({ texts, files, today }) {
  const ls = lines(texts["page.txt"]);
  if (!ls.includes("午前9時から12時、午後1時から5時まで")) throw new Error("診療時間の記載が想定と違う");
  const head = ls.indexOf("診療日別病院一覧表");
  if (head < 0 || ls.slice(head + 1, head + 6).join(",") !== "診療日,病院名,診療科目,所在地,電話") throw new Error("表の見出しが想定と違う");
  const end = ls.findIndex((l, i) => i > head && /^メールで/.test(l));
  const source = fileUrl(files, "page.txt");

  // 日付ごとに行を集める
  const days = [];
  for (let i = head + 6; i < (end < 0 ? ls.length : end); i++) {
    const l = toHalf(ls[i]);
    const m = /^(\d{1,2})月(\d{1,2})日$/.exec(l);
    if (m) { days.push({ date: ymd(inferYear(+m[1], today), +m[1], +m[2]), cells: [] }); continue; }
    if (/^\(.+\)$/.test(l)) continue; // （日曜日）（祝）など
    if (!days.length) throw new Error(`日付の前に行がある: ${l}`);
    days[days.length - 1].cells.push(ls[i]);
  }

  const entries = [];
  const covered = [];
  for (const day of days) {
    const groups = [];
    let cur = [];
    for (const c of day.cells) {
      cur.push(c);
      if (/^0\d/.test(toHalf(c))) { groups.push(cur); cur = []; }
    }
    // 電話番号で終わらない行が残る、または3〜4行にならない組がある日は使わない
    if (cur.length || !groups.length || groups.some(g => g.length < 3 || g.length > 4)) continue;
    const mine = groups.map(g => {
      const [name, ...rest] = g;
      const tel = rest.pop();
      const address = rest.pop();
      const subj = rest[0];
      const depts = subj ? mapDepts([subj]) : ["内科", "外科"];
      return {
        date: day.date, name, address: `入間市${address}`, tel: normTel(tel), depts,
        note: subj ? `診療科目：${subj}。休診時間があるので必ず事前に問い合わせを。` : "診療科目は表に書かれていないので、必ず事前に問い合わせを。",
        source,
      };
    });
    if (mine.some(e => !e.depts.length || /\d/.test(e.name))) continue;
    for (const e of mine) {
      entries.push({ ...e, start: "09:00", end: "12:00" }, { ...e, start: "13:00", end: "17:00" });
    }
    covered.push(day.date);
  }
  if (!entries.length) throw new Error("当番が1件も読み取れない");
  // 表の期間（最初の日〜最後の日）のうち、読み取れなかった日だけを除く
  const skipped = new Set(days.map(d => d.date).filter(d => !covered.includes(d)));
  const range = coverDates(days.map(d => ({ date: d.date })));
  return { entries, coveredDates: range.filter(d => !skipped.has(d)) };
}
