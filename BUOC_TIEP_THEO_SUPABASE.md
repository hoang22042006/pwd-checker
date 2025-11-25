# Các bước tiếp theo sau khi có Connection String

## Bước 1: Copy và thay password trong Connection String

1. Ở trang Supabase, bạn thấy connection string:
   ```
   postgresql://postgres:[YOUR_PASSWORD]@db.rkklzrxxnmiytfdvtiar.supabase.co:5432/postgres
   ```

2. **Thay `[YOUR_PASSWORD]`** bằng password database của bạn
   - Password này là password bạn đã tạo khi tạo project Supabase
   - Nếu quên, click "Reset your database password" để tạo mới

3. Sau khi thay, connection string sẽ có dạng:
   ```
   postgresql://postgres:matkhau123@db.rkklzrxxnmiytfdvtiar.supabase.co:5432/postgres
   ```

4. **Copy toàn bộ** connection string (đã thay password)

---

## Bước 2: Dùng Session Pooler (Khuyến nghị cho Vercel)

⚠️ **Quan trọng:** Bạn thấy cảnh báo "Not IPv4 compatible"
→ Nên dùng **Session Pooler** thay vì Direct connection

### Cách lấy Session Pooler connection string:

1. Ở trang hiện tại, tìm dropdown **"Method"**
2. Đổi từ **"Direct connection"** → **"Session Pooler"** hoặc **"Transaction Pooler"**
3. Copy connection string mới (sẽ có port khác, thường là `6543`)

Hoặc:

1. Click vào **"Pooler settings"** button trong cảnh báo
2. Copy connection string từ Session Pooler

**Session Pooler connection string sẽ có dạng:**
```
postgresql://postgres.rkklzrxxnmiytfdvtiar:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## Bước 3: Thêm vào Vercel Environment Variables

1. Quay lại trang Vercel (tab deploy của bạn)
2. Scroll xuống phần **"Environment Variables"**
3. Click **"> Environment Variables"** để mở rộng
4. Click **"Add"** hoặc **"New"**
5. Điền:
   - **Name**: `DATABASE_URL`
   - **Value**: (paste connection string đã copy - đã thay password)
6. Click **"Save"** hoặc **"Add"**

---

## Bước 4: Cập nhật Prisma Schema

Cần đổi từ SQLite sang PostgreSQL:

1. Mở file `prisma/schema.prisma`
2. Sửa dòng 9:
   ```prisma
   datasource db {
     provider = "postgresql"  // Thay đổi từ "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. Lưu file

---

## Bước 5: Push code lên GitHub

1. Mở Git Bash hoặc terminal
2. Chạy:
   ```bash
   cd /d/web/pwd-checker-blue-csp-safe
   git add prisma/schema.prisma
   git commit -m "Update Prisma schema to use PostgreSQL"
   git push
   ```

---

## Bước 6: Deploy trên Vercel

1. Quay lại Vercel
2. Đảm bảo `DATABASE_URL` đã được thêm vào Environment Variables
3. Click nút **"Deploy"** (màu đen ở dưới)
4. Đợi Vercel build và deploy (2-5 phút)

---

## Bước 7: Chạy Migration (Sau khi deploy)

Sau khi deploy thành công, cần tạo tables trong database:

### Cách 1: Dùng Supabase SQL Editor (Dễ nhất)

1. Vào Supabase dashboard
2. Click **"SQL Editor"** ở sidebar trái
3. Tạo migration file local:
   ```bash
   npx prisma migrate dev --name init --create-only
   ```
4. Mở file: `prisma/migrations/.../migration.sql`
5. Copy toàn bộ nội dung
6. Paste vào Supabase SQL Editor
7. Click **"Run"**

### Cách 2: Dùng Prisma db push (Nhanh)

1. Cài Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login và link project:
   ```bash
   vercel login
   vercel link
   ```

3. Push schema:
   ```bash
   npx prisma db push
   ```

---

## Checklist

- [ ] Đã copy connection string từ Supabase
- [ ] Đã thay `[YOUR_PASSWORD]` bằng password thật
- [ ] Đã thêm `DATABASE_URL` vào Vercel Environment Variables
- [ ] Đã sửa `prisma/schema.prisma` thành `postgresql`
- [ ] Đã push code lên GitHub
- [ ] Đã deploy trên Vercel
- [ ] Đã chạy migration để tạo tables

---

## Lưu ý

- **Nên dùng Session Pooler** cho Vercel (tốt hơn cho serverless)
- **KHÔNG commit** connection string vào GitHub
- Password phải được thay trong connection string trước khi thêm vào Vercel

