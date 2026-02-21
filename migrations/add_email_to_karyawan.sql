-- Migration: Add email column to tblkaryawan
-- Date: 2026-02-21

ALTER TABLE tblkaryawan
ADD COLUMN email VARCHAR(255) AFTER Nama_Karyawan;
