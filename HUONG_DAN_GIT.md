# Hướng dẫn sử dụng Git sau khi cài đặt

## Vấn đề: Git chưa được nhận diện

Sau khi cài Git, bạn cần:

### Bước 1: Khởi động lại PowerShell/Terminal
- **Đóng** PowerShell hiện tại
- **Mở lại** PowerShell mới (hoặc Command Prompt)
- Hoặc khởi động lại máy tính

### Bước 2: Kiểm tra Git đã hoạt động
Mở PowerShell mới và chạy:
```powershell
git --version
```

Nếu thấy version (ví dụ: `git version 2.xx.x`), nghĩa là Git đã sẵn sàng!

### Bước 3: Cấu hình Git (lần đầu)
```powershell
git config --global user.name "Tên của bạn"
git config --global user.email "email@example.com"
```

Thay `"Tên của bạn"` và `"email@example.com"` bằng thông tin của bạn.

---

## Cách 1: Dùng Git Bash (Khuyến nghị)

Nếu PowerShell vẫn không nhận Git:

1. Tìm **"Git Bash"** trong Start Menu
2. Mở Git Bash
3. Di chuyển đến thư mục dự án:
   ```bash
   cd /d/web/pwd-checker-blue-csp-safe
   # (hoặc thư mục hiện tại của bạn)
   ```
4. Chạy các lệnh:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Password Checker project"
   git branch -M main
   ```

---

## Cách 2: Dùng Command Prompt (cmd)

1. Mở **Command Prompt** (cmd)
2. Di chuyển đến thư mục:
   ```cmd
   cd D:\web\pwd-checker-blue-csp-safe
   # (hoặc thư mục hiện tại của bạn)
   ```
3. Chạy các lệnh git như trên

---

## Cách 3: Dùng GitHub Desktop (Dễ nhất)

1. Tải GitHub Desktop: https://desktop.github.com/
2. Cài đặt và đăng nhập
3. File → Add Local Repository
4. Chọn thư mục dự án của bạn
5. Click "Publish repository" để đưa lên GitHub

---

## Sau khi Git hoạt động

Chạy các lệnh sau trong thư mục dự án:

```bash
# 1. Khởi tạo repository
git init

# 2. Thêm tất cả files
git add .

# 3. Tạo commit đầu tiên
git commit -m "Initial commit: Password Checker with Login/Register"

# 4. Đổi branch thành main
git branch -M main
```

Sau đó:
1. Tạo repo trên GitHub: https://github.com/new
2. Copy URL repo (ví dụ: `https://github.com/username/pwd-checker.git`)
3. Chạy:
   ```bash
   git remote add origin https://github.com/username/pwd-checker.git
   git push -u origin main
   ```

---

## Lưu ý

- Nếu gặp lỗi authentication, cần tạo Personal Access Token tại: https://github.com/settings/tokens
- Token cần có quyền `repo` (full control)
- Dùng token làm password khi push

