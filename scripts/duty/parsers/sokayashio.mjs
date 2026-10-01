// 草加八潮医師会「草加市の休日当番医」（内科・外科）
//   9月6日（日） | いしどりクリニック / 午前 | 豊田クリニック | 午後 | 草加松原整形外科医院 |
//   9月20日（日） | 石関医院 / さくら整形外科
// 1日分は「内科の医療機関、外科の医療機関」の2行か、
// 「内科の医療機関、午前、外科（午前）、午後、外科（午後）」の5行。
// 診療時間は 午前9時〜12時 / 午後2時〜5時。住所・電話番号は載っていない。
import { lines, toHalf, inferYear, ymd, coverDates, fileUrl } from "./util.mjs";

const AM = ["09:00", "12:00"], PM = ["14:00", "17:00"];

export default function parse({ texts, files, today }) {
  const ls = lines(texts["page.txt"]);
  const head = ls.indexOf("内科・外科休日当番医表");
  const hours = ls.indexOf("午前：9時～12時 / 午後：2時～5時", head);
  if (head < 0 || hours < 0 || ls[hours + 1] !== "内科" || ls[hours + 2] !== "外科") throw new Error("当番表の見出しが想定と違う");
  const end = ls.indexOf("※ 状況により変更する場合もあります", hours);
  if (end < 0) throw new Error("表の終わりが見つからない");

  const source = fileUrl(files, "page.txt");
  const entries = [];
  const add = (date, name, dept, [start, endTime]) => entries.push({
    date, name, address: "草加市", depts: [dept], start, end: endTime,
    note: "住所・電話番号は情報元に載っていません。受診前に医療機関へ電話で確認を。", source,
  });

  let i = hours + 3;
  while (i < end) {
    const m = /^(\d{1,2})月(\d{1,2})日\(/.exec(toHalf(ls[i]));
    if (!m) throw new Error(`日付の行ではない: ${ls[i]}`);
    const date = ymd(inferYear(+m[1], today), +m[1], +m[2]);
    let j = i + 1;
    while (j < end && !/^\d{1,2}月\d{1,2}日\(/.test(toHalf(ls[j]))) j++;
    const cells = ls.slice(i + 1, j);
    if (cells.length === 2) {
      add(date, cells[0], "内科", AM); add(date, cells[0], "内科", PM);
      add(date, cells[1], "外科", AM); add(date, cells[1], "外科", PM);
    } else if (cells.length === 5 && cells[1] === "午前" && cells[3] === "午後") {
      add(date, cells[0], "内科", AM); add(date, cells[0], "内科", PM);
      add(date, cells[2], "外科", AM); add(date, cells[4], "外科", PM);
    } else {
      throw new Error(`1日分の形が想定と違う: ${ls[i]} ${cells.join(" / ")}`);
    }
    i = j;
  }
  if (!entries.length) throw new Error("当番が1件も読み取れない");
  return { entries, coveredDates: coverDates(entries) };
}
