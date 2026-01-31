# CLAUDE.md - TechNews RSS Reader Project

## 🎯 Project Overview

สร้าง **TechNews** - Mobile-first PWA สำหรับอ่าน RSS Feed ติดตามข่าว IT, AI และ Security

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite 5
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **PWA**: vite-plugin-pwa
- **RSS Parsing**: rss-parser (ผ่าน CORS proxy)
- **Icons**: Lucide React

## 📋 Core Features

1. ✅ แสดงรายการข่าวจาก RSS feeds
2. ✅ จัดหมวดหมู่ (AI, Security, Dev, Tech)
3. ✅ ค้นหาข่าว
4. ✅ Reader Mode (อ่านสะอาด)
5. ✅ Dark/Light Mode
6. ✅ Pull to Refresh
7. ✅ Push Notification (ข่าวใหม่)
8. ✅ เพิ่ม/ลบ RSS feeds เอง
9. ✅ PWA (ติดตั้งบน Home Screen)

## 🎨 Design Style

- **Style**: Minimalist, Editorial
- **Font Title**: Instrument Serif (Google Fonts)
- **Font Body**: IBM Plex Sans (Google Fonts)
- **Colors Light**: bg #FAFAFA, surface #FFFFFF, accent #3B82F6
- **Colors Dark**: bg #0A0A0A, surface #171717, accent #60A5FA

## 📁 Project Structure

```
technews/
├── public/
│   ├── favicon.ico
│   └── icons/
│       ├── icon-192x192.png
│       └── icon-512x512.png
├── src/
│   ├── components/
│   │   ├── ui/           # Button, Card, Input, Modal, Toggle
│   │   ├── layout/       # Header, BottomNav, PullToRefresh
│   │   └── features/     # ArticleCard, ArticleList, CategoryTabs, SearchBar, ReaderView, SourceList, AddFeedModal, Settings
│   ├── hooks/
│   │   ├── useFeeds.js
│   │   ├── usePullToRefresh.js
│   │   └── useTheme.js
│   ├── stores/
│   │   └── useStore.js   # Zustand store
│   ├── utils/
│   │   ├── rssParser.js
│   │   ├── storage.js
│   │   └── constants.js
│   ├── data/
│   │   └── defaultFeeds.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🔧 Key Implementation Details

### RSS CORS Proxy
ใช้ AllOrigins หรือ Cloudflare Worker เป็น proxy:
```javascript
const PROXY_URL = 'https://api.allorigins.win/get?url=';
const feedUrl = `${PROXY_URL}${encodeURIComponent(originalUrl)}`;
```

### Local Storage Keys
- `technews-feeds`: รายการ feeds ที่ user เพิ่ม
- `technews-settings`: การตั้งค่า (theme, notifications)
- `technews-cache`: cache ข่าวล่าสุด

### Push Notifications
ใช้ Service Worker + Notification API สำหรับแจ้งเตือนข่าวใหม่

## ⚠️ Important Rules

1. ใช้ Tailwind CSS เท่านั้น ไม่ใช้ inline styles
2. ทุก component ต้อง responsive (mobile-first)
3. รองรับ Dark Mode ทุก component
4. Handle loading และ error states
5. ใช้ semantic HTML
6. Accessibility: focus states, aria labels

## 🚀 Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
