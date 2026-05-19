# Invitely

Beautiful digital invitations, made effortless. A React Native mobile app to create and share stunning invitation cards for any occasion — powered by AI-assisted zone detection, a Skia text renderer, and a full ingestion pipeline for template management.

---

## What is Invitely?

Invitely lets users browse a curated library of invitation card templates, personalise them with their own text, and share the final card instantly. The product targets occasions like birthdays, anniversaries, baby showers, and weddings, with a free tier and a premium unlock path.

Templates are ingested through an AI pipeline (GPT-4o Vision) that automatically detects optimal text zone placements, assigns fonts, and suggests text effects — eliminating manual zone authoring.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navigation | Expo Router v6 (file-based) |
| Canvas / Graphics | `@shopify/react-native-skia` 2.2.12 |
| Authentication | Supabase Auth (email/password) |
| Database | Supabase (PostgreSQL + Row-Level Security) |
| Storage | Supabase Storage (`templates` + `template-drafts` buckets) |
| State | Zustand v4 |
| Server state | TanStack React Query v5 (5 min stale time) |
| Animations | React Native Reanimated v4 + Worklets |
| Fonts | 38 custom fonts via `@expo-google-fonts` |
| AI — Zone detection | OpenAI GPT-4o Vision |
| AI — Text removal | OpenAI DALL-E 2 (inpainting) |
| Deployment | EAS Update (OTA) |
| Language | TypeScript (strict) |

---

## Project Structure

```
Invitely/
├── app/                            # Expo Router screens (file-based routing)
│   ├── _layout.tsx                 # Root layout — fonts, auth listener, providers
│   ├── index.tsx                   # Entry redirect (auth → tabs or login)
│   ├── (auth)/
│   │   ├── login.tsx               # Email/password sign-in
│   │   └── signup.tsx              # New account creation
│   ├── (tabs)/
│   │   ├── home/                   # Template feed + search
│   │   ├── categories/             # Category browser + filtered list
│   │   ├── my-designs/             # Saved drafts and completed cards
│   │   └── premium/                # Premium upgrade screen
│   ├── editor/
│   │   └── [templateId].tsx        # Full-screen card editor
│   ├── template/
│   │   └── [id].tsx                # Template detail / preview
│   └── share/
│       └── new.tsx                 # Share / download screen
│
├── components/
│   ├── editor/
│   │   ├── EditorCanvas.tsx        # Background image canvas (aspect-ratio aware)
│   │   ├── TextZone.tsx            # Draggable text zone — plain + shadow rendering
│   │   ├── StyledTextZone.tsx      # Draggable text zone — stroke, glow, gradient (Skia)
│   │   ├── SelectionBox.tsx        # Selection handles for active zone
│   │   ├── EditorToolbar.tsx       # Formatting controls (font, colour, size, effects)
│   │   └── TextEditModal.tsx       # Full-screen text input modal
│   ├── cards/
│   │   ├── TemplateCard.tsx        # Template grid card
│   │   ├── TemplateThumbnail.tsx   # Scaled zone preview overlay (uses text_zones_v2)
│   │   ├── TrendingCard.tsx        # Horizontal trending card
│   │   └── CategoryCircle.tsx      # Category icon + label
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CategoryChip.tsx
│   │   └── SectionHeader.tsx
│   └── layout/
│       ├── AppHeader.tsx
│       └── BottomSheet.tsx
│
├── hooks/
│   ├── useAuth.ts                  # Supabase auth listener + accessor
│   ├── useTemplates.ts             # React Query hooks for template data
│   ├── useEditor.ts                # Zone state, undo/redo, initFromTemplate (v1 + v2)
│   └── useEditorFonts.ts           # Lazy-loads all 38 decorative fonts on editor mount
│
├── services/
│   ├── auth.ts                     # Supabase Auth helpers
│   ├── supabase.ts                 # Supabase client
│   ├── templates.ts                # Template queries + draft save/load
│   └── storage.ts                  # Storage upload helpers
│
├── store/
│   ├── authStore.ts                # Zustand — current user
│   └── editorStore.ts              # Zustand — captured URI, cardId
│
├── types/
│   ├── template.ts                 # Template, TextZoneDefinition (v1), TextZoneDefinitionV2,
│   │                               #   TextEffects, RenderMode, TemplateReviewStatus
│   └── editor.ts                   # ZoneState (includes effects field)
│
├── utils/
│   └── zoneGeometry.ts             # zoneV2ToPixels, zoneV1ToPixels, scaledFontSize, upgradeZone
│
├── constants/
│   ├── colors.ts
│   ├── fonts.ts
│   └── categories.ts
│
├── supabase/
│   ├── schema.sql                  # Full DB schema + 17-template seed (idempotent)
│   └── migrations/
│       └── 20260519_ingestion_schema.sql   # ingestion_jobs + ingestion_zone_reviews tables
│
└── tools/
    └── ingestion-cli/              # Offline AI pipeline for template ingestion
        ├── src/
        │   ├── ingest.ts           # npm run ingest -- --template <id> [--remove-text] [--hint]
        │   ├── batch.ts            # npm run batch [--all] [--limit n] [--dry-run]
        │   ├── review.ts           # npm run review -- --list | --approve | --reject
        │   ├── compare.ts          # npm run compare -- --template <id>
        │   ├── config.ts           # 38 BUNDLED_FONTS list
        │   ├── types.ts            # Zod schemas (ProposedZone, AnalysisResult)
        │   └── lib/
        │       ├── analyzer.ts     # GPT-4o Vision — downloads image as base64, returns zones
        │       ├── remover.ts      # DALL-E 2 inpainting — removes baked-in text from background
        │       ├── fontMatcher.ts  # Validates AI-chosen font against bundle, falls back
        │       ├── writer.ts       # DB writer — createJob, writeZoneReview, promoteApprovedZones
        │       └── clients.ts      # OpenAI + Supabase singletons
        ├── .env.example
        └── package.json
```

---

## Database Schema

Five tables with Row-Level Security:

| Table | Purpose | Access |
|---|---|---|
| `templates` | Template catalogue with v1 + v2 zone data | Public read |
| `saved_cards` | User drafts and completed cards | Owner only |
| `user_favourites` | Saved template bookmarks | Owner only |
| `ingestion_jobs` | Tracks AI pipeline runs per template | Service role only |
| `ingestion_zone_reviews` | Proposed zones awaiting human approval | Service role only |

### Zone schema evolution

**v1 `text_zones`** (JSONB) — hand-authored, uses `x/y/w/h` percentage coords. Kept for backwards compatibility.

**v2 `text_zones_v2`** (JSONB) — AI-generated, uses `leftPct/topPct/widthPct/heightPct`, adds `effects` (shadow, stroke, gradient, glow), `confidence`, and `renderMode`. The editor and thumbnails prefer v2 when present.

Run `supabase/schema.sql` in the Supabase SQL editor to set up all tables, policies, and seed all 17 templates.

---

## Template Library (17 templates — all 9:16 portrait)

| ID | Name | Category |
|---|---|---|
| `bday-30th-sarah` | 30th Birthday — Navy Gold | Birthday |
| `bday-40th-robert` | 40th Birthday — Art & Wine | Birthday |
| `bday-retro-30th` | 30th Birthday — Retro Vintage | Birthday |
| `bday-fashion-luxury` | 30th Birthday — Fashion Luxury | Birthday |
| `kbday-blastoff-leo` | Kids Birthday — Space Blastoff | Kids Birthday |
| `kbday-woodland-maya` | Kids Birthday — Woodland | Kids Birthday |
| `kbday-dino-1st-boy` | 1st Birthday — Dino Roar King | Kids Birthday |
| `kbday-teddy-1st-girl` | 1st Birthday — Teddy Bear Girl | Kids Birthday |
| `kbday-barbie-glam` | Barbie Birthday — Pink Glam | Kids Birthday |
| `kbday-peppa-fair` | 3rd Birthday — Peppa Village Fair | Kids Birthday |
| `bshower-littlestar` | Baby Shower — Little Star | Baby Shower |
| `bshower-floral-pink` | Baby Shower — Floral Pink | Baby Shower |
| `bshower-elephant-blue` | Baby Shower — Elephant Blue | Baby Shower |
| `anniv-25th-emily-liam` | 25th Anniversary — Floral | Anniversary |
| `anniv-hearts-sarah-david` | Anniversary — Hearts | Anniversary |
| `anniv-25th-champagne-gold` | 25th Anniversary — Champagne Gold | Anniversary |
| `anniv-25th-navy-lights` | 25th Anniversary — Navy Lights | Anniversary |

---

## AI Ingestion Pipeline

Templates with embedded text are processed through a 4-step CLI pipeline before going live in the app.

### Architecture

```
Source image (Supabase Storage)
        │
        ▼
  GPT-4o Vision ──► Identifies 5–9 text zones (position, font, color, effects)
        │
        ▼
  (optional) DALL-E 2 ──► Removes baked-in text from background via inpainting
        │
        ▼
  ingestion_zone_reviews ──► Human reviews comparison image
        │
        ▼
  npm run review --approve ──► Zones promoted to templates.text_zones_v2 (live)
```

### CLI commands

```bash
cd tools/ingestion-cli

# Single template
npm run ingest -- --template <id>
npm run ingest -- --template <id> --remove-text          # + DALL-E 2 text removal
npm run ingest -- --template <id> --hint "placement tip" # + per-template guidance

# Batch all templates
npm run batch -- --all
npm run batch -- --all --dry-run   # preview only, no API calls

# Visual comparison (saves to comparisons/<id>.png)
npm run compare -- --template <id>

# Review queue
npm run review -- --list
npm run review -- --approve <review-id>
npm run review -- --reject <review-id> --notes "reason"
```

### Setup

```bash
cd tools/ingestion-cli
cp .env.example .env
# Fill in: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
npm install
```

---

## Text Effects System (Sprint 4)

The editor supports four text effect types rendered via `StyledTextZone`:

| Effect | Rendering method |
|---|---|
| `shadow` | React Native `textShadow*` style props |
| `stroke` | Four offset `Text` layers (N/S/E/W) in stroke color behind fill |
| `glow` | `textShadowRadius` with zero offset |
| `gradient` | Skia `LinearGradient` canvas overlay composited over text |

The editor automatically selects `StyledTextZone` (for zones with effects) or plain `TextZone` (for zones without) based on the presence of the `effects` field.

---

## Running Locally

### Prerequisites
- Node.js 18+
- A Supabase project with `schema.sql` applied
- `.env` file with Supabase credentials (see below)

### Environment variables

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Start dev server

```powershell
# Install dependencies
npm install --legacy-peer-deps

# Start Metro (increase heap for large font bundle)
$env:NODE_OPTIONS="--max-old-space-size=8192"
npx expo start --clear
```

> **Note:** This app uses `@shopify/react-native-skia` (a custom native module). It cannot run in the standard Expo Go app. You need an EAS development build or a local `npx expo run:android` / `npx expo run:ios` build.

### Publishing an OTA update

```powershell
eas update --branch main --message "your message"
```

---

## Key Architecture Decisions

### Supabase Auth (replaced Firebase)
Auth is handled entirely by Supabase Auth (email/password). Firebase has been removed. The `services/auth.ts` wraps Supabase's `signInWithPassword`, `signUp`, and `onAuthStateChange`.

### Zone v2 coordinate system
v2 zones use `leftPct/topPct/widthPct/heightPct` (percentage of canvas) instead of v1's `x/y/w/h`, making zones resolution-independent. `utils/zoneGeometry.ts` converts to absolute pixels for rendering and provides `upgradeZone()` to migrate v1 → v2.

### Font loading strategy
The 2 UI fonts (DM Sans, Playfair Display) load at app start in `_layout.tsx`. The 38 decorative editor fonts load lazily via `useEditorFonts` only when the editor screen mounts — preventing a ~6 MB font payload from blocking app startup. The editor gates zone rendering on `fontsLoaded` to avoid a flash of unstyled text.

### Base64 image encoding for GPT-4o
Supabase Storage URLs are private-network URLs that OpenAI's API cannot reach directly. `analyzer.ts` downloads each template image locally via `node-fetch` and sends it as a `data:image/png;base64,...` URL instead, which works reliably regardless of storage bucket visibility.

### DALL-E 2 square-pad strategy
DALL-E 2 inpainting requires a square PNG ≤ 4 MB. Portrait template images are padded to a square with transparent edges, inpainted at 1024×1024, then cropped back to the original dimensions using `sharp`.

### Reanimated + Worklets version pinning
Expo SDK 54 bundles `react-native-reanimated 4.1.1` and `react-native-worklets 0.5.1` as pre-compiled native binaries. The JS packages in `package.json` are pinned to these exact versions. Mismatches cause Skia's optional-dependency proxy to throw at startup.

---

## License

MIT — see `LICENSE` for details.
