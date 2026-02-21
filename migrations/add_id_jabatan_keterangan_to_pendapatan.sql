-- Migration: Add ID_Jabatan and Keterangan columns to tblpendapatan
-- Date: 2026-02-21

ALTER TABLE tblpendapatan
ADD COLUMN ID_Jabatan VARCHAR(50) AFTER Nominal,
ADD COLUMN Keterangan VARCHAR(255) AFTER ID_Jabatan;
