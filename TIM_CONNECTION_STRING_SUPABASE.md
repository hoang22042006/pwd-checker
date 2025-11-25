# Hướng dẫn tìm Connection String trong Supabase

## Cách 1: Từ Database Settings (Trang bạn đang ở)

1. Ở trang **"Database Settings"** (trang hiện tại của bạn)
2. Scroll xuống dưới, tìm phần **"Connection string"** hoặc **"Connection info"**
3. Nếu không thấy, thử cách 2

---

## Cách 2: Từ Project Settings (Khuyến nghị)

1. Click vào **"Project Settings"** (biểu tượng bánh răng ⚙️) ở sidebar trái
   - Hoặc click vào tên project ở góc trên bên trái
2. Trong menu Settings, click **"Database"** hoặc **"Connection string"**
3. Scroll xuống phần **"Connection string"**
4. Bạn sẽ thấy các tab:
   - **URI** ← Chọn tab này
   - Transaction mode
   - Session mode
5. Copy connection string từ tab **"URI"**

---

## Cách 3: Từ Connection Pooling

1. Ở sidebar trái, tìm **"Connection Pooling"** (có thể nằm dưới Database)
2. Click vào đó
3. Sẽ thấy connection string ở đây

---

## Cách 4: Từ API Settings

1. Click **"Project Settings"** (⚙️)
2. Click **"API"** trong menu
3. Scroll xuống phần **"Database"**
4. Tìm **"Connection string"** hoặc **"Connection URI"**

---

## Connection String sẽ có dạng:

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

Hoặc:

```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## Nếu vẫn không thấy:

### Option A: Tạo Connection String thủ công

1. Ở trang Database Settings, bạn thấy:
   - **Host**: (sẽ có dạng `db.xxxxx.supabase.co`)
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: (password bạn đã tạo khi tạo project)

2. Tạo connection string theo format:
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```

3. Thay:
   - `[PASSWORD]` = password database của bạn
   - `[HOST]` = host từ Supabase

### Option B: Dùng Connection Pooling (Khuyến nghị cho Vercel)

1. Vào **"Connection Pooling"** trong sidebar
2. Copy connection string từ đây (thường có port `6543` hoặc `5432`)
3. Connection pooling tốt hơn cho serverless (Vercel)

---

## Lưu ý:

- Connection string có 2 loại:
  - **Direct connection** (port 5432): Dùng cho local development
  - **Connection pooling** (port 6543): Dùng cho production/Vercel (khuyến nghị)

- Cho Vercel, nên dùng **Connection Pooling** connection string

---

## Nếu bạn thấy "Reset database password":

1. Click **"Reset database password"**
2. Tạo password mới
3. Sau đó connection string sẽ hiện ra
4. Hoặc tạo thủ công như Option A ở trên

