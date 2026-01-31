# TechNews - RSS Reader PWA

A mobile-first Progressive Web App for reading RSS feeds about IT, AI, and Security news.

## Features

- **RSS Feed Reader**: Read news from multiple tech sources
- **Categories**: Filter by AI, Security, Dev, and Tech categories
- **Search**: Quick search through articles with debounced input
- **Reader Mode**: Clean reading experience with adjustable font sizes
- **Dark/Light Mode**: System preference aware with manual toggle
- **Pull to Refresh**: Mobile-native refresh gesture
- **Auto Refresh**: Configurable automatic feed refresh interval
- **Push Notifications**: Get notified when new articles are available
- **Custom Feeds**: Add your own RSS feeds
- **PWA Support**: Install on home screen and use offline

## Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** - Utility-first styling
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icons
- **vite-plugin-pwa** - Progressive Web App support

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
cd technews

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
technews/
├── public/
│   ├── favicon.svg
│   └── icons/
│       ├── icon-192x192.svg
│       └── icon-512x512.svg
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── layout/       # Layout components
│   │   └── features/     # Feature-specific components
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand state management
│   ├── utils/            # Utility functions
│   ├── data/             # Static data (default feeds)
│   ├── styles/           # Global CSS
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Default RSS Feeds

- **The Verge** - Tech news
- **TechCrunch** - Tech news
- **Hacker News** - Dev news
- **OpenAI Blog** - AI news
- **Krebs on Security** - Security news
- **Schneier on Security** - Security news
- **VentureBeat AI** - AI news

## Configuration

### Adding Custom Feeds

1. Go to the **Sources** tab
2. Click **Add Custom Feed**
3. Enter the RSS feed URL
4. Select a category and icon
5. Click **Add Feed**

### Settings

- **Theme**: Light, Dark, or System
- **Font Size**: Small, Medium, or Large (for reader mode)
- **Notifications**: Enable/disable push notifications
- **Refresh Interval**: 15 minutes, 30 minutes, or 1 hour

## Design

- **Style**: Minimalist, Editorial
- **Fonts**: Instrument Serif (titles), IBM Plex Sans (body)
- **Colors**:
  - Light: Background #FAFAFA, Surface #FFFFFF, Accent #3B82F6
  - Dark: Background #0A0A0A, Surface #171717, Accent #60A5FA

## License

MIT
