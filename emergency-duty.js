// 毎日更新する当番医の情報（emergency-tool.html が読み込む）
// 更新手順は emergency-duty-update.md を参照。
//
// updatedAt : 最後に更新した日時（ISO形式、日本時間）
// coverage  : 日付ごとに、当番情報を確認できた地域ID（emergency-tool.html の AREAS）
//             ここに無い日付・地域は「当番情報なし」と表示される
// entries   : 当番医 1件 = 1日の1時間帯
//   date    : "YYYY-MM-DD"
//   area    : 地域ID
//   name, address, tel
//   depts   : ["内科", "小児科", "外科", "歯科" ...]
//   start, end : "HH:MM"（end が start より前なら翌日まで）
//   note    : 任意
//   source  : 情報元のURL
window.DUTY_DATA = {
  updatedAt: null,
  coverage: {},
  entries: [],
};
