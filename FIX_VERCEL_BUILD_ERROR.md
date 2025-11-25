# Sửa lỗi Build trên Vercel

## Lỗi gặp phải:
```
Error: Failed to collect page data for /api/login
Error: Command "npm run build" exited with 1
```

## Nguyên nhân:
1. Prisma Client chưa được generate trước khi build
2. Prisma schema vẫn đang dùng SQLite (cần đổi sang PostgreSQL cho Supabase)

## Đã sửa:

### 1. Cập nhật package.json
- Thêm `prisma generate` vào build script
- Thêm `postinstall` script để tự động generate Prisma Client

### 2. Cập nhật Prisma Schema
- Đổi từ `sqlite` → `postgresql`

## Các bước tiếp theo:

### Bước 1: Push code lên GitHub
```bash
git add package.json prisma/schema.prisma
git commit -m "Fix: Update Prisma for PostgreSQL and add generate to build"
git push
```

### Bước 2: Kiểm tra Vercel Environment Variables
1. Vào Vercel dashboard
2. Vào **Settings** → **Environment Variables**
3. Đảm bảo có `DATABASE_URL` với connection string từ Supabase
4. Nếu chưa có, thêm vào:
   - Name: `DATABASE_URL`
   - Value: Connection string từ Supabase (đã thay password)

### Bước 3: Redeploy
1. Vào Vercel dashboard
2. Click **"Deployments"**
3. Click **"Redeploy"** ở deployment mới nhất
4. Hoặc Vercel sẽ tự động redeploy khi bạn push code mới

## Nếu vẫn lỗi:

### Kiểm tra Build Command trong Vercel:
1. Vào **Settings** → **General**
2. Kiểm tra **Build Command**:
   - Nên là: `npm run build` (đã có `prisma generate` trong script)
   - Hoặc: `prisma generate && npm run build`

### Kiểm tra DATABASE_URL:
- Đảm bảo connection string đúng format PostgreSQL
- Đảm bảo đã thay `[YOUR_PASSWORD]` bằng password thật
- Nên dùng Session Pooler connection string (port 6543)

## Sau khi deploy thành công:

Cần chạy migration để tạo tables:

1. Vào Supabase → **SQL Editor**
2. Tạo migration:
   ```bash
   npx prisma migrate dev --name init --create-only
   ```
3. Copy nội dung từ `prisma/migrations/.../migration.sql`
4. Paste vào Supabase SQL Editor và Run

Hoặc dùng Prisma db push:
```bash
npx prisma db push
```

