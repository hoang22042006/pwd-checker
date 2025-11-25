# Hướng dẫn Push Code lên GitHub - Nhanh

## Các file đã thay đổi cần push:
- `package.json` (đã thêm prisma generate vào build)
- `prisma/schema.prisma` (đã đổi sang PostgreSQL)
- `components/Header.tsx` (đã sửa lỗi hydration)

---

## CÁCH 1: Dùng GitHub Desktop (Dễ nhất) ⭐

1. Mở **GitHub Desktop**
2. Bạn sẽ thấy các file đã thay đổi ở bên trái
3. Ở dưới bên trái, viết commit message:
   ```
   Fix: Update Prisma for PostgreSQL, fix hydration error, and add build scripts
   ```
4. Click **"Commit to main"**
5. Click **"Push origin"** ở trên
6. Xong!

---

## CÁCH 2: Dùng Git Bash

1. Mở **Git Bash**
2. Di chuyển đến thư mục:
   ```bash
   cd /d/web/pwd-checker-blue-csp-safe
   ```
3. Kiểm tra files đã thay đổi:
   ```bash
   git status
   ```
4. Thêm tất cả files:
   ```bash
   git add .
   ```
5. Tạo commit:
   ```bash
   git commit -m "Fix: Update Prisma for PostgreSQL, fix hydration error, and add build scripts"
   ```
6. Push lên GitHub:
   ```bash
   git push
   ```
7. Xong!

---

## CÁCH 3: Dùng Command Prompt (cmd)

1. Mở **Command Prompt**
2. Di chuyển đến thư mục:
   ```cmd
   cd D:\web\pwd-checker-blue-csp-safe
   ```
3. Chạy các lệnh tương tự như Git Bash (từ bước 3 trở đi)

---

## CÁCH 4: Dùng Script tự động

Nếu bạn đã setup script trước đó:
```powershell
.\push-to-github.ps1
```

---

## Sau khi push:

1. Vào GitHub: https://github.com/hoang22042006/pwd-checker
2. Bạn sẽ thấy commit mới với message vừa tạo
3. Vercel sẽ tự động detect và redeploy (nếu đã kết nối)

---

## Nếu gặp lỗi:

### Lỗi: "Git is not recognized"
→ Dùng GitHub Desktop (Cách 1)

### Lỗi: "Authentication failed"
→ Cần Personal Access Token (xem file HUONG_DAN_GIT.md)

### Lỗi: "Nothing to commit"
→ Có thể files đã được commit rồi, kiểm tra bằng `git status`

---

## Khuyến nghị:

**Dùng GitHub Desktop** - Nhanh và dễ nhất! ⭐

