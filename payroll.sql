-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 07, 2023 at 06:02 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

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
  `ID_Gaji` char(10) NOT NULL,
  `Tanggal` datetime DEFAULT NULL,
  `ID_Karyawan` char(5) DEFAULT NULL,
  `Total_Pendapatan` int(11) DEFAULT NULL,
  `Total_Potongan` int(11) DEFAULT NULL,
  `Gaji_Bersih` int(11) DEFAULT NULL,
  `Keterangan` varchar(50) DEFAULT NULL,
  `email` char(20) DEFAULT NULL,
  `ID_Profil` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tblgajidetail`
--

CREATE TABLE `tblgajidetail` (
  `ID_Gaji` char(10) DEFAULT NULL,
  `ID_Pendapatan` char(2) DEFAULT NULL,
  `Jumlah_Pendapatan` int(11) DEFAULT NULL,
  `ID_Potongan` char(2) DEFAULT NULL,
  `Jumlah_Potongan` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tblgolongan`
--

CREATE TABLE `tblgolongan` (
  `ID_Golongan` char(3) NOT NULL,
  `Nama_Golongan` varchar(50) DEFAULT NULL,
  `Tunjangan_Golongan` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbljabatan`
--

CREATE TABLE `tbljabatan` (
  `ID_Jabatan` char(3) NOT NULL,
  `Nama_Jabatan` varchar(50) DEFAULT NULL,
  `Tunjangan_Jabatan` int(11) DEFAULT NULL,
  `Tunjangan_Keluarga` int(11) DEFAULT NULL,
  `Tunjangan_Anak` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tblkaryawan`
--

CREATE TABLE `tblkaryawan` (
  `ID_Karyawan` char(5) NOT NULL,
  `Nama_Karyawan` varchar(50) DEFAULT NULL,
  `Gaji_Pokok` int(11) DEFAULT NULL,
  `ID_Golongan` char(3) DEFAULT NULL,
  `ID_Jabatan` char(3) DEFAULT NULL,
  `Divisi` varchar(50) DEFAULT NULL,
  `Status_Pernikahan` varchar(50) DEFAULT NULL,
  `Jumlah_Anak` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tblpendapatan`
--

CREATE TABLE `tblpendapatan` (
  `ID_Pendapatan` char(2) NOT NULL,
  `Nama_Pendapatan` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tblpotongan`
--

CREATE TABLE `tblpotongan` (
  `ID_Potongan` char(2) NOT NULL,
  `Nama_Potongan` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tblprofil`
--

CREATE TABLE `tblprofil` (
  `ID_Profil` char(2) NOT NULL,
  `Nama` varchar(255) DEFAULT NULL,
  `Alamat` varchar(255) DEFAULT NULL,
  `Telepon` varchar(255) DEFAULT NULL,
  `Fax` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Website` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbluser`
--

CREATE TABLE `tbluser` (
  `email` char(20) NOT NULL,
  `NamaLengkap` varchar(50) DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tblgaji`
--
ALTER TABLE `tblgaji`
  ADD PRIMARY KEY (`ID_Gaji`),
  ADD KEY `ID_Karyawan` (`ID_Karyawan`),
  ADD KEY `email` (`email`),
  ADD KEY `ID_Profil` (`ID_Profil`);

--
-- Indexes for table `tblgajidetail`
--
ALTER TABLE `tblgajidetail`
  ADD KEY `ID_Gaji` (`ID_Gaji`),
  ADD KEY `ID_Pendapatan` (`ID_Pendapatan`),
  ADD KEY `ID_Potongan` (`ID_Potongan`);

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
  ADD PRIMARY KEY (`ID_Pendapatan`);

--
-- Indexes for table `tblpotongan`
--
ALTER TABLE `tblpotongan`
  ADD PRIMARY KEY (`ID_Potongan`);

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
-- Constraints for dumped tables
--

--
-- Constraints for table `tblgaji`
--
ALTER TABLE `tblgaji`
  ADD CONSTRAINT `tblgaji_ibfk_1` FOREIGN KEY (`ID_Karyawan`) REFERENCES `tblkaryawan` (`ID_Karyawan`),
  ADD CONSTRAINT `tblgaji_ibfk_2` FOREIGN KEY (`email`) REFERENCES `tbluser` (`email`),
  ADD CONSTRAINT `tblgaji_ibfk_3` FOREIGN KEY (`ID_Profil`) REFERENCES `tblprofil` (`ID_Profil`);

--
-- Constraints for table `tblgajidetail`
--
ALTER TABLE `tblgajidetail`
  ADD CONSTRAINT `tblgajidetail_ibfk_1` FOREIGN KEY (`ID_Gaji`) REFERENCES `tblgaji` (`ID_Gaji`),
  ADD CONSTRAINT `tblgajidetail_ibfk_2` FOREIGN KEY (`ID_Pendapatan`) REFERENCES `tblpendapatan` (`ID_Pendapatan`),
  ADD CONSTRAINT `tblgajidetail_ibfk_3` FOREIGN KEY (`ID_Potongan`) REFERENCES `tblpotongan` (`ID_Potongan`);

--
-- Constraints for table `tblkaryawan`
--
ALTER TABLE `tblkaryawan`
  ADD CONSTRAINT `tblkaryawan_ibfk_1` FOREIGN KEY (`ID_Golongan`) REFERENCES `tblgolongan` (`ID_Golongan`),
  ADD CONSTRAINT `tblkaryawan_ibfk_2` FOREIGN KEY (`ID_Jabatan`) REFERENCES `tbljabatan` (`ID_Jabatan`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
