-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 26, 2025 at 02:21 PM
-- Server version: 9.1.0
-- PHP Version: 8.4.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `teambernerslee`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `adminID` char(4) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`adminID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`adminID`, `username`, `password`) VALUES
('A001', 'admin1', 'admin1'),
('A002', 'admin2', 'admin2'),
('A003', 'admin3', 'admin3'),
('A004', 'admin4', 'admin4'),
('A005', 'admin5', 'admin5'),
('A006', 'admin6', 'admin6'),
('A007', 'admin7', 'admin7'),
('A008', 'admin8', 'admin8'),
('A009', 'admin9', 'admin9'),
('A010', 'admin10', 'admin10');

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
CREATE TABLE IF NOT EXISTS `client` (
  `clientID` char(4) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phonenum` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`clientID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`clientID`, `firstName`, `lastName`, `birthdate`, `address`, `phonenum`, `email`, `password`) VALUES
('C001', 'John', 'Doe', '1990-05-12', '123 Main St', '09170000001', 'johndoe@email.com', '123'),
('C002', 'Jane', 'Smith', '1985-07-22', '45 Elm St', '09170000002', 'janesmith@email.com', '123'),
('C003', 'Alex', 'Johnson', '1993-03-14', '67 Pine St', '09170000003', 'alex@email.com', '123'),
('C004', 'Sara', 'Brown', '1999-10-10', '89 Oak St', '09170000004', 'sara@email.com', '123'),
('C005', 'Chris', 'White', '1987-01-02', '23 Maple St', '09170000005', 'chris@email.com', '123'),
('C006', 'Emily', 'Davis', '1995-11-09', '56 Birch St', '09170000006', 'emily@email.com', '123'),
('C007', 'David', 'Garcia', '1983-06-06', '12 Cedar St', '09170000007', 'david@email.com', '123'),
('C008', 'Mia', 'Martinez', '1997-09-18', '34 Willow St', '09170000008', 'mia@email.com', '123'),
('C009', 'Luke', 'Wilson', '1991-02-27', '78 Cherry St', '09170000009', 'luke@email.com', '123'),
('C010', 'Olivia', 'Taylor', '1996-12-15', '90 Ash St', '09170000010', 'olivia@email.com', '123');

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
CREATE TABLE IF NOT EXISTS `doctor` (
  `doctorID` char(4) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `specialty` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `phonenum` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`doctorID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`doctorID`, `firstName`, `lastName`, `specialty`, `location`, `phonenum`, `email`, `password`) VALUES
('D001', 'Mark', 'Anderson', 'Cardiology', 'City Hospital', '9171234567', 'mark@hospital.com', 'doc123'),
('D002', 'Lisa', 'Reed', 'Dermatology', 'Central Clinic', '9181234567', 'lisa@hospital.com', 'doc123'),
('D003', 'Paul', 'King', 'Pediatrics', 'WellCare', '9191234567', 'paul@hospital.com', 'doc123'),
('D004', 'Anna', 'Scott', 'Orthopedics', 'HealthPlus', '9201234567', 'anna@hospital.com', 'doc123'),
('D005', 'Tom', 'Baker', 'Neurology', 'MetroMed', '9211234567', 'tom@hospital.com', 'doc123'),
('D006', 'Rachel', 'Adams', 'General Medicine', 'City Hospital', '9221234567', 'rachel@hospital.com', 'doc123'),
('D007', 'James', 'Lee', 'ENT', 'Central Clinic', '9231234567', 'james@hospital.com', 'doc123'),
('D008', 'Sophia', 'Clark', 'Gynecology', 'WellCare', '9241234567', 'sophia@hospital.com', 'doc123'),
('D009', 'Henry', 'Moore', 'Oncology', 'HealthPlus', '9251234567', 'henry@hospital.com', 'doc123'),
('D010', 'Chloe', 'Turner', 'Family Medicine', 'MetroMed', '9261234567', 'chloe@hospital.com', 'doc123');

-- --------------------------------------------------------

--
-- Table structure for table `medicine`
--

DROP TABLE IF EXISTS `medicine`;
CREATE TABLE IF NOT EXISTS `medicine` (
  `medID` char(4) NOT NULL,
  `genericName` varchar(100) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `manufactureDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`medID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `medicine`
--

INSERT INTO `medicine` (`medID`, `genericName`, `brand`, `manufactureDate`, `expiryDate`, `description`) VALUES
('M001', 'Paracetamol', 'BioPharma', '2024-01-15', '2026-01-14', 'Used to relieve mild to moderate pain and reduce fever.'),
('M002', 'Amoxicillin', 'MedLife', '2023-11-20', '2025-11-19', 'Antibiotic used to treat various bacterial infections such as pneumonia and bronchitis.'),
('M003', 'Loratadine', 'ClearAllergy', '2024-03-12', '2027-03-11', 'Antihistamine that helps relieve allergy symptoms such as runny nose and sneezing.'),
('M004', 'Ibuprofen', 'PainAway', '2024-02-05', '2026-02-04', 'Nonsteroidal anti-inflammatory drug for pain'),
('M005', 'Cetirizine', 'ZeeCare', '2024-04-18', '2027-04-17', 'Used to relieve symptoms of allergy such as watery eyes and itching.'),
('M006', 'Metformin', 'Glucostop', '2023-10-01', '2026-09-30', 'Helps control high blood sugar in patients with type 2 diabetes.'),
('M007', 'Omeprazole', 'AcidBlock', '2024-05-09', '2027-05-08', 'Reduces stomach acid and treats heartburn'),
('M008', 'Losartan', 'HeartSafe', '2023-12-10', '2026-12-09', 'Used to treat high blood pressure and protect kidneys from damage due to diabetes.'),
('M009', 'Azithromycin', 'Macromax', '2024-01-25', '2026-01-24', 'Antibiotic used to treat infections like bronchitis'),
('M010', 'Vitamin C', 'ImmunoPlus', '2024-06-15', '2027-06-14', 'Boosts the immune system and helps in tissue repair and collagen formation.');

-- --------------------------------------------------------

--
-- Table structure for table `pharmacist`
--

DROP TABLE IF EXISTS `pharmacist`;
CREATE TABLE IF NOT EXISTS `pharmacist` (
  `pharmaID` char(5) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`pharmaID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pharmacist`
--

INSERT INTO `pharmacist` (`pharmaID`, `firstName`, `lastName`, `location`, `email`, `password`) VALUES
('PH001', 'Kate', 'Lopez', 'City Pharmacy', 'kate.l@pharma.com', 'pharma123'),
('PH002', 'John', 'Ramos', 'HealthHub', 'john.r@pharma.com', 'pharma123'),
('PH003', 'Nina', 'Castro', 'MedCenter', 'nina.c@pharma.com', 'pharma123'),
('PH004', 'Leo', 'Ortiz', 'WellMed', 'leo.o@pharma.com', 'pharma123'),
('PH005', 'Ava', 'Mendoza', 'QuickMeds', 'ava.m@pharma.com', 'pharma123'),
('PH006', 'Noah', 'Santos', 'City Pharmacy', 'noah.s@pharma.com', 'pharma123'),
('PH007', 'Ella', 'Cruz', 'HealthHub', 'ella.c@pharma.com', 'pharma123'),
('PH008', 'Ian', 'Gomez', 'MedCenter', 'ian.g@pharma.com', 'pharma123'),
('PH009', 'Zoe', 'Navarro', 'WellMed', 'zoe.n@pharma.com', 'pharma123'),
('PH010', 'Liam', 'Torres', 'QuickMeds', 'liam.t@pharma.com', 'pharma123');

-- --------------------------------------------------------

--
-- Table structure for table `prescription`
--

DROP TABLE IF EXISTS `prescription`;
CREATE TABLE IF NOT EXISTS `prescription` (
  `prescID` char(4) NOT NULL,
  `doctorID` char(4) NOT NULL,
  `clientID` char(4) NOT NULL,
  `dateGiven` date NOT NULL,
  `dateExpiry` date NOT NULL,
  PRIMARY KEY (`prescID`),
  KEY `doctorID` (`doctorID`),
  KEY `clientID` (`clientID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `prescription`
--

INSERT INTO `prescription` (`prescID`, `doctorID`, `clientID`, `dateGiven`, `dateExpiry`) VALUES
('P001', 'D001', 'C001', '2025-10-01', '2025-11-01'),
('P002', 'D002', 'C002', '2025-09-15', '2025-10-15'),
('P003', 'D003', 'C003', '2025-10-05', '2025-11-05'),
('P004', 'D004', 'C004', '2025-10-10', '2025-11-10'),
('P005', 'D005', 'C005', '2025-10-20', '2025-11-20');

-- --------------------------------------------------------

--
-- Table structure for table `prescriptiondetails`
--

DROP TABLE IF EXISTS `prescriptiondetails`;
CREATE TABLE IF NOT EXISTS `prescriptiondetails` (
  `prescID` char(5) NOT NULL,
  `medID` char(4) NOT NULL,
  `dosage` varchar(100) DEFAULT NULL,
  `remainingAmount` int DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`prescID`,`medID`),
  KEY `medID` (`medID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `prescriptiondetails`
--

INSERT INTO `prescriptiondetails` (`prescID`, `medID`, `dosage`, `remainingAmount`, `description`) VALUES
('P001', 'M002', '500mg tablet every 6 hours', 12, 'Take after meals to relieve pain.'),
('P002', 'M004', '200mg capsule twice a day', 8, 'Take with water for inflammation and headache.'),
('P003', 'M006', '500mg tablet once daily', 20, 'Take with breakfast for blood sugar control.'),
('P004', 'M007', '20mg capsule once daily', 15, 'Take before breakfast to reduce acid reflux.'),
('P005', 'M010', '1000mg tablet once daily', 30, 'Take with water to boost immune system.');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
