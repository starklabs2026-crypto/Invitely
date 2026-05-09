# Invitely

Beautiful digital invitations, made effortless. A React Native mobile app to create and share stunning invitation cards for any occasion — powered by AI and built with Expo, Skia, Firebase, and Supabase.

---

## What is Invitely?

Invitely lets users browse a curated library of invitation card templates, personalise them with their own text, and share the final card instantly. The product targets occasions like birthdays, anniversaries, baby showers, and weddings, with a free tier and a premium unlock path.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navigation | Expo Router v6 (file-based) |
| Canvas / Graphics | `@shopify/react-native-skia` 2.2.12 |
| Authentication | Firebase Auth v10 (email/password) |
| Database | Supabase (PostgreSQL + Row-Level Security) |
| Storage | Supabase Storage (template images) |
| State | Zustand |
| Server state | TanStack React Query |
| Animations | React Native Reanimated v4 + Worklets |
| Fonts | DM Sans, Playfair Display (via `@expo-google-fonts`) |
| Language | TypeScript (strict) |

---

## Project Structure

```
Invitely/
├── app/                        # Expo Router screens (file-based routing)
│   ├── _layout.tsx             # Root layout — fonts, auth listener, providers
│   ├── index.tsx               # Entry redirect (auth → tabs or login)
│   ├── (auth)/
│   │   ├── login.tsx           # Email/password sign-in
│   │   └── signup.tsx          # New account creation
│   ├── (tabs)/
│   │   ├── home/               # Template feed + search
│   │   ├── categories/         # Category browser + filtered list
│   │   ├── my-designs/         # Saved drafts and completed cards
│   │   └── premium/            # Premium upgrade screen
│   ├── editor/
│   │   └── [templateId].tsx    # Full-screen card editor
│   ├── template/
│   │   └── [id].tsx            # Template detail / preview
│   ├── share/
│   │   └── [cardId].tsx        # Share / download screen
│   └── ai-generate.tsx         # AI-assisted design screen (Phase 3)
│
├── components/
│   ├── editor/
│   │   ├── EditorCanvas.tsx    # Skia canvas — renders background + text zones
│   │   ├── TextZone.tsx        # Individual editable text region
│   │   ├── SelectionBox.tsx    # Drag / resize handles for active zone
│   │   └── EditorToolbar.tsx   # Formatting controls (font, colour, size)
│   ├── cards/
│   │   ├── TemplateCard.tsx    # Template grid card
│   │   ├── TrendingCard.tsx    # Horizontal trending card
│   │   └── CategoryCircle.tsx  # Category icon + label
│   ├── ui/
│   │   ├── Button.tsx          # Primary / outline / ghost variants
│   │   ├── Badge.tsx           # Tier / category badge
│   │   ├── SearchBar.tsx       # Search input with icon
│   │   ├── CategoryChip.tsx    # Pill filter chip
│   │   └── SectionHeader.tsx   # Section title + optional "See all" link
│   └── layout/
│       ├── AppHeader.tsx       # Top bar with logo and action icons
│       └── BottomSheet.tsx     # Reusable gesture-driven bottom sheet
│
├── services/
│   ├── auth.ts                 # Firebase Auth helpers (sign-in, sign-up, sign-out, listener)
│   ├── supabase.ts             # Supabase client initialisation
│   ├── templates.ts            # Template queries (fetch list, fetch by id, categories)
│   └── storage.ts              # Supabase storage helpers (upload, URL generation)
│
├── store/
│   ├── authStore.ts            # Zustand — current user + loading state
│   ├── editorStore.ts          # Zustand — active text zones, selected zone, undo
│   └── templateStore.ts        # Zustand — cached template list
│
├── hooks/
│   ├── useAuth.ts              # Auth listener + accessor hook
│   ├── useTemplates.ts         # React Query hooks for template data
│   └── useEditor.ts            # Editor gesture and state helpers
│
├── types/
│   ├── auth.ts                 # User type
│   ├── template.ts             # Template, TextZoneDefinition types
│   └── editor.ts               # EditorZone, EditorState types
│
├── constants/
│   ├── colors.ts               # Design system colour tokens
│   ├── fonts.ts                # Font family constants
│   └── categories.ts           # Category metadata (label, icon, slug)
│
├── supabase/
│   └── schema.sql              # Full DB schema + 7-template seed data
│
├── assets/
│   └── templates/              # Source PNG files for all 7 templates
│
├── metro.config.js             # Custom Metro resolver (Firebase ESM/CJS dedup fix)
├── babel.config.js             # Expo preset + Reanimated plugin
└── tsconfig.json               # TypeScript strict config with path aliases
```

---

## Database Schema (Supabase)

Three tables with Row-Level Security enabled:

**`templates`** — read-only catalogue, managed by admin  
**`saved_cards`** — user drafts and completed cards, owner-only access  
**`user_favourites`** — saved template favourites, owner-only access

The `templates.text_zones` column (JSONB) holds per-template zone definitions — position, default text, font, colour, and size — which drive the editor without any hardcoded layout.

Run `supabase/schema.sql` in the Supabase SQL editor to set up all tables, policies, and seed the 7 launch templates.

---

## Template Library (Phase 1 — 7 templates)

| ID | Occasion | Orientation |
|---|---|---|
| `bday-30th-sarah` | 30th Birthday | Landscape |
| `bday-40th-robert` | 40th Birthday | Landscape |
| `kbday-blastoff-leo` | Kids Birthday — Space | Landscape |
| `kbday-woodland-maya` | Kids Birthday — Woodland | Landscape |
| `bshower-littlestar` | Baby Shower | Landscape |
| `anniv-25th-emily-liam` | 25th Anniversary | Landscape |
| `anniv-hearts-sarah-david` | Anniversary — Hearts | Portrait |

Template PNG files are hosted in Supabase Storage under the `templates` bucket (public access).

---

## Running Locally

### Prerequisites
- Node.js 18+
- Expo Go app on your iOS or Android device (same Wi-Fi as your machine)
- A Firebase project with Email/Password auth enabled
- A Supabase project with the schema applied

### Steps

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start Metro bundler (increase heap for large bundle)
$env:NODE_OPTIONS="--max-old-space-size=8192"   # PowerShell
npx expo start --clear
```

Scan the QR code in the terminal with the Expo Go app.

---

## Key Architecture Decisions

### Firebase ESM/CJS dedup (`metro.config.js`)
Firebase's `@firebase/app` and `@firebase/component` packages ship separate ESM and CJS bundles. Metro can cache them as two separate module instances, breaking the shared singleton registry that `initializeAuth` relies on. `metro.config.js` forces both to always resolve to their CJS bundle so every caller shares one instance.

### Firebase Auth initialisation (`services/auth.ts`)
React Native requires `initializeAuth` with `getReactNativePersistence(AsyncStorage)` instead of plain `getAuth()`. A try/catch IIFE handles hot-reload (where `initializeAuth` throws on the second evaluation because auth is already initialised) by falling back to `getAuth()`.

### Reanimated + Worklets versions
Expo Go SDK 54 bundles `react-native-reanimated 4.1.1` and `react-native-worklets 0.5.1` as pre-compiled native binaries. The JS packages in `package.json` are pinned to these exact versions. Mismatches (e.g. v3 JS against v4 native binary) cause Skia's optional-dependency proxy to throw at startup.

### Dynamic canvas aspect ratio
`EditorCanvas` computes its height dynamically from the template's `aspect_ratio` string (`"7:5"` or `"5:7"`), so the same component handles both landscape and portrait templates without any hardcoded dimensions.

---

## License

MIT — see `LICENSE` for details.
