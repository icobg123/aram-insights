# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ARAM Insights is a Next.js application that tracks and displays League of Legends champion/item/rune balance adjustments for special game modes (ARAM, Arena, Ultra Rapid Fire). The app combines web scraping from the League of Legends Wiki with official Riot API data to provide comprehensive balance information.

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code (Prettier with Tailwind plugin)
npx prettier --write .
```

## Architecture

### Data Fetching Pipeline

The application uses a **multi-stage server-side data fetching** pattern in `src/app/fetching/scraping.ts`:

1. **Parallel initial fetch**: `scrapePatchVersion()` and `scrapeLoLWikiData()` run concurrently
   - Scrapes League Wiki for current patch version and balance changes
   - Uses Cheerio for HTML parsing

2. **Data enrichment**: After scraping, three parallel fetches run:
   - `fetchChampionAllData()`: Merges scraped data with DDragon API data, fetches MetaSrc win rates, fetches individual champion spells/passives
   - `fetchItemsAllData()`: Merges items from DDragon with scraped changes
   - `fetchRunesAllData()`: Merges runes from DDragon with scraped changes

3. **Image optimization**: Uses `plaiceholder` to generate blur placeholders for all images during fetch

**Key Pattern**: All page components are async server components that fetch data before rendering. This data is then passed as props to client components for interactivity.

**Caching**: ISR (Incremental Static Regeneration) with `revalidate: 604800` (7 days). Pages regenerate weekly or on manual revalidation.

### Component Organization

- **Server Components** (src/app): Pages that handle data fetching
- **Client Components** (src/components): Interactive tables and UI elements marked with `"use client"`

**Table Architecture**:
- `TableWrapper` (server component): Container receiving fetched data, manages tab state
- `ChampionTableWrapper`, `ItemTableWrapper`, `RuneTableWrapper` (client components): Use TanStack React Table for sorting, filtering, and search
- `Table`, `TableBody`, `TableHeadCell`: Generic reusable table components
- `OtherChangesCell`, `AbilityChanges`: Display balance change details

### Important Files

- `src/app/fetching/scraping.ts`: All data fetching logic
- `src/types.ts`: Comprehensive TypeScript types for champions, items, runes, and API responses
- `src/middleware.ts`: Route protection and redirects
- `src/utils.ts`: Utility functions

### Key Data Models

```typescript
ChampionDataApi {
  champion: string
  damageDealt: number      // ARAM damage dealt modifier
  damageReceived: number   // ARAM damage received modifier
  generalChanges: string[]
  abilityChanges: AbilityChangesScrapped[]
  winRate: number          // From MetaSrc
  icon: IconData
  title: string
  spells: Record<string, IconData>  // Passive + Q/W/E/R
}

IconData {
  src: string
  height: number
  width: number
  base64: string  // Blur placeholder
}
```

## Code Conventions

### TypeScript Configuration

- Path aliases configured in `tsconfig.json`:
  - `@/*` → `./src/*`
  - `@/public/*` → `./public/*`
  - `@/root/*` → `./*`
- Strict mode enabled
- All files should be TypeScript

### Styling

- **TailwindCSS** with **DaisyUI** components
- Prettier configured with `prettier-plugin-tailwindcss` for class sorting
- Dark theme (bg-gray-900, gray-800 backgrounds)
- Mobile-first responsive design

Code formatting rules (from .prettierrc.json):
- Double quotes for strings
- Semicolons required
- 2 space indentation
- 80 character line width
- Trailing commas (ES5)

### Next.js Configuration

Important config in `next.config.js`:
- `staticPageGenerationTimeout: 500` seconds for long data fetches
- `images.unoptimized: true` (images from DDragon API)
- Remote pattern allowed: `ddragon.leagueoflegends.com`

### Data Fetching Patterns

When adding new data sources or modifying fetching:
- Use `Promise.all()` for parallel fetches to minimize load time
- All fetching functions should have try-catch with graceful fallbacks
- Return empty objects/arrays on error rather than throwing
- Log errors to console for debugging
- Always include `revalidate` option for ISR

### Component Patterns

**Server Components** (default):
- All page components in `src/app`
- Async functions that fetch data
- Pass data as props to client components

**Client Components** (`"use client"`):
- Any component using hooks (useState, useEffect, etc.)
- TanStack table wrappers
- Interactive UI elements (tabs, filters, search)

**TanStack React Table**:
- Use `createColumnHelper` for type-safe columns
- Implement global filter for search (searches entity names)
- Use `getCoreRowModel`, `getFilteredRowModel`, `getSortedRowModel`

## Adding New Features

### Adding a New Game Mode

1. Create new page: `src/app/[mode-name]/page.tsx`
2. Add Wiki URL to scraping functions in `src/app/fetching/scraping.ts`
3. Update middleware routing in `src/middleware.ts`
4. Add navigation link in `src/components/header/Header.tsx`
5. Update metadata generation

### Modifying Data Structure

1. Update types in `src/types.ts` first
2. Modify scraping logic in `src/app/fetching/scraping.ts`
3. Update component props and rendering logic
4. Update table column definitions in respective `*TableWrapper.tsx` files

### Adding New Table Columns

1. Modify data type in `src/types.ts`
2. Update fetching to include new data
3. Add column definition in `createColumnHelper()` in table wrapper
4. Create cell renderer component if needed (see `ChampionCell.tsx`, `ItemCell.tsx`)

## Data Sources

- **League of Legends Wiki** (scraped): Balance changes for ARAM/Arena/URF
  - Patch history: `https://wiki.leagueoflegends.com/en-us/Patch`
  - ARAM: `https://wiki.leagueoflegends.com/en-us/ARAM`
  - Arena: `https://wiki.leagueoflegends.com/en-us/Arena`
  - URF: `https://wiki.leagueoflegends.com/en-us/Ultra_Rapid_Fire`
- **DDragon API** (`ddragon.leagueoflegends.com`): Official champion/item/rune data and images
- **MetaSrc** (`metasrc.com`): Win rate statistics

### Wiki Scraping Details

The new official League of Legends wiki (migrated from Fandom in 2025) has a different HTML structure:

**Patch Version Scraping:**
- Extracted from the first row of the patches table
- Format: `V25.20` → parsed to `25.20`

**Champion Data:**
- Table with 4 columns: Champion | Special Modifiers Header | Modifiers List | Abilities Changes
- Damage dealt/received parsed from text like "Damage dealt increased by 5%"
- Ability changes grouped by ability name with icon references

**Items and Runes:**
- Located in sections identified by heading text
- Format: Item/Rune name (linked) followed by `<ul>` with changes
- Changes extracted from bullet lists

## Testing Strategy

Currently no automated tests. When adding tests:
- Use Jest + React Testing Library for component tests
- Test data fetching functions with mocked responses
- Test table filtering/sorting behavior
- Test responsive design with viewport testing
