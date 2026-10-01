// 三郷市「小児時間外（初期救急）診療当番表」（半年ごとのPDF。3か月分の暦が横に並ぶ）
//            ４月                         ５月                         ６月
//   1    水   MCクリニック            1   金   あおばファミリー…     1    月   立澤外科胃腸科医院
// 各行の日付がどの月の列かは、月の見出しの文字位置で決める。
// 書かれた曜日が実際の暦と合わなければ読み取りをやめる。
//   医療機関名        … その夜の当番（受付 19:00〜20:30）
//   休日診療所        … その夜は三郷市医師会立休日診療所で診療
//   ☆休日診療所…      … 日曜・祝日の通常の休日診療（固定データで表示するので、ここでは扱わない）
//   調整中            … 当番が決まっていないので「確認できた日」に入れない
//   空欄              … 診療なし（お盆・年末）
// 電話番号と住所は、市のページの「当番医療機関一覧」から引く。
import { lines, toHalf, reiwa, ymd, normTel, coverDates, fileUrl } from "./util.mjs";

const WEEK = "日月火水木金土";
const ROW = /(\d{1,2})\s+([月火水木金土日])(?:\s+([^\s\d]\S*))?/g;

function clinicList(ls) {
  // 医療機関名 | 住所 | 電話番号 の3行ずつ
  const head = ls.indexOf("当番医療機関一覧");
  const cols = ls.indexOf("医療機関名", head);
  if (head < 0 || ls.slice(cols, cols + 3).join(",") !== "医療機関名,住所,電話番号") throw new Error("当番医療機関一覧が想定と違う");
  const list = {};
  for (let i = cols + 3; i + 2 < ls.length && !/^当番医療機関のかかり方/.test(ls[i]); i += 3) {
    const tel = toHalf(ls[i + 2]);
    if (!/^[0-9-]+$/.test(tel)) break;
    list[ls[i].replace(/\(PDFファイル.*$/, "").replace(/（PDFファイル.*$/, "")] = { address: `三郷市${ls[i + 1]}`, tel: normTel(tel, "048") };
  }
  return list;
}

export default function parse({ texts, files }) {
  const ls = lines(texts["page.txt"]);
  if (!ls.map(toHalf).includes("午後7時～午後9時(受付時間:午後7時～午後8時30分)")) throw new Error("受付時間の記載が想定と違う");
  const clinics = clinicList(ls);
  const center = { name: "三郷市医師会立休日診療所", address: "三郷市半田1010", tel: "048-949-1000" };
  const source = fileUrl(files, "page.txt");

  const entries = [];
  const covered = [];
  for (const f of files.filter(x => /^令和\d+年\d{1,2}月～\d{1,2}月/.test(x.label || ""))) {
    const fy = reiwa(+/^令和(\d+)年/.exec(f.label)[1]);
    let cols = null;
    for (const raw of toHalf(texts[f.file]).split("\n")) {
      // 月の見出しの行：列の位置と月を覚える
      const heads = [...raw.matchAll(/(\d{1,2})月/g)];
      if (heads.length >= 2 && !/\d+\s+[月火水木金土日]\s/.test(raw)) {
        cols = heads.map(h => ({ month: +h[1], pos: h.index }));
        continue;
      }
      if (!cols || !/\d{1,2}\s+[月火水木金土日](\s|$)/.test(raw)) continue;
      for (const m of raw.matchAll(ROW)) {
        // いちばん近い列（見出しの位置）の月とする
        const col = cols.reduce((a, c) => Math.abs(c.pos - m.index) < Math.abs(a.pos - m.index) ? c : a);
        const year = col.month >= 4 ? fy : fy + 1;
        const date = ymd(year, col.month, +m[1]);
        const real = WEEK[new Date(`${date}T00:00:00Z`).getUTCDay()];
        if (real !== m[2]) throw new Error(`曜日が暦と合わない: ${date} 表=${m[2]} 暦=${real}`);
        const name = m[3] || "";
        if (name === "調整中") continue;
        covered.push(date);
        if (!name || name.startsWith("☆")) continue;
        const who = name === "休日診療所" ? center : { name, ...clinics[name] };
        if (!who.tel) throw new Error(`電話番号が分からない医療機関: ${name}`);
        entries.push({
          date, name: who.name, address: who.address, tel: who.tel, depts: ["小児科"], start: "19:00", end: "20:30",
          note: name === "休日診療所"
            ? "子どもの夜間の初期救急。この日は休日診療所で診療します。時間は受付時間です（診療は21時まで）。予約制なので必ず電話を。"
            : "子どもの夜間の初期救急の当番です。時間は受付時間です（診療は21時まで）。前もって電話で子どもの状態を伝えてから受診を。",
          source: f.url,
        });
      }
    }
  }
  if (covered.length < 100) throw new Error(`読み取れた日が少なすぎる（${covered.length}日）`);
  const done = new Set(covered);
  const range = coverDates(covered.map(date => ({ date })));
  return { entries, coveredDates: range.filter(d => done.has(d)) };
}
