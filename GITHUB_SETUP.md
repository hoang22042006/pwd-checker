# Hướng dẫn đưa code lên GitHub

## Bước 1: Cài đặt Git (nếu chưa có)

### Cách 1: Cài Git từ trang chính thức
1. Truy cập: https://git-scm.com/download/win
2. Tải và cài đặt Git for Windows
3. Khởi động lại terminal/PowerShell sau khi cài

### Cách 2: Sử dụng GitHub Desktop (Dễ hơn)
1. Truy cập: https://desktop.github.com/
2. Tải và cài đặt GitHub Desktop
3. Đăng nhập với tài khoản GitHub của bạn

---

## Bước 2: Khởi tạo Git Repository (Nếu dùng Git CLI)

Mở terminal/PowerShell trong thư mục dự án và chạy:

```bash
# Khởi tạo git repository
git init

# Thêm tất cả files
git add .

# Commit lần đầu
git commit -m "Initial commit: Password Checker with Login/Register"

# Đổi tên branch chính thành main (nếu cần)
git branch -M main
```

---

## Bước 3: Tạo Repository trên GitHub

1. Đăng nhập vào https://github.com
2. Click nút **"+"** ở góc trên bên phải → **"New repository"**
3. Điền thông tin:
   - **Repository name**: `pwd-checker` (hoặc tên bạn muốn)
   - **Description**: "Password Checker với Login/Register - Next.js + Prisma + SQLite"
   - **Visibility**: Chọn Public hoặc Private
   - **KHÔNG** tích vào "Initialize with README" (vì đã có code)
4. Click **"Create repository"**

---

## Bước 4: Kết nối và Push code lên GitHub

Sau khi tạo repo trên GitHub, bạn sẽ thấy hướng dẫn. Chạy các lệnh sau:

```bash
# Thêm remote repository (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/pwd-checker.git

# Push code lên GitHub
git push -u origin main
```

Nếu bạn dùng SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/pwd-checker.git
git push -u origin main
```

---

## Bước 5: Nếu dùng GitHub Desktop

1. Mở GitHub Desktop
2. File → Add Local Repository
3. Chọn thư mục dự án: `D:\web\pwd-checker-blue-csp-safe` (hoặc thư mục hiện tại của bạn)
4. Click **"Publish repository"** ở góc trên
5. Chọn tên repo và click **"Publish Repository"**

---

## Lưu ý quan trọng:

✅ **Đã được ignore (không lên GitHub):**
- `.env` - File môi trường
- `node_modules/` - Dependencies
- `prisma/dev.db` - Database file
- `.next/` - Build files

✅ **Sẽ được commit:**
- Source code (`.tsx`, `.ts`, `.css`)
- `package.json`, `tsconfig.json`
- `prisma/schema.prisma` và `migrations/`
- `README.md`, `.gitignore`

---

## Nếu gặp lỗi authentication:

GitHub yêu cầu Personal Access Token thay vì password:

1. Vào: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Chọn quyền: `repo` (full control)
4. Copy token và dùng làm password khi push

---

## Sau khi push thành công:

Bạn có thể:
- Xem code tại: `https://github.com/YOUR_USERNAME/pwd-checker`
- Clone về máy khác: `git clone https://github.com/YOUR_USERNAME/pwd-checker.git`
- Deploy lên Vercel/Netlify từ GitHub

