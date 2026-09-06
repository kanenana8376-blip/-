# CHANGELOG

「AI漫画量産ハーネス（デジコミック）」の製品バージョン履歴。[SemVer](https://semver.org/lang/ja/) 準拠。
版の正本はこのファイルと `VERSION` と `開発ログ/` が担う（ファイル名に `vN` を乱立させない＝「無印＝最新」原則）。

## [1.1.0] - 2026-07-05
### ハーネス一本化＋監視官のClaude移管（大規模改善・開発ログ #20〜23）
- **生成入口を `render_with_review.py` に一本化**: Observer↔Fixer 修正ループを配線（`--auto-fix` 既定ON・`--max-fix-cycles=3`）。スキルから自作 generate_manga.py 経路を廃止し、監視官が必ず通る既定経路に。
- **監視官のマルチバックエンド化**: `harness/harness/observer_backend.py` 新設（codex / claude）。Codex はサブスク上限（実測 約25呼び出し/5時間）を画像生成に全振りし、審査は Claude 側へ移管 — ページ監視官=Sonnet、章監視官=Opus、グリッド下読み=Haiku（Haiku の誤fail を実測したため pass/fail 権限は Sonnet 以上）。
- **原稿ゲートの前倒し（Phase 4g）**: 挿絵生成の前に原稿合議（n=3 多数決）を実施し、原稿差し戻し時の挿絵作り直し（60〜90分）を根絶。
- **ルール正本の新設**: `docs/rules/manga_prompt_rules.md`（読み順・コマ割りテンプレ・文字方向・吹き出し形式・オノマトペ・背景30種・SCREEN タグ・ページ間連結フック）。Phase 5/7b/7d の開始時に Read 必須。
- **役割別エージェント定義**: `.claude/agents/` に6本（researcher / writer / converter / chapter-observer / grid-prescreener / fixer-editorial）。生成と評価の分離をエージェント単位で固定。
- **キャラシート生成の Codex CLI 対応**: `scripts/codex_character_sheets.py` 新設（キャラモード1/2/3対応・`--main-ref`／`--skip-names`）。
- **`build_docx.py` 刷新**: `--slug` 対応・`pageNN_vN` 最新版自動採用・出力自動バージョニング・句点改行の閉じ括弧根治（#19の恒久対策）。
- **通し受け入れ試験に合格**: 軽量本1冊（挿絵6＋漫画18ページ）を Phase 0→8 完走。qa_check / typeset_check とも exit 0・ページ再生成ゼロ・章スコア 8/10 ×3章。
- モデル方針: 自動化の既定は Opus / Sonnet / Haiku（特定上位モデルへの依存を設計から排除）。

## [1.0.1] - 2026-06-03
### 配布パッケージの整備（コミュニティ配布版）
- Codex CLI のインストールを公式の `npm i -g @openai/codex`（Mac/Win/Linux共通）に統一。
- 必要プランを明記（Claude Code=Pro最低/Max推奨・ChatGPT=Plus可/Pro推奨）。
- 「はじめにお読みください」と「スタートガイド」を1本に統合。
- カタカナ「デジコミック」表記・個人情報（実パス/メール/旧名）を除去。
- 旧APIキー版マニュアル・.env.example を同梱から除外。

## [1.0.0] - 2026-05-31
### フォルダ構成の大規模再設計（フェーズ1・2）
- **構成整理**: ハーネス設計・ドキュメント・成果物・旧仕様を物理分離。`output/` は成果物だけに。
  - 設計物 → `docs/`（design / reports / improvement / manuals / samples）
  - 旧仕様・秘匿・巨大物 → `.archive/`（配布ZIP・gitから除外）
- **英語コア命名**: `ハーネス/` → `harness/`（改名のみ・`parents[2]` ゼロ改修で吸収）。
  日本語素材（`キャラ参照/`・`コマ割りテンプレ/`・`開発ログ/`）はブランド資産として名称維持。
- **HANDOFF.md をプロジェクト直下へ昇格**（再開の起点を最上位に）。
- **旧仕様の隔離**:
  - OpenAI直叩き画像生成6本を退役（Codex CLI一本化・APIキー不要を徹底）。
  - 非推奨オーケストレーター skill（ebook-auto / ebook-deji）を隔離。現役は ebook-manga-auto-ss ＋部品5本。
  - 実装計画 v1/v2 を隔離（v3 が現行の正）。
- **堅牢化**: `scripts/config.py` を環境変数 `PROJECT_ROOT` 優先に。秘匿 `.env` を退役し `.env.example` を同梱。
- **新規台帳**: `VERSION` / `CHANGELOG.md` / `docs/FOLDER_STRUCTURE.md` を追加（「無印＝最新」運用と販売信頼性の両立）。

### 品質ハーネス（既存・本リリースに内包）
- Step A–G（page_review / state_manager / decision_packet / manuscript_review /
  manga_structure_review / chapter_map / gate_consensus）と監視官(Observer)/修正担当(Fixer)分離、
  10点満点スコア記録（score_log）、ループ防止（--max-fix-cycles）を搭載。
- `is_run_complete()`：原稿承認 AND 全章承認 AND 全ページ完了 AND blocked無し で初めて完成判定。

---

## [Unreleased] - 2026-06-02
### 本文DOCXの組版ゲート新設＋既存原稿の括弧バグ修正（#19）
完成DOCXで閉じ鉤括弧「」」だけが行頭に弾き出される組版バグ（句点改行が `。」` を割って84箇所発生）を発見。Dynamic Workflow で「原稿修正」「ハーネス分析」を分離実行し是正。詳細は `開発ログ/2026-06-02_19_*.md`。
- **`scripts/typeset_check.py` 新設（MANDATORY ゲート）**: DOCX/md の(a)閉じ括弧だけの孤立段落・(b)行頭禁則・(c)括弧開閉バランスを全数機械検査し、違反で exit 1。`qa_check`(画像) と並ぶ出荷ゲートの必須2点目。
- **監査官の守備範囲を拡張**: これまで「漫画PNG」と「DOCX化前の原稿md」の2領域のみで、DOCX後処理（句点改行）で初めて生まれる組版崩れに検査の空白地帯があった → 第3領域「最終成果物（DOCX）の組版」を恒久追加（CLAUDE.md セクション4に追記、完了宣言の前提に typeset_check 全通過を追加）。
- **既存原稿の修正**: 84件の孤立「」」を直前段落へ結合し `ClaudeCode✖️AI漫画量産ハーネス_v2_括弧修正.docx` として別名保存（原本非上書き・画像77枚保持・括弧バランス一致を検証）。
- **残課題**: build側で「閉じ括弧直前の句点では改行しない」根治（`re.split(r'。(?![」』）)】])', text)`）＋ `build_docx.py` への句点改行一本化＋ `render_with_review` への自動フック化。

## [Unreleased] - 2026-06-01
### 漫画品質ルールの強化（動作確認 #18 で確立）
新構成での実走確認（`output/ougon-no-hane`）で表面化した品質欠陥を是正。詳細は `開発ログ/2026-06-01_18_*.md`。
- **オノマトペ（描き文字）ルール新設（MANDATORY）**: 感情・動きのコマに必須化。かつ **1人/1事象につき1種類・多重配置禁止**（皆無も過剰も品質欠陥）。AGENTS.md / `.claude/CLAUDE.md` / skill.md に追記。
- **レタリング／書体ルール新設（MANDATORY）**: 基本書体は全ページ統一・強調は同系統で太く/大きく・オノマトペは別の手描き描き文字・思考吹き出しのしっぽは本人を指す。
- **監視官（Observer）の判定軸を拡張**: `page_review`(#6しっぽ向き/#7オノマトペ欠落・過剰/#8書体混在)、`manga_structure_review`(⑨オノマトペ ⑩レタリング ⑪思考しっぽ＋採点JSON)。
- **知覚限界の明文化**: しっぽ向き・書体混在は codex ビジョンで信頼検出できない（直接問うても誤判定）と検証 → skill Phase7f に人間目視カテゴリ[演出・レタリング]を新設し「人間確認必須」と明記。

## 次フェーズ（未リリース・予定）
- `assets/` 集約（env `CHAR_REF_DIR`/`TEMPLATE_DIR` 注入＋回帰テスト）
- harness フラット化（`parents[1]` 化＋package import 整理）、`tests/test_paths.py` 新設
- `build_docx.py` の `--slug` 引数化＋**pageNN_vN 最新版自動採用＋A5仕様統合**（output直下に毎回 build_final.py を自作しなくて済むように）、implementation_plan の無印化、codex_character_sheets.py 整備
