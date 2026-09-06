---
name: image-studio
description: Generate and edit raster images with GPT Image 2 (illustrations, book covers, thumbnails, article art, mockups, banners), with reference-image / image-to-image support and verified output pixel dimensions. Use whenever the user asks for an image to be created, drawn, rendered, or changed — "GPT-image2で作成", "画像生成して", "画像を作って", "サムネ作って", "挿絵を作って", "アイキャッチ", "カバー画像", "表紙", "バナー", "generate an image", "make a thumbnail", "draw me". Use it especially when a local reference image is involved — "この画像を参考に", "この画像を元に", "同じ絵柄で", "キャラを統一して", "この画像を修正して", "背景だけ変えて", "image to image", "i2i" — and when an exact output size or aspect ratio is requested ("1600x2560で", "縦長で", "16:9で", "A4比率で"). Reference images must be files on disk; pasted-chat-image recovery is not available in this copy. Do not use for SVG/vector/CSS/HTML-native graphics, charts or data visualization (use dataviz), or edits to a vector asset already in the repo.
---

# Image Studio (GPT Image 2)

Claude Code does the **creative direction**; the script does the **rendering, sizing, and
verification**. Supersedes the older `image-gen` skill by adding image-to-image and real
size handling.

**This is the copy bundled with 神谷表紙制作会社.** It is invoked by relative path from the
project root, so the whole folder can be handed to someone else and still work. Nothing here
depends on `~/.claude/skills/`, and no path is tied to one machine.

Scripts, all under `skills/image-studio/scripts/` (relative to the project root):

| Script | Purpose |
|---|---|
| `codex-image.ps1` | the only script — generate / edit, sizing, verification |

The upstream `get-pasted-image.ps1` / `lib-pasted-images.ps1` pair was removed here; see
"Images the user pasted into chat" below for why.

## The one thing to know about size

**The built-in path gives you any aspect ratio you ask for, at a fixed ~1.5 MP resolution.**

Measured across every image the built-in tool produced on this machine:

| Output | Aspect | Pixels |
|---|---|---|
| `992x1586` | 1.599 (8:5) | 1,573,312 |
| `1024x1536` | 1.500 (3:2) | 1,572,864 |
| `1536x1024` | 1.500 (3:2) | 1,572,864 |

The aspect ratio tracks the request — `992x1586` is exactly the shape of a `1600x2560`
ask — while the pixel count is pinned at ~1,572,864. It is not a fixed menu of presets,
and the edges are not even constrained to multiples of 16.

Consequences worth stating plainly to the user:

- **Aspect ratio: free.** Ask for 5:8, A4, 16:9 — you get it, natively.
- **Resolution: capped.** ~1.5 MP is the ceiling. `1600x2560` (4.1 MP) is not reachable
  natively on this path.
- **Getting to an exact large size is therefore a pure upscale**, not a crop and not a
  stretch: `992x1586 → 1600x2560` is a straight 1.613× scale because the shape already
  matches. `-AllowResample` does exactly this and labels it `UPSCALED ... aspect
  preserved, no crop`.
- Codex, asked about its own tool schema, reports *"no size parameter exists"*. The
  observed behaviour above contradicts that, so trust the measurements, not the
  self-report — the script verifies the real pixel dimensions of every file either way.

Never present a rescaled file as a native render. The script labels which one it did;
pass that label on.

## One backend, on purpose

Everything runs through Codex CLI's built-in `image_gen` tool on the user's **ChatGPT
login** — no `OPENAI_API_KEY`, no per-image billing. The OpenAI API path was deliberately
removed from this skill; do not reintroduce it, and do not suggest `image_gen.py`,
`pip install openai`, or an API key as the fix for a size or feature limit. If something
is genuinely out of reach here, say so plainly and stop there.

The prompt header explicitly tells Codex never to fall back to the API and never to ask
for a key. Keep that instruction if you edit the header.

Practical limits of this path, for honest expectation-setting:

- resolution capped at ~1.5 MP (see above)
- no mask-based inpainting; edits are prompt-guided via `-Mode edit`
- no native transparency (see the chroma-key workflow below)

## Workflow

### 1. Settle the brief

Decide these yourself from context; ask only when a wrong guess wastes the whole run.

- **Count** — one unless the user asked for several or for candidates.
- **Destination** — always pass `-OutDir` explicitly. See below.
- **Base filename** — `YYYYMMDD-<descriptive-kebab-slug>`, no extension.
- **Size** — see the size section below.
- **Quality** — `high` for anything publishable, `low` for drafts and candidates.
- **Reference images** — any local file the new image should follow. See i2i below.

The invocation phrase is an instruction, not image content. Strip "GPT-image2で作成"
before building the prompt; it must never appear in the image or the filename.

#### Save location

Always relative to the project root, always passed as `-OutDir`:

| What | Where |
|---|---|
| Book covers | `01-my_book/<書籍タイトル>/output` |
| Main image feeding a cover | `01-my_book/<書籍タイトル>/output/00-main` |

The `-OutDir` default (`output`) is a fallback for ad-hoc runs, not a destination to rely on.
The script creates the folder if missing and never overwrites — it appends `-v2`, `-v3`, …

Quote every path: the project sits under Japanese folder names, and book titles contain
spaces and full-width characters.

### 2. Choose the size honestly

- **User named exact pixels at or under ~1.5 MP** (e.g. 1024×1536) → `-Size 1024x1536`.
  The built-in path hits it exactly; no warning.
- **User named exact pixels above the cap** (e.g. 1600×2560) → still pass
  `-Size 1600x2560`. The script predicts what will really come back (992×1586, correct
  shape) and prints it. Then either:
  - add `-AllowResample` to land on 1600×2560 by a pure aspect-preserving rescale, or
  - leave it native at 992×1586 and say so.

  Say which one you did. Do not present a rescale as a native render.
- **User named a ratio** → `-AspectRatio 5:8 -LongEdge 2560`. Ratios are honoured
  natively, so this is the cheapest way to get an unusual shape.
- **User said only "縦長" / "横長" / nothing** → `-Size 1024x1536` / `1536x1024` / omit.
- **Sizes are passed through as given.** No snapping: the built-in tool is not bound by
  the API's 16-pixel grid (it returned `992x1586`), so rounding the request would only
  distort the shape the user asked for. Ratios past ~3:1 get a warning, because that is
  where the tool stops honouring the shape.

`-AllowResample` resamples the saved file to the exact requested size. When the aspect
already matches — the normal case — it is a **pure rescale with no cropping and no
distortion** (`UPSCALED` or `DOWNSCALED` in the log). When the aspect differs it scales to
cover and centre-crops; it never stretches. Either way it is resampling, so say you did it.

### 3. Write the prompt file

Write to the scratchpad. **English prompt body** — GPT Image 2 responds better to English.
Exception: text that must appear *inside* the image stays verbatim in its original language.

```text
Use case: <taxonomy slug>
Asset type: <where the asset will be used>
Primary request: <the core idea in one sentence>
Subject: <main subject>
Scene/backdrop: <environment>
Style/medium: <photo / flat illustration / 3D render / watercolor / ...>
Composition/framing: <wide|close|top-down; placement; where negative space goes>
Lighting/mood: <lighting + mood>
Color palette: <palette>
Materials/textures: <surface details>
Text (verbatim): "<exact text>"   (or: none)
Constraints: <must keep>
Avoid: <negative constraints>
```

Do **not** put `Size:` or `Quality:` lines in the body — they are script parameters now,
and a stale `Size:` line in the prompt is exactly what creates false confidence.

For multiple images use `--- Image N ---` headers and start the file with
`Generate N images.` The script counts those headers to know how many files to expect, so
it can warn when Codex returns the wrong number.

Use case slugs: `photorealistic-natural`, `product-mockup`, `ui-mockup`,
`infographic-diagram`, `scientific-educational`, `ads-marketing`, `productivity-visual`,
`logo-brand`, `illustration-story`, `stylized-concept`, `historical-scene`.

Prompting rules that matter:

- Order the prompt scene/backdrop → subject → details → constraints.
- State the intended use (thumbnail, ad, UI mock) — it sets the polish level.
- If the user's request is already specific, normalize it; **do not** invent extra
  characters, objects, brands, or slogans they did not ask for.
- Reserve negative space when a headline will be overlaid later.
- Always add `no watermark`, and `no text` unless text was requested.
- For text inside the image: quote it exactly, specify typeface feel and placement, and
  add "render exactly as given, no extra characters". Japanese works — request a clean
  gothic sans-serif and keep the string short.
- For a set that must look consistent, repeat the same `Style/medium` + `Color palette` +
  `Lighting/mood` lines verbatim in every image block.

### 4. Image-to-image

Pass local files with `-RefImage` (repeatable). They are attached to the Codex turn, which
puts them in conversation context where the built-in tool can see them.

- `-Mode generate` (default) — **references**. A new image that follows the attached one's
  character design, style, palette, or composition. Describe in the prompt body *which*
  aspects to carry over and what is new.
- `-Mode edit` — **edit target**. The attached image is modified. Restate the invariants
  in the prompt body ("change only the background; keep the character unchanged"), because
  the model drifts otherwise.

#### Images the user pasted into chat

**`-RefFromChat` was removed from this bundle.** The upstream helper recovered pasted
images by reading Claude Code session transcripts under `~/.claude/projects`, and when it
could not identify the transcript for the current project it fell back to the most recently
written transcript *anywhere on the machine* — i.e. another project's private images. A
folder meant to be handed to other people must not do that, so the helper scripts are gone
and the flag now throws.

The cover workflow never needed it: reference images arrive as real files through the app's
drag & drop and are passed with `-RefImage`.

If an image only exists as a chat paste, save it to a file first, then pass that path.

### 5. Run it

```bash
pwsh -NoProfile -File "./skills/image-studio/scripts/codex-image.ps1" -PromptFile "<prompt.txt>" -Size 1024x1536 -Quality high -BaseName "<YYYYMMDD-slug>"
```

With a reference file:

```bash
pwsh -NoProfile -File "./skills/image-studio/scripts/codex-image.ps1" -PromptFile "<prompt.txt>" -RefImage "<ref.png>" -Mode generate -Size 1024x1536 -BaseName "<YYYYMMDD-slug>"
```

`-DryRun` resolves the size and prints the plan without generating — use it when unsure
what dimensions a request will actually produce.

Allow a generous timeout: roughly 60–120 s per image at `high`. For 5 images use
600000 ms+. Run it in the background and report when the notification arrives.

Ignore `windows sandbox: ... SpawnChild ... CreateProcessAsUserW failed: 5` — that is
Codex failing to open its own docs under the read-only sandbox. Generation still succeeds.

Exit codes: `0` clean, `1` nothing generated, `2` generated but not at the requested shape,
`3` wrong NUMBER of images came back.

`3` is the one to take seriously. `$CODEX_HOME/generated_images` is shared, so getting more
files than you asked for is what a mis-collection looks like — check the `SAVED` paths
before using them rather than assuming the extra one is a harmless duplicate.

### 6. Verify and report

**Read every generated file** with the Read tool before reporting. Check subject, style,
composition, and — critically — that any in-image text is spelled correctly.

Report the saved paths as markdown links, plus the **actual** pixel size from the `SIZE:`
line. If the script printed a size warning, pass that on rather than burying it.

If something is off, iterate with **one targeted change** to the prompt file and re-run.
Restate the invariants that were already correct so they do not drift.

## Transparent backgrounds

`gpt-image-2` has no native transparency. Generate the subject on a flat `#00ff00`
chroma-key background (`#ff00ff` for green subjects), then key it out:

```bash
python "$HOME/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py" --input <src> --out <final.png> --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 220 --despill
```

Prompt it with: perfectly flat uniform key color, no shadows/gradients/reflections/floor
plane, crisp edges, generous padding, key color absent from the subject. Requires `pillow`.
For hair, fur, smoke, glass, or liquids this looks rough — say so rather than shipping a
bad matte.

## Prerequisites

```bash
npm i -g @openai/codex
```

```bash
codex login
```

`codex login status` should print `Logged in using ChatGPT`.
