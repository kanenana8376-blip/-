// 本庄市児玉郡医師会「在宅当番医制 当番表」（年度ごとのPDF、2段組み）
//   月 日 医療機関名 電話番号      月 日 医療機関名 電話番号
//    4 /  5 あたご山クリニック 22-8733   10 / 11 本庄皮膚科医院 22-3233
//          12 恵南クリニック   24-0008          12 鈴木外科病院   72-1235
// 外科系（切り傷・打撲など）の当番で、日曜・休日の 9:00〜12:00。
import { toHalf, reiwa, ymd, normTel, mapDepts, coverDates } from "./util.mjs";

const ROW = /(?:(\d{1,2})\s*\/\s*)?(\d{1,2})\s+([^\s\d][^\s]*)\s+(\d{2}-\d{4})/g;

// 医療機関名から診療科を決める。分からなければ外科系当番として「外科」
function deptsOf(name) {
  const d = mapDepts([name.replace(/クリニック|医院|病院/g, "")]).filter(x => x !== "内科");
  return d.length ? d : ["外科"];
}

export default function parse({ texts, files }) {
  const page = texts["page.txt"];
  if (!/外科系疾患の初期救急/.test(page) || !/休日在宅当番医[\s\S]{0,200}診療時間\n午前9時～正午/.test(page)) {
    throw new Error("在宅当番医の説明が想定と違う");
  }
  const pdf = files.find(f => /在宅当番/.test(f.label || ""));
  if (!pdf) throw new Error("在宅当番表のPDFがない");
  const text = toHalf(texts[pdf.file]);
  const fy = /令和(\d+)年度/.exec(text);
  if (!fy) throw new Error("年度が見つからない");
  const year = reiwa(+fy[1]);
  const header = text.split("\n").find(l => /月\s+日\s+医療機関名\s+電話番号\s+月\s+日/.test(l));
  if (!header) throw new Error("表の見出しが見つからない");
  const split = header.indexOf("月", header.indexOf("電話番号"));

  const months = [null, null];
  const entries = [];
  for (const line of text.split("\n")) {
    for (const m of line.matchAll(ROW)) {
      const col = m.index >= split - 4 ? 1 : 0;
      if (m[1]) months[col] = +m[1];
      if (!months[col]) throw new Error(`月が分からない行: ${line.trim()}`);
      const month = months[col];
      const name = m[3];
      entries.push({
        date: ymd(month >= 4 ? year : year + 1, month, +m[2]), name, tel: normTel(m[4], "0495"),
        depts: deptsOf(name), start: "09:00", end: "12:00",
        note: "外科系（切り傷・打撲など）の在宅当番医。当番は変わることがあるので、必ず電話で確認を。",
        source: pdf.url,
      });
    }
  }
  if (entries.length < 40) throw new Error(`当番の件数が少なすぎる（${entries.length}件）`);
  return { entries, coveredDates: coverDates(entries) };
}
