# REQUIREMENTS.md - TechNews Functional Requirements

## 📱 App Overview

| Item | Value |
|------|-------|
| **Name** | TechNews |
| **Type** | Mobile-first PWA |
| **Purpose** | RSS Reader สำหรับข่าว IT, AI, Security |
| **Target Users** | IT Professionals, Developers, Tech Enthusiasts |

---

## ✅ Functional Requirements

### FR-01: Feed Display
- แสดงรายการข่าวจาก RSS feeds
- แสดง: Title, Source, Time ago, Excerpt, Category tag
- เรียงตามเวลา (ใหม่สุดก่อน)
- รองรับ pagination หรือ infinite scroll

### FR-02: Categories
- หมวดหมู่: All, AI, Security, Dev, Tech
- Filter ข่าวตาม category
- แสดง category tab แบบ horizontal scroll
- Active tab มี highlight

### FR-03: Search
- ค้นหาจาก title และ excerpt
- Real-time filtering (ไม่ต้องกด enter)
- แสดง "No results" ถ้าไม่พบ

### FR-04: Reader Mode
- เปิดอ่านข่าวแบบ clean view
- แสดง: Source, Title, Author, Date, Read time, Content
- ปุ่ม Back กลับไปหน้า list
- ปุ่มปรับ Font size (Aa)
- ปุ่มเปิดใน browser จริง (external link)

### FR-05: Theme (Dark/Light Mode)
- Toggle ระหว่าง Dark และ Light
- จำค่าใน localStorage
- ใช้ Tailwind dark: classes

### FR-06: Pull to Refresh
- ลากลงจากด้านบนเพื่อ refresh
- แสดง loading indicator
- แสดงข้อความ: Pull → Release → Refreshing
- อัพเดทเวลา "Last updated"

### FR-07: Push Notifications
- ขอ permission เมื่อ user enable ใน settings
- แจ้งเตือนเมื่อมีข่าวใหม่ (background check)
- สามารถ on/off ใน settings

### FR-08: RSS Source Management
- แสดง Default sources (ลบไม่ได้)
- เพิ่ม Custom feeds ได้
- ลบ Custom feeds ได้
- Toggle enable/disable แต่ละ feed

### FR-09: Add Feed Modal
- Input: Feed URL (required)
- Select: Category (required)
- Input: Display name (optional)
- Validate URL format
- Test fetch ก่อน save

### FR-10: Settings
- Theme: Light / Dark / System
- Font size: Small / Medium / Large
- Push notifications: On/Off
- Refresh interval: 15min / 30min / 1hr
- About section: Version, Credits

### FR-11: PWA Features
- Installable (Add to Home Screen)
- App icon และ splash screen
- Offline: แสดง cached content
- Service Worker สำหรับ caching

---

## 🎨 UI Requirements

### UR-01: Layout
- Mobile-first (max-width: 430px centered บน desktop)
- Bottom navigation: Home, Sources, Settings
- Sticky header with app name และ actions

### UR-02: Typography
- Title font: Instrument Serif (Google Fonts)
- Body font: IBM Plex Sans (Google Fonts)
- Article title: 18px
- Body text: 14-16px
- Meta text: 11-12px

### UR-03: Colors
**Light Mode:**
- Background: #FAFAFA
- Surface: #FFFFFF
- Primary text: #0A0A0A
- Secondary text: #6B7280
- Accent: #3B82F6
- Border: #E5E7EB

**Dark Mode:**
- Background: #0A0A0A
- Surface: #171717
- Primary text: #FAFAFA
- Secondary text: #9CA3AF
- Accent: #60A5FA
- Border: #262626

### UR-04: Components
- Article Card: rounded-xl, border, padding 16px
- Category Pill: rounded-full, padding 8px 16px
- Button: rounded-lg, min-height 44px
- Input: rounded-xl, border, padding 12px 16px
- Modal: rounded-2xl, backdrop blur

### UR-05: Animations
- Page transitions: fade + slide
- Pull to refresh: spring animation
- Card hover: subtle lift (desktop)
- Button press: scale 0.98
- Theme toggle: smooth color transition

---

## 📰 Default RSS Feeds

```javascript
const DEFAULT_FEEDS = [
  {
    id: 'theverge',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'tech',
    icon: '🌐'
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'tech',
    icon: '💻'
  },
  {
    id: 'hackernews',
    name: 'Hacker News',
    url: 'https://hnrss.org/frontpage',
    category: 'dev',
    icon: '🔶'
  },
  {
    id: 'openai-blog',
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'ai',
    icon: '🤖'
  },
  {
    id: 'krebs',
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
    category: 'security',
    icon: '🔒'
  },
  {
    id: 'schneier',
    name: 'Schneier on Security',
    url: 'https://www.schneier.com/feed/',
    category: 'security',
    icon: '🛡️'
  },
  {
    id: 'aitimes',
    name: 'AI News - VentureBeat',
    url: 'https://venturebeat.com/category/ai/feed/',
    category: 'ai',
    icon: '🧠'
  }
];
```

---

## 🔧 Technical Requirements

### TR-01: CORS Proxy
ใช้ proxy สำหรับ fetch RSS feeds:
- Primary: `https://api.allorigins.win/get?url=`
- Fallback: `https://corsproxy.io/?`

### TR-02: Caching Strategy
- Cache feeds ใน localStorage (15 นาที)
- Service Worker cache สำหรับ static assets
- Network-first strategy สำหรับ feeds

### TR-03: Error Handling
- แสดง error message เมื่อ fetch ล้มเหลว
- Retry button
- Fallback to cached data ถ้ามี

### TR-04: Performance
- Lazy load images
- Debounce search input (300ms)
- Virtual scrolling ถ้า list ยาวมาก (optional)

---

## 📊 Data Models

### Article
```typescript
interface Article {
  id: string;
  title: string;
  link: string;
  excerpt: string;
  content: string;
  author: string;
  pubDate: string;
  source: {
    id: string;
    name: string;
    icon: string;
  };
  category: 'ai' | 'security' | 'dev' | 'tech';
  readTime: number; // minutes
}
```

### Feed
```typescript
interface Feed {
  id: string;
  name: string;
  url: string;
  category: string;
  icon: string;
  enabled: boolean;
  isDefault: boolean;
}
```

### Settings
```typescript
interface Settings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
  refreshInterval: 15 | 30 | 60; // minutes
}
```

---

## 🚫 Out of Scope (ไม่ต้องทำ)

- ❌ User authentication / Login
- ❌ Cloud sync
- ❌ Bookmark / Save articles
- ❌ Offline reading (full content)
- ❌ Share to social media
- ❌ Comments
- ❌ Analytics
