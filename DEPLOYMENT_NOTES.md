# API Payroll — Catatan Deployment & History

## Links Penting

| Deskripsi | URL |
|---|---|
| GitHub | https://github.com/dickyadem/API-PAYROLL |
| Vercel (Production) | https://api-payroll.vercel.app |
| Vercel Dashboard | https://vercel.com/dickyadems-projects/api-payroll |
| Aiven Console | https://console.aiven.io |

---

## Stack

- **Backend**: Node.js + Express
- **Database**: MySQL via Knex ORM (hosted di Aiven)
- **Auth**: JWT + bcryptjs
- **Deployment**: Vercel (serverless)
- **Database Host**: Aiven MySQL (free tier)

---

## Kredensial Database (Aiven)

```env
DB_HOST=mysql-3400d5e-dickyadem-6bad.h.aivencloud.com
DB_PORT=19775
DB_USER=avnadmin
DB_PASSWORD=<lihat di console.aiven.io — copy paste, jangan ketik manual>
DB_NAME=defaultdb
DB_SSL=true
```

> ⚠️ Aiven free tier bisa auto power-off saat tidak aktif. Cek di console.aiven.io jika tiba-tiba tidak bisa connect.

---

## Environment Variables Vercel

Harus diset di **Vercel Dashboard → Settings → Environment Variables**:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DB_HOST` | `mysql-3400d5e-dickyadem-6bad.h.aivencloud.com` |
| `DB_PORT` | `19775` |
| `DB_USER` | `avnadmin` |
| `DB_PASSWORD` | lihat di console.aiven.io (angka 1, bukan huruf L) |
| `DB_NAME` | `defaultdb` |
| `DB_SSL` | `true` |
| `DB_CA_CERT` | (base64 CA cert dari Aiven) |
| `TOKEN` | (JWT secret) |
| `CORS_ORIGIN` | URL frontend |
| `PAGE_LIMIT` | `10` |

---

## Admin User Default

Dibuat via `npx knex seed:run`:

```
Email   : admin@example.com
Password: admin123
Role    : ADMIN
```

---

## Semua Fix Yang Dilakukan

### 1. mysql → mysql2
- **Masalah**: `ER_NOT_SUPPORTED_AUTH_MODE` — package `mysql` lama tidak support MySQL 8.x
- **Fix**: Ganti dependency `mysql` → `mysql2`, ubah `client: "mysql"` → `client: "mysql2"` di `knexfile.js`

### 2. math-intrinsics missing
- **Masalah**: `Cannot find module 'math-intrinsics/abs'` di Vercel
- **Fix**: Tambah `"math-intrinsics": "^1.1.0"` ke `dependencies` di `package.json`, hapus `package-lock.json` dari `.gitignore`

### 3. Vercel serverless compatibility
- **Masalah**: `server.listen()` tidak kompatibel dengan serverless
- **Fix**: Update `index.js` — export `app` dan hanya jalankan server jika bukan di Vercel:
  ```js
  module.exports = app;
  if (!process.env.VERCEL) {
      const server = http.createServer(app);
      server.listen(port, ...);
  }
  ```

### 4. Case sensitivity filename (Linux)
- **Masalah**: `Cannot find module './services/GajiServicesList'` — file aslinya `GajiServicesLIst.js` (huruf I kapital), Windows tidak masalah tapi Linux Vercel case-sensitive
- **Fix**: `git mv apps/gaji/services/GajiServicesLIst.js apps/gaji/services/GajiServicesList.js`

### 5. express-rate-limit trust proxy
- **Masalah**: `ValidationError: X-Forwarded-For header is set but trust proxy is false`
- **Fix**: Tambah `app.set("trust proxy", 1)` di `app.js` sebelum rate limiter

### 6. Migration schema tidak sinkron
- **Masalah**: Migration lama pakai `NamaDepan`/`NamaBelakang`, kode baru pakai `NamaLengkap`, `role`, `department` — tabel tidak ada di Aiven
- **Fix**: Update `migrations/20260313_create_tables.js` — tambah kolom baru, buat `NamaDepan`/`NamaBelakang` nullable

### 7. Shared DB connection
- **Masalah**: Setiap service file buat koneksi Knex sendiri (hardcoded)
- **Fix**: Buat `apps/base/db.js` sebagai shared instance, semua service import dari sini

---

## File Penting Yang Dibuat/Dimodifikasi

```
API-PAYROLL/
├── index.js                          # Modified: Vercel serverless compat
├── app.js                            # Modified: trust proxy
├── knexfile.js                       # Modified: SSL + mysql2
├── package.json                      # Modified: mysql2, math-intrinsics
├── vercel.json                       # Created: Vercel config
├── render.yaml                       # Created: Render config
├── .gitignore                        # Modified: tambah .env, hapus package-lock dari ignore
├── postman_collection.json           # Created: 55 requests, 13 folder
├── seeds/
│   └── 01_admin_user.js              # Created: seed admin user
├── migrations/
│   └── 20260313_create_tables.js     # Modified: schema fix
└── apps/
    ├── base/
    │   └── db.js                     # Created: shared DB connection
    └── gaji/
        └── services/
            └── GajiServicesList.js   # Renamed dari GajiServicesLIst.js
```

---

## Cara Setup dari Awal (Fresh Clone)

```bash
# 1. Clone & install
git clone https://github.com/dickyadem/API-PAYROLL
cd API-PAYROLL
npm install

# 2. Buat .env (copy dari .env.example, isi kredensial Aiven)
cp .env.example .env

# 3. Jalankan migration
npx knex migrate:latest

# 4. Seed admin user
npx knex seed:run

# 5. Jalankan server
npm run dev
```

---

## Status Saat Ini

| Item | Status | Catatan |
|---|---|---|
| Vercel deployment | ✅ Live | API bisa diakses |
| Aiven MySQL | ✅ Running | Tabel sudah dibuat |
| Admin user | ✅ Dibuat | admin@example.com / admin123 |
| Login via localhost | ✅ Bisa | Gunakan http://localhost:4000 |
| Login via Vercel | ⚠️ Bermasalah | DB_PASSWORD di Vercel salah (typo l vs 1) |
| Postman Collection | ✅ Siap | postman_collection.json |

---

## Masalah Yang Belum Selesai

### DB_PASSWORD salah di Vercel
- **Gejala**: `Access denied for user 'avnadmin'@'<IP Vercel>'`
- **Penyebab**: `DB_PASSWORD` di Vercel dashboard kemungkinan tersimpan dengan huruf `l` bukan angka `1`
- **Fix**:
  1. Buka console.aiven.io → MySQL service
  2. Klik **ikon copy** di sebelah password (jangan ketik manual)
  3. Buka vercel.com → api-payroll → Settings → Environment Variables
  4. Edit `DB_PASSWORD` → hapus nilai lama → paste dari clipboard
  5. Save → tunggu redeploy

---

## Postman

File: `postman_collection.json` (ada di root project)

**Import**: Postman → Import → Link:
```
https://raw.githubusercontent.com/dickyadem/API-PAYROLL/main/postman_collection.json
```

**Variable yang perlu diset:**
- `base_url` = `http://localhost:4000` (lokal) atau `https://api-payroll.vercel.app` (production)
- `token` = diisi otomatis setelah request Login dijalankan

**Urutan test:**
1. Health Check
2. Login (token tersimpan otomatis)
3. Golongan → Tambah
4. Jabatan → Tambah
5. Karyawan → Tambah
6. Pendapatan → Tambah
7. Potongan → Tambah
8. Gaji → Buat
9. Export Excel / Slip

---

## Catatan Tambahan

- **Aiven free tier**: MySQL bisa auto power-off jika tidak ada aktivitas. Cek dashboard Aiven jika tiba-tiba connection refused.
- **Vercel cold start**: Serverless function pertama kali dipanggil mungkin lambat (cold start ~2-3 detik).
- **CORS**: Pastikan `CORS_ORIGIN` di Vercel diset ke URL frontend yang benar.
- **Rate limit**: 100 req/15 menit (global), 10 req/15 menit (login/register).
