-- Migration: Add Nominal column to tblpotongan
-- Date: 2026-02-21

ALTER TABLE tblpotongan
ADD COLUMN Nominal DECIMAL(15,0) NOT NULL;
