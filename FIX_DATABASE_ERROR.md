# Sửa lỗi Database trên Vercel

## Lỗi: "Có lỗi xảy ra khi xử lý yêu cầu"

Nguyên nhân có thể:
1. **Database chưa có tables** (chưa chạy migration)
2. **DATABASE_URL chưa được set** trong Vercel
3. **Connection string không đúng**
4. **Prisma Client chưa được generate**

---

## Cách kiểm tra và sửa:

### Bước 1: Kiểm tra Vercel Environment Variables

1. Vào Vercel dashboard: https://vercel.com
2. Chọn project `pwd-checker`
3. Vào **Settings** → **Environment Variables**
4. Kiểm tra có biến `DATABASE_URL` không
5. Nếu chưa có hoặc sai, thêm/sửa:
   - **Name**: `DATABASE_URL`
   - **Value**: Connection string từ Supabase (đã thay password)
   - **Environment**: Production, Preview, Development (tích cả 3)

### Bước 2: Kiểm tra Database Tables

Database có thể chưa có table `User`. Cần chạy migration:

#### Cách 1: Dùng Supabase SQL Editor (Dễ nhất)

1. Vào Supabase dashboard
2. Click **"SQL Editor"** ở sidebar
3. Tạo file migration local:
   ```bash
   npx prisma migrate dev --name init --create-only
   ```
4. Mở file: `prisma/migrations/.../migration.sql`
5. Copy toàn bộ nội dung
6. Paste vào Supabase SQL Editor
7. Click **"Run"**

#### Cách 2: Dùng Prisma db push (Nhanh)

1. Cài Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Link project:
   ```bash
   vercel link
   ```

4. Set DATABASE_URL:
   ```bash
   export DATABASE_URL="postgresql://..."
   ```
   (Thay bằng connection string từ Supabase)

5. Push schema:
   ```bash
   npx prisma db push
   ```

#### Cách 3: Tạo table thủ công trong Supabase

1. Vào Supabase → **SQL Editor**
2. Chạy SQL sau:

```sql
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
```

### Bước 3: Kiểm tra Connection String

Đảm bảo connection string đúng format:

```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

Hoặc dùng Session Pooler (khuyến nghị):
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### Bước 4: Redeploy trên Vercel

1. Vào Vercel dashboard
2. Vào **Deployments**
3. Click **"Redeploy"** ở deployment mới nhất
4. Hoặc push code mới lên GitHub (Vercel sẽ tự động deploy)

---

## Kiểm tra Logs trên Vercel

1. Vào Vercel dashboard
2. Chọn project
3. Vào **Deployments** → Click vào deployment mới nhất
4. Xem **"Function Logs"** để thấy lỗi chi tiết

---

## Checklist

- [ ] DATABASE_URL đã được thêm vào Vercel Environment Variables
- [ ] Connection string đã thay password
- [ ] Database tables đã được tạo (User table)
- [ ] Đã redeploy trên Vercel
- [ ] Đã kiểm tra Function Logs để xem lỗi chi tiết

---

## Lưu ý

- **Nên dùng Session Pooler** connection string cho Vercel (port 6543)
- **Password phải được thay** trong connection string
- **Tables phải được tạo** trước khi sử dụng API








