# 当番医データの毎日更新手順

`emergency-tool.html` は、毎日変わる当番医の情報を `emergency-duty.js` から読み込む。
毎日の更新では **`emergency-duty.js` だけ** を書き換える。

## 手順

1. 下の「情報元」の各ページ・PDFを開き、**今日から7日分**の当番医を読み取る。
2. 読み取れた当番ごとに `entries` に1件追加する（日付・地域・名称・住所・電話・診療科・時間・情報元URL）。
3. その地域の当番表をその日について**確認できた**場合だけ、`coverage["YYYY-MM-DD"]` にその地域IDを入れる。
   - ページが開けない、表が見つからない、読み取りに自信がない地域は入れない（画面に「情報なし」と出て #7119 へ案内される）。
   - 推測で埋めない。情報元に書いていない時間・診療科は書かない。
4. `updatedAt` を現在の日本時間にする。昨日以前の `entries` と `coverage` は削除する。
5. 構文チェック：`node -e "global.window={};require('./emergency-duty.js');console.log(window.DUTY_DATA.entries.length)"`
6. コミットしてプッシュする。

## 情報元（地域ID：情報元）

公開されているのは主に「日曜・祝日の昼間の在宅当番医」と一部の「小児夜間の当番病院」。
平日夜間の病院の輪番表は、多くの地域で一般には公開されていない。

| 地域ID | 地域 | 情報元 |
|---|---|---|
| saitama | さいたま市 | https://www.city.saitama.lg.jp/002/001/017/006/p019179.html |
| kawaguchi | 川口市・蕨市・戸田市 | https://www.city.kawaguchi.lg.jp/kosodate_gakkou/kodomonoiryo_kenko/iryou/17296.html / http://warabitoda-med.or.jp/emergency-medical-system/ |
| ageo | 上尾市・桶川市・伊奈町 | https://www.ageomed.com/night.html |
| asaka | 朝霞地区4市 | https://www.asakamed.com/emergency/ |
| tokorozawa | 所沢市・狭山市・入間市 | https://www.city.tokorozawa.saitama.jp/kenko/kenkoiryo/kinkyu/kyujitukyukantobaninogoannai.html |
| kawagoe | 川越市 | https://www.city.kawagoe.saitama.jp/kurashi/anshin/1001530/1001531/index.html |
| hiki | 東松山市・比企郡 | https://hiki-ishikai.com/kyuujitsu/ |
| koshigaya | 越谷市・草加市・八潮市・三郷市 | https://sokayashio-med.or.jp/toban/ |
| kasukabe | 春日部市 | https://www.city.kasukabe.lg.jp/anshin_anzen/kyukyu_kyumei/kyujitsutobani/index.html |
| kuki | 久喜市・加須市・幸手市 | https://www.city.kuki.lg.jp/kenko/kenko_iryo/kyujitsu/1003818.html |
| kumagaya | 熊谷市・深谷市・寄居町 | https://www.city.kumagaya.lg.jp/kurashi/bosai/shinryo/kyukyu.html |
| honjo | 本庄市・児玉郡 | https://www.city.honjo.lg.jp/soshiki/hoken/kenko/oshirase/kyuukan.html |
| chichibu | 秩父市・秩父郡 | https://chichibu-ishikai.jp/system/ / https://www.city.chichibu.lg.jp/9070.html |

県全体の参考：https://99.pref.saitama.lg.jp/ （埼玉県救急医療情報システム）

情報元のURLは移転することがある。開けなくなったら、自治体サイト内の「休日当番医」ページを探して、この表を直す。
