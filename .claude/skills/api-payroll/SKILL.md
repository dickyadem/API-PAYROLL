# API Payroll - Backend Skill

Backend REST API untuk Sistem Penggajian (Payroll Management System).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js v24 |
| Framework | Express.js v4.18 |
| Database | MySQL/MariaDB (via Knex.js) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Authorization | Custom RBAC (Role-Based Access Control) |
| Validation | express-validator v7 |
| Excel Export | ExcelJS + excel4node |
| Rate Limiting | express-rate-limit |

## Project Structure

```
API-PAYROLL/
├── app.js                    # Express app setup, middleware, routes
├── index.js                  # Server entry (port from .env API_PORT)
├── package.json
├── .env                      # Environment config
├── payroll.sql               # Database schema + seed data
├── migrations/               # SQL migration scripts
└── apps/                     # Feature modules
    ├── base/                 # Shared utilities
    │   ├── services/
    │   │   ├── BaseServiceQueryBuilder.js   # Knex DB connection
    │   │   ├── BaseServicePaginator.js      # Pagination helper
    │   │   ├── ConfigCTA.js                 # Response messages
    │   │   └── BaseServiceExcelColumnResponsive.js
    │   └── validators/       # Shared validation middleware
    ├── user/                 # Auth & User management
    ├── karyawan/             # Employee management
    ├── gaji/                 # Salary + Excel reports
    │   ├── services/         # CRUD services
    │   ├── laporanBPJS/      # BPJS insurance reports
    │   ├── laporanPPH/       # Tax (PPH) reports
    │   └── laporanslip/      # Payslip reports
    ├── gajidetail/           # Salary detail
    ├── pendapatan/           # Income types
    ├── pendapatandetail/     # Income details per salary
    ├── potongan/             # Deduction types
    ├── potongandetail/       # Deduction details per salary
    ├── jabatan/              # Positions
    ├── golongan/             # Grade levels
    ├── profil/               # Company profile
    └── rbac/                 # Role-Based Access Control
```

## Module Pattern

Every module follows this structure:
```
apps/<module>/
├── config.js                    # Table name & config
├── <Module>Controllers.js       # Express Router (routes + handlers)
├── <Module>Validators.js        # express-validator rules
└── services/
    ├── <Module>ServiceCreate.js
    ├── <Module>ServiceList.js
    ├── <Module>ServiceGet.js
    ├── <Module>ServiceEdit.js
    └── <Module>ServiceDelete.js
```

Flow: `Controller → Validators → Service → BaseServiceQueryBuilder (Knex) → MySQL`

## Environment Variables (.env)

```env
API_PORT=4000
PAGE_LIMIT=10
TOKEN=<jwt-secret>
CORS_ORIGIN=http://localhost:3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=payroll
```

## Authentication & Authorization

### JWT Authentication
- Login: `POST /user/login` → returns JWT token
- Token sent via: `Authorization: Bearer <token>` or `x-access-token` header
- Middleware: `UserServiceTokenAuthentication`
- Token payload: `{ email, NamaLengkap, role, department }`

### RBAC Roles
`ADMIN` | `MANAGER` | `HR` | `FINANCE` | `USER`
- ADMIN bypasses all permission checks
- Middleware: `RBACPermissionCheck('module.action')` or `RBACRoleCheck(['ADMIN'])`

### Permissions Format
`<module>.<action>`: `gaji.create`, `gaji.read`, `gaji.update`, `gaji.delete`, `gaji.export`, `laporan.pph`, `laporan.bpjs`, `laporan.slip`, `laporan.period`, `karyawan.create`, etc.

## Security Features
- Password hashing: bcryptjs (10 rounds)
- Rate limiting: 100 req/15min global, 10 req/15min for auth endpoints
- CORS: configurable origin via .env
- Input validation: express-validator on all endpoints
- Centralized error handler middleware

## Database Tables

| Table | Description | Primary Key |
|-------|-------------|-------------|
| tbluser | User accounts & auth | email |
| tblkaryawan | Employees | ID_Karyawan |
| tblgaji | Salary records | ID_Gaji |
| tblpendapatan | Income types | ID_Pendapatan |
| tblpendapatandetail | Income per salary | ID_PendapatanDetail |
| tblpotongan | Deduction types | ID_Potongan |
| tblpotongandetail | Deduction per salary | ID_PotonganDetail |
| tbljabatan | Job positions | ID_Jabatan |
| tblgolongan | Grade levels | ID_Golongan |
| tblprofil | Company profile | ID_Profil |
| tblroles | RBAC roles | ID_Role |
| tblpermissions | RBAC permissions | ID_Permission |
| tblrolepermissions | Role-permission mapping | ID_RolePermission |

## Key Relationships
- `tblkaryawan.ID_Golongan` → `tblgolongan.ID_Golongan`
- `tblkaryawan.ID_Jabatan` → `tbljabatan.ID_Jabatan`
- `tblgaji.ID_Karyawan` → `tblkaryawan.ID_Karyawan`
- `tblgaji.ID_Profil` → `tblprofil.ID_Profil`
- `tblpendapatandetail.ID_Gaji` → `tblgaji.ID_Gaji`
- `tblpotongandetail.ID_Gaji` → `tblgaji.ID_Gaji`

## Commands

```bash
# Development
npm start          # Start server (node index.js)
npm run dev        # Start with nodemon (hot reload)

# Database
mysql -u root payroll < payroll.sql           # Init schema
mysql -u root payroll < migrations/*.sql      # Run migrations
```

## Response Formats

### Success (single)
```json
{ "success": true, "data": {...}, "message": "..." }
```

### Success (list/paginated)
```json
{ "page": 1, "next": 2, "prev": null, "numberOfPage": 5, "total": 50, "results": [...] }
```

### Error
```json
{ "error": "Error message" }
```

### Validation Error
```json
{ "errors": [{ "type": "field", "value": "...", "msg": "...", "path": "field", "location": "body" }] }
```

---

## API Reference

### Authentication

#### POST /user/login
Login and get JWT token.
- **Auth:** None
- **Rate Limit:** 10 req/15min
- **Body:**
```json
{ "email": "user@email.com", "password": "password123" }
```
- **Response 200:**
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { "email": "...", "username": "...", "role": "admin", "department": "IT" }
}
```
- **Response 401:** `{ "success": false, "message": "Email atau password salah" }`

#### POST /user/register
Register new user (admin only).
- **Auth:** JWT + Role ADMIN
- **Rate Limit:** 10 req/15min
- **Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@email.com",
  "password": "password123",
  "role": "user",
  "department": "IT"
}
```
- **Response 201:**
```json
{ "success": true, "message": "User berhasil didaftarkan", "data": { "email": "...", "username": "...", "role": "...", "department": "..." } }
```

#### GET /user/
List users (paginated).
- **Auth:** JWT
- **Query:** `?page=1&terms=search`
- **Response 200:** Paginated list

#### GET /user/:email
Get user by email.
- **Auth:** JWT
- **Response 200:** User object

---

### Karyawan (Employee)

#### POST /karyawan/
Create employee.
- **Auth:** JWT + `karyawan.create`
- **Body:**
```json
{
  "ID_Karyawan": "KRY-001",
  "Nama_Karyawan": "John Doe",
  "email": "john@email.com",
  "ID_Golongan": "GOL-01",
  "ID_Jabatan": "JBT-01",
  "Divisi": "IT",
  "Status_Pernikahan": "Belum Menikah",
  "Jumlah_Anak": 0
}
```

#### GET /karyawan/
List employees (paginated).
- **Auth:** JWT + `karyawan.read`
- **Query:** `?page=1&terms=search`

#### GET /karyawan/:ID_Karyawan
Get employee by ID.
- **Auth:** JWT + `karyawan.read`

#### PUT /karyawan/:ID_Karyawan
Update employee.
- **Auth:** JWT + `karyawan.update`

#### DELETE /karyawan/:ID_Karyawan
Delete employee.
- **Auth:** JWT + `karyawan.delete`

---

### Gaji (Salary)

#### POST /gaji/
Create salary record with income & deduction items.
- **Auth:** JWT + `gaji.create`
- **Body:**
```json
{
  "ID_Gaji": "GJI-001",
  "Tanggal": "2024-01-15",
  "ID_Karyawan": "KRY-001",
  "Total_Pendapatan": 5000000,
  "Total_Potongan": 500000,
  "Gaji_Bersih": 4500000,
  "Keterangan": "Gaji Januari",
  "email": "admin@email.com",
  "ID_Profil": "PRF-01",
  "itemsPendapatan": [
    { "ID_Pendapatan": "PDT-01", "Jumlah_Pendapatan": 5000000 }
  ],
  "itemsPotongan": [
    { "ID_Potongan": "PTG-01", "Jumlah_Potongan": 500000 }
  ]
}
```

#### GET /gaji/
List salary records (paginated).
- **Auth:** JWT + `gaji.read`
- **Query:** `?page=1&terms=search`

#### GET /gaji/:ID_Gaji
Get salary with detail items.
- **Auth:** JWT + `gaji.read`
- **Response 200:**
```json
{
  "ID_Gaji": "GJI-001", "Tanggal": "2024-01-15", "ID_Karyawan": "KRY-001",
  "Total_Pendapatan": 5000000, "Total_Potongan": 500000, "Gaji_Bersih": 4500000,
  "items": { "pendapatan": [...], "potongan": [...] }
}
```

#### DELETE /gaji/:ID_Gaji
Delete salary record.
- **Auth:** JWT + `gaji.delete`

---

### Excel Export Endpoints

All export endpoints return `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (xlsx blob).

#### POST /gaji/gaji-excel
Export all salary data to Excel.
- **Auth:** JWT + `gaji.export`

#### POST /gaji/slip-excel
Export all payslips to Excel.
- **Auth:** JWT + `laporan.slip`

#### POST /gaji/:ID_Gaji/slip-excel
Export single payslip by ID.
- **Auth:** JWT + `laporan.slip`

#### POST /gaji/report-period-excel
Export salary report by date range.
- **Auth:** JWT + `laporan.period`
- **Body:**
```json
{ "startDate": "2024-01-01", "endDate": "2024-01-31", "terms": "" }
```

#### POST /gaji/pph-excel
Export all PPH (tax) data to Excel.
- **Auth:** JWT + `laporan.pph`

#### POST /gaji/reportPph-period-excel
Export PPH report by date range.
- **Auth:** JWT + `laporan.pph`
- **Body:**
```json
{ "startDate": "2024-01-01", "endDate": "2024-01-31", "terms": "" }
```

#### POST /gaji/bpjs-excel
Export all BPJS (insurance) data to Excel.
- **Auth:** JWT + `laporan.bpjs`

#### POST /gaji/reportBpjs-period-excel
Export BPJS report by date range.
- **Auth:** JWT + `laporan.bpjs`
- **Body:**
```json
{ "startDate": "2024-01-01", "endDate": "2024-01-31", "terms": "" }
```

---

### Pendapatan (Income Types)

#### POST /pendapatan/
Create income type.
- **Auth:** JWT + `pendapatan.create`
- **Body:**
```json
{ "ID_Pendapatan": "PDT-01", "Nama_Pendapatan": "Gaji Pokok", "Nominal": 5000000, "ID_Jabatan": "JBT-01", "Keterangan": "Gaji pokok bulanan" }
```

#### GET /pendapatan/
List income types. **Auth:** JWT + `pendapatan.read`

#### GET /pendapatan/:ID_Pendapatan
Get income type. **Auth:** JWT + `pendapatan.read`

#### PUT /pendapatan/:ID_Pendapatan
Update income type. **Auth:** JWT + `pendapatan.update`

#### DELETE /pendapatan/:ID_Pendapatan
Delete income type. **Auth:** JWT + `pendapatan.delete`

---

### Pendapatan Detail

#### POST /pendapatandetail/
Create income detail. **Auth:** JWT

#### GET /pendapatandetail/
List income details. **Auth:** JWT

#### GET /pendapatandetail/:ID
Get income detail. **Auth:** JWT

---

### Potongan (Deduction Types)

#### POST /potongan/
Create deduction type.
- **Auth:** JWT + `potongan.create`
- **Body:**
```json
{ "ID_Potongan": "PTG-01", "Nama_Potongan": "BPJS Kesehatan", "Nominal": 100000, "ID_Jabatan": "JBT-01", "Keterangan": "Potongan BPJS" }
```

#### GET /potongan/
List deduction types. **Auth:** JWT + `potongan.read`

#### GET /potongan/:ID_Potongan
Get deduction type. **Auth:** JWT + `potongan.read`

#### PUT /potongan/:ID_Potongan
Update deduction type. **Auth:** JWT + `potongan.update`

#### DELETE /potongan/:ID_Potongan
Delete deduction type. **Auth:** JWT + `potongan.delete`

---

### Potongan Detail

#### POST /potongandetail/
Create deduction detail. **Auth:** JWT

#### GET /potongandetail/
List deduction details. **Auth:** JWT

#### GET /potongandetail/:ID
Get deduction detail. **Auth:** JWT

---

### Jabatan (Position)

#### POST /jabatan/
Create position. **Auth:** JWT + `master.jabatan`
- **Body:** `{ "ID_Jabatan": "JBT-01", "Nama_Jabatan": "Manager" }`

#### GET /jabatan/
List positions. **Auth:** JWT

#### GET /jabatan/:ID_Jabatan
Get position. **Auth:** JWT

#### PUT /jabatan/:ID_Jabatan
Update position. **Auth:** JWT + `master.jabatan`

#### DELETE /jabatan/:ID_Jabatan
Delete position. **Auth:** JWT + `master.jabatan`

---

### Golongan (Grade Level)

#### POST /golongan/
Create grade. **Auth:** JWT + `master.golongan`
- **Body:** `{ "ID_Golongan": "GOL-01", "Nama_Golongan": "Golongan III" }`

#### GET /golongan/
List grades. **Auth:** JWT

#### GET /golongan/:ID_Golongan
Get grade. **Auth:** JWT

#### PUT /golongan/:ID_Golongan
Update grade. **Auth:** JWT + `master.golongan`

#### DELETE /golongan/:ID_Golongan
Delete grade. **Auth:** JWT + `master.golongan`

---

### Profil (Company Profile)

#### POST /profil/
Create company profile. **Auth:** JWT + `master.profil`
- **Body:**
```json
{ "ID_Profil": "PRF-01", "Nama": "PT Example", "Alamat": "Jl. Contoh 123", "Telepon": "021-123456", "Fax": "021-654321", "Email": "info@example.com", "Website": "www.example.com" }
```

#### GET /profil/
List profiles. **Auth:** JWT

#### GET /profil/:ID_Profil
Get profile. **Auth:** JWT

#### PUT /profil/:ID_Profil
Update profile. **Auth:** JWT + `master.profil`

#### DELETE /profil/:ID_Profil
Delete profile. **Auth:** JWT + `master.profil`

---

### RBAC Management

#### Endpoints under /rbac/
Role and permission management endpoints for admin users.

---

### Utility

#### GET /health
Health check endpoint.
- **Auth:** None
- **Response 200:** `{ "status": "ok", "timestamp": "2024-01-15T10:00:00.000Z" }`

---

## Frontend Integration

- **FE Repo:** `C:\Users\WINDOWS10\Documents\flutter\AplikasiPenggajianReactJS`
- **FE Stack:** React 18 + Bootstrap + Axios
- **FE Base URL:** `http://localhost:4000`
- **Token Storage:** `localStorage.TOKEN`
- **Token Header:** `x-access-token` (via Axios interceptor)
- **Error Handling:** Global Axios response interceptor (401→logout, 403→forbidden, 429→rate limit)
