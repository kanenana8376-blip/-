// 久喜市「休日診療のお知らせ」の令和◯年度の診療予定
//   令和8年10月4日（日曜） | 新久喜総合病院 | 扶顛堂たかぎクリニック |
// 時間は 9:00〜12:00。電話番号は同じページの「休日診療実施医療機関」から引く。
import { lines, toHalf, reiwa, ymd, normTel, coverDates, fileUrl } from "./util.mjs";

export default function parse({ texts, files }) {
  const ls = lines(texts["page.txt"]);
  // 実施医療機関の一覧：名前 / 科目 / 科目名 / 連絡先 / 電話 / 診療日 / … / 診療時間 / 午前9時から正午
  const tel = {};
  const listHead = ls.indexOf("休日診療実施医療機関");
  if (listHead < 0) throw new Error("実施医療機関の一覧が見つからない");
  for (let i = listHead + 1; i < ls.length && ls[i] !== "令和8年度の診療予定" && !/年度の診療予定$/.test(ls[i]); i++) {
    if (ls[i + 1] === "科目" && ls[i + 3] === "連絡先") {
      tel[ls[i]] = normTel(ls[i + 4]);
      const hours = ls.indexOf("診療時間", i);
      if (ls[hours + 1] !== "午前9時から正午") throw new Error(`診療時間が想定と違う: ${ls[i]}`);
    }
  }
  if (Object.keys(tel).length < 2) throw new Error("実施医療機関の電話番号が読み取れない");

  const head = ls.findIndex(l => /年度の診療予定$/.test(l));
  if (head < 0 || ls.slice(head + 1, head + 4).join(",") !== "診療日,内科,小児科") throw new Error("診療予定の見出しが想定と違う");
  const source = fileUrl(files, "page.txt");
  const entries = [];
  for (let i = head + 4; i + 2 < ls.length; i += 3) {
    const m = /^令和(\d+)年(\d{1,2})月(\d{1,2})日/.exec(toHalf(ls[i]));
    if (!m) break;
    const date = ymd(reiwa(+m[1]), +m[2], +m[3]);
    for (const [name, dept] of [[ls[i + 1], "内科"], [ls[i + 2], "小児科"]]) {
      if (!tel[name]) throw new Error(`電話番号が分からない医療機関: ${name}`);
      entries.push({
        date, name, tel: tel[name], depts: [dept], start: "09:00", end: "12:00",
        note: dept === "小児科" && name.includes("たかぎ") ? "予約受付は8時〜11時30分。受診前に必ず電話を。" : "受診前に必ず電話を。",
        source,
      });
    }
  }
  if (!entries.length) throw new Error("当番が1件も読み取れない");
  return { entries, coveredDates: coverDates(entries) };
}
