# Hướng dẫn Deploy lên Vercel

## Cấu hình trên Vercel

### 1. Root Directory
✅ **Giữ nguyên: `./`** 
- Đây là đúng vì code ở root của repository

### 2. Build and Output Settings

#### Build Command:
✅ **Giữ nguyên: `npm run build`** hoặc để Vercel tự detect
- Vercel sẽ tự động nhận diện Next.js và dùng `next build`

#### Output Directory:
✅ **Giữ nguyên: `.next`** (Next.js default)
- Next.js tự động build vào `.next`

#### Install Command:
✅ **Giữ nguyên: `npm install`** (hoặc để Vercel tự detect)
- Vercel sẽ tự động chạy `npm install`

### 3. Environment Variables (QUAN TRỌNG!)

⚠️ **BẮT BUỘC phải thêm:**

1. Click vào **"> Environment Variables"** để mở rộng
2. Thêm biến môi trường:

**Tên biến:** `DATABASE_URL`  
**Giá trị:** 
- Nếu dùng SQLite (không khuyến nghị cho production): `file:./dev.db`
- **Khuyến nghị:** Dùng PostgreSQL hoặc database cloud

#### Option 1: Dùng Vercel Postgres (Khuyến nghị)
1. Trong Vercel dashboard, vào **Storage** → **Create Database** → **Postgres**
2. Copy connection string
3. Thêm vào Environment Variables:
   - Name: `DATABASE_URL`
   - Value: (paste connection string từ Vercel Postgres)

#### Option 2: Dùng Supabase (Free)
1. Tạo tài khoản tại: https://supabase.com
2. Tạo project mới
3. Vào **Settings** → **Database** → Copy connection string
4. Thêm vào Vercel Environment Variables

#### Option 3: Dùng PlanetScale (Free MySQL)
1. Tạo tài khoản tại: https://planetscale.com
2. Tạo database
3. Copy connection string
4. Thêm vào Vercel Environment Variables

### 4. Cập nhật Prisma Schema (nếu dùng PostgreSQL)

Nếu bạn chọn PostgreSQL, cần sửa `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Thay đổi từ "sqlite"
  url      = env("DATABASE_URL")
}
```

Sau đó chạy migration:
```bash
npx prisma migrate deploy
```

---

## Các bước Deploy

### Bước 1: Đảm bảo code đã push lên GitHub
- Code phải có trên: `https://github.com/hoang22042006/pwd-checker`

### Bước 2: Import vào Vercel
1. Vào: https://vercel.com/new
2. Chọn **"Import Git Repository"**
3. Chọn repo: `hoang22042006/pwd-checker`
4. Click **"Import"**

### Bước 3: Cấu hình Project
1. **Framework Preset:** Next.js (tự động detect)
2. **Root Directory:** `./` (giữ nguyên)
3. **Build Command:** `npm run build` (giữ nguyên)
4. **Output Directory:** `.next` (giữ nguyên)

### Bước 4: Thêm Environment Variables
1. Click **"> Environment Variables"**
2. Thêm `DATABASE_URL` với giá trị database của bạn
3. (Nếu cần) Thêm các biến khác

### Bước 5: Deploy
1. Click nút **"Deploy"** (màu đen ở dưới)
2. Đợi Vercel build và deploy (2-5 phút)
3. Xong! Bạn sẽ có URL như: `https://pwd-checker.vercel.app`

---

## Lưu ý quan trọng

### ⚠️ SQLite KHÔNG hoạt động trên Vercel
- SQLite cần file system cố định
- Vercel là serverless (không có persistent file system)
- **BẮT BUỘC phải dùng database cloud** (PostgreSQL, MySQL, etc.)

### ✅ Giải pháp:
1. **Vercel Postgres** (dễ nhất, tích hợp sẵn)
2. **Supabase** (free tier tốt)
3. **PlanetScale** (MySQL free)
4. **Railway** (PostgreSQL free)

### 📝 Sau khi deploy:
1. Vào Vercel dashboard
2. Vào tab **"Settings"** → **"Environment Variables"**
3. Kiểm tra `DATABASE_URL` đã được set
4. Nếu cần, click **"Redeploy"** để apply changes

---

## Troubleshooting

### Lỗi: "Prisma Client not generated"
→ Thêm vào Build Command: `npx prisma generate && npm run build`

### Lỗi: "Database connection failed"
→ Kiểm tra `DATABASE_URL` trong Environment Variables
→ Đảm bảo database đã được tạo và accessible

### Lỗi: "Module not found"
→ Kiểm tra `package.json` có đầy đủ dependencies
→ Vercel sẽ tự động chạy `npm install`

---

## Checklist trước khi Deploy

- [ ] Code đã push lên GitHub
- [ ] `package.json` có đầy đủ dependencies
- [ ] `prisma/schema.prisma` đã cấu hình đúng database
- [ ] Đã tạo database cloud (PostgreSQL/MySQL)
- [ ] Đã thêm `DATABASE_URL` vào Environment Variables
- [ ] Đã test build local: `npm run build`

