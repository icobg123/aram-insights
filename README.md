# ARAM Insights

A Next.js application that tracks and displays League of Legends champion, item, and rune balance adjustments for special game modes (ARAM, Arena, Ultra Rapid Fire).

## Features

- Real-time balance changes scraped from League of Legends Wiki
- Champion statistics including damage modifiers and win rates
- Item and rune adjustments for special game modes
- Interactive tables with sorting, filtering, and search
- Responsive dark theme UI with TailwindCSS and DaisyUI
- Automatic weekly data updates via ISR (Incremental Static Regeneration)

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + DaisyUI
- **Data Fetching**: Server Components with ISR
- **Web Scraping**: Cheerio
- **Tables**: TanStack React Table
- **Image Optimization**: Plaiceholder for blur placeholders

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npx prettier --write .  # Format code
```

## Project Structure

```
src/
├── app/
│   ├── fetching/scraping.ts    # All data fetching logic
│   ├── aram/                   # ARAM mode page
│   ├── arena/                  # Arena mode page
│   └── urf/                    # URF mode page
├── components/                 # Client components (tables, UI)
├── types.ts                    # TypeScript type definitions
└── utils.ts                    # Utility functions
```

## Data Sources

- **League of Legends Wiki**: Balance changes for special game modes
- **DDragon API**: Official champion/item/rune data and images
- **MetaSrc**: Win rate statistics

## License

MIT
