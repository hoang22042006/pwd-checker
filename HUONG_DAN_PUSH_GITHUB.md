# Hướng dẫn Push Code lên GitHub - Từng bước chi tiết

## Repo của bạn: `hoang22042006/pwd-checker`

---

## CÁCH 1: Dùng GitHub Desktop (Dễ nhất - Khuyến nghị) ⭐

### Bước 1: Tải GitHub Desktop
1. Truy cập: https://desktop.github.com/
2. Click **"Download for Windows"**
3. Cài đặt và mở GitHub Desktop

### Bước 2: Đăng nhập GitHub
1. Mở GitHub Desktop
2. Click **"Sign in to GitHub.com"**
3. Đăng nhập với tài khoản: `hoang22042006`

### Bước 3: Thêm Repository
1. Trong GitHub Desktop, click **File** → **Add Local Repository**
2. Click **"Choose..."** và chọn thư mục: `D:\web\pwd-checker-blue-csp-safe`
3. Click **"Add repository"**

### Bước 4: Publish lên GitHub
1. GitHub Desktop sẽ hiện thông báo "This directory appears to be a Git repository"
2. Click **"Publish repository"** ở góc trên bên phải
3. Đảm bảo:
   - **Name**: `pwd-checker`
   - **Description**: (có thể để trống hoặc điền mô tả)
   - **Keep this code private**: Bỏ tích nếu muốn Public
4. Click **"Publish repository"**

### Bước 5: Xác nhận
- Đợi vài giây, code sẽ được push lên GitHub
- Mở trình duyệt và vào: `https://github.com/hoang22042006/pwd-checker`
- Bạn sẽ thấy tất cả files đã được upload!

---

## CÁCH 2: Dùng Git Bash (Nếu đã cài Git)

### Bước 1: Mở Git Bash
1. Tìm **"Git Bash"** trong Start Menu
2. Mở Git Bash

### Bước 2: Di chuyển đến thư mục dự án
```bash
cd /d/web/pwd-checker-blue-csp-safe
```

### Bước 3: Cấu hình Git (chỉ lần đầu)
```bash
git config --global user.name "hoang22042006"
git config --global user.email "email-cua-ban@example.com"
```
*(Thay email-cua-ban@example.com bằng email GitHub của bạn)*

### Bước 4: Khởi tạo Git repository
```bash
git init
```

### Bước 5: Thêm tất cả files
```bash
git add .
```

### Bước 6: Tạo commit đầu tiên
```bash
git commit -m "Initial commit: Password Checker with Login/Register"
```

### Bước 7: Đổi branch thành main
```bash
git branch -M main
```

### Bước 8: Kết nối với GitHub
```bash
git remote add origin https://github.com/hoang22042006/pwd-checker.git
```

### Bước 9: Push code lên GitHub
```bash
git push -u origin main
```

### Bước 10: Xác nhận
- Nếu được hỏi username: nhập `hoang22042006`
- Nếu được hỏi password: **KHÔNG dùng password GitHub**, mà dùng **Personal Access Token**

---

## Tạo Personal Access Token (Nếu cần)

### Nếu Git Bash yêu cầu password:

1. Truy cập: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Đặt tên: `pwd-checker-push`
4. Chọn quyền: **`repo`** (tích vào ô này)
5. Click **"Generate token"**
6. **COPY TOKEN NGAY** (chỉ hiện 1 lần!)
7. Dùng token này làm password khi push

---

## CÁCH 3: Dùng Command Prompt (cmd)

Nếu Git đã được cài và có trong PATH:

1. Mở **Command Prompt** (cmd)
2. Chạy các lệnh tương tự như Git Bash (từ Bước 2 trở đi)

---

## Kiểm tra sau khi push

Sau khi push thành công, truy cập:
**https://github.com/hoang22042006/pwd-checker**

Bạn sẽ thấy:
- ✅ Tất cả source code
- ✅ README.md
- ✅ package.json
- ✅ Các file cấu hình

**KHÔNG thấy:**
- ❌ `.env` (đã được ignore)
- ❌ `node_modules/` (đã được ignore)
- ❌ `prisma/dev.db` (đã được ignore)

---

## Lần sau khi có thay đổi

### Nếu dùng GitHub Desktop:
1. Mở GitHub Desktop
2. Sẽ tự động thấy thay đổi
3. Viết commit message
4. Click **"Commit to main"**
5. Click **"Push origin"**

### Nếu dùng Git Bash:
```bash
cd /d/web/pwd-checker-blue-csp-safe
git add .
git commit -m "Mô tả thay đổi"
git push
```

---

## Lưu ý quan trọng

1. **File `.env` sẽ KHÔNG lên GitHub** (đã được ignore) - Đây là đúng!
2. **Database file `dev.db` sẽ KHÔNG lên GitHub** - Đúng!
3. **`node_modules/` sẽ KHÔNG lên GitHub** - Đúng!

---

## Nếu gặp lỗi

### Lỗi: "Git is not recognized"
→ Cài Git từ: https://git-scm.com/download/win
→ Hoặc dùng GitHub Desktop

### Lỗi: "Authentication failed"
→ Tạo Personal Access Token (xem hướng dẫn trên)

### Lỗi: "Repository not found"
→ Kiểm tra URL repo: `https://github.com/hoang22042006/pwd-checker.git`
→ Đảm bảo repo đã được tạo trên GitHub

---

## Khuyến nghị

**Dùng GitHub Desktop** - Dễ nhất và nhanh nhất! ⭐

