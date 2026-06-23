-- ========================================
-- RBAC (Role-Based Access Control) Schema
-- ========================================

-- 1. Table roles (daftar role dalam sistem)
CREATE TABLE IF NOT EXISTS tblroles (
    ID_Role VARCHAR(20) PRIMARY KEY,
    Nama_Role VARCHAR(100) NOT NULL,
    Keterangan TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table permissions (daftar permissions/akses)
CREATE TABLE IF NOT EXISTS tblpermissions (
    ID_Permission VARCHAR(50) PRIMARY KEY,
    Nama_Permission VARCHAR(100) NOT NULL,
    Module VARCHAR(50) NOT NULL,
    Description TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table role_permissions (many-to-many relationship)
CREATE TABLE IF NOT EXISTS tblrolepermissions (
    ID_RolePermission INT AUTO_INCREMENT PRIMARY KEY,
    ID_Role VARCHAR(20) NOT NULL,
    ID_Permission VARCHAR(50) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_role_permission (ID_Role, ID_Permission),
    FOREIGN KEY (ID_Role) REFERENCES tblroles(ID_Role) ON DELETE CASCADE,
    FOREIGN KEY (ID_Permission) REFERENCES tblpermissions(ID_Permission) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Add ID_Role ke tbluser (untuk assign role ke user)
ALTER TABLE tbluser 
ADD COLUMN ID_Role VARCHAR(20) DEFAULT 'USER' AFTER ID_Profil,
ADD CONSTRAINT fk_user_role 
FOREIGN KEY (ID_Role) REFERENCES tblroles(ID_Role) ON DELETE SET NULL;

-- ========================================
-- Seed Data - Roles
-- ========================================
INSERT INTO tblroles (ID_Role, Nama_Role, Keterangan) VALUES
('ADMIN', 'Administrator', 'Akses penuh ke semua fitur sistem'),
('MANAGER', 'Manager', 'Akses ke laporan dan approval'),
('HR', 'Human Resources', 'Akses ke data karyawan dan penggajian'),
('FINANCE', 'Finance', 'Akses ke laporan keuangan dan pajak'),
('USER', 'User', 'Akses terbatas untuk viewing saja')
ON DUPLICATE KEY UPDATE Nama_Role = VALUES(Nama_Role);

-- ========================================
-- Seed Data - Permissions
-- ========================================

-- Gaji Module
INSERT INTO tblpermissions (ID_Permission, Nama_Permission, Module, Description) VALUES
('gaji.create', 'Create Gaji', 'gaji', 'Buat data penggajian baru'),
('gaji.read', 'Read Gaji', 'gaji', 'Lihat data penggajian'),
('gaji.update', 'Update Gaji', 'gaji', 'Edit data penggajian'),
('gaji.delete', 'Delete Gaji', 'gaji', 'Hapus data penggajian'),
('gaji.export', 'Export Gaji', 'gaji', 'Export laporan penggajian'),

-- Karyawan Module
('karyawan.create', 'Create Karyawan', 'karyawan', 'Tambah karyawan baru'),
('karyawan.read', 'Read Karyawan', 'karyawan', 'Lihat data karyawan'),
('karyawan.update', 'Update Karyawan', 'karyawan', 'Edit data karyawan'),
('karyawan.delete', 'Delete Karyawan', 'karyawan', 'Hapus data karyawan'),

-- Pendapatan Module
('pendapatan.create', 'Create Pendapatan', 'pendapatan', 'Tambah jenis pendapatan'),
('pendapatan.read', 'Read Pendapatan', 'pendapatan', 'Lihat jenis pendapatan'),
('pendapatan.update', 'Update Pendapatan', 'pendapatan', 'Edit jenis pendapatan'),
('pendapatan.delete', 'Delete Pendapatan', 'pendapatan', 'Hapus jenis pendapatan'),

-- Potongan Module
('potongan.create', 'Create Potongan', 'potongan', 'Tambah jenis potongan'),
('potongan.read', 'Read Potongan', 'potongan', 'Lihat jenis potongan'),
('potongan.update', 'Update Potongan', 'potongan', 'Edit jenis potongan'),
('potongan.delete', 'Delete Potongan', 'potongan', 'Hapus jenis potongan'),

-- Laporan Module
('laporan.pph', 'Laporan PPh', 'laporan', 'Akses laporan PPh'),
('laporan.bpjs', 'Laporan BPJS', 'laporan', 'Akses laporan BPJS'),
('laporan.slip', 'Laporan Slip Gaji', 'laporan', 'Akses slip gaji'),
('laporan.period', 'Laporan Periode', 'laporan', 'Akses laporan periode'),

-- Master Data Module
('master.golongan', 'Master Golongan', 'master', 'Akses master golongan'),
('master.jabatan', 'Master Jabatan', 'master', 'Akses master jabatan'),
('master.profil', 'Master Profil', 'master', 'Akses master profil perusahaan'),

-- User Management Module
('user.create', 'Create User', 'user', 'Tambah user baru'),
('user.read', 'Read User', 'user', 'Lihat data user'),
('user.update', 'Update User', 'user', 'Edit data user'),
('user.delete', 'Delete User', 'user', 'Hapus user'),
('role.manage', 'Manage Roles', 'user', 'Kelola roles dan permissions')
ON DUPLICATE KEY UPDATE Nama_Permission = VALUES(Nama_Permission);

-- ========================================
-- Seed Data - Role Permissions Assignment
-- ========================================

-- ADMIN: Semua permissions
INSERT INTO tblrolepermissions (ID_Role, ID_Permission)
SELECT 'ADMIN', ID_Permission FROM tblpermissions
ON DUPLICATE KEY UPDATE ID_Role = VALUES(ID_Role);

-- MANAGER: Read + Export + Laporan
INSERT INTO tblrolepermissions (ID_Role, ID_Permission) VALUES
('MANAGER', 'gaji.read'), ('MANAGER', 'gaji.export'),
('MANAGER', 'karyawan.read'),
('MANAGER', 'pendapatan.read'),
('MANAGER', 'potongan.read'),
('MANAGER', 'laporan.pph'), ('MANAGER', 'laporan.bpjs'), ('MANAGER', 'laporan.slip'), ('MANAGER', 'laporan.period'),
('MANAGER', 'master.golongan'), ('MANAGER', 'master.jabatan'), ('MANAGER', 'master.profil')
ON DUPLICATE KEY UPDATE ID_Role = VALUES(ID_Role);

-- HR: Full akses karyawan + read gaji
INSERT INTO tblrolepermissions (ID_Role, ID_Permission) VALUES
('HR', 'karyawan.create'), ('HR', 'karyawan.read'), ('HR', 'karyawan.update'), ('HR', 'karyawan.delete'),
('HR', 'gaji.read'), ('HR', 'gaji.create'), ('HR', 'gaji.update'),
('HR', 'pendapatan.read'),
('HR', 'potongan.read'),
('HR', 'laporan.slip')
ON DUPLICATE KEY UPDATE ID_Role = VALUES(ID_Role);

-- FINANCE: Full akses laporan + pajak
INSERT INTO tblrolepermissions (ID_Role, ID_Permission) VALUES
('FINANCE', 'gaji.read'), ('FINANCE', 'gaji.export'),
('FINANCE', 'karyawan.read'),
('FINANCE', 'pendapatan.read'),
('FINANCE', 'potongan.read'),
('FINANCE', 'laporan.pph'), ('FINANCE', 'laporan.bpjs'), ('FINANCE', 'laporan.slip'), ('FINANCE', 'laporan.period'),
('FINANCE', 'master.profil')
ON DUPLICATE KEY UPDATE ID_Role = VALUES(ID_Role);

-- USER: Read only basic
INSERT INTO tblrolepermissions (ID_Role, ID_Permission) VALUES
('USER', 'gaji.read'),
('USER', 'karyawan.read'),
('USER', 'laporan.slip')
ON DUPLICATE KEY UPDATE ID_Role = VALUES(ID_Role);
