-- Migration: Add Nominal column to tblpendapatan
-- Date: 2026-02-21

ALTER TABLE tblpendapatan
ADD COLUMN Nominal DECIMAL(15,0) NOT NULL;
