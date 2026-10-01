// 情報元ID（sources.json の id）ごとの読み取り処理。
// ここに登録した情報元だけが emergency-duty.js に反映される。
//
// 読み取り処理は ({ texts, files, source, today }) を受け取り、
//   { entries: [{ date, name, address, tel, depts, start, end, note, source }],
//     coveredDates: ["YYYY-MM-DD", ...] }
// を返す。coveredDates には「その日の当番表を確かに読み取れた日付」だけを入れる。
// 形が想定と違うときは推測せずに例外を投げる（その地域は「情報なし」と表示される）。
// 実物は duty-raw/<id>/ に毎日保存される。
import asaka from "./asaka.mjs";
import chichibu from "./chichibu.mjs";
import hiki from "./hiki.mjs";
import honjo from "./honjo.mjs";
import iruma from "./iruma.mjs";
import jibika from "./jibika.mjs";
import kazo from "./kazo.mjs";
import kazoKodomo from "./kazo-kodomo.mjs";
import moroyama from "./moroyama.mjs";
import yoshikawa from "./yoshikawa.mjs";
import kasukabe from "./kasukabe.mjs";
import kawaguchi from "./kawaguchi.mjs";
import kawaguchiKodomo from "./kawaguchi-kodomo.mjs";
import kuki from "./kuki.mjs";
import sokayashio from "./sokayashio.mjs";
import tokorozawa from "./tokorozawa.mjs";

export default {
  "asaka": asaka,
  "chichibu-ishikai": chichibu,
  "hiki": hiki,
  "honjo": honjo,
  "iruma": iruma,
  "jibika": jibika,
  "kazo": kazo,
  "kazo-kodomo": kazoKodomo,
  "moroyama": moroyama,
  "yoshikawa": yoshikawa,
  "kasukabe": kasukabe,
  "kawaguchi": kawaguchi,
  "fixed-kawaguchi-kodomo": kawaguchiKodomo,
  "kuki": kuki,
  "sokayashio": sokayashio,
  "tokorozawa": tokorozawa,
};
