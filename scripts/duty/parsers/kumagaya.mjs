// 熊谷市「救急医療ガイド」の輪番制病院（大人の一般的疾患・脳疾患）
//   一般的疾患の当番日病院 / 曜日 | 病院 | 電話
//   月曜日 | 第1、第3、第5 | 熊谷外科病院 | 048-521-4115 |   火曜日 | 熊谷総合病院 | 048-521-0065 |
//   脳疾患の当番日病院 / 曜日 | 病院 | 電話 |
//   月曜日・木曜日 | 熊谷総合病院 | 048-521-0065 |
// 受付時間は書かれていないので、時間を決めない当番（allDay）として、今日から14日分を作る。
import { lines, toHalf, ymd, normTel, fileUrl } from "./util.mjs";

const WEEK = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
const DAYS = 14;

function readGeneral(ls) {
  const head = ls.indexOf("一般的疾患の当番日病院");
  if (head < 0 || ls.slice(head + 1, head + 4).join(",") !== "曜日,病院,電話") throw new Error("一般的疾患の表の見出しが想定と違う");
  const rules = [];
  for (let i = head + 4; i < ls.length && WEEK.includes(ls[i]);) {
    const wd = WEEK.indexOf(ls[i]);
    let nth = null;
    let j = i + 1;
    if (/^第\d+(、第\d+)*$/.test(toHalf(ls[j]))) { nth = toHalf(ls[j]).match(/\d/g).map(Number); j += 1; }
    const name = ls[j], tel = ls[j + 1];
    if (!/^0\d/.test(toHalf(tel || ""))) throw new Error(`一般的疾患の行の形が想定と違う: ${ls[i]}`);
    rules.push({ wd, nth, name, tel: normTel(tel) });
    i = j + 2;
  }
  if (rules.length < 7) throw new Error(`一般的疾患の当番が少なすぎる（${rules.length}件）`);
  return rules;
}

function readBrain(ls) {
  const head = ls.indexOf("脳疾患の当番日病院");
  if (head < 0 || ls[head + 1] !== "曜日 | 病院 | 電話") throw new Error("脳疾患の表の見出しが想定と違う");
  const rules = [];
  for (let i = head + 2; i < ls.length; i++) {
    const cells = ls[i].split(" | ");
    if (cells.length !== 3 || !/曜日/.test(cells[0])) break;
    const wds = cells[0].split("・").map(w => WEEK.indexOf(w));
    if (wds.some(w => w < 0)) throw new Error(`脳疾患の曜日が読めない: ${cells[0]}`);
    for (const wd of wds) rules.push({ wd, nth: null, name: cells[1], tel: normTel(cells[2]) });
  }
  if (new Set(rules.map(r => r.wd)).size !== 7) throw new Error("脳疾患の当番がすべての曜日にない");
  return rules;
}

export default function parse({ texts, files, today }) {
  const ls = lines(texts["page.txt"]);
  const updated = (/更新日：(\d{4})年(\d{1,2})月(\d{1,2})日/.exec(texts["page.txt"]) || []).slice(1).join("/");
  const general = readGeneral(ls), brain = readBrain(ls);
  const source = fileUrl(files, "page.txt");
  const entries = [];
  const covered = [];
  for (let k = 0; k < DAYS; k++) {
    const d = new Date(`${today}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + k);
    const wd = d.getUTCDay(), nth = Math.ceil(d.getUTCDate() / 7);
    const date = d.toISOString().slice(0, 10);
    const g = general.filter(r => r.wd === wd && (!r.nth || r.nth.includes(nth)));
    const b = brain.filter(r => r.wd === wd);
    if (g.length !== 1 || b.length !== 1) throw new Error(`${date} の当番が1つに決まらない`);
    entries.push({
      date, allDay: true, name: g[0].name, tel: g[0].tel, depts: ["内科", "外科"],
      note: `大人の一般的な病気の、休日・夜間の当番病院（輪番）です。受付時間は書かれていないので、必ず電話で問い合わせてから。市の表は${updated}更新。`,
      source,
    }, {
      date, allDay: true, name: b[0].name, tel: b[0].tel, depts: ["内科"],
      note: `脳の病気の、休日・夜間の当番病院です。片側の手足のまひ、ろれつが回らない、激しい頭痛などのときは迷わず119番を。市の表は${updated}更新。`,
      source,
    });
    covered.push(date);
  }
  return { entries, coveredDates: covered };
}
