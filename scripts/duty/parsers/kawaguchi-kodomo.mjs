// 川口市「小児夜間救急診療について」の小児夜間救急診療当番医
// （川口市こども夜間救急診療所が閉まった後、翌朝8時までの当番病院）
//   月日 | 曜日 | 診療時間 | 医療機関名 | 電話番号 | 所在地
//   9月25日 | 金 | 23:00～翌8:00 | 埼玉協同病院 | 0570-00-4771 | 木曽呂1317
import { lines, toHalf, inferYear, ymd, normTel, coverDates, fileUrl } from "./util.mjs";

export default function parse({ texts, files, today }) {
  const ls = lines(texts["page.txt"]);
  const title = ls.findIndex(l => /^小児夜間救急診療当番医$/.test(l));
  const head = title < 0 ? -1 : ls.indexOf("月日", title);
  if (head < 0 || ls.slice(head, head + 6).join(",") !== "月日,曜日,診療時間,医療機関名,電話番号,所在地") {
    throw new Error("当番表の見出しが想定と違う");
  }
  const source = fileUrl(files, "page.txt");
  const entries = [];
  const seen = new Set();
  for (let i = head + 6; i + 5 < ls.length; i += 6) {
    const [dateText, dow, hours, name, tel, addr] = ls.slice(i, i + 6).map(toHalf);
    const d = /^(\d{1,2})月(\d{1,2})日$/.exec(dateText);
    if (!d) break;
    if (!/^[月火水木金土日祝休]$/.test(dow)) throw new Error(`曜日が想定と違う: ${dateText} ${dow}`);
    const h = /^(\d{1,2}):(\d{2})～翌(\d{1,2}):(\d{2})$/.exec(hours);
    if (!h) throw new Error(`診療時間が想定と違う: ${hours}`);
    const date = ymd(inferYear(+d[1], today), +d[1], +d[2]);
    // 表の終わりに同じ日付が重複して載ることがある
    const key = `${date} ${name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const pad = n => String(n).padStart(2, "0");
    entries.push({
      date, name, address: `川口市${addr}`, tel: normTel(tel), depts: ["小児科"],
      start: `${pad(h[1])}:${h[2]}`, end: `${pad(h[3])}:${h[4]}`,
      note: "川口市こども夜間救急診療所が閉まった後の、子どもの夜間救急の当番病院です。入院患者の診療中で待つことがあります。受診前に必ず電話を。",
      source,
    });
  }
  if (!entries.length) throw new Error("当番が1件も読み取れない");
  return { entries, coveredDates: coverDates(entries) };
}
