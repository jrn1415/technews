export const th = {
  // App
  appName: 'TechNews',
  appTagline: 'ข่าวเทคโนโลยีประจำวัน',

  // Navigation
  nav: {
    home: 'หน้าแรก',
    saved: 'บันทึกไว้',
    stats: 'สถิติ',
    sources: 'แหล่งข่าว',
    settings: 'ตั้งค่า'
  },

  // Categories
  categories: {
    all: 'ทั้งหมด',
    ai: 'AI',
    security: 'ความปลอดภัย',
    dev: 'นักพัฒนา',
    tech: 'เทคโนโลยี'
  },

  // Header
  header: {
    search: 'ค้นหา',
    searchPlaceholder: 'ค้นหาบทความ...',
    lastUpdated: 'อัพเดตล่าสุด'
  },

  // Articles
  articles: {
    readTime: 'นาทีอ่าน',
    by: 'โดย',
    noResults: 'ไม่พบบทความ',
    noResultsDesc: 'ลองค้นหาด้วยคำอื่น หรือเปลี่ยนหมวดหมู่',
    loadError: 'เกิดข้อผิดพลาด',
    loadErrorDesc: 'ไม่สามารถโหลดบทความได้ กรุณาลองใหม่',
    tryAgain: 'ลองอีกครั้ง',
    openExternal: 'เปิดในเบราว์เซอร์',
    share: 'แชร์',
    bookmark: 'บันทึก',
    removeBookmark: 'ลบออกจากที่บันทึก'
  },

  // Reader
  reader: {
    back: 'กลับ',
    fontSize: 'ขนาดตัวอักษร',
    small: 'เล็ก',
    medium: 'กลาง',
    large: 'ใหญ่',
    readOriginal: 'อ่านต้นฉบับ'
  },

  // Bookmarks
  bookmarks: {
    title: 'บทความที่บันทึก',
    empty: 'ยังไม่มีบทความที่บันทึก',
    emptyDesc: 'กดไอคอนบันทึกที่บทความเพื่อเก็บไว้อ่านทีหลัง',
    clearAll: 'ลบทั้งหมด',
    clearConfirm: 'ต้องการลบบทความที่บันทึกทั้งหมดใช่ไหม?',
    cleared: 'ลบบทความที่บันทึกทั้งหมดแล้ว',
    added: 'บันทึกบทความแล้ว',
    removed: 'ลบออกจากที่บันทึกแล้ว'
  },

  // Stats
  stats: {
    title: 'สถิติบทความ',
    totalArticles: 'บทความทั้งหมด',
    avgReadTime: 'เวลาอ่านเฉลี่ย (นาที)',
    topCategory: 'หมวดยอดนิยม',
    byCategory: 'แยกตามหมวด',
    articles: 'บทความ'
  },

  // Sources
  sources: {
    title: 'จัดการแหล่งข่าว',
    default: 'แหล่งข่าวเริ่มต้น',
    custom: 'แหล่งข่าวที่เพิ่ม',
    addNew: 'เพิ่มแหล่งข่าว',
    noCustom: 'ยังไม่มีแหล่งข่าวที่เพิ่มเอง',
    deleteConfirm: 'ต้องการลบแหล่งข่าวนี้ใช่ไหม?'
  },

  // Add Feed Modal
  addFeed: {
    title: 'เพิ่มแหล่งข่าว RSS',
    url: 'URL ของ RSS Feed',
    urlPlaceholder: 'https://example.com/rss.xml',
    name: 'ชื่อที่แสดง (ไม่บังคับ)',
    namePlaceholder: 'เช่น บล็อกเทคโนโลยี',
    category: 'หมวดหมู่',
    selectCategory: 'เลือกหมวดหมู่',
    icon: 'ไอคอน',
    cancel: 'ยกเลิก',
    add: 'เพิ่ม',
    adding: 'กำลังเพิ่ม...',
    validating: 'กำลังตรวจสอบ...',
    invalidUrl: 'URL ไม่ถูกต้อง',
    fetchError: 'ไม่สามารถดึงข้อมูลจาก Feed นี้ได้'
  },

  // Settings
  settings: {
    title: 'ตั้งค่า',
    appearance: 'การแสดงผล',
    theme: 'ธีม',
    themeLight: 'สว่าง',
    themeDark: 'มืด',
    themeSystem: 'ตามระบบ',
    fontSize: 'ขนาดตัวอักษร (Reader)',
    language: 'ภาษา',
    languageTh: 'ไทย',
    languageEn: 'English',
    notifications: 'การแจ้งเตือน',
    pushNotifications: 'Push Notifications',
    pushDesc: 'รับแจ้งเตือนเมื่อมีบทความใหม่',
    pushUnsupported: 'อุปกรณ์ไม่รองรับการแจ้งเตือน',
    autoRefresh: 'รีเฟรชอัตโนมัติ',
    refreshInterval: 'ความถี่ในการรีเฟรช',
    every15min: 'ทุก 15 นาที',
    every30min: 'ทุก 30 นาที',
    everyHour: 'ทุก 1 ชั่วโมง',
    about: 'เกี่ยวกับ',
    version: 'เวอร์ชัน'
  },

  // Pull to Refresh
  pullToRefresh: {
    pull: 'ดึงลงเพื่อรีเฟรช',
    release: 'ปล่อยเพื่อรีเฟรช',
    refreshing: 'กำลังรีเฟรช...'
  },

  // Offline
  offline: {
    message: 'คุณออฟไลน์อยู่',
    description: 'กำลังแสดงข้อมูลที่บันทึกไว้'
  },

  // Common
  common: {
    loading: 'กำลังโหลด...',
    error: 'เกิดข้อผิดพลาด',
    retry: 'ลองอีกครั้ง',
    cancel: 'ยกเลิก',
    save: 'บันทึก',
    delete: 'ลบ',
    confirm: 'ยืนยัน',
    close: 'ปิด'
  },

  // Install Guide
  install: {
    title: 'ติดตั้ง TechNews',
    description: 'เพิ่มลงหน้าจอหลักเพื่อเข้าถึงได้เร็วขึ้น',
    howTo: 'วิธีติดตั้ง',
    later: 'ไว้ทีหลัง',
    guideTitle: 'วิธีติดตั้งแอป',
    guideSubtitle: 'เพิ่มลง Home Screen',
    alreadyInstalled: 'ติดตั้งแอปแล้ว!',
    gotIt: 'เข้าใจแล้ว',
    settingsTitle: 'ติดตั้งแอป',
    settingsDesc: 'เพิ่มไอคอนลงหน้าจอหลัก',
    ios: {
      step1Title: 'กดปุ่ม Share',
      step1Desc: 'กดปุ่ม Share (ไอคอนสี่เหลี่ยมมีลูกศรชี้ขึ้น) ที่ด้านล่างของ Safari',
      step2Title: 'เลือก "Add to Home Screen"',
      step2Desc: 'เลื่อนหาเมนู "Add to Home Screen" หรือ "เพิ่มไปยังหน้าจอโฮม"',
      step3Title: 'กด "Add"',
      step3Desc: 'กดปุ่ม "Add" หรือ "เพิ่ม" ที่มุมขวาบน เพื่อติดตั้งแอป',
      note: 'ต้องใช้ Safari เท่านั้น ไม่รองรับ Chrome หรือเบราว์เซอร์อื่นบน iOS'
    },
    android: {
      step1Title: 'กดเมนู ⋮',
      step1Desc: 'กดปุ่มเมนู 3 จุด (⋮) ที่มุมขวาบนของ Chrome',
      step2Title: 'เลือก "Install app" หรือ "Add to Home screen"',
      step2Desc: 'เลื่อนหาเมนู "Install app" หรือ "Add to Home screen"',
      step3Title: 'กด "Install"',
      step3Desc: 'กดปุ่ม "Install" เพื่อติดตั้งแอปลงเครื่อง',
      note: 'แนะนำให้ใช้ Chrome หรือ Samsung Internet เพื่อประสบการณ์ที่ดีที่สุด'
    }
  },

  // Update Prompt
  update: {
    title: 'มีเวอร์ชันใหม่!',
    subtitle: 'พร้อมใช้งานแล้ว',
    description: 'เวอร์ชันใหม่มาพร้อมฟีเจอร์และการปรับปรุงใหม่ๆ อัพเดทเลยเพื่อประสบการณ์ที่ดีที่สุด',
    now: 'อัพเดทเลย',
    later: 'ไว้ทีหลัง',
    updating: 'กำลังอัพเดท...',
    notification: 'มีเวอร์ชันใหม่พร้อมใช้งาน กดเพื่ออัพเดท'
  }
};
