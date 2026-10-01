// 情報元ID（sources.json の id）ごとの読み取り処理。
// ここに登録した情報元だけが emergency-duty.js に反映される。
//
// 読み取り処理は ({ texts, files, source, today }) を受け取り、
//   { entries: [{ date, name, address, tel, depts, start, end, note, source }],
//     coveredDates: ["YYYY-MM-DD", ...] }
// を返す。coveredDates には「その日の当番表を確かに読み取れた日付」だけを入れる。
// 形が想定と違うときは推測せずに例外を投げる（その地域は「情報なし」と表示される）。
//
// まだ各地域の当番表の実物を確認できていないため、登録している処理はない。
// 実物は duty-raw/<id>/ に毎日保存される。

export default {};
