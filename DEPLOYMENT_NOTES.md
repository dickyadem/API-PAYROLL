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

## Fix Session 2 — 26 Juni 2026

### 8. DB_PASSWORD typo di Vercel
- **Masalah**: Login via Vercel gagal 401 — `DB_PASSWORD` tersimpan dengan huruf `l` bukan angka `1`
- **Fix**: Hapus env var lama via Vercel CLI, set ulang dengan nilai benar, redeploy

### 9. RBAC endpoints 500 — tabel tidak ada
- **Masalah**: `tblroles`, `tblpermissions`, `tblrolepermissions` tidak ada di Aiven DB
- **Fix**: Buat migration `20260626_create_rbac_tables.js`, jalankan via inline knex dengan `ssl: { rejectUnauthorized: false }`

### 10. Excel library salah — BPJSServiceReportPeriodExcel & PphServiceReportPeriodExcel
- **Masalah**: Kedua file ditulis dengan API `excel4node` tapi project memakai `exceljs` → semua method tidak ada → crash
- **Fix**: Rewrite kedua file dari nol menggunakan exceljs. Juga fix function signature dan return value (`wb` → `wb.xlsx`)

### 11. Chaining bug — BPJSServiceReportPeriod & PphServiceReportPeriod
- **Masalah**: `BaseServiceQueryBuilder.fetchAll(table)` mengembalikan Promise. Kode memanggil `.clone()` langsung pada Promise → TypeError
- **Fix**: Ganti ke `BaseServiceQueryBuilder(table)` (Knex QueryBuilder langsung) sebelum memanggil `.clone()`

### 12. Import hilang — GajiServiceReportPeriodExcel
- **Masalah**: `xl` (exceljs) dan `BaseServiceExcelColumnResponsive` dipakai tapi tidak pernah di-import → ReferenceError
- **Fix**: Tambah dua baris import di bagian atas file

### 13. Crash data kosong — BPJSServiceFakturExcel & PphServiceFakturExcel
- **Masalah**: `Object.entries(tblprofil[0])` crash ketika `tblprofil` array kosong
- **Fix**: Tambah guard `if (!tblprofil.length) return wb.xlsx` sebelum baris tersebut

### 14. Dead code crash — SlipServiceFakturExcel
- **Masalah**: `db.fetchAll('tblgajidetail')` dieksekusi padahal tabel tidak ada di DB dan hasil query tidak pernah dipakai
- **Fix**: Hapus baris `fetchAll('tblgajidetail')` sepenuhnya

### 15. Tabel hilang di Aiven — tblpendapatandetail & tblpotongandetail
- **Masalah**: Migration awal tidak membuat kedua tabel ini. Dipakai oleh GajiServicesList, PphServiceFakturExcel, BPJSServiceFakturExcel → 500
- **Fix**: Buat migration `20260626_create_detail_tables.js` yang membuat kedua tabel + menambah kolom yang hilang di `tblgaji`

### 16. Schema tblgaji tidak sinkron
- **Masalah**: Kode menggunakan `Tanggal`, `Total_Pendapatan`, `Total_Potongan`, `Gaji_Bersih`, `Keterangan`, `email`, `ID_Profil` tapi kolom-kolom ini tidak ada di tabel hasil migration lama
- **Fix**: Migration `20260626_create_detail_tables.js` menambah semua kolom yang hilang

### 17. GROUP BY violation — GajiServiceReportPeriod
- **Masalah**: Query SELECT `ID_Gaji`, `Tanggal`, `Nama_Karyawan`, `Divisi` tapi GROUP BY hanya `Nama_Karyawan`, `Divisi` → MySQL `ONLY_FULL_GROUP_BY` error → 500
- **Fix**: Hapus kolom non-aggregated (`ID_Gaji`, `Tanggal`, `Divisi`) dari SELECT dan GROUP BY, sesuaikan header Excel

### 18. Kolom Divisi tidak ada di tblkaryawan
- **Masalah**: Query join `tblkaryawan.Divisi` tapi kolom tersebut tidak ada di schema → MySQL error
- **Fix**: Hapus `Divisi` dari query dan laporan Excel

### 19. BaseServiceExcelColumnResponsive crash pada undefined
- **Masalah**: `column.values.map(v => v.toString().length)` — index 0 di exceljs selalu `undefined` → TypeError saat `ws.addRow()` dipakai
- **Fix**: Ganti ke `v ? v.toString().length : 0`

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
├── postman_collection.json           # Updated: 64 requests, fix body & password
├── seeds/
│   └── 01_admin_user.js              # Created: seed admin user
├── migrations/
│   ├── 20260313_create_tables.js     # Modified: schema fix
│   ├── 20260626_create_rbac_tables.js    # Created: tblroles, tblpermissions, tblrolepermissions
│   ├── 20260626_create_detail_tables.js  # Created: tblpendapatandetail, tblpotongandetail + kolom tblgaji
│   └── 20260626_add_missing_columns.js   # Created: kolom tambahan tabel lain
└── apps/
    ├── base/
    │   ├── db.js                         # Created: shared DB connection
    │   ├── services/
    │   │   ├── BaseServiceQueryBuilder.js    # Modified: tambah fetchFirst()
    │   │   └── BaseServiceExcelColumnResponsive.js  # Fixed: null guard untuk undefined values
    ├── gaji/
    │   ├── config.js                     # Modified: tambah DATAPROFIL_CONFIG_TABLE
    │   ├── services/
    │   │   ├── GajiServicesList.js       # Renamed dari GajiServicesLIst.js
    │   │   ├── GajiServiceReportPeriod.js    # Fixed: GROUP BY query, hapus kolom non-aggregated
    │   │   └── GajiServiceReportPeriodExcel.js  # Fixed: tambah import xl & BaseServiceExcelColumnResponsive
    │   ├── laporanBPJS/
    │   │   ├── BPJSServiceReportPeriod.js    # Fixed: chaining bug (.clone() pada Promise)
    │   │   ├── BPJSServiceReportPeriodExcel.js  # Rewrite: dari excel4node ke exceljs
    │   │   └── BPJSServiceFakturExcel.js     # Fixed: guard untuk tblprofil kosong
    │   ├── laporanPPH/
    │   │   ├── PphServiceReportPeriod.js     # Fixed: chaining bug (.clone() pada Promise)
    │   │   ├── PphServiceReportPeriodExcel.js   # Rewrite: dari excel4node ke exceljs
    │   │   └── PphServiceFakturExcel.js      # Fixed: guard untuk tblprofil kosong
    │   └── laporanslip/
    │       └── SlipServiceFakturExcel.js     # Fixed: hapus dead code tblgajidetail, guard tblkaryawan kosong
    └── user/
        └── services/
            └── UserServiceRegister.js        # Fixed: bug register endpoint
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

# 3. Jalankan migration (gunakan inline knex jika Aiven SSL error)
npx knex migrate:latest

# 4. Seed admin user
npx knex seed:run

# 5. Jalankan server
npm run dev
```

> ⚠️ Jika `knex migrate:latest` gagal karena SSL error Aiven, jalankan via inline:
> ```bash
> node -e "const k=require('knex')({client:'mysql2',connection:{...ssl:{rejectUnauthorized:false}},migrations:{directory:'./migrations',tableName:'knex_migrations'}});k.migrate.latest().then(r=>{console.log(r);return k.destroy()})"
> ```

---

## Status Saat Ini (Update: 26 Juni 2026)

| Item | Status | Catatan |
|---|---|---|
| Vercel deployment | ✅ Live | https://api-payroll.vercel.app |
| Aiven MySQL | ✅ Running | Semua tabel sudah ada |
| Admin user | ✅ Dibuat | admin@example.com / admin123 |
| Login via Vercel | ✅ Berfungsi | DB_PASSWORD sudah diperbaiki |
| RBAC endpoints | ✅ Berfungsi | Tabel RBAC sudah dimigrasikan |
| Excel exports (pph, bpjs, slip, report) | ✅ Berfungsi | Semua 200 OK |
| Postman Collection | ✅ Siap | 64 requests, semua endpoint tercakup |
| Karyawan CRUD | ⚠️ Perlu data prereq | Butuh Golongan & Jabatan aktif |
| Gaji CRUD | ⚠️ Perlu data karyawan | Butuh karyawan, pendapatan, potongan aktif |

---

## Masalah Yang Diketahui

### Aiven Free Tier Auto Power-Off
- **Gejala**: `ECONNRESET` atau `ENOTFOUND` setelah idle lama
- **Fix**: Buka console.aiven.io → klik **Power On** di MySQL service
- **Catatan**: Test Newman yang lama (>5 menit) rentan kena masalah ini

### ~~CORS Error — Frontend GitHub Pages diblokir~~ ✅ SELESAI (2026-07-01)
- **Gejala**: Login dari `https://dickyadem.github.io` gagal CORS policy
- **Root cause**: `CORS_ORIGIN` di Vercel hanya berisi `http://localhost:3000`
- **Fix yang dilakukan**:
  - Update `app.js` — CORS middleware sekarang support multi-origin (split by comma)
  - Update env var `CORS_ORIGIN` di Vercel: `http://localhost:3000,https://dickyadem.github.io`
  - Sudah di-deploy dan diverifikasi — kedua origin mengembalikan header CORS yang benar
- **Untuk tambah origin baru**: Edit `CORS_ORIGIN` di Vercel, tambahkan URL baru dipisah koma, redeploy

### Karyawan POST butuh field lengkap
Body request harus menyertakan semua field yang diwajibkan validator:
```json
{
  "ID_Karyawan": "KRY001",
  "Nama_Karyawan": "Budi Santoso",
  "ID_Golongan": "GOL001",
  "ID_Jabatan": "JAB001",
  "email": "budi@example.com",
  "Divisi": "IT",
  "Status_Pernikahan": "Menikah",
  "Jumlah_Anak": 2,
  "Gaji_Pokok": 5000000
}
```

### Pendapatan & Potongan POST butuh field Nominal
```json
{
  "ID_Pendapatan": "PDT001",
  "Nama_Pendapatan": "Gaji Pokok",
  "Nominal": 5000000
}
```

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
