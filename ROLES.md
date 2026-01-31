# ROLES.md - AI Development Team Roles

## 👥 AI Roles

คุณจะสวมบทบาทตามลำดับดังนี้:

---

### 1. 📋 Product Owner
**หน้าที่:**
- ทำความเข้าใจ requirements จาก REQUIREMENTS.md
- ตรวจสอบว่า features ครบตาม spec
- Priority: Core features ก่อน, Nice-to-have ทีหลัง

**Deliverable:**
- ยืนยันว่าเข้าใจ requirements ถูกต้อง

---

### 2. 🏗️ Architect
**หน้าที่:**
- วาง project structure
- เลือก patterns ที่เหมาะสม
- ออกแบบ data flow

**Deliverable:**
- สร้างโครงสร้างโฟลเดอร์
- สร้าง config files (vite, tailwind, postcss)

---

### 3. 💻 Developer
**หน้าที่:**
- เขียนโค้ดตาม architecture
- สร้าง components ทีละส่วน
- ทำให้ features ทำงานได้

**Rules:**
- Clean code, readable
- ใช้ Tailwind CSS
- Handle errors properly
- Mobile-first responsive
- Support Dark Mode

**Deliverable:**
- Source code ทั้งหมด

---

### 4. 🔍 Code Reviewer
**หน้าที่:**
- ตรวจสอบคุณภาพโค้ด
- หา bugs และ issues
- แนะนำ improvements

**Checklist:**
- [ ] No hardcoded values
- [ ] Error handling ครบ
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Loading states
- [ ] Accessibility

**Deliverable:**
- รายงาน issues ที่พบ
- แก้ไข critical issues

---

### 5. 🧪 Tester
**หน้าที่:**
- ทดสอบ features ทั้งหมด
- ตรวจสอบ edge cases
- ทดสอบบน mobile view

**Test Cases:**
- [ ] Load feeds successfully
- [ ] Search works correctly
- [ ] Category filter works
- [ ] Dark/Light mode toggle
- [ ] Pull to refresh
- [ ] Add custom feed
- [ ] Delete custom feed
- [ ] Reader mode opens
- [ ] Back navigation works
- [ ] PWA installable

**Deliverable:**
- รายงานผลการทดสอบ

---

### 6. 🔒 Security Auditor
**หน้าที่:**
- ตรวจสอบ security vulnerabilities
- ตรวจ XSS, injection risks
- ตรวจ data handling

**Checklist:**
- [ ] No sensitive data in code
- [ ] XSS protection (sanitize HTML)
- [ ] Safe localStorage usage
- [ ] HTTPS only
- [ ] CSP headers (if applicable)

**Deliverable:**
- Security report

---

### 7. 📱 UX Reviewer
**หน้าที่:**
- ตรวจสอบ UI ตรงตาม design
- ตรวจ accessibility
- ตรวจ mobile usability

**Checklist:**
- [ ] Touch targets ≥ 44px
- [ ] Color contrast OK
- [ ] Loading indicators
- [ ] Error messages clear
- [ ] Animations smooth
- [ ] Font sizes readable

**Deliverable:**
- UX feedback report

---

## 📝 Reporting Format

เมื่อทำเสร็จแต่ละ role ให้รายงานดังนี้:

```
✅ [ROLE NAME] COMPLETE

สิ่งที่ทำ:
- [รายการ 1]
- [รายการ 2]

ไฟล์ที่สร้าง/แก้ไข:
- [file1.js]
- [file2.jsx]

Issues พบ (ถ้ามี):
- [issue 1]

พร้อมไป Role ถัดไป: [ชื่อ role]
```
