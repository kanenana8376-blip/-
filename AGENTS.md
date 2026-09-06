# 電子書籍+漫画 完全自動生成システム（Codex CLI版）

## 概要

テーマを入力するだけで、リサーチ → 原稿25,000字 → 挿絵約30枚 → 漫画20ページ → 最終DOCX を全自動で生成するシステムです。
画像生成は **Codex CLI（`codex exec`）の組み込み `image_gen` ツール** を使用します。**ChatGPT サブスク認証のみで動作し、OpenAI / Gemini 等の外部 API キーは一切不要**です。ブラウザ操作も不要です。

## 起動時チェック（MANDATORY）

**会話が始まったら、毎回必ず以下のステップを実行すること。スキップ禁止。**

| ステップ | 内容 | 実行タイミング |
|---------|------|--------------|
| ステップ1 | 事前準備の案内（Codex CLI・パッケージ確認） | **初回のみ**（Codex CLIが導入済みならスキップ） |
| ステップ2 | Codex CLI 認証確認 | **初回のみ**（`codex` コマンドが応答すればスキップ） |
| ステップ3 | スキル起動（コンテンツ設定はスキルのPhase 0が担当） | **毎回必ず実行**（2回目以降も省略不可） |

### 起動時の自動チェック手順

#### ステップ1: 事前準備の案内（初回のみ）

`codex` コマンドが利用可能（`which codex` で見つかる）であればこのステップをスキップしてステップ3へ進む。
存在しない場合のみ以下のメッセージをユーザーに表示する：

```
📌 電子書籍の自動生成を始める前に、以下の準備をお願いします。
  すでに済んでいる項目はスキップしてOKです。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【1】Codex CLI をインストール（初回のみ）
  ターミナルで以下を実行（Mac の場合）：
  npm i -g @openai/codex   # もしくは公式手順に従う
  codex --version       # 0.128.0 以上であることを確認

  ※ OpenAI API キーは不要です。Codex CLI は ChatGPT サブスクの認証だけで動作します。

【2】Codex CLI にログイン（初回のみ）
  ターミナルで以下を実行：
  codex login
  → ブラウザが開いて ChatGPT サブスクアカウントで認証
  ※ 一度ログインすれば認証情報は ~/.codex/ に保存され、再ログイン不要です

【3】Pythonパッケージが揃っているか確認（初回のみ）
  ターミナルで以下を実行：
  pip install python-docx Pillow

【4】Pandocがインストールされているか確認（初回のみ）
  ターミナルで pandoc --version を実行
  未インストールの場合: winget install pandoc（Windows）/ brew install pandoc（Mac）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
全て準備できたら「OK」と入力してください。
```

ユーザーが「OK」「できた」「はい」等の肯定を返すまで待つ。

#### ステップ2: Codex CLI 認証確認（初回のみ）

`codex` コマンドが応答する場合はスキップしてステップ3へ進む。
ユーザーの肯定後、Codex CLI の状態を確認する。

```bash
# Codex CLI の存在とバージョン確認
which codex >/dev/null 2>&1 && codex --version || echo "❌ codex コマンドが見つかりません"
```

**`codex-cli 0.128.0` 以上が表示される場合**: 「Codex CLI 設定OK」と表示して次へ

**コマンドが見つからない場合**: 以下のメッセージを表示する：

```
❌ Codex CLI がインストールされていません。
以下を実行してください：

  npm i -g @openai/codex   # Mac の場合
  codex login          # ChatGPT サブスクで認証

公式ドキュメント: https://github.com/openai/codex
設定後、「できた」と入力してください。
```


#### ステップ3: スキル起動

**ステップ1・2が完了したら（または初回以降でステップ1・2をスキップした場合も）、
`ebook-manga-auto-ss` スキルを起動する。コンテンツ設定の質問はスキルのPhase 0が行う。**

### 途中で止まった場合の案内

画像生成フェーズ（Phase 5b, Phase 7）に入る前に以下を案内すること：

```
📌 これから画像生成を開始します。基本的に全自動ですが、以下にご注意ください：
  - 画像生成には Codex CLI（ChatGPT サブスクの image_gen ツール）を使用します
  - 1ページあたり 2〜3 分かかります（並列実行はしません）
  - もし処理が止まったように見えたら「続けて」と入力してください
  - ChatGPT サブスクのレート制限に達した場合は少し待ってから「続けて」と入力してください
```

## 使い方

Codex で以下のように指示してください：

```
「〇〇」のテーマで電子書籍と漫画を自動生成してください
```

スキル `ebook-manga-auto-ss` が自動的に起動し、Phase 0〜8 を一気通貫で実行します。


## ルール

- ステップ1・2（技術環境確認）は Codex CLI が導入・ログイン済みであればスキップしてよい
- **コンテンツ設定の質問（テーマ・文字数・章数等）はスキルのPhase 0が毎回行う** — AGENTS.md側では行わない
- スキルのPhase 0完了後は確認なしで全自動進行
- 停止が必要なのは: 生成が完全停止した場合 or ChatGPT サブスクのレート制限に達した場合のみ
- ユーザーに「続けて」と言われたら、中断した箇所から作業を再開すること

## 画像生成の仕組み

- **使用スクリプト**:
  - `scripts/codex_image_gen.py`（単発1枚生成・挿絵 / キャラシート用）
  - `scripts/codex_render_from_csv.py`（CSV → 漫画ページ一括逐次生成）
- **画像生成エンジン**: Codex CLI（`codex exec`）の組み込み `image_gen` ツール
- **認証**: `codex login` 済みの ChatGPT サブスク（**OpenAI API キー不要・`.env` 不要**）
- **サポートサイズ**: `1024x1024` / `1536x1024`（横長） / `1024x1536`（縦長）
  - 任意のwidth/heightを渡すと、近いアスペクト比で生成→Pillow/sipsで指定サイズにリサイズ
- **絶対禁止**: スクリプトから OpenAI / Gemini / その他外部 AI 画像生成 API を呼ぶこと
- **並列実行はしない**: サブスクのレート制限を踏むため、必ず逐次実行する

### 退避された旧スクリプト（OpenAI API版）

以下は OpenAI gpt-image-2 API 直接呼び出し版で、現在は使用しない。`scripts/.deprecated_openai/` にも同名で退避済み。

| 旧スクリプト | 後継 |
|---|---|
| `scripts/openai_image_gen.py` | `scripts/codex_image_gen.py` |
| `scripts/generate_character_sheets.py` | `scripts/codex_character_sheets.py`（順次整備、内部で `codex_image_gen.py` を呼ぶ） |
| `scripts/generate_manga_batch.py` | `scripts/codex_render_from_csv.py` |
| `scripts/generate_illustrations.py` | `scripts/codex_image_gen.py`（直接呼び出し） |

## キャラクター参照画像によるキャラ一貫性（任意オプション）

**デフォルトでは主人公を含む全キャラクターのシートをAIが自動生成し、Codex CLI の `-i` 添付で外見を統一します。** `キャラ参照/` フォルダに参照画像を置いた場合はそちらを使用します（任意）。

### 仕組み

- `--reference ref1.png ref2.png ...` オプションでキャラクター画像を渡すと、`codex exec` の `-i` 引数として複数添付される
- Codex CLI の `image_gen` ツールが添付画像を参照して、キャラクターの外見（服装・体型・顔・配色等）の一貫性を維持する
- 複数キャラの参照画像を同時に渡せる（実用上 10 枚程度まで）

### サブキャラクター外見の差別化（MANDATORY）

`character_prompts.md` を作成する際、**全サブキャラの外見が互いに被らないこと**を必ず確認すること。また主人公の外見とも被らないように設計する。

#### 差別化必須の3項目

| 項目 | ルール | 例外 |
|------|--------|------|
| **髪色** | 全キャラで異なる色を使用 | なし |
| **髪型** | 全キャラで異なるスタイルを使用 | なし |
| **服の色（メインカラー）** | 全キャラで異なる色を使用 | 制服・ユニフォーム等、設定上同じ服を着る場合は除く |

#### character_prompts.md 作成手順

1. まず主人公の外見（髪色・髪型・服色）を `character_prompts.md` に「使用済み」として記録する
2. サブキャラを1人ずつ設計する際、**すでに割り当て済みの髪色・髪型・服色リスト**を参照して被りがないことを確認してから記述する
3. 各キャラの定義末尾に `# 使用: 髪色=XX, 髪型=XX, 服色=XX` とコメントで記録する

#### 使用する属性の選択肢（被り防止のための参照リスト）

**髪色**: 黒、茶色（ライトブラウン）、茶色（ダークブラウン）、金髪、赤、オレンジ、白、灰色、青、紫、緑、ピンク

**髪型（女性）**: ロング・ストレート、ロング・ウェーブ、ショートボブ、ツインテール、ポニーテール、お団子、サイドアップ、セミロング

**髪型（男性）**: 短髪・整髪、短髪・無造作、刈り上げ、センター分け、マッシュ、長髪、オールバック

**服の主要カラー**: 白、黒、紺、グレー、赤、青、緑、黄色、オレンジ、紫、ピンク、ベージュ、茶色

### キャラシート先行生成フロー

漫画ページ生成の**前に**、選択されたキャラクターモードに応じてシートを生成・収集すること。

```
【モード1: 全部お任せ（デフォルト）】

Phase A: AIが主人公＋サブキャラの外見・性格をテキストで設計
Phase B: 全キャラのシートを一括生成（内部で codex_image_gen.py を逐次呼出し）
  └─ python scripts/codex_character_sheets.py --slug <slug>
     → 主人公を含む全キャラのシート画像を output/<slug>/characters/ に生成
Phase C: 生成したシート画像を全漫画ページに -i 添付して外見を統一
  └─ python scripts/codex_render_from_csv.py --csv output/<slug>/manga_pages.csv \
       --out-dir output/<slug>/panels --char-ref "output/<slug>/characters/"

【モード2: 主人公のみ自分で用意】

Phase A: 主人公 = キャラ参照/の画像を使用 / サブキャラ = AIが設計
Phase B: サブキャラのシートを生成（主人公はスキップ）
  └─ python scripts/codex_character_sheets.py --slug <slug> --main-ref "キャラ参照/主人公名/主人公名.png"
     → サブキャラのシート画像を output/<slug>/characters/ に生成
Phase C: 主人公の参照画像＋サブキャラシートを全漫画ページに -i 添付して統一
  └─ python scripts/codex_render_from_csv.py --csv output/<slug>/manga_pages.csv \
       --out-dir output/<slug>/panels --char-ref "output/<slug>/characters/" \
       --char-ref-files "キャラ参照/主人公名/主人公名.png"

【モード3: 全キャラ自分で設定】

Phase A: キャラ参照/ の全キャラ画像を収集
Phase B: シート生成をスキップ（全員の画像が揃っているため）
Phase C: キャラ参照/ の全画像を漫画ページに -i 添付して統一
  └─ python scripts/codex_render_from_csv.py --csv output/<slug>/manga_pages.csv \
       --out-dir output/<slug>/panels --char-ref "キャラ参照/"
```

**全モード共通ルール:**
- **テキスト定義のみでの漫画生成は禁止** — 必ずシート画像を参照すること
- **全キャラのシートを渡すこと** — 一部省略不可

### キャラ参照フォルダ構成

```
【モード1: 全部お任せ】
キャラ参照/  ← 空のまま（何も置かない）
  ※ AIが全キャラを設計・生成

【モード2: 主人公のみ自分で用意】
キャラ参照/
  主人公名/
    主人公名.png              ← 主人公の全身立ち絵（必須）
    character_prompts.md     ← 外見定義テキスト（任意）
  ※ サブキャラはAIが自動生成

【モード3: 全キャラ自分で設定】
キャラ参照/
  主人公名/
    主人公名.png              ← 全身立ち絵（必須）
    character_prompts.md     ← 外見定義テキスト（任意）
  サブキャラ1名/
    サブキャラ1名.png
    character_prompts.md
  サブキャラ2名/
    サブキャラ2名.png
    character_prompts.md
  （登場人物の数だけ作成）

output/<slug>/characters/    ← モード1・2で自動生成されるキャラシート
  char_01.png
  char_02.png
  ...
```

### codex_character_sheets.py の使い方（Codex CLI 版・順次整備中）

```bash
# 基本: character_prompts.md から全サブキャラのシートを生成
python scripts/codex_character_sheets.py --slug my-book

# 主人公の既存画像を指定（そのキャラの生成をスキップ）
python scripts/codex_character_sheets.py --slug my-book --main-ref "キャラ参照/主人公名/主人公名.png"

# 特定キャラ名をスキップ
python scripts/codex_character_sheets.py --slug my-book --skip-names "主人公名" "HeroName"

# character_prompts.md のパスを明示指定
python scripts/codex_character_sheets.py --slug my-book --prompts "path/to/character_prompts.md"
```

このスクリプトは内部で `codex_image_gen.py` を 1 キャラずつ呼び出して、Codex CLI の `image_gen` ツールで全身立ち絵を生成する。

### 漫画一括生成での使い方

```bash
# フォルダ内の全キャラシート + 主人公画像を -i 添付して漫画CSVを処理
python scripts/codex_render_from_csv.py \
  --csv output/my-book/manga_pages.csv \
  --out-dir output/my-book/panels \
  --char-ref "output/my-book/characters/" \
  --char-ref-files "キャラ参照/主人公名/主人公名.png"
```

### 自動生成フロー内での使い方

ステップ3で選択されたキャラクターモードに応じて処理を分岐する。

**【モード1】全部お任せ（`キャラ参照/` が空）:**
1. AIが主人公＋サブキャラの外見・性格をテキストで設計
2. `codex_character_sheets.py` で主人公を含む全キャラのシートを生成
3. 生成したシート画像を全漫画ページに `-i` 添付で渡す

**【モード2】主人公のみ自分で用意:**
1. `キャラ参照/主人公名/` の画像を主人公のシートとして使用
2. `codex_character_sheets.py --main-ref` でサブキャラのシートを生成
3. 主人公画像＋サブキャラシートを全漫画ページに `-i` 添付で渡す

**【モード3】全キャラ自分で設定:**
1. `キャラ参照/` 内の全フォルダから画像を収集（シート生成はスキップ）
2. 収集した全画像を全漫画ページに `-i` 添付で渡す

**全モード共通:**
- **テキスト定義のみでの漫画生成は禁止** — 必ずシート画像を参照すること
- **全キャラの画像を渡すこと** — 一部省略不可

## 画像サイズ仕様

| 用途 | 生成サイズ | 向き |
|------|-----------|------|
| 挿絵（章ヘッダー・本文中図解） | `1536x1024`（横長デフォルト） / `1024x1024`（正方形） / `1024x1536`（縦長）から場面に応じて選択可 | 横長基本・パターンに応じて柔軟 |
| **漫画ページ** | **`1024x1536` 固定（縦長厳守）** | **必ず縦長** |

漫画ページは絶対に縦長（`1024x1536`）で生成すること。横長・正方形にしない。

### 漫画セリフの文字向き（MANDATORY・2026-05-30 確定／旧縦中横ルールを上書き）

吹き出し内テキストの向きは、**その吹き出しに英語が含まれるか**で決める。
- **日本語だけの吹き出し** → **縦書き**（top-to-bottom, right-to-left）。
- **英語・ラテン文字を1語でも含む吹き出し** → **その吹き出し全体を横書き**（left-to-right, 正立）。
  - ★ 縦書き日本語の中に英語だけ横にする「**縦中横の混在は禁止**」。混ぜると崩れるため、英語が入る吹き出しは丸ごと横書きにする。
- 吹き出しの形は場面に応じて自由（通常・叫び・思考・ナレーション等）。
- プロンプトに必ず以下を含める:
  `Speech bubbles: Japanese-only bubbles are VERTICAL (top-to-bottom, right-to-left). Any bubble that contains even one English/Latin word must be rendered ENTIRELY HORIZONTAL (left-to-right, upright). Do NOT mix vertical Japanese with inline horizontal Latin in the same bubble.`

### セリフ吹き出しのプロンプト形式（MANDATORY・違反禁止）

漫画プロンプトでセリフを記述する際、**必ず以下の形式を使うこと**。

**✅ 正しい形式:**
```
CHARACTER's bubble (vertical) — text reads: 「セリフ内容」
CHARACTER's inner monologue bubble (vertical) — text reads: 「心の声」
CHARACTER's bubble (vertical, small) — text reads: 「小さいセリフ」
```

**❌ 禁止形式（AIがキャラ名を吹き出し内に描画してしまう）:**
```
Speech bubble (vertical): キャラ名「セリフ内容」
Speech bubbles (vertical): キャラ名「セリフ1」 キャラ名2「セリフ2」
```

**ルール:**
- キャラ名は**英語大文字**（例: YUI, DAD, MOM）で吹き出しの「所有者ラベル」として外に出す
- 実際のセリフは `text reads:` の後に日本語で記述する
- 複数キャラが同じコマに登場する場合は**1キャラ1行**に分けて記述する
- `generate_manga_csv.py` などのスクリプトを生成するときも必ずこの形式を使うこと

### オノマトペ（描き文字）ルール（MANDATORY・2026-06-01 確立）

漫画CSV/プロンプト生成時、**驚き・衝撃・強い感情・動き/アクションのコマには必ずオノマトペ（描き文字）を入れる**。オノマトペ皆無は「紙芝居的で臨場感が死ぬ」最大級の品質欠陥。

- 記述形式（コマ内に1行）: `オノマトペ（描き文字・吹き出しの外）: 〇〇を手描き描き文字で。`（例: ガーン / ドーン / ハッ / パァァッ / ふわり / ドキッ / ぐんぐん / うーん）
- **吹き出しの中に書かない**。吹き出しの外、空いた空間に手描き文字で配置する。
- 静かな説明・会話だけのコマは付けなくてよい（全コマ強制ではない）。
- **【入れすぎ厳禁】1人または1つの事象につき1種類に絞る**。同じ擬音の多重配置は禁止（例: キラキラを画面に4個＝NG）。1ページの描き文字は最小限、画面を文字で埋めない。基本は「大きいの1つ＋小さいの1つ」程度。考えているコマはそのキャラに「うーん」など1つで十分。
- 起源: 2026-06-01「黄金の羽根」動作確認で、(1)CSVにオノマトペを一切入れず12ページ生成→「一番重要なのに皆無」と指摘、(2)修正後にp8で「ハッ!＋パァァッ＋キラキラ×4」と盛りすぎ→「入れすぎ」と再指摘。皆無も過剰も品質欠陥。`scripts/term_check.py` は吹き出し外の描き文字を検出しないため、人間目視＋章Observer⑨で担保。

### レタリング／書体ルール（MANDATORY・2026-06-01 確立）

プロンプト共通ヘッダーに**必ず文字組ルールを明記**する（指定が無いと画像モデルが吹き出しごとに書体を勝手に変える）。

- **基本書体は全ページ統一**（明瞭な丸ゴシック系）。吹き出し間・ページ間で書体を切り替えない。
- **強調は同系統で太く/大きく**（無関係な装飾書体を強調に使わない）。
- **オノマトペは別物の動きある手描き描き文字**（意図的な使い分けで正常）。
- **思考（モノローグ）吹き出しのしっぽ**＝雲形＋連なる小円は「考えている本人の頭」を指す。明後日の方向・別人を指すのはNG。
- ★ ただし**しっぽの向き・書体混在は codex のビジョン判定では信頼検出できない**（2026-05-31検証で旧不良ページも「ok」と誤判定）。**Phase 7f の人間グリッド目視で必ず確認**する（自動Observerに任せきらない）。

### コマの読み順とテンプレート（MANDATORY）

> ★正本: `docs/rules/manga_prompt_rules.md`（2026-07-02制定）。本節はコピー。改訂はまず正本を直し、乖離時は正本が勝つ。

漫画ページ生成時は、`コマ割りテンプレ (1024 x 1536 px)/` フォルダのテンプレートを使用する。
**テンプレート番号ごとにパネル番号と位置が固定されている。** プロンプト生成時は必ず下記の対応表に従ってパネル番号と位置を明記すること。

#### 基本原則
- 日本漫画の読み順：**右から左、上から下**
- パネル番号は必ず「右上から開始」し、右→左、上→下の順に振る
- プロンプト冒頭に必ず記載：`JAPANESE MANGA. Reading direction: right-to-left. Panel 1 is at [position]. Never use left-to-right Western reading order.`

#### テンプレート別パネル位置・読み順対応表

**1コマ**

| テンプレ | 構造 | Panel 1 | Panel 2 | Panel 3 | Panel 4 |
|---------|------|---------|---------|---------|---------|
| テンプレ1 | 全面1コマ | 全面 | — | — | — |

**2コマ**

| テンプレ | 構造 | Panel 1 | Panel 2 |
|---------|------|---------|---------|
| テンプレ2 | 上下均等 | 上（全幅） | 下（全幅） |
| テンプレ3 | 上小・下大 | 上（全幅・小） | 下（全幅・大） |
| テンプレ4 | 上大・下小 | 上（全幅・大） | 下（全幅・小） |

**3コマ**

| テンプレ | 構造 | Panel 1 | Panel 2 | Panel 3 |
|---------|------|---------|---------|---------|
| テンプレ5 | 均等横3段 | 上（全幅） | 中（全幅） | 下（全幅） |
| テンプレ6 | 上全幅＋下左右 | 上（全幅） | 下右 | 下左 |
| テンプレ7 | 上左右＋下全幅 | 上右 | 上左 | 下（全幅） |

**4コマ**

| テンプレ | 構造 | Panel 1 | Panel 2 | Panel 3 | Panel 4 |
|---------|------|---------|---------|---------|---------|
| テンプレ8 | 上全幅＋中左右＋下全幅 | 上（全幅） | 中右 | 中左 | 下（全幅） |
| テンプレ9 | 上全幅＋下（右縦長・左2段）斜め | 上（全幅） | 下右（縦長・斜め） | 下左上 | 下左下 |
| テンプレ10 | 上全幅＋下（左縦長・右2段）斜め | 上（全幅） | 下右上 | 下右下 | 下左（縦長） |

#### プロンプトへの記載例（テンプレ6の場合）

```
JAPANESE MANGA. Reading direction: right-to-left. Panel 1 is at the TOP (full width). Never use left-to-right Western reading order.

Layout: テンプレ6（上全幅＋下左右）

[Panel 1 — TOP, full width]
（シーン内容）

[Panel 2 — BOTTOM-RIGHT]
（シーン内容）

[Panel 3 — BOTTOM-LEFT]
（シーン内容）
```

## 背景システム（全ページ必須・30パターン）

> ★正本: `docs/rules/manga_prompt_rules.md`（2026-07-02制定）。本節はコピー。改訂はまず正本を直し、乖離時は正本が勝つ。

漫画ページのプロンプト生成時、**全コマに必ず背景指定を含めること**。背景は「感情背景」「状況背景」の2種類から、シーンの内容と感情に合わせて選択する。

### 背景選択ルール

1. **アクション・感情が強いコマ** → 感情背景を使用
2. **特定の場所が明確なコマ** → 状況背景を使用（かつシーン一貫性を維持）
3. **同一シーン内での背景変化は禁止** — 同じ場所にいる限り状況背景は固定
4. **1ページ内でコマごとに異なる背景タイプを混在させてOK**（例: コマ1=状況背景、コマ2=集中線、コマ3=状況背景）

### 感情背景パターン（状況に関係なく使用可）

| ID | 背景名 | 使うシーン | 色トーン | プロンプト記述例 |
|----|--------|-----------|---------|----------------|
| E01 | 集中線 | 驚き・衝撃・クライマックス | 黄色・白 | `background: dynamic speed lines / concentration lines radiating from center, yellow and white` |
| E02 | フラッシュ | 叫び・強い感情・決意 | 白・黄 | `background: white burst flash effect with yellow radial rays, high impact` |
| E03 | 水玉 | コミカル・軽い雰囲気・明るい | パステルピンク・水色 | `background: cute polka dot pattern, pastel pink and light blue dots on white` |
| E04 | 半円 | 元気・前向き・ポップ | オレンジ・黄 | `background: pop art semicircle pattern, orange and yellow half-circles on white` |
| E05 | ドット（ハーフトーン） | 日常的な会話・普通の場面 | グレー・白 | `background: subtle halftone dot screen tone pattern, light gray dots on white` |
| E06 | ストライプ（斜め） | 緊張・葛藤・焦り | 赤・白 | `background: diagonal stripes, alternating red and white, tension feel` |
| E07 | ストライプ（縦） | 落ち着き・説明・整理 | 青・白 | `background: vertical stripes, calm blue and white` |
| E08 | 幾何学模様 | 論理的説明・分析・気づき | 紺・水色 | `background: geometric diamond/hexagon pattern, navy and light blue, analytical feel` |
| E09 | グラデーション（縦） | 感動・エモーション・転換点 | オレンジ→ピンク | `background: vertical gradient from warm orange to soft pink, emotional atmosphere` |
| E10 | グラデーション（横） | 内省・回想・静けさ | 青→紫 | `background: horizontal gradient from soft blue to lavender, introspective mood` |
| E11 | フラットカラー（黄） | 驚き・発見 | 黄色 | `background: flat solid bright yellow, no texture` |
| E12 | フラットカラー（青） | 落ち着き・信頼・知識 | 青 | `background: flat solid calm blue (#4A90D9), no texture` |
| E13 | フラットカラー（灰） | 不安・迷い・くすみ | グレー | `background: flat solid muted gray (#9E9E9E), no texture` |
| E14 | フラットカラー（緑） | 希望・成長・前向き | 緑 | `background: flat solid fresh green (#66BB6A), no texture` |
| E15 | フラットカラー（赤） | 怒り・強調・危機感 | 赤 | `background: flat solid bold red (#E53935), no texture` |
| E16 | フラットカラー（オレンジ） | 喜び・感動・エネルギー | オレンジ | `background: flat solid warm orange (#FF8F00), no texture` |
| E17 | フラットカラー（紫） | 悲しみ・深み・神秘 | 紫 | `background: flat solid deep purple (#7B1FA2), no texture` |
| E18 | スクリーントーン（細） | ごく普通の日常・モノローグ | グレー | `background: fine halftone screen tone, very subtle gray pattern` |
| E19 | 星・キラキラ | 感激・憧れ・夢 | 金・黄 | `background: sparkling stars and glitter effect, gold and yellow on white` |
| E20 | ハート模様 | 好意・嬉しさ・照れ | ピンク | `background: small heart pattern on light pink, cute manga style` |

### 状況背景パターン（場所を明示する場合）

| ID | 背景名 | 詳細指定必須内容 | scene_id例 |
|----|--------|----------------|-----------|
| S01 | オフィス | デスク・PC・パーティション・蛍光灯 | `office` |
| S02 | 自宅リビング | ソファ・テレビ・観葉植物・温かい照明 | `home_living` |
| S03 | 自室/書斎 | 本棚・デスク・夜の窓・スタンドライト | `home_study` |
| S04 | 道路/屋外昼 | 歩道・街路樹・青空・日差し | `outdoor_day` |
| S05 | 道路/屋外夜 | 街灯・夜空・ビル群の明かり | `outdoor_night` |
| S06 | 公園 | 木々・ベンチ・芝生・空 | `park` |
| S07 | セミナー会場 | 大型スクリーン・演台・白椅子の列・照明 | `seminar_hall` |
| S08 | 教室 | 黒板・机と椅子の列・窓 | `classroom` |
| S09 | 会議室 | 長テーブル・ホワイトボード・プロジェクター | `meeting_room` |
| S10 | 講座ルーム | 少人数テーブル・ホワイトボード・明るい照明 | `lecture_room` |
| S11 | カフェ | カウンター・木のテーブル・コーヒーメニュー | `cafe` |
| S12 | 電車内 | シートの列・吊り革・窓外の景色 | `train` |
| S13 | 夜景/屋上 | 都市の夜景・星空・ビル群の光 | `rooftop_night` |
| S14 | PC/スマホ画面 | 画面の枠・アプリUI・テキスト | `screen` |
| S15 | ステージ/プレゼン | スポットライト・聴衆のシルエット・スクリーン | `stage` |
| S16 | 書店 | 本棚・本の背表紙・照明 | `bookstore` |
| S17 | 飲食店/レストラン | テーブル・メニュー・店内照明 | `restaurant` |
| S18 | 病院/クリニック | 白い壁・診察台・医療機器 | `hospital` |
| S19 | 商業施設/ショッピング | 店舗・人込み・広告看板 | `shopping` |
| S20 | 自然/山・海 | 山並み・海・空の広大な風景 | `nature` |

### シーン一貫性ルール（MANDATORY）

page_prompts 生成時に **`scene_manifest`** を内部管理すること:

```
同一 scene_id のページ・コマは → 必ず同じ状況背景（bg_desc）を使い回す
scene_id が変わったページは → 新しい状況背景に切り替える
```

プロンプトへの背景記述形式:
```
[Panel X background]
SCENE: {scene_id} — {bg_desc: 状況背景の詳細説明}
または
BACKGROUND: {感情背景のプロンプト記述}
```

### 感情×色トーン早見表

| 感情 | 背景タイプ推奨 | 色 |
|------|-------------|-----|
| 驚き・衝撃 | E01集中線 / E11黄 | 黄・白 |
| 喜び・感動 | E16オレンジ / E19キラキラ | オレンジ・金 |
| 落ち着き・説明 | E07縦ストライプ / E12青 | 青 |
| 不安・迷い | E06斜めストライプ / E13灰 | 赤白 / グレー |
| 希望・気づき | E14緑 / E08幾何学 | 緑・紺 |
| 怒り・強調 | E15赤 / E02フラッシュ | 赤・白 |
| 悲しみ・後悔 | E17紫 / E10グラデ横 | 紫・青 |
| コミカル | E03水玉 / E04半円 | パステル |
| 内省・回想 | E10グラデ横 / E18スクリーントーン | 青紫 |
| 日常会話 | E05ドット / S01〜S20 状況背景 | グレー or 実景 |

## 漫画ページ生成スクリプトの即時チェック（MANDATORY・省略禁止）

漫画ページを生成するスクリプト（`generate_manga.py` 等）を生成・実行する際、**各ページ生成直後に必ず以下の構造チェックを実行すること**。

```python
from PIL import Image
import os

def check_page_ok(path: str) -> bool:
    if not os.path.exists(path): return False
    if os.path.getsize(path) < 50 * 1024: return False  # 50KB未満 = 白紙・破損
    with Image.open(path) as img:
        if img.size != (1024, 1536): return False  # 寸法異常
    return True
```

- NG → 即再生成（最大3回）
- 3回でもNG → スキップリストに記録して次のページへ
- `scripts/generate_manga_batch.py` はこのチェックを組み込み済み

---

## スクリーンデバイス登場コマのプロンプト生成ルール（Step 7d・MANDATORY）

漫画CSVのプロンプト生成時、スマートフォン・タブレット・ラップトップ・PCモニター等の画面デバイスが登場するコマには必ず以下のタグを末尾に追記する。

### [SCREEN:show] — 画面を見せる場面

画面内容を相手に説明・スクロール画面を読者に提示・作業中の画面を描写する場面。

```
IMPORTANT: The device screen MUST face toward the viewer. Show the screen content clearly. [SCREEN:show]
```

### [SCREEN:hide] — 画面を見せない場面

電車・カフェでのスマホ操作・ラップトップを閉じて持ち歩き・背を向けてPC作業する場面。

```
IMPORTANT: The screen does NOT face toward the viewer. Smartphone/tablet: back cover faces viewer, solid dark color, no screen content visible. Laptop: lid/back panel faces viewer. Do NOT render any screen content, UI, or text on the non-screen side. [SCREEN:hide]
```

### 両タグ共通の絶対禁止

```
FORBIDDEN: Do NOT show the non-screen side AND screen content simultaneously — physically impossible regardless of device type.
```

### OK / NG 判定一覧

| 状態 | タグ | 判定 |
|------|------|------|
| 画面面が前・画面コンテンツが表示 | [SCREEN:show] | OK |
| 背面/天板が前・コンテンツなし（暗い単色） | [SCREEN:hide] | OK |
| 背面/天板が前・画面コンテンツが重なる | どちらでも | NG（再生成） |

画面デバイスが登場しないコマにはタグを付けない。

---

## 言語

- 日本語優先
- 画像内テキストは必ず日本語
- プロンプトは英語OK（表示テキストは日本語のまま埋め込む）
