# API Payroll — Panduan untuk Frontend Developer

**Base URL Production:** `https://api-payroll.vercel.app`  
**Base URL Local:** `http://localhost:3000`

---

## Catatan Penting untuk FE

### 1. Autentikasi
Semua endpoint (kecuali login) **wajib** mengirim token JWT di header:

```http
Authorization: Bearer <token>
```

Token didapat dari response `/user/login`. Simpan di `localStorage` atau `sessionStorage`.

### 2. Format Angka (Decimal)
Semua field angka (`Gaji_Bersih`, `Total_Pendapatan`, `Nominal`, dst.) dikirim API sebagai **string**, bukan number:
```json
"Gaji_Bersih": "4800000.00"
```
Parse ke float sebelum dipakai: `parseFloat(data.Gaji_Bersih)`

### 3. Pagination
Semua endpoint list menggunakan query `?page=1`. Struktur response selalu sama:
```json
{
  "page": 1,
  "next": 2,
  "prev": null,
  "numberOfPage": 5,
  "total": 47,
  "results": [...],
  "terms": ""
}
```
- `next` / `prev` — nomor halaman berikutnya/sebelumnya, `null` jika tidak ada
- `total` — total semua data (bukan per halaman)
- Tambah `?terms=<keyword>` untuk search

### 4. Response GET Single Item
GET `/:ID` mengembalikan **objek langsung** (bukan dibungkus `{ data: ... }`):
```json
{ "ID_Karyawan": "KRY001", "Nama_Karyawan": "Budi Santoso", ... }
```

### 5. Response PUT / POST
PUT dan POST mengembalikan `{ success: true, data: {...} }` atau `{ success: true, message: "...", data: {...} }`.

### 6. Tanggal
Format tanggal dari API: ISO 8601 (`"2026-06-27T00:00:00.000Z"`).  
Gunakan `new Date(data.Tanggal).toLocaleDateString('id-ID')` untuk display.

### 7. Field `password` di response GET /user
Response GET `/user` menyertakan field `password` (sudah di-hash). **Jangan tampilkan ke UI**, filter di FE.

### 8. CORS
CORS sudah dikonfigurasi untuk `http://localhost:3000` dan `https://dickyadem.github.io`.  
Jika pakai port/domain lain, hubungi BE untuk ditambahkan.

### 9. Endpoint yang Belum Ada (TODO BE)
Fitur berikut **belum ada di BE**:
- `DELETE /rbac/roles/:id` — hapus role (bukan cabut permission dari role)
- `DELETE /rbac/permissions/:id` — hapus permission

---

## Struktur Error

### Validation Error (400)
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Email tidak valid",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Auth Error (401)
```json
{ "success": false, "message": "Token tidak valid atau sudah expired" }
```

### Forbidden (403)
```json
{
  "error": "Akses ditolak",
  "message": "Role Anda tidak memiliki akses untuk melakukan aksi ini",
  "required": ["admin"],
  "yourRole": "staff"
}
```

### Not Found (404)
```json
{ "success": false, "message": "Data tidak ditemukan" }
```

### Login Gagal (401)
```json
{ "success": false, "message": "Email atau password salah" }
```

---

## Endpoint Reference

### AUTH

#### POST /user/login
```http
POST /user/login
Content-Type: application/json
```
**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```
**Response 200:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "admin@example.com",
    "username": "Admin Payroll",
    "role": "ADMIN",
    "department": "IT"
  }
}
```
> Simpan `token` untuk semua request selanjutnya. Simpan `user.role` untuk logika tampil/sembunyikan menu.

---

#### POST /user/register *(Admin only)*
```http
POST /user/register
Authorization: Bearer <token>
Content-Type: application/json
```
**Request:**
```json
{
  "email": "staff@example.com",
  "password": "password123",
  "NamaLengkap": "Nama Lengkap",
  "role": "ROLE001",
  "department": "HRD",
  "Status": "aktif"
}
```
**Response 201:** `{ "success": true, "message": "User berhasil dibuat" }`

---

### USER

#### GET /user *(Admin only)*
```http
GET /user?page=1&terms=budi
Authorization: Bearer <token>
```
**Response 200:**
```json
{
  "page": 1,
  "next": null,
  "prev": null,
  "numberOfPage": 1,
  "total": 3,
  "results": [
    {
      "ID_User": "USR001",
      "NamaDepan": "Admin",
      "NamaBelakang": "",
      "NamaLengkap": "Admin Payroll",
      "Status": "aktif",
      "email": "admin@example.com",
      "password": "$2a$10$...",
      "role": "ADMIN",
      "department": "IT",
      "created_at": "2026-06-23T10:08:00.000Z",
      "updated_at": "2026-06-23T10:08:00.000Z"
    }
  ],
  "terms": ""
}
```
> ⚠️ Filter field `password` sebelum tampil ke UI.

---

#### PUT /user/:email *(Admin only)*
```http
PUT /user/admin@example.com
Authorization: Bearer <token>
Content-Type: application/json
```
**Request** (semua field opsional):
```json
{
  "NamaLengkap": "Admin Payroll",
  "role": "ADMIN",
  "department": "IT",
  "Status": "aktif"
}
```
**Response 200:**
```json
{
  "success": true,
  "message": "User berhasil diupdate",
  "data": {
    "ID_User": "USR001",
    "NamaLengkap": "Admin Payroll",
    "email": "admin@example.com",
    "role": "ADMIN",
    "department": "IT",
    "Status": "aktif",
    "created_at": "2026-06-23T10:08:00.000Z",
    "updated_at": "2026-06-23T10:08:00.000Z"
  }
}
```
> Password **tidak bisa** diubah lewat endpoint ini. Gunakan `/user/change-password`.

---

#### PUT /user/change-password
```http
PUT /user/change-password
Authorization: Bearer <token>
Content-Type: application/json
```
**Request:**
```json
{
  "oldPassword": "password_lama",
  "newPassword": "password_baru"
}
```
**Response 200:** `{ "success": true, "message": "Password berhasil diubah" }`

> Dipakai oleh user untuk ganti password **miliknya sendiri**. Butuh `oldPassword` lama.

---

#### PUT /user/reset-password/:email *(Admin only)*
```http
PUT /user/reset-password/budi@example.com
Authorization: Bearer <token>
Content-Type: application/json
```
**Request:**
```json
{
  "newPassword": "passwordbaru123"
}
```
**Response 200:**
```json
{
  "success": true,
  "message": "Password untuk budi@example.com berhasil direset"
}
```
> Dipakai **Admin** untuk reset password user lain. Tidak butuh `oldPassword`. Minimal 8 karakter.  
> Berbeda dengan `change-password` yang dipakai user reset password sendiri.

---

### PROFIL PERUSAHAAN

#### GET /profil
```http
GET /profil?page=1
Authorization: Bearer <token>
```
**Response 200:**
```json
{
  "page": 1,
  "next": null,
  "prev": null,
  "numberOfPage": 1,
  "total": 1,
  "results": [
    {
      "ID_Profil": "PRF001",
      "Nama": "Pt Contoh Indonesia",
      "Alamat": "Jl. Raya Contoh No. 123456",
      "Telepon": "0211234567",
      "Fax": "0211234568",
      "Email": "info@ptcontoh.com",
      "Website": "www.ptcontoh.com",
      "created_at": "2026-06-26T02:51:26.000Z",
      "updated_at": "2026-06-26T02:51:26.000Z"
    }
  ],
  "terms": ""
}
```

#### GET /profil/:ID_Profil
**Response 200:**
```json
{
  "ID_Profil": "PRF001",
  "Nama": "Pt Contoh Indonesia",
  "Alamat": "Jl. Raya Contoh No. 123456",
  "Telepon": "0211234567",
  "Fax": "0211234568",
  "Email": "info@ptcontoh.com",
  "Website": "www.ptcontoh.com",
  "created_at": "2026-06-26T02:51:26.000Z",
  "updated_at": "2026-06-26T02:51:26.000Z"
}
```

#### POST /profil
```json
{
  "ID_Profil": "PRF002",
  "Nama": "Nama Perusahaan",
  "Alamat": "Jl. Alamat Lengkap No. 1 (min 10 karakter)",
  "Telepon": "0211234567",
  "Fax": "0211234568",
  "Email": "info@perusahaan.com",
  "Website": "www.perusahaan.com"
}
```
> ⚠️ `Alamat` minimal 10 karakter. `Telepon` dan `Fax` format angka saja (bukan +62).

#### PUT /profil/:ID_Profil
Sama dengan POST tapi semua field opsional.

---

### GOLONGAN

#### GET /golongan
```json
{
  "page": 1, "next": null, "prev": null, "numberOfPage": 1, "total": 1,
  "results": [
    {
      "ID_Golongan": "GOL001",
      "Nama_Golongan": "GOLONGAN I",
      "Tunjangan_Golongan": "0.00",
      "created_at": "2026-06-26T02:28:45.000Z",
      "updated_at": "2026-06-26T02:28:45.000Z"
    }
  ],
  "terms": ""
}
```

#### POST /golongan
```json
{ "ID_Golongan": "GOL002", "Nama_Golongan": "GOLONGAN II", "Tunjangan_Golongan": 500000 }
```

#### PUT /golongan/:ID_Golongan
```json
{ "Nama_Golongan": "GOLONGAN II", "Tunjangan_Golongan": 750000 }
```
**Response:** `{ "success": true, "data": { ... } }`

---

### JABATAN

#### GET /jabatan
```json
{
  "page": 1, "next": null, "prev": null, "numberOfPage": 1, "total": 2,
  "results": [
    {
      "ID_Jabatan": "J001",
      "Nama_Jabatan": "Staff Junior HR",
      "Tunjangan_Jabatan": "0.00",
      "created_at": "2026-06-29T09:41:00.000Z",
      "updated_at": "2026-06-29T09:41:00.000Z"
    }
  ],
  "terms": ""
}
```

#### POST /jabatan
```json
{ "ID_Jabatan": "JAB002", "Nama_Jabatan": "Manager", "Tunjangan_Jabatan": 2000000 }
```

#### PUT /jabatan/:ID_Jabatan
```json
{ "Nama_Jabatan": "Senior Manager", "Tunjangan_Jabatan": 2500000 }
```

---

### PENDAPATAN (Master Jenis Pendapatan)

#### GET /pendapatan
```json
{
  "page": 1, "next": null, "prev": null, "numberOfPage": 1, "total": 1,
  "results": [
    {
      "ID_Pendapatan": "PDT001",
      "Nama_Pendapatan": "Gaji Pokok",
      "Nominal": "5000000.00",
      "ID_Jabatan": null,
      "Keterangan": "Gaji pokok bulanan",
      "created_at": "2026-06-26T02:51:28.000Z",
      "updated_at": "2026-06-26T02:51:28.000Z"
    }
  ],
  "terms": ""
}
```

#### POST /pendapatan
```json
{
  "ID_Pendapatan": "PDT002",
  "Nama_Pendapatan": "Tunjangan Makan",
  "Nominal": 500000,
  "Keterangan": "Tunjangan makan harian"
}
```

#### PUT /pendapatan/:ID_Pendapatan
```json
{ "Nama_Pendapatan": "Tunjangan Makan", "Nominal": 600000 }
```

---

### POTONGAN (Master Jenis Potongan)

#### GET /potongan
```json
{
  "page": 1, "next": null, "prev": null, "numberOfPage": 1, "total": 1,
  "results": [
    {
      "ID_Potongan": "PTG001",
      "Nama_Potongan": "Bpjs Kesehatan",
      "Nominal": "259000.00",
      "ID_Jabatan": null,
      "Keterangan": "Potongan BPJS Kesehatan 1%",
      "created_at": "2026-06-26T02:51:29.000Z",
      "updated_at": "2026-06-26T02:51:29.000Z"
    }
  ],
  "terms": ""
}
```

#### POST /potongan
```json
{
  "ID_Potongan": "PTG002",
  "Nama_Potongan": "BPJS Ketenagakerjaan",
  "Nominal": 100000,
  "Keterangan": "Potongan BPJS TK 2%"
}
```

#### PUT /potongan/:ID_Potongan
```json
{ "Nominal": 120000, "Keterangan": "Updated" }
```

---

### KARYAWAN

#### GET /karyawan
```json
{
  "page": 1, "next": null, "prev": null, "numberOfPage": 1, "total": 1,
  "results": [
    {
      "ID_Karyawan": "KRY001",
      "Nama_Karyawan": "Budi Santoso",
      "ID_Golongan": "GOL001",
      "ID_Jabatan": "JAB001",
      "Gaji_Pokok": "0.00",
      "Divisi": "Hrd",
      "Status_Pernikahan": "Menikah",
      "Jumlah_Anak": 2,
      "email": "budi@example.com",
      "created_at": "2026-06-26T02:51:27.000Z",
      "updated_at": "2026-06-26T02:51:27.000Z"
    }
  ],
  "terms": ""
}
```

#### GET /karyawan/:ID_Karyawan
**Response:** Objek tunggal (sama strukturnya dengan item di `results[]` di atas).

#### POST /karyawan
```json
{
  "ID_Karyawan": "KRY002",
  "Nama_Karyawan": "Siti Rahayu",
  "ID_Golongan": "GOL001",
  "ID_Jabatan": "JAB001",
  "Divisi": "Finance",
  "Status_Pernikahan": "Belum Menikah",
  "Jumlah_Anak": 0,
  "email": "siti@example.com",
  "Gaji_Pokok": 4000000
}
```

#### PUT /karyawan/:ID_Karyawan
```json
{
  "Nama_Karyawan": "Siti Rahayu Updated",
  "ID_Golongan": "GOL002",
  "Divisi": "HRD"
}
```
**Response:** `{ "success": true, "data": { ... } }`

---

### GAJI

#### GET /gaji
```json
{
  "page": 1, "next": null, "prev": null, "numberOfPage": 1, "total": 1,
  "results": [
    {
      "ID_Gaji": "GJI-2606-7199",
      "ID_Karyawan": "KRY001",
      "Gaji_Pokok": "0.00",
      "Tanggal_Gaji": null,
      "Tanggal": "2026-06-27T00:00:00.000Z",
      "Total_Pendapatan": "5000000.00",
      "Total_Potongan": "259000.00",
      "Gaji_Bersih": "4800000.00",
      "Keterangan": "Gaji Bulanan Juni 2026",
      "email": "budi@example.com",
      "ID_Profil": "PRF001",
      "created_at": "2026-06-27T12:51:36.000Z",
      "updated_at": "2026-06-27T12:51:36.000Z",
      "itemsPendapatan": [
        {
          "id": 3,
          "ID_Gaji": "GJI-2606-7199",
          "ID_Pendapatan": "PDT001",
          "Jumlah_Pendapatan": "5000000.00",
          "created_at": "2026-06-27T12:51:36.000Z",
          "updated_at": "2026-06-27T12:51:36.000Z"
        }
      ],
      "itemsPotongan": [
        {
          "id": 3,
          "ID_Gaji": "GJI-2606-7199",
          "ID_Potongan": "PTG001",
          "Jumlah_Potongan": "259000.00",
          "created_at": "2026-06-27T12:51:36.000Z",
          "updated_at": "2026-06-27T12:51:36.000Z"
        }
      ]
    }
  ],
  "terms": ""
}
```

#### GET /gaji/:ID_Gaji
```json
{
  "ID_Gaji": "GJI-2606-7199",
  "ID_Karyawan": "KRY001",
  "Tanggal": "2026-06-27T00:00:00.000Z",
  "Total_Pendapatan": "5000000.00",
  "Total_Potongan": "259000.00",
  "Gaji_Bersih": "4800000.00",
  "Keterangan": "Gaji Bulanan Juni 2026",
  "email": "budi@example.com",
  "ID_Profil": "PRF001",
  "items": [...]
}
```
> ⚠️ GET single `/gaji/:ID` mengembalikan field `items` (bukan `itemsPendapatan`/`itemsPotongan` seperti GET list).

#### POST /gaji
```json
{
  "ID_Karyawan": "KRY001",
  "Tanggal": "2026-07-01",
  "Keterangan": "Gaji Bulanan Juli 2026",
  "email": "budi@example.com",
  "ID_Profil": "PRF001",
  "Total_Pendapatan": 5000000,
  "Total_Potongan": 259000,
  "Gaji_Bersih": 4741000,
  "itemsPendapatan": [
    { "ID_Pendapatan": "PDT001", "Jumlah_Pendapatan": 5000000 }
  ],
  "itemsPotongan": [
    { "ID_Potongan": "PTG001", "Jumlah_Potongan": 259000 }
  ]
}
```
**Response 201:** `{ "ID_Gaji": "GJI-XXXX-YYYY", ... }`  
> `ID_Gaji` di-generate otomatis oleh server.

#### PUT /gaji/:ID_Gaji
```json
{
  "Tanggal": "2026-06-27",
  "Keterangan": "Gaji Bulanan Juni 2026 (revisi)",
  "Total_Pendapatan": 5200000,
  "Total_Potongan": 259000,
  "Gaji_Bersih": 4941000,
  "email": "budi@example.com",
  "ID_Profil": "PRF001"
}
```
**Response 200:**
```json
{
  "success": true,
  "data": {
    "ID_Gaji": "GJI-2606-7199",
    "ID_Karyawan": "KRY001",
    "Tanggal": "2026-06-27T00:00:00.000Z",
    "Total_Pendapatan": "5200000.00",
    "Total_Potongan": "259000.00",
    "Gaji_Bersih": "4941000.00",
    "Keterangan": "Gaji Bulanan Juni 2026 (revisi)",
    "updated_at": "2026-07-01T..."
  }
}
```
> ⚠️ PUT /gaji **tidak** mengupdate `itemsPendapatan`/`itemsPotongan`. Update detail gaji lewat endpoint `/pendapatandetail` dan `/potongandetail` secara terpisah.

---

### PENDAPATAN DETAIL (Detail Pendapatan per Gaji)

#### GET /pendapatandetail
```json
{
  "page": 1, "next": null, "prev": null, "numberOfPage": 1, "total": 1,
  "results": [
    {
      "id": 3,
      "ID_Gaji": "GJI-2606-7199",
      "ID_Pendapatan": "PDT001",
      "Jumlah_Pendapatan": "5200000.00",
      "created_at": "2026-06-27T12:51:36.000Z",
      "updated_at": "2026-06-27T12:51:36.000Z"
    }
  ],
  "terms": ""
}
```

#### GET /pendapatandetail/:ID_Gaji
Mengembalikan **objek tunggal** (item pertama untuk gaji tersebut):
```json
{
  "id": 3,
  "ID_Gaji": "GJI-2606-7199",
  "ID_Pendapatan": "PDT001",
  "Jumlah_Pendapatan": "5200000.00",
  "created_at": "2026-06-27T12:51:36.000Z",
  "updated_at": "2026-06-27T12:51:36.000Z"
}
```

#### POST /pendapatandetail
```json
{
  "ID_Gaji": "GJI-2606-7199",
  "ID_Pendapatan": "PDT002",
  "Jumlah_Pendapatan": 500000
}
```

#### PUT /pendapatandetail/:ID_Gaji/:ID_Pendapatan
```json
{ "Jumlah_Pendapatan": 5500000 }
```
**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "ID_Gaji": "GJI-2606-7199",
    "ID_Pendapatan": "PDT001",
    "Jumlah_Pendapatan": "5500000.00",
    "created_at": "2026-06-27T12:51:36.000Z",
    "updated_at": "2026-07-01T..."
  }
}
```

---

### POTONGAN DETAIL (Detail Potongan per Gaji)

#### GET /potongandetail
```json
{
  "page": 1, "next": null, "prev": null, "numberOfPage": 1, "total": 1,
  "results": [
    {
      "id": 3,
      "ID_Gaji": "GJI-2606-7199",
      "ID_Potongan": "PTG001",
      "Jumlah_Potongan": "259000.00",
      "created_at": "2026-06-27T12:51:36.000Z",
      "updated_at": "2026-06-27T12:51:36.000Z"
    }
  ],
  "terms": ""
}
```

#### PUT /potongandetail/:ID_Gaji/:ID_Potongan
```json
{ "Jumlah_Potongan": 300000 }
```
**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "ID_Gaji": "GJI-2606-7199",
    "ID_Potongan": "PTG001",
    "Jumlah_Potongan": "300000.00",
    "updated_at": "2026-07-01T..."
  }
}
```

---

### LAPORAN (Excel Download)

Semua endpoint laporan mengembalikan **file Excel** (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).  
Gunakan `window.open(url)` atau fetch dengan `responseType: 'blob'`.

| Endpoint | Deskripsi |
|---|---|
| `GET /gaji/pph-excel` | Laporan PPh 21 |
| `GET /gaji/bpjs-excel` | Laporan BPJS |
| `GET /gaji/slip-excel` | Slip Gaji |
| `GET /gaji/report-period-excel?startDate=2026-01-01&endDate=2026-12-31` | Laporan periode |
| `GET /gaji/reportPph-period-excel?startDate=...&endDate=...` | Laporan PPh periode |
| `GET /gaji/reportBpjs-period-excel?startDate=...&endDate=...` | Laporan BPJS periode |

**Contoh download di FE:**
```javascript
const response = await fetch(`${BASE_URL}/gaji/slip-excel`, {
  headers: { Authorization: `Bearer ${token}` }
});
const blob = await response.blob();
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'slip-gaji.xlsx';
a.click();
```

---

### RBAC (Role & Permission Management) *(Admin only)*

#### GET /rbac/roles
```json
[
  {
    "ID_Role": "ROLE001",
    "Nama_Role": "Staff Senior",
    "Keterangan": "Role Staff HR",
    "created_at": "2026-06-26T02:45:14.000Z",
    "updated_at": "2026-06-26T02:45:14.000Z"
  }
]
```
> Mengembalikan **array** (bukan objek pagination).

#### POST /rbac/roles
```json
{ "ID_Role": "ROLE002", "Nama_Role": "Finance Staff", "Keterangan": "Staff keuangan" }
```

#### PUT /rbac/roles/:ID_Role
```json
{ "Nama_Role": "Finance Senior", "Keterangan": "Staff keuangan senior" }
```
**Response 200:** `{ "success": true, "data": { ... } }`

---

#### GET /rbac/permissions
```json
[
  {
    "ID_Permission": "PERM001",
    "Nama_Permission": "Lihat Gaji",
    "Module": "gaji",
    "Description": "Akses lihat data gaji (read only)",
    "created_at": "2026-06-26T02:45:16.000Z",
    "updated_at": "2026-06-26T02:45:16.000Z"
  }
]
```

#### POST /rbac/permissions
```json
{
  "ID_Permission": "PERM002",
  "Nama_Permission": "Edit Karyawan",
  "Module": "karyawan",
  "Description": "Akses edit data karyawan"
}
```

#### PUT /rbac/permissions/:ID_Permission
```json
{ "Nama_Permission": "Edit Karyawan", "Description": "Updated description" }
```

---

#### GET /rbac/roles/:ID_Role/permissions
```json
[
  { "ID_Permission": "PERM001", "Nama_Permission": "Lihat Gaji", "Module": "gaji", ... }
]
```

#### POST /rbac/roles/:ID_Role/permissions *(Assign permission ke role)*
```json
{ "ID_Permission": "PERM002" }
```

#### DELETE /rbac/roles/:ID_Role/permissions/:ID_Permission *(Cabut permission dari role)*
**Response 200:** `{ "success": true, "message": "Permission berhasil dihapus dari role" }`

#### POST /rbac/users/:email/role *(Assign role ke user)*
```json
{ "ID_Role": "ROLE001" }
```

---

### USER PROFILE (Profil User Sendiri)

#### GET /user/me
```http
GET /user/me
Authorization: Bearer <token>
```
**Response 200:**
```json
{
  "success": true,
  "data": {
    "ID_User": "USR001",
    "NamaLengkap": "Admin Payroll",
    "Status": "aktif",
    "email": "admin@example.com",
    "role": "ADMIN",
    "department": "IT",
    "phone": "0812-3456-7890",
    "position": "System Administrator",
    "joinDate": "2023-01-15",
    "address": "Jl. Sudirman No. 123, Jakarta",
    "avatar": null,
    "created_at": "2026-06-23T10:08:00.000Z",
    "updated_at": "2026-07-01T10:00:00.000Z"
  }
}
```
> Field `password` sudah difilter — tidak muncul di response ini. `phone`, `position`, `joinDate`, `address`, `avatar` akan `null` sampai diisi via `PUT /user/me`.

---

#### PUT /user/me
```http
PUT /user/me
Authorization: Bearer <token>
Content-Type: application/json
```
**Request** (semua field opsional):
```json
{
  "NamaLengkap": "Admin Payroll",
  "phone": "0812-3456-7890",
  "position": "System Administrator",
  "joinDate": "2023-01-15",
  "address": "Jl. Sudirman No. 123, Jakarta",
  "avatar": "data:image/png;base64,iVBORw0KGgo..."
}
```
**Response 200:**
```json
{
  "success": true,
  "message": "Profil berhasil diupdate",
  "data": {
    "ID_User": "USR001",
    "NamaLengkap": "Admin Payroll",
    "email": "admin@example.com",
    "role": "ADMIN",
    "department": "IT",
    "phone": "0812-3456-7890",
    "position": "System Administrator",
    "joinDate": "2023-01-15",
    "address": "Jl. Sudirman No. 123, Jakarta",
    "avatar": "data:image/png;base64,...",
    "updated_at": "2026-07-01T10:00:00.000Z"
  }
}
```
> User hanya bisa update profil **sendiri**. Untuk update `role`/`department`/`Status` user lain, gunakan `PUT /user/:email` (Admin only).  
> `avatar` dikirim sebagai base64 string dan disimpan langsung di DB.

---

### NOTIFIKASI

#### GET /notifications
```http
GET /notifications?page=1
Authorization: Bearer <token>
```
**Response 200:**
```json
{
  "page": 1,
  "next": null,
  "prev": null,
  "numberOfPage": 1,
  "total": 2,
  "results": [
    {
      "id": 1,
      "email": "admin@example.com",
      "type": "success",
      "title": "Penggajian berhasil diproses",
      "message": "Periode Juli 2026 untuk 24 karyawan sudah selesai dihitung.",
      "is_read": false,
      "created_at": "2026-07-01T09:12:00.000Z",
      "updated_at": "2026-07-01T09:12:00.000Z"
    },
    {
      "id": 2,
      "email": "admin@example.com",
      "type": "warning",
      "title": "Laporan BPJS jatuh tempo",
      "message": "Deadline pelaporan BPJS bulan Juli 2026 adalah 10 Juli 2026.",
      "is_read": true,
      "created_at": "2026-06-30T08:00:00.000Z",
      "updated_at": "2026-06-30T08:00:00.000Z"
    }
  ],
  "terms": ""
}
```
> Hanya menampilkan notifikasi milik user yang login (berdasarkan token). Diurutkan terbaru di atas.  
> `type`: `"success"` | `"warning"` | `"info"` — dipakai untuk warna/icon di FE.

---

#### PATCH /notifications/read-all
```http
PATCH /notifications/read-all
Authorization: Bearer <token>
```
**Response 200:**
```json
{
  "success": true,
  "message": "Semua notifikasi ditandai sudah dibaca"
}
```

---

#### PATCH /notifications/:id/read
```http
PATCH /notifications/1/read
Authorization: Bearer <token>
```
**Response 200:**
```json
{
  "success": true,
  "message": "Notifikasi ditandai sudah dibaca"
}
```
**Response 404** (notifikasi tidak ditemukan atau bukan milik user):
```json
{
  "success": false,
  "message": "Notifikasi tidak ditemukan"
}
```
> ⚠️ `read-all` **wajib** dipanggil sebelum `/:id/read` di routing — sudah dihandle di BE.

---

## Ringkasan Status HTTP

| Status | Arti |
|---|---|
| 200 | OK — GET/PUT berhasil |
| 201 | Created — POST berhasil |
| 204 | No Content — DELETE berhasil |
| 304 | Not Modified — cache browser (normal, bukan error) |
| 400 | Bad Request — validasi gagal atau data kurang |
| 401 | Unauthorized — token missing/expired/salah |
| 403 | Forbidden — role tidak punya akses |
| 404 | Not Found — data tidak ada |
| 500 | Internal Server Error — error BE |

---

*Terakhir diupdate: 2026-07-01 | Backend: https://api-payroll.vercel.app*
