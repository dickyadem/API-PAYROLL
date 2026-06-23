-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 28, 2026 at 11:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `payroll`
--

-- --------------------------------------------------------

--
-- Table structure for table `tblgaji`
--

CREATE TABLE `tblgaji` (
  `ID_Gaji` varchar(50) NOT NULL,
  `Tanggal` date NOT NULL,
  `ID_Karyawan` varchar(50) DEFAULT NULL,
  `Total_Pendapatan` decimal(15,2) DEFAULT NULL,
  `Total_Potongan` decimal(15,2) DEFAULT NULL,
  `Gaji_Bersih` decimal(15,2) DEFAULT NULL,
  `Keterangan` text DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `ID_Profil` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblgaji`
--

INSERT INTO `tblgaji` (`ID_Gaji`, `Tanggal`, `ID_Karyawan`, `Total_Pendapatan`, `Total_Potongan`, `Gaji_Bersih`, `Keterangan`, `email`, `ID_Profil`) VALUES
('GJI-2602-1787', '2026-02-22', 'EMP-2602-XX-4814', 2000000.00, 250000.00, 1750000.00, '1', 'sd@gmail.com', 1),
('GJI-2602-2951', '2026-02-22', 'EMP-2602-IT-8437', 10500000.00, 622500.00, 9877500.00, '12', 'aw@gmail.com', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tblgajidetail`
--

CREATE TABLE `tblgajidetail` (
  `ID_GajiDetail` int(11) NOT NULL,
  `ID_Gaji` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tblgolongan`
--

CREATE TABLE `tblgolongan` (
  `ID_Golongan` varchar(50) NOT NULL,
  `Nama_Golongan` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblgolongan`
--

INSERT INTO `tblgolongan` (`ID_Golongan`, `Nama_Golongan`) VALUES
('G001', 'GOLONGAN I - STAFF'),
('G002', 'GOLONGAN II - SENIOR STAFF'),
('G003', 'GOLONGAN III - SUPERVISOR'),
('G004', 'GOLONGAN IV - MANAGER'),
('G005', 'GOLONGAN V - SENIOR MANAGER');

-- --------------------------------------------------------

--
-- Table structure for table `tbljabatan`
--

CREATE TABLE `tbljabatan` (
  `ID_Jabatan` varchar(50) NOT NULL,
  `Nama_Jabatan` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbljabatan`
--

INSERT INTO `tbljabatan` (`ID_Jabatan`, `Nama_Jabatan`) VALUES
('J001', 'Staff'),
('J002', 'Senior Staff'),
('J003', 'Supervisor'),
('J004', 'Manager');

-- --------------------------------------------------------

--
-- Table structure for table `tblkaryawan`
--

CREATE TABLE `tblkaryawan` (
  `ID_Karyawan` varchar(50) NOT NULL,
  `Nama_Karyawan` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `ID_Golongan` varchar(50) DEFAULT NULL,
  `ID_Jabatan` varchar(50) DEFAULT NULL,
  `Divisi` varchar(100) DEFAULT NULL,
  `Status_Pernikahan` varchar(50) DEFAULT NULL,
  `Jumlah_Anak` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblkaryawan`
--

INSERT INTO `tblkaryawan` (`ID_Karyawan`, `Nama_Karyawan`, `email`, `ID_Golongan`, `ID_Jabatan`, `Divisi`, `Status_Pernikahan`, `Jumlah_Anak`) VALUES
('EMP-2602-IT-2904', 'Adee', 'ade@gmail.com', 'G001', 'J001', 'It', 'Belum Menikah', 0),
('EMP-2602-IT-8437', 'Aw', 'aw@gmail.com', 'G003', 'J003', 'It', 'Menikah', 3),
('EMP-2602-XX-4814', 'Sed', 'sd@gmail.com', 'G002', 'J002', 'Fn', 'Menikah', 1),
('EMP-2602-XX-5878', 'Af', 'af@gmail.com', 'G004', 'J004', 'Mk', 'Menikah', 2);

-- --------------------------------------------------------

--
-- Table structure for table `tblpendapatan`
--

CREATE TABLE `tblpendapatan` (
  `ID_Pendapatan` varchar(50) NOT NULL,
  `Nama_Pendapatan` varchar(100) NOT NULL,
  `Nominal` decimal(15,0) DEFAULT 0,
  `ID_Jabatan` varchar(50) DEFAULT NULL,
  `Keterangan` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblpendapatan`
--

INSERT INTO `tblpendapatan` (`ID_Pendapatan`, `Nama_Pendapatan`, `Nominal`, `ID_Jabatan`, `Keterangan`) VALUES
('PDN-26-2983', 'Gaji Pokok', 2000000, 'J002', NULL),
('PDN-26-6027', 'Gaji Pokok', 1000000, 'J001', NULL),
('PDN-26-8994', 'Gaji Pokok', 10000000, 'J003', NULL),
('PDN-26-9839', 'Tunjangan Transport', 500000, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tblpendapatandetail`
--

CREATE TABLE `tblpendapatandetail` (
  `ID_PendapatanDetail` int(11) NOT NULL,
  `ID_Gaji` varchar(50) DEFAULT NULL,
  `ID_Pendapatan` varchar(50) DEFAULT NULL,
  `Jumlah_Pendapatan` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblpendapatandetail`
--

INSERT INTO `tblpendapatandetail` (`ID_PendapatanDetail`, `ID_Gaji`, `ID_Pendapatan`, `Jumlah_Pendapatan`) VALUES
(19, 'GJI-2602-2951', 'PDN-26-8994', 10000000.00),
(20, 'GJI-2602-2951', 'PDN-26-9839', 500000.00),
(21, 'GJI-2602-1787', 'PDN-26-2983', 1500000.00),
(22, 'GJI-2602-1787', 'PDN-26-9839', 500000.00);

-- --------------------------------------------------------

--
-- Table structure for table `tblpotongan`
--

CREATE TABLE `tblpotongan` (
  `ID_Potongan` varchar(50) NOT NULL,
  `Nama_Potongan` varchar(100) NOT NULL,
  `Nominal` decimal(15,0) DEFAULT 0,
  `ID_Jabatan` varchar(50) DEFAULT NULL,
  `Keterangan` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblpotongan`
--

INSERT INTO `tblpotongan` (`ID_Potongan`, `Nama_Potongan`, `Nominal`, `ID_Jabatan`, `Keterangan`) VALUES
('PTG-02', 'Pph', 0, NULL, NULL),
('PTG-26-1226', 'Bpjs Kesehatan', 250000, 'J002', NULL),
('PTG-26-9381', 'Bpjs Kesehatan', 350000, 'J003', NULL),
('PTG001', 'Bpjs Kesehatan', 100000, 'J001', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tblpotongandetail`
--

CREATE TABLE `tblpotongandetail` (
  `ID_PotonganDetail` int(11) NOT NULL,
  `ID_Gaji` varchar(50) DEFAULT NULL,
  `ID_Potongan` varchar(50) DEFAULT NULL,
  `Jumlah_Potongan` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblpotongandetail`
--

INSERT INTO `tblpotongandetail` (`ID_PotonganDetail`, `ID_Gaji`, `ID_Potongan`, `Jumlah_Potongan`) VALUES
(11, 'GJI-2602-2951', 'PTG-02', 272500.00),
(12, 'GJI-2602-2951', 'PTG-26-9381', 350000.00),
(13, 'GJI-2602-1787', 'PTG-26-1226', 250000.00);

-- --------------------------------------------------------

--
-- Table structure for table `tblprofil`
--

CREATE TABLE `tblprofil` (
  `ID_Profil` int(11) NOT NULL,
  `Nama` varchar(100) DEFAULT NULL,
  `Alamat` text DEFAULT NULL,
  `Telepon` varchar(20) DEFAULT NULL,
  `Fax` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Website` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblprofil`
--

INSERT INTO `tblprofil` (`ID_Profil`, `Nama`, `Alamat`, `Telepon`, `Fax`, `Email`, `Website`) VALUES
(0, 'Pt B Aja', 'JL B AJA NO 01', '9172172917291', '32413414122', 'Baja@gmail.com', 'www.Baja.com'),
(1, 'Pt A', 'jln Huruf Alfabet A', '08714534545', '121334534543', 'EmailA@gmail.com', 'www.a.com');

-- --------------------------------------------------------

--
-- Table structure for table `tbluser`
--

CREATE TABLE `tbluser` (
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `NamaLengkap` varchar(100) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `department` varchar(100) DEFAULT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbluser`
--

INSERT INTO `tbluser` (`email`, `password`, `NamaLengkap`, `Status`, `role`, `department`, `permissions`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
('adem@gmail.com', '$2a$10$NBIXL1eN/Nn3WFYJGvb4nOSs8Ymj4Sb0hWQ/hsnMjYTEnUT.OHwl2', 'Adem', 'Admin', 'admin', 'IT', NULL, 1, NULL, '2026-02-28 08:20:00', '2026-02-28 08:48:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tblgaji`
--
ALTER TABLE `tblgaji`
  ADD PRIMARY KEY (`ID_Gaji`),
  ADD KEY `ID_Karyawan` (`ID_Karyawan`);

--
-- Indexes for table `tblgajidetail`
--
ALTER TABLE `tblgajidetail`
  ADD PRIMARY KEY (`ID_GajiDetail`),
  ADD KEY `ID_Gaji` (`ID_Gaji`);

--
-- Indexes for table `tblgolongan`
--
ALTER TABLE `tblgolongan`
  ADD PRIMARY KEY (`ID_Golongan`);

--
-- Indexes for table `tbljabatan`
--
ALTER TABLE `tbljabatan`
  ADD PRIMARY KEY (`ID_Jabatan`);

--
-- Indexes for table `tblkaryawan`
--
ALTER TABLE `tblkaryawan`
  ADD PRIMARY KEY (`ID_Karyawan`),
  ADD KEY `ID_Golongan` (`ID_Golongan`),
  ADD KEY `ID_Jabatan` (`ID_Jabatan`);

--
-- Indexes for table `tblpendapatan`
--
ALTER TABLE `tblpendapatan`
  ADD PRIMARY KEY (`ID_Pendapatan`),
  ADD KEY `ID_Jabatan` (`ID_Jabatan`);

--
-- Indexes for table `tblpendapatandetail`
--
ALTER TABLE `tblpendapatandetail`
  ADD PRIMARY KEY (`ID_PendapatanDetail`),
  ADD KEY `ID_Gaji` (`ID_Gaji`),
  ADD KEY `ID_Pendapatan` (`ID_Pendapatan`);

--
-- Indexes for table `tblpotongan`
--
ALTER TABLE `tblpotongan`
  ADD PRIMARY KEY (`ID_Potongan`),
  ADD KEY `ID_Jabatan` (`ID_Jabatan`);

--
-- Indexes for table `tblpotongandetail`
--
ALTER TABLE `tblpotongandetail`
  ADD PRIMARY KEY (`ID_PotonganDetail`),
  ADD KEY `ID_Gaji` (`ID_Gaji`),
  ADD KEY `ID_Potongan` (`ID_Potongan`);

--
-- Indexes for table `tblprofil`
--
ALTER TABLE `tblprofil`
  ADD PRIMARY KEY (`ID_Profil`);

--
-- Indexes for table `tbluser`
--
ALTER TABLE `tbluser`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tblgajidetail`
--
ALTER TABLE `tblgajidetail`
  MODIFY `ID_GajiDetail` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tblpendapatandetail`
--
ALTER TABLE `tblpendapatandetail`
  MODIFY `ID_PendapatanDetail` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `tblpotongandetail`
--
ALTER TABLE `tblpotongandetail`
  MODIFY `ID_PotonganDetail` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tblgaji`
--
ALTER TABLE `tblgaji`
  ADD CONSTRAINT `tblgaji_ibfk_1` FOREIGN KEY (`ID_Karyawan`) REFERENCES `tblkaryawan` (`ID_Karyawan`);

--
-- Constraints for table `tblgajidetail`
--
ALTER TABLE `tblgajidetail`
  ADD CONSTRAINT `tblgajidetail_ibfk_1` FOREIGN KEY (`ID_Gaji`) REFERENCES `tblgaji` (`ID_Gaji`);

--
-- Constraints for table `tblkaryawan`
--
ALTER TABLE `tblkaryawan`
  ADD CONSTRAINT `tblkaryawan_ibfk_1` FOREIGN KEY (`ID_Golongan`) REFERENCES `tblgolongan` (`ID_Golongan`),
  ADD CONSTRAINT `tblkaryawan_ibfk_2` FOREIGN KEY (`ID_Jabatan`) REFERENCES `tbljabatan` (`ID_Jabatan`);

--
-- Constraints for table `tblpendapatan`
--
ALTER TABLE `tblpendapatan`
  ADD CONSTRAINT `tblpendapatan_ibfk_1` FOREIGN KEY (`ID_Jabatan`) REFERENCES `tbljabatan` (`ID_Jabatan`);

--
-- Constraints for table `tblpendapatandetail`
--
ALTER TABLE `tblpendapatandetail`
  ADD CONSTRAINT `tblpendapatandetail_ibfk_1` FOREIGN KEY (`ID_Gaji`) REFERENCES `tblgaji` (`ID_Gaji`),
  ADD CONSTRAINT `tblpendapatandetail_ibfk_2` FOREIGN KEY (`ID_Pendapatan`) REFERENCES `tblpendapatan` (`ID_Pendapatan`);

--
-- Constraints for table `tblpotongan`
--
ALTER TABLE `tblpotongan`
  ADD CONSTRAINT `tblpotongan_ibfk_1` FOREIGN KEY (`ID_Jabatan`) REFERENCES `tbljabatan` (`ID_Jabatan`);

--
-- Constraints for table `tblpotongandetail`
--
ALTER TABLE `tblpotongandetail`
  ADD CONSTRAINT `tblpotongandetail_ibfk_1` FOREIGN KEY (`ID_Gaji`) REFERENCES `tblgaji` (`ID_Gaji`),
  ADD CONSTRAINT `tblpotongandetail_ibfk_2` FOREIGN KEY (`ID_Potongan`) REFERENCES `tblpotongan` (`ID_Potongan`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
