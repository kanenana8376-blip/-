// 読み取り処理で共通に使う小道具

// 全角の英数字・記号を半角に
export function toHalf(s) {
  return s
    .replace(/[０-９Ａ-Ｚａ-ｚ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[－―‐−]/g, "-")
    .replace(/[（]/g, "(").replace(/[）]/g, ")").replace(/：/g, ":")
    .replace(/　/g, " ");
}

// 行に分け、表のセル区切り " |" を取り除く
export function lines(text) {
  return text.split("\n").map(l => l.replace(/\s*\|\s*$/, "").trim()).filter(Boolean);
}

const pad = n => String(n).padStart(2, "0");
export const ymd = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

// 年が書かれていない「M月D日」の年を、今日に近い方で決める
export function inferYear(month, today) {
  const y = +today.slice(0, 4), m = +today.slice(5, 7);
  if (month < m - 6) return y + 1;
  if (month > m + 6) return y - 1;
  return y;
}

// 和暦（令和）の年を西暦に
export const reiwa = n => 2018 + n;

// 電話番号を "0493-25-2979" の形に。市外局番が省かれていれば areaCode を補う。
export function normTel(raw, areaCode) {
  // 電話番号の中の長音「ー」はハイフンとして扱う
  const s = toHalf(raw).replace(/[☎\s]/g, "").replace(/ー/g, "-").replace(/-+/g, "-");
  if (/^0\d{1,4}-\d{1,4}-\d{3,4}$/.test(s)) return s;
  if (areaCode && /^\d{1,4}-\d{4}$/.test(s)) return `${areaCode}-${s}`;
  throw new Error(`電話番号の形が想定外: ${raw}`);
}

// 当番表の略号・科目名を、ツールの絞り込みで使う診療科に直す
const DEPT_RULES = [
  [/小児|^小$/, "小児科"],
  [/内|^呼$|^循$|^胃$|^消$|糖尿|胃腸|消化/, "内科"],
  [/整形|^整$|^整外$|^外$|外科|形成/, "外科"],
  [/耳鼻|^耳$/, "耳鼻咽喉科"],
  [/眼/, "眼科"],
  [/皮/, "皮膚科"],
  [/産|婦人|レディース/, "産婦人科"],
  [/歯/, "歯科"],
];
export function mapDepts(tokens) {
  const out = [];
  for (const t of tokens) {
    for (const [re, dept] of DEPT_RULES) {
      if (re.test(t) && !out.includes(dept)) out.push(dept);
    }
  }
  return out;
}

// 日付の範囲 [from, to] をすべて列挙
export function dateRange(from, to) {
  const out = [];
  const d = new Date(`${from}T00:00:00Z`), end = new Date(`${to}T00:00:00Z`);
  for (; d <= end; d.setUTCDate(d.getUTCDate() + 1)) out.push(d.toISOString().slice(0, 10));
  return out;
}
export function coverDates(entries) {
  const dates = entries.map(e => e.date).sort();
  return dates.length ? dateRange(dates[0], dates[dates.length - 1]) : [];
}

export function fileUrl(files, name) {
  const f = files.find(x => x.file === name);
  if (!f) throw new Error(`${name} がない`);
  return f.url;
}
