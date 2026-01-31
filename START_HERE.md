# START_HERE.md - วิธีใช้งานไฟล์กับ Claude Code

## 🎯 ภาพรวม

ไฟล์ชุดนี้ใช้สำหรับสร้าง **TechNews** - Mobile-first PWA สำหรับอ่าน RSS Feed

---

## 📁 ไฟล์ในชุดนี้

| ไฟล์ | หน้าที่ |
|------|--------|
| `CLAUDE.md` | ข้อมูลโปรเจค, Tech Stack, Structure |
| `ROLES.md` | บทบาท AI ในแต่ละ Phase |
| `REQUIREMENTS.md` | Functional & UI Requirements ทั้งหมด |
| `START_HERE.md` | คำแนะนำการใช้งาน (ไฟล์นี้) |

---

## 🚀 วิธีใช้งาน

### Step 1: เตรียมโฟลเดอร์
สร้างโฟลเดอร์ใหม่และใส่ไฟล์ทั้ง 4 ไว้ด้วยกัน:
```
~/Projects/technews_setup/
├── CLAUDE.md
├── ROLES.md
├── REQUIREMENTS.md
└── START_HERE.md
```

### Step 2: เปิด Claude Desktop App
- เลือกแท็บ **Code**
- กด "Select folder" แล้วเลือกโฟลเดอร์ `technews_setup`

### Step 3: พิมพ์ Prompt เริ่มต้น

```
อ่านไฟล์ CLAUDE.md, ROLES.md และ REQUIREMENTS.md
แล้วเริ่มทำตาม workflow ตั้งแต่ Phase 1
รายงานผลเมื่อทำเสร็จแต่ละ phase แล้วรอคำสั่งก่อนไป phase ถัดไป
```

---

## 📋 Workflow Phases

### Phase 1: Setup Project
**สิ่งที่ต้องทำ:**
- สร้างโฟลเดอร์ `technews` (โปรเจคจริง)
- สร้าง `package.json`
- สร้าง config files (vite, tailwind, postcss)
- สร้าง `index.html`
- สร้างโครงสร้างโฟลเดอร์ `src/`

**Prompt:**
```
เริ่ม Phase 1: Setup Project
สร้างโครงสร้างโปรเจคและ config files ทั้งหมด
```

---

### Phase 2: Core Components
**สิ่งที่ต้องทำ:**
- สร้าง UI components (Button, Card, Input, Modal, Toggle)
- สร้าง Layout components (Header, BottomNav)
- สร้าง base styles (index.css)

**Prompt:**
```
เริ่ม Phase 2: Core Components
สร้าง UI components และ Layout components
```

---

### Phase 3: State & Utils
**สิ่งที่ต้องทำ:**
- สร้าง Zustand store
- สร้าง utility functions (rssParser, storage, constants)
- สร้าง custom hooks

**Prompt:**
```
เริ่ม Phase 3: State & Utils
สร้าง Zustand store, utilities และ hooks
```

---

### Phase 4: Feature Components
**สิ่งที่ต้องทำ:**
- ArticleCard, ArticleList
- CategoryTabs, SearchBar
- ReaderView
- SourceList, AddFeedModal
- Settings components
- PullToRefresh

**Prompt:**
```
เริ่ม Phase 4: Feature Components
สร้าง feature components ทั้งหมด
```

---

### Phase 5: App Assembly
**สิ่งที่ต้องทำ:**
- สร้าง main App.jsx
- รวม components เข้าด้วยกัน
- เพิ่ม routing/navigation logic
- ทดสอบ flow ทั้งหมด

**Prompt:**
```
เริ่ม Phase 5: App Assembly
รวม components และทำให้ app ทำงานได้
```

---

### Phase 6: PWA Setup
**สิ่งที่ต้องทำ:**
- สร้าง PWA icons
- Configure service worker
- ทดสอบ installability
- ทดสอบ push notifications

**Prompt:**
```
เริ่ม Phase 6: PWA Setup
Configure PWA และ push notifications
```

---

### Phase 7: Review & Polish
**สิ่งที่ต้องทำ:**
- Code review
- Fix bugs
- Improve performance
- Final testing

**Prompt:**
```
เริ่ม Phase 7: Review & Polish
ตรวจสอบโค้ด แก้ bugs และ polish
```

---

## ✅ Completion Checklist

เมื่อทำเสร็จทุก phase ควรมี:

- [ ] App รันได้ด้วย `npm run dev`
- [ ] แสดงข่าวจาก RSS feeds
- [ ] Filter ตาม category
- [ ] Search ทำงาน
- [ ] Reader mode เปิดได้
- [ ] Dark/Light mode toggle
- [ ] Pull to refresh
- [ ] เพิ่ม/ลบ feeds ได้
- [ ] Settings ทำงาน
- [ ] PWA installable
- [ ] Build production ได้ `npm run build`

---

## 🆘 Troubleshooting

### RSS fetch ไม่ทำงาน
- ตรวจสอบ CORS proxy URL
- ลอง proxy อื่น: `https://corsproxy.io/?`

### Dark mode ไม่ทำงาน
- ตรวจสอบ `darkMode: 'class'` ใน tailwind.config.js
- ตรวจสอบว่ามี `dark` class บน `<html>`

### PWA ไม่ติดตั้ง
- ต้องรันบน HTTPS หรือ localhost
- ตรวจสอบ manifest.json
- ตรวจสอบ service worker registration

---

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Lucide Icons](https://lucide.dev/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

---

Good luck! 🚀
