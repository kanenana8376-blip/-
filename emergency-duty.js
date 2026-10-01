// 毎日更新する当番医の情報（emergency-tool.html が読み込む）
// このファイルは scripts/duty/build.mjs が自動で書き出す。手で直さないこと。
// 形式の説明は emergency-duty-update.md を参照。
window.DUTY_DATA = {
  "updatedAt": "2026-10-01T23:08:36+09:00",
  "areas": [
    "kawaguchi",
    "asaka",
    "tokorozawa",
    "hiki",
    "soka",
    "kasukabe",
    "kuki",
    "honjo",
    "chichibu",
    "sayama",
    "sakado",
    "misato",
    "kazo",
    "all"
  ],
  "coverage": {
    "2026-10-01": [
      "kawaguchi",
      "tokorozawa",
      "hiki",
      "soka",
      "honjo",
      "chichibu",
      "sakado",
      "misato",
      "kazo",
      "all"
    ],
    "2026-10-02": [
      "kawaguchi",
      "tokorozawa",
      "hiki",
      "soka",
      "honjo",
      "chichibu",
      "sakado",
      "misato",
      "kazo",
      "all"
    ],
    "2026-10-03": [
      "kawaguchi",
      "tokorozawa",
      "hiki",
      "soka",
      "honjo",
      "chichibu",
      "sakado",
      "misato",
      "kazo",
      "all"
    ],
    "2026-10-04": [
      "kawaguchi",
      "asaka",
      "tokorozawa",
      "hiki",
      "soka",
      "kasukabe",
      "kuki",
      "honjo",
      "chichibu",
      "sayama",
      "sakado",
      "misato",
      "kazo",
      "all"
    ],
    "2026-10-05": [
      "kawaguchi",
      "asaka",
      "hiki",
      "soka",
      "kasukabe",
      "kuki",
      "honjo",
      "chichibu",
      "sayama",
      "sakado",
      "misato",
      "kazo",
      "all"
    ],
    "2026-10-06": [
      "kawaguchi",
      "asaka",
      "hiki",
      "soka",
      "kasukabe",
      "kuki",
      "honjo",
      "chichibu",
      "sayama",
      "sakado",
      "misato",
      "kazo",
      "all"
    ],
    "2026-10-07": [
      "kawaguchi",
      "asaka",
      "hiki",
      "soka",
      "kasukabe",
      "kuki",
      "honjo",
      "chichibu",
      "sayama",
      "sakado",
      "misato",
      "kazo",
      "all"
    ]
  },
  "entries": [
    {
      "area": "misato",
      "date": "2026-10-01",
      "name": "津田医院",
      "address": "松伏町松伏3432",
      "tel": "048-993-3111",
      "depts": [
        "小児科"
      ],
      "start": "19:00",
      "end": "21:00",
      "note": "平日夜間の小児時間外（初期救急）診療。時間は受付時間です（診療は21時30分まで）。前もって電話で子どもの状態を伝えてから受診を。",
      "source": "https://www.city.yoshikawa.saitama.jp/index.cfm/24,447,137,767,html"
    },
    {
      "area": "kawaguchi",
      "date": "2026-10-01",
      "name": "川口市立医療センター",
      "address": "川口市西新井宿180",
      "tel": "048-287-2525",
      "depts": [
        "小児科"
      ],
      "start": "23:00",
      "end": "08:00",
      "note": "川口市こども夜間救急診療所が閉まった後の、子どもの夜間救急の当番病院です。入院患者の診療中で待つことがあります。受診前に必ず電話を。",
      "source": "https://www.city.kawaguchi.lg.jp/soshiki/01090/010/4/1/5712.html"
    },
    {
      "area": "misato",
      "date": "2026-10-02",
      "name": "秋本小児科アレルギー科医院",
      "address": "吉川市保1-3-7 吉川医療ビル5階",
      "tel": "048-983-1515",
      "depts": [
        "小児科"
      ],
      "start": "19:00",
      "end": "21:00",
      "note": "平日夜間の小児時間外（初期救急）診療。時間は受付時間です（診療は21時30分まで）。前もって電話で子どもの状態を伝えてから受診を。",
      "source": "https://www.city.yoshikawa.saitama.jp/index.cfm/24,447,137,767,html"
    },
    {
      "area": "kawaguchi",
      "date": "2026-10-02",
      "name": "埼玉協同病院",
      "address": "川口市木曽呂1317",
      "tel": "0570-00-4771",
      "depts": [
        "小児科"
      ],
      "start": "23:00",
      "end": "08:00",
      "note": "川口市こども夜間救急診療所が閉まった後の、子どもの夜間救急の当番病院です。入院患者の診療中で待つことがあります。受診前に必ず電話を。",
      "source": "https://www.city.kawaguchi.lg.jp/soshiki/01090/010/4/1/5712.html"
    },
    {
      "area": "kawaguchi",
      "date": "2026-10-03",
      "name": "川口市立医療センター",
      "address": "川口市西新井宿180",
      "tel": "048-287-2525",
      "depts": [
        "小児科"
      ],
      "start": "22:00",
      "end": "08:00",
      "note": "川口市こども夜間救急診療所が閉まった後の、子どもの夜間救急の当番病院です。入院患者の診療中で待つことがあります。受診前に必ず電話を。",
      "source": "https://www.city.kawaguchi.lg.jp/soshiki/01090/010/4/1/5712.html"
    },
    {
      "area": "all",
      "date": "2026-10-04",
      "name": "彩の国東大宮メディカルセンター",
      "tel": "048-665-6111",
      "depts": [
        "耳鼻咽喉科"
      ],
      "start": "09:00",
      "end": "17:00",
      "note": "耳鼻咽喉科の休日救急（県の東地区の当番）。当番が変わることもあるので、必ず事前に電話を。",
      "source": "https://www.pref.saitama.lg.jp/documents/77646/r08_0201.pdf"
    },
    {
      "area": "all",
      "date": "2026-10-04",
      "name": "坂戸八幡耳鼻咽喉科クリニック",
      "tel": "049-284-8734",
      "depts": [
        "耳鼻咽喉科"
      ],
      "start": "09:00",
      "end": "17:00",
      "note": "耳鼻咽喉科の休日救急（県の西地区の当番）。当番が変わることもあるので、必ず事前に電話を。",
      "source": "https://www.pref.saitama.lg.jp/documents/77646/r08_0201.pdf"
    },
    {
      "area": "chichibu",
      "date": "2026-10-04",
      "name": "秩父郡市医師会休日診療所",
      "address": "秩父市熊木町 2-19",
      "tel": "0494-23-8561",
      "depts": [
        "内科",
        "小児科"
      ],
      "start": "09:00",
      "end": "17:00",
      "note": "受付は16時30分まで。事前に電話を。",
      "source": "https://chichibu-ishikai.jp/system/"
    },
    {
      "area": "chichibu",
      "date": "2026-10-04",
      "name": "石塚クリニック",
      "address": "秩父市大野原3331-1",
      "tel": "0494-22-6122",
      "depts": [
        "内科"
      ],
      "start": "09:00",
      "end": "18:00",
      "note": "診療科目：内・呼。必ず電話で確認してから受診を。",
      "source": "https://chichibu-ishikai.jp/system/"
    },
    {
      "area": "honjo",
      "date": "2026-10-04",
      "name": "したら眼科クリニック",
      "tel": "0495-33-8333",
      "depts": [
        "眼科"
      ],
      "start": "09:00",
      "end": "12:00",
      "note": "外科系（切り傷・打撲など）の在宅当番医。当番は変わることがあるので、必ず電話で確認を。",
      "source": "https://www.city.honjo.lg.jp/material/files/group/16/R8_zaitaku.pdf"
    },
    {
      "area": "kasukabe",
      "date": "2026-10-04",
      "name": "みくに中央クリニック",
      "address": "春日部市中央1-56-18",
      "tel": "048-737-5400",
      "depts": [
        "内科"
      ],
      "start": "09:00",
      "end": "12:00",
      "note": "内科系の当番。診療科目：内科。受付時間は医療機関により異なるので、必ず電話を。",
      "source": "https://www.city.kasukabe.lg.jp/anshin_anzen/kyukyu_kyumei/kyujitsutobani/13580.html"
    },
    {
      "area": "kasukabe",
      "date": "2026-10-04",
      "name": "宇野クリニック",
      "address": "春日部市粕壁1-6-5-2階",
      "tel": "048-760-3711",
      "depts": [
        "小児科",
        "内科",
        "外科"
      ],
      "start": "09:00",
      "end": "12:00",
      "note": "小児科系の当番。診療科目：内科、小児科、整形外科。受付時間は医療機関により異なるので、必ず電話を。",
      "source": "https://www.city.kasukabe.lg.jp/anshin_anzen/kyukyu_kyumei/kyujitsutobani/13580.html"
    },
    {
      "area": "kasukabe",
      "date": "2026-10-04",
      "name": "さだまつ眼科クリニック",
      "address": "春日部市谷原新田2213-1",
      "tel": "048-731-5040",
      "depts": [
        "外科",
        "眼科"
      ],
      "start": "09:00",
      "end": "12:00",
      "note": "外科系の当番。診療科目：眼科。受付時間は医療機関により異なるので、必ず電話を。",
      "source": "https://www.city.kasukabe.lg.jp/anshin_anzen/kyukyu_kyumei/kyujitsutobani/13580.html"
    },
    {
      "area": "kawaguchi",
      "date": "2026-10-04",
      "name": "埼玉協同病院",
      "address": "川口市木曽呂1317",
      "tel": "0570-00-4771",
      "depts": [
        "外科",
        "内科"
      ],
      "start": "09:00",
      "end": "17:00",
      "note": "診療科目：外・内・胃。途中に休憩時間があります。必ず事前に電話を。",
      "source": "https://www.city.kawaguchi.lg.jp/soshiki/01090/010/4/1/5637.html"
    },
    {
      "area": "kawaguchi",
      "date": "2026-10-04",
      "name": "ひろ小児科ファミリークリニック",
      "address": "川口市上青木3-3-1",
      "tel": "048-266-1155",
      "depts": [
        "小児科"
      ],
      "start": "09:00",
      "end": "17:00",
      "note": "診療科目：小。途中に休憩時間があります。必ず事前に電話を。",
      "source": "https://www.city.kawaguchi.lg.jp/soshiki/01090/010/4/1/5637.html"
    },
    {
      "area": "kawaguchi",
      "date": "2026-10-04",
      "name": "安行メディカルクリニック",
      "address": "川口市安行藤八418",
      "tel": "048-291-3568",
      "depts": [
        "内科",
        "外科"
      ],
      "start": "09:00",
      "end": "17:00",
      "note": "診療科目：内・外・消。途中に休憩時間があります。必ず事前に電話を。",
      "source": "https://www.city.kawaguchi.lg.jp/soshiki/01090/010/4/1/5637.html"
    },
    {
      "area": "kawaguchi",
      "date": "2026-10-04",
      "name": "さとう眼科医院",
      "address": "川口市芝4-5-30",
      "tel": "048-266-7359",
      "depts": [
        "眼科"
      ],
      "start": "09:00",
      "end": "17:00",
      "note": "診療科目：眼。途中に休憩時間があります。必ず事前に電話を。",
      "source": "https://www.city.kawaguchi.lg.jp/soshiki/01090/010/4/1/5637.html"
    },
    {
      "area": "kawaguchi",
      "date": "2026-10-04",
      "name": "はしだ歯科医院",
      "address": "川口市朝日2-6-12",
      "tel": "048-226-4343",
      "depts": [
        "歯科"
      ],
      "start": "09:00",
      "end": "17:00",
      "note": "診療科目：歯。途中に休憩時間があります。必ず事前に電話を。",
      "source": "https://www.city.kawaguchi.lg.jp/soshiki/01090/010/4/1/5637.html"
    },
    {
      "area": "kuki",
      "date": "2026-10-04",
      "name": "新久喜総合病院",
      "tel": "0480-26-0033",
      "depts": [
        "内科"
      ],
      "start": "09:00",
      "end": "12:00",
      "note": "受診前に必ず電話を。",
      "source": "https://www.city.kuki.lg.jp/kenko/kenko_iryo/kyujitsu/1003818.html"
    },
    {
      "area": "kuki",
      "date": "2026-10-04",
      "name": "扶顛堂たかぎクリニック",
      "tel": "0480-21-0124",
      "depts": [
        "小児科"
      ],
      "start": "09:00",
      "end": "12:00",
      "note": "予約受付は8時〜11時30分。受診前に必ず電話を。",
      "source": "https://www.city.kuki.lg.jp/kenko/kenko_iryo/kyujitsu/1003818.html"
    },
    {
      "area": "sayama",
      "date": "2026-10-04",
      "name": "小林病院",
      "address": "入間市宮寺2417",
      "tel": "04-2934-5121",
      "depts": [
        "内科"
      ],
      "note": "診療科目：内科。休診時間があるので必ず事前に問い合わせを。",
      "source": "https://www.city.iruma.saitama.jp/soshiki/kenkokanrika/7/156.html",
      "start": "09:00",
      "end": "12:00"
    },
    {
      "area": "sayama",
      "date": "2026-10-04",
      "name": "豊岡整形外科病院",
      "address": "入間市豊岡1-7-16",
      "tel": "04-2962-8256",
      "depts": [
        "外科"
      ],
      "note": "診療科目：外科。休診時間があるので必ず事前に問い合わせを。",
      "source": "https://www.city.iruma.saitama.jp/soshiki/kenkokanrika/7/156.html",
      "start": "09:00",
      "end": "12:00"
    },
    {
      "area": "soka",
      "date": "2026-10-04",
      "name": "あい小児科",
      "address": "草加市",
      "depts": [
        "内科"
      ],
      "start": "09:00",
      "end": "12:00",
      "note": "住所・電話番号は情報元に載っていません。受診前に医療機関へ電話で確認を。",
      "source": "https://sokayashio-med.or.jp/toban/"
    },
    {
      "area": "soka",
      "date": "2026-10-04",
      "name": "山崎クリニック",
      "address": "草加市",
      "depts": [
        "外科"
      ],
      "start": "09:00",
      "end": "12:00",
      "note": "住所・電話番号は情報元に載っていません。受診前に医療機関へ電話で確認を。",
      "source": "https://sokayashio-med.or.jp/toban/"
    },
    {
      "area": "tokorozawa",
      "date": "2026-10-04",
      "name": "柳内医院",
      "address": "所沢市元町21番7号",
      "tel": "04-2922-2005",
      "depts": [
        "内科"
      ],
      "start": "09:00",
      "end": "17:00",
      "note": "診療科目：内科・放射線科・胃腸科・循環器科・呼吸器科",
      "source": "https://www.city.tokorozawa.saitama.jp/kenko/kenkoiryo/kinkyu/kyujitukyukantobaninogoannai.html"
    },
    {
      "area": "tokorozawa",
      "date": "2026-10-04",
      "name": "小手指整形外科",
      "address": "所沢市小手指元町3丁目2番地の31",
      "tel": "04-2947-3321",
      "depts": [
        "外科"
      ],
      "start": "09:00",
      "end": "17:00",
      "note": "診療科目：整形外科・リウマチ科・外科・リハビリテーション科",
      "source": "https://www.city.tokorozawa.saitama.jp/kenko/kenkoiryo/kinkyu/kyujitukyukantobaninogoannai.html"
    },
    {
      "area": "tokorozawa",
      "date": "2026-10-04",
      "name": "村田医院",
      "address": "所沢市上安松538番地の7",
      "tel": "04-2997-5051",
      "depts": [
        "内科",
        "小児科"
      ],
      "start": "09:00",
      "end": "17:00",
      "note": "診療科目：内科・小児科",
      "source": "https://www.city.tokorozawa.saitama.jp/kenko/kenkoiryo/kinkyu/kyujitukyukantobaninogoannai.html"
    },
    {
      "area": "asaka",
      "date": "2026-10-04",
      "name": "くりはら内科クリニック",
      "address": "新座市栗原3-10-22",
      "tel": "042-438-6606",
      "depts": [
        "内科"
      ],
      "start": "10:00",
      "end": "16:00",
      "note": "当番の診療科目：内、消内、循内（通常と異なる場合あり）",
      "source": "https://www.asakamed.com/emergency/"
    },
    {
      "area": "asaka",
      "date": "2026-10-04",
      "name": "朝霞台駅前みなみ耳鼻咽喉科",
      "address": "朝霞市東弁財1-5-18 カロータ2F",
      "tel": "048-474-8733",
      "depts": [
        "耳鼻咽喉科"
      ],
      "start": "10:00",
      "end": "16:00",
      "note": "当番の診療科目：耳、アレ（通常と異なる場合あり）",
      "source": "https://www.asakamed.com/emergency/"
    },
    {
      "area": "sayama",
      "date": "2026-10-04",
      "name": "小林病院",
      "address": "入間市宮寺2417",
      "tel": "04-2934-5121",
      "depts": [
        "内科"
      ],
      "note": "診療科目：内科。休診時間があるので必ず事前に問い合わせを。",
      "source": "https://www.city.iruma.saitama.jp/soshiki/kenkokanrika/7/156.html",
      "start": "13:00",
      "end": "17:00"
    },
    {
      "area": "sayama",
      "date": "2026-10-04",
      "name": "豊岡整形外科病院",
      "address": "入間市豊岡1-7-16",
      "tel": "04-2962-8256",
      "depts": [
        "外科"
      ],
      "note": "診療科目：外科。休診時間があるので必ず事前に問い合わせを。",
      "source": "https://www.city.iruma.saitama.jp/soshiki/kenkokanrika/7/156.html",
      "start": "13:00",
      "end": "17:00"
    },
    {
      "area": "kasukabe",
      "date": "2026-10-04",
      "name": "みくに中央クリニック",
      "address": "春日部市中央1-56-18",
      "tel": "048-737-5400",
      "depts": [
        "内科"
      ],
      "start": "14:00",
      "end": "17:00",
      "note": "内科系の当番。診療科目：内科。受付時間は医療機関により異なるので、必ず電話を。",
      "source": "https://www.city.kasukabe.lg.jp/anshin_anzen/kyukyu_kyumei/kyujitsutobani/13580.html"
    },
    {
      "area": "kasukabe",
      "date": "2026-10-04",
      "name": "宇野クリニック",
      "address": "春日部市粕壁1-6-5-2階",
      "tel": "048-760-3711",
      "depts": [
        "小児科",
        "内科",
        "外科"
      ],
      "start": "14:00",
      "end": "17:00",
      "note": "小児科系の当番。診療科目：内科、小児科、整形外科。受付時間は医療機関により異なるので、必ず電話を。",
      "source": "https://www.city.kasukabe.lg.jp/anshin_anzen/kyukyu_kyumei/kyujitsutobani/13580.html"
    },
    {
      "area": "kasukabe",
      "date": "2026-10-04",
      "name": "さだまつ眼科クリニック",
      "address": "春日部市谷原新田2213-1",
      "tel": "048-731-5040",
      "depts": [
        "外科",
        "眼科"
      ],
      "start": "14:00",
      "end": "17:00",
      "note": "外科系の当番。診療科目：眼科。受付時間は医療機関により異なるので、必ず電話を。",
      "source": "https://www.city.kasukabe.lg.jp/anshin_anzen/kyukyu_kyumei/kyujitsutobani/13580.html"
    },
    {
      "area": "soka",
      "date": "2026-10-04",
      "name": "あい小児科",
      "address": "草加市",
      "depts": [
        "内科"
      ],
      "start": "14:00",
      "end": "17:00",
      "note": "住所・電話番号は情報元に載っていません。受診前に医療機関へ電話で確認を。",
      "source": "https://sokayashio-med.or.jp/toban/"
    },
    {
      "area": "soka",
      "date": "2026-10-04",
      "name": "草加松原整形外科医院",
      "address": "草加市",
      "depts": [
        "外科"
      ],
      "start": "14:00",
      "end": "17:00",
      "note": "住所・電話番号は情報元に載っていません。受診前に医療機関へ電話で確認を。",
      "source": "https://sokayashio-med.or.jp/toban/"
    },
    {
      "area": "kawaguchi",
      "date": "2026-10-04",
      "name": "川口市立医療センター",
      "address": "川口市西新井宿180",
      "tel": "048-287-2525",
      "depts": [
        "小児科"
      ],
      "start": "22:00",
      "end": "08:00",
      "note": "川口市こども夜間救急診療所が閉まった後の、子どもの夜間救急の当番病院です。入院患者の診療中で待つことがあります。受診前に必ず電話を。",
      "source": "https://www.city.kawaguchi.lg.jp/soshiki/01090/010/4/1/5712.html"
    },
    {
      "area": "misato",
      "date": "2026-10-05",
      "name": "埼葛クリニック",
      "address": "吉川市富新田245",
      "tel": "048-982-3211",
      "depts": [
        "小児科"
      ],
      "start": "19:00",
      "end": "21:00",
      "note": "平日夜間の小児時間外（初期救急）診療。時間は受付時間です（診療は21時30分まで）。前もって電話で子どもの状態を伝えてから受診を。",
      "source": "https://www.city.yoshikawa.saitama.jp/index.cfm/24,447,137,767,html"
    },
    {
      "area": "kawaguchi",
      "date": "2026-10-05",
      "name": "川口市立医療センター",
      "address": "川口市西新井宿180",
      "tel": "048-287-2525",
      "depts": [
        "小児科"
      ],
      "start": "23:00",
      "end": "08:00",
      "note": "川口市こども夜間救急診療所が閉まった後の、子どもの夜間救急の当番病院です。入院患者の診療中で待つことがあります。受診前に必ず電話を。",
      "source": "https://www.city.kawaguchi.lg.jp/soshiki/01090/010/4/1/5712.html"
    },
    {
      "area": "misato",
      "date": "2026-10-06",
      "name": "土屋医院",
      "address": "吉川市加藤664-1",
      "tel": "048-982-2156",
      "depts": [
        "小児科"
      ],
      "start": "19:00",
      "end": "21:00",
      "note": "平日夜間の小児時間外（初期救急）診療。時間は受付時間です（診療は21時30分まで）。前もって電話で子どもの状態を伝えてから受診を。",
      "source": "https://www.city.yoshikawa.saitama.jp/index.cfm/24,447,137,767,html"
    },
    {
      "area": "kawaguchi",
      "date": "2026-10-06",
      "name": "済生会川口総合病院",
      "address": "川口市西川口5-11-5",
      "tel": "0570-08-1551",
      "depts": [
        "小児科"
      ],
      "start": "23:00",
      "end": "08:00",
      "note": "川口市こども夜間救急診療所が閉まった後の、子どもの夜間救急の当番病院です。入院患者の診療中で待つことがあります。受診前に必ず電話を。",
      "source": "https://www.city.kawaguchi.lg.jp/soshiki/01090/010/4/1/5712.html"
    },
    {
      "area": "misato",
      "date": "2026-10-07",
      "name": "吉川中央総合病院",
      "address": "吉川市平沼111",
      "tel": "048-982-8311",
      "depts": [
        "小児科"
      ],
      "start": "19:00",
      "end": "21:00",
      "note": "平日夜間の小児時間外（初期救急）診療。時間は受付時間です（診療は21時30分まで）。前もって電話で子どもの状態を伝えてから受診を。",
      "source": "https://www.city.yoshikawa.saitama.jp/index.cfm/24,447,137,767,html"
    },
    {
      "area": "kawaguchi",
      "date": "2026-10-07",
      "name": "川口市立医療センター",
      "address": "川口市西新井宿180",
      "tel": "048-287-2525",
      "depts": [
        "小児科"
      ],
      "start": "23:00",
      "end": "08:00",
      "note": "川口市こども夜間救急診療所が閉まった後の、子どもの夜間救急の当番病院です。入院患者の診療中で待つことがあります。受診前に必ず電話を。",
      "source": "https://www.city.kawaguchi.lg.jp/soshiki/01090/010/4/1/5712.html"
    }
  ]
};
