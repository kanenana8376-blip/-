// 加須市「休日小児科診療当番医予定表」
//   4月29日 | 水曜日 | 福島小児科医院 | 加須市久下1丁目10-3 | 0480-65-2215 |
// 診療時間は 9:00〜12:00。
import { lines, toHalf, inferYear, ymd, normTel, coverDates, fileUrl } from "./util.mjs";

export default function parse({ texts, files, today }) {
  const ls = lines(texts["page.txt"]);
  const hours = ls.indexOf("診療時間");
  if (hours < 0 || toHalf(ls[hours + 1]) !== "9時から12時") throw new Error("診療時間の記載が想定と違う");
  const head = ls.indexOf("休日小児科診療当番医予定表");
  if (head < 0 || ls.slice(head + 1, head + 6).join(",") !== "月日,曜日,当番医,住所,電話番号") throw new Error("表の見出しが想定と違う");
  const source = fileUrl(files, "page.txt");
  const entries = [];
  for (let i = head + 6; i + 4 < ls.length; i += 5) {
    const m = /^(\d{1,2})月(\d{1,2})日$/.exec(toHalf(ls[i]));
    if (!m) break;
    if (!/曜日$/.test(ls[i + 1])) throw new Error(`曜日の行がない: ${ls[i]}`);
    const [name, address, tel] = ls.slice(i + 2, i + 5);
    entries.push({
      date: ymd(inferYear(+m[1], today), +m[1], +m[2]), name, address, tel: normTel(tel),
      depts: ["小児科"], start: "09:00", end: "12:00",
      note: "休日（午前）小児科診療。当番医は変わることがあるので、受診の際は電話で確認を。", source,
    });
  }
  if (!entries.length) throw new Error("当番が1件も読み取れない");
  return { entries, coveredDates: coverDates(entries) };
}
