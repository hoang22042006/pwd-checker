# Hướng dẫn tạo Supabase Database - Từng bước

## Bước 1: Tạo tài khoản Supabase

1. Truy cập: **https://supabase.com**
2. Click nút **"Start your project"** hoặc **"Sign in"**
3. Đăng nhập bằng:
   - GitHub account (khuyến nghị - nhanh nhất)
   - Email
   - Google account

---

## Bước 2: Tạo Project mới

1. Sau khi đăng nhập, click **"New Project"** hoặc **"Create a new project"**
2. Điền thông tin:
   - **Name**: `pwd-checker` (hoặc tên bạn muốn)
   - **Database Password**: Tạo password mạnh (LƯU LẠI PASSWORD NÀY!)
   - **Region**: Chọn gần nhất (ví dụ: `Southeast Asia (Singapore)`)
   - **Pricing Plan**: Chọn **Free** (đủ dùng cho dự án nhỏ)
3. Click **"Create new project"**
4. Đợi 2-3 phút để Supabase setup database

---

## Bước 3: Lấy Connection String

1. Sau khi project được tạo, vào **Settings** (biểu tượng bánh răng ở sidebar trái)
2. Click **"Database"** trong menu Settings
3. Scroll xuống phần **"Connection string"**
4. Chọn tab **"URI"**
5. Copy connection string, sẽ có dạng:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Thay `[YOUR-PASSWORD]`** bằng password bạn đã tạo ở Bước 2
7. Copy toàn bộ connection string (đã thay password)

---

## Bước 4: Thêm vào Vercel Environment Variables

1. Quay lại trang Vercel (trang deploy của bạn)
2. Click vào **"> Environment Variables"** để mở rộng
3. Click **"Add"** hoặc **"New"**
4. Điền:
   - **Name**: `DATABASE_URL`
   - **Value**: (paste connection string từ Supabase)
5. Click **"Save"** hoặc **"Add"**

---

## Bước 5: Cập nhật Prisma Schema

Cần đổi từ SQLite sang PostgreSQL:

1. Mở file `prisma/schema.prisma`
2. Sửa dòng:
   ```prisma
   datasource db {
     provider = "postgresql"  // Thay đổi từ "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. Lưu file

---

## Bước 6: Push code lên GitHub

1. Commit và push thay đổi:
   ```bash
   git add prisma/schema.prisma
   git commit -m "Update Prisma schema to use PostgreSQL"
   git push
   ```

---

## Bước 7: Deploy trên Vercel

1. Quay lại Vercel
2. Đảm bảo `DATABASE_URL` đã được thêm vào Environment Variables
3. Click **"Deploy"**
4. Vercel sẽ tự động:
   - Pull code từ GitHub
   - Chạy `npm install`
   - Chạy `npx prisma generate`
   - Chạy `npm run build`
   - Deploy

---

## Bước 8: Chạy Migration (Sau khi deploy)

Sau khi deploy thành công, cần chạy migration để tạo tables:

### Cách 1: Dùng Vercel CLI (Khuyến nghị)
```bash
# Cài Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Chạy migration
npx prisma migrate deploy
```

### Cách 2: Dùng Supabase SQL Editor
1. Vào Supabase dashboard
2. Click **"SQL Editor"** ở sidebar
3. Tạo file migration từ Prisma:
   ```bash
   npx prisma migrate dev --name init --create-only
   ```
4. Copy nội dung file migration (trong `prisma/migrations/.../migration.sql`)
5. Paste vào Supabase SQL Editor
6. Click **"Run"**

### Cách 3: Dùng Prisma Studio (Local)
```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://..."

# Chạy migration
npx prisma migrate deploy

# Hoặc push schema (nhanh hơn, nhưng không tạo migration)
npx prisma db push
```

---

## Kiểm tra Database

1. Vào Supabase dashboard
2. Click **"Table Editor"** ở sidebar
3. Bạn sẽ thấy table `User` đã được tạo
4. Có thể xem và chỉnh sửa data tại đây

---

## Lưu ý quan trọng

### 🔒 Bảo mật:
- **KHÔNG commit** connection string vào GitHub
- Chỉ thêm vào Vercel Environment Variables
- File `.env` đã được ignore (an toàn)

### 💰 Free Tier của Supabase:
- 500MB database storage
- 2GB bandwidth/month
- Đủ dùng cho dự án nhỏ

### 🔄 Nếu cần đổi password:
1. Vào Supabase → Settings → Database
2. Click **"Reset database password"**
3. Update lại `DATABASE_URL` trong Vercel

---

## Troubleshooting

### Lỗi: "Connection refused"
→ Kiểm tra password trong connection string đã đúng chưa
→ Kiểm tra IP restrictions trong Supabase Settings

### Lỗi: "Table does not exist"
→ Chưa chạy migration
→ Chạy: `npx prisma migrate deploy`

### Lỗi: "Prisma Client not generated"
→ Thêm vào Vercel Build Command: `npx prisma generate && npm run build`

---

## Checklist

- [ ] Đã tạo tài khoản Supabase
- [ ] Đã tạo project mới
- [ ] Đã copy connection string
- [ ] Đã thay password trong connection string
- [ ] Đã thêm `DATABASE_URL` vào Vercel Environment Variables
- [ ] Đã sửa `prisma/schema.prisma` thành `postgresql`
- [ ] Đã push code lên GitHub
- [ ] Đã deploy trên Vercel
- [ ] Đã chạy migration

---

## Sau khi hoàn tất

App của bạn sẽ chạy trên Vercel với database Supabase!
URL sẽ là: `https://pwd-checker.vercel.app` (hoặc tên bạn đặt)

