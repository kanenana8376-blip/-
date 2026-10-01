// 毎日更新する当番医の情報（emergency-tool.html が読み込む）
// このファイルは scripts/duty/build.mjs が自動で書き出す。手で直さないこと。
// 形式の説明は emergency-duty-update.md を参照。
window.DUTY_DATA = {
  "updatedAt": "2026-10-01T22:37:19+09:00",
  "areas": [
    "asaka",
    "tokorozawa",
    "hiki",
    "koshigaya",
    "kuki",
    "honjo",
    "chichibu"
  ],
  "coverage": {
    "2026-10-04": [
      "asaka",
      "tokorozawa",
      "hiki",
      "koshigaya",
      "kuki",
      "honjo",
      "chichibu"
    ],
    "2026-10-05": [
      "asaka",
      "hiki",
      "koshigaya",
      "kuki",
      "honjo",
      "chichibu"
    ],
    "2026-10-06": [
      "asaka",
      "hiki",
      "koshigaya",
      "kuki",
      "honjo",
      "chichibu"
    ],
    "2026-10-07": [
      "asaka",
      "hiki",
      "koshigaya",
      "kuki",
      "honjo",
      "chichibu"
    ],
    "2026-10-01": [
      "tokorozawa",
      "hiki",
      "koshigaya",
      "honjo",
      "chichibu"
    ],
    "2026-10-02": [
      "tokorozawa",
      "hiki",
      "koshigaya",
      "honjo",
      "chichibu"
    ],
    "2026-10-03": [
      "tokorozawa",
      "hiki",
      "koshigaya",
      "honjo",
      "chichibu"
    ]
  },
  "entries": [
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
      "area": "koshigaya",
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
      "area": "koshigaya",
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
      "area": "koshigaya",
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
      "area": "koshigaya",
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
    }
  ]
};
