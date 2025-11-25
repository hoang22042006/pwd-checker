
# Password Checker — Blue + CSP (SAFE)
UI xanh dương. CSP đã cấu hình để Next.js hydrate ổn định trên Vercel.
Tiêu đề: "Kiểm tra độ mạnh yếu mật khẩu".

## Tính năng
- ✅ Kiểm tra độ mạnh mật khẩu
- ✅ Tạo mật khẩu ngẫu nhiên
- ✅ Đăng ký / Đăng nhập với database
- ✅ Bảo mật: Password hashing với bcrypt

## Setup

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Tạo file .env từ .env.example
cp .env.example .env

# Generate Prisma Client
npx prisma generate

# Tạo database và chạy migrations
npx prisma migrate dev --name init
```

### 3. Chạy development server
```bash
npm run dev
```

## Database
- **SQLite** cho development (file: `./dev.db`)
- **Prisma ORM** để quản lý database
- Password được hash bằng **bcryptjs**

## Đưa code lên GitHub

### Cách 1: Dùng Script tự động (Khuyến nghị)
```powershell
# Chạy script setup (lần đầu)
.\setup-github.ps1

# Sau đó push code
.\push-to-github.ps1
```

### Cách 2: Thủ công
Xem file `GITHUB_SETUP.md` để biết hướng dẫn chi tiết.

## Deploy Vercel
Import repo, Framework Next.js, Root `./`. 
Cần set environment variable: `DATABASE_URL`
