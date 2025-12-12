-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 09, 2025 at 02:48 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `team-berners-lee`
--

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `CreatePrescription`$$
CREATE PROCEDURE `CreatePrescription` (IN `p_doctorID` VARCHAR(10), IN `p_clientID` VARCHAR(10), IN `p_dateGiven` DATE, IN `p_dateExpiry` DATE, IN `p_medicines` JSON)   BEGIN
    DECLARE v_prescID VARCHAR(10);
    DECLARE v_lastID VARCHAR(10);
    DECLARE v_num INT;
    DECLARE v_medID INT;
    DECLARE i INT DEFAULT 0;
    DECLARE count INT;

    -- Get last prescription ID and generate new one
    SELECT prescID INTO v_lastID 
    FROM prescription 
    ORDER BY prescID DESC 
    LIMIT 1;

    IF v_lastID IS NULL THEN
        SET v_prescID = 'P001';
    ELSE
        SET v_num = CAST(SUBSTRING(v_lastID, 2) AS UNSIGNED) + 1;
        SET v_prescID = CONCAT('P', LPAD(v_num, 3, '0'));
    END IF;

    -- Insert into PRESCRIPTION
    INSERT INTO prescription (prescID, doctorID, clientID, dateGiven, dateExpiry)
    VALUES (v_prescID, p_doctorID, p_clientID, p_dateGiven, p_dateExpiry);

    -- Loop through medicines JSON
    SET count = JSON_LENGTH(p_medicines);

    WHILE i < count DO
        SET v_medID = JSON_UNQUOTE(JSON_EXTRACT(p_medicines, CONCAT('$[', i, '].medID')));
        SET @dosage = JSON_UNQUOTE(JSON_EXTRACT(p_medicines, CONCAT('$[', i, '].dosage')));
        SET @amount = JSON_UNQUOTE(JSON_EXTRACT(p_medicines, CONCAT('$[', i, '].amount')));
        SET @description = JSON_UNQUOTE(JSON_EXTRACT(p_medicines, CONCAT('$[', i, '].description')));

        INSERT INTO prescriptiondetails (prescID, medID, dosage, amount, description)
        VALUES (v_prescID, v_medID, @dosage, @amount, @description);

        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

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
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`clientID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`clientID`, `firstName`, `lastName`, `birthdate`, `address`, `email`, `password`) VALUES
('C001', 'John', 'Doe', '1990-05-12', '123 Main St', 'johndoe@email.com', '123'),
('C002', 'Jane', 'Smith', '1985-07-22', '45 Elm St', 'janesmith@email.com', '123'),
('C003', 'Alex', 'Johnson', '1993-03-14', '67 Pine St', 'alex@email.com', '123'),
('C004', 'Sara', 'Brown', '1999-10-10', '89 Oak St', 'sara@email.com', '123'),
('C005', 'Chris', 'White', '1987-01-02', '23 Maple St', 'chris@email.com', '123'),
('C006', 'Emily', 'Davis', '1995-11-09', '56 Birch St', 'emily@email.com', '123'),
('C007', 'David', 'Garcia', '1983-06-06', '12 Cedar St', 'david@email.com', '123'),
('C008', 'Mia', 'Martinez', '1997-09-18', '34 Willow St', 'mia@email.com', '123'),
('C009', 'Luke', 'Wilson', '1991-02-27', '78 Cherry St', 'luke@email.com', '123'),
('C010', 'Olivia', 'Taylor', '1996-12-15', '90 Ash St', 'olivia@email.com', '123');

-- --------------------------------------------------------

--
-- Table structure for table `dispense`
--

DROP TABLE IF EXISTS `dispense`;
CREATE TABLE IF NOT EXISTS `dispense` (
  `dispenseID` int NOT NULL AUTO_INCREMENT,
  `prescID` char(4) NOT NULL,
  `pharmaID` char(5) NOT NULL,
  `dateDispensed` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dispenseID`),
  KEY `prescID` (`prescID`),
  KEY `pharmaID` (`pharmaID`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dispense`
--

INSERT INTO `dispense` (`dispenseID`, `prescID`, `pharmaID`, `dateDispensed`) VALUES
(1, 'P001', 'PH001', '2025-10-02 09:30:00'),
(2, 'P002', 'PH002', '2025-10-03 14:15:00'),
(3, 'P005', 'PH001', '2025-10-21 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `dispense_items`
--

DROP TABLE IF EXISTS `dispense_items`;
CREATE TABLE IF NOT EXISTS `dispense_items` (
  `itemID` int NOT NULL AUTO_INCREMENT,
  `dispenseID` int NOT NULL,
  `medID` char(4) NOT NULL,
  `quantitySold` int NOT NULL,
  `priceAtSale` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`itemID`),
  KEY `dispenseID` (`dispenseID`),
  KEY `medID` (`medID`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dispense_items`
--

INSERT INTO `dispense_items` (`itemID`, `dispenseID`, `medID`, `quantitySold`, `priceAtSale`) VALUES
(1, 1, 'M002', 12, 15.50),
(2, 2, 'M004', 8, 8.25),
(3, 3, 'M010', 30, 5.00);

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
('M010', 'Vitamin C', 'ImmunoPlus', '2024-06-15', '2027-06-14', 'Boosts the immune system and helps in tissue repair and collagen formation.'),
('M011', 'Aspirin', 'CardioGuard', '2024-03-20', '2027-03-19', 'Used to reduce pain, fever, or inflammation. Also used to prevent blood clots.'),
('M012', 'Simvastatin', 'CholestoLow', '2023-09-05', '2026-09-04', 'Statin medication used to lower cholesterol and triglyceride levels.'),
('M013', 'Lisinopril', 'PressNorm', '2024-02-11', '2027-02-10', 'ACE inhibitor used to treat high blood pressure and heart failure.'),
('M014', 'Amlodipine', 'VasoCalm', '2024-07-01', '2027-06-30', 'Calcium channel blocker used to treat high blood pressure and angina.'),
('M015', 'Levothyroxine', 'ThyroWell', '2023-11-18', '2025-11-17', 'Treats hypothyroidism (underactive thyroid) and goiter.'),
('M016', 'Albuterol', 'BreatheEasy', '2024-08-02', '2026-08-01', 'Bronchodilator that relaxes muscles in the airways and increases air flow to the lungs.'),
('M017', 'Gabapentin', 'NeuroSoothe', '2024-01-30', '2027-01-29', 'Used to treat epilepsy and pain from nerve damage.'),
('M018', 'Sertraline', 'SereneMind', '2023-12-22', '2026-12-21', 'SSRI antidepressant used for depression, panic attacks, and obsessive-compulsive disorder.'),
('M019', 'Atorvastatin', 'Lipidex', '2024-05-14', '2027-05-13', 'Statin medication that lowers bad cholesterol and fats.'),
('M020', 'Metoprolol', 'CardioPress', '2024-04-03', '2027-04-02', 'Beta-blocker used to treat chest pain, heart failure, and high blood pressure.'),
('M021', 'Prednisone', 'InflaCort', '2023-10-10', '2025-10-09', 'Corticosteroid that prevents the release of substances in the body that cause inflammation.'),
('M022', 'Tramadol', 'Ultrapain', '2024-06-25', '2027-06-24', 'Narcotic-like pain reliever used to treat moderate to severe pain.'),
('M023', 'Clopidogrel', 'PlateletGuard', '2024-03-08', '2027-03-07', 'Antiplatelet medicine that prevents platelets in your blood from coagulating.'),
('M024', 'Warfarin', 'CoumaThromb', '2023-08-15', '2026-08-14', 'Anticoagulant (blood thinner) used to treat and prevent blood clots.'),
('M025', 'Tamsulosin', 'ProstaFlow', '2024-09-01', '2027-08-31', 'Relaxes the muscles in the prostate and bladder neck, making it easier to urinate.'),
('M026', 'Montelukast', 'Singulairis', '2024-02-19', '2027-02-18', 'Used to prevent asthma attacks and to relieve symptoms of allergies.'),
('M027', 'Escitalopram', 'LexaCalm', '2023-11-30', '2026-11-29', 'SSRI antidepressant used to treat anxiety and major depressive disorder.'),
('M028', 'Ciprofloxacin', 'Ciproxin', '2024-07-12', '2026-07-11', 'Antibiotic that treats a variety of bacterial infections.'),
('M029', 'Doxycycline', 'VibraTabs', '2024-01-05', '2026-01-04', 'Tetracycline antibiotic that fights bacteria in the body.'),
('M030', 'Fluoxetine', 'Prozacare', '2024-05-21', '2027-05-20', 'Antidepressant of the SSRI class, used for depression, bulimia, and panic disorder.'),
('M031', 'Pantoprazole', 'ProtonixShield', '2024-08-18', '2027-08-17', 'Proton pump inhibitor that decreases the amount of acid produced in the stomach.'),
('M032', 'Meloxicam', 'MobicFlex', '2023-10-25', '2026-10-24', 'Nonsteroidal anti-inflammatory drug (NSAID) used to treat pain or inflammation caused by arthritis.'),
('M033', 'Rosuvastatin', 'Crestoril', '2024-04-16', '2027-04-15', 'Statin medication used to reduce levels of bad cholesterol.'),
('M034', 'Bupropion', 'WellbutrinXL', '2024-03-11', '2027-03-10', 'Antidepressant medication used to treat major depressive disorder and seasonal affective disorder.'),
('M035', 'Venlafaxine', 'Effexor XR', '2023-12-01', '2026-11-30', 'SNRI antidepressant used to treat major depressive disorder, anxiety, and panic disorder.'),
('M036', 'Insulin Glargine', 'LantusSolostar', '2024-09-09', '2026-09-08', 'Long-acting insulin used to treat type 1 and type 2 diabetes.'),
('M037', 'Allopurinol', 'Zyloprim', '2024-02-28', '2027-02-27', 'Used to treat gout and certain types of kidney stones.'),
('M038', 'Potassium Chloride', 'K-Dur', '2024-06-07', '2027-06-06', 'Mineral supplement used to treat or prevent low amounts of potassium in the blood.'),
('M039', 'Oxycodone', 'OxyContin', '2024-01-19', '2027-01-18', 'Opioid pain medication used to treat moderate to severe pain.'),
('M040', 'Alprazolam', 'Xanaxify', '2024-05-02', '2027-05-01', 'Benzodiazepine used to treat anxiety and panic disorders.'),
('M041', 'Zolpidem', 'AmbienCR', '2023-11-14', '2026-11-13', 'Sedative, also called a hypnotic, used to treat insomnia.'),
('M042', 'Carvedilol', 'Coreg', '2024-07-23', '2027-07-22', 'Beta-blocker used to treat heart failure and high blood pressure.'),
('M043', 'Cephalexin', 'Keflexin', '2024-08-30', '2026-08-29', 'Cephalosporin antibiotic used to treat a wide variety of bacterial infections.'),
('M044', 'Cyclobenzaprine', 'Flexeril', '2024-03-27', '2027-03-26', 'Muscle relaxant used to treat skeletal muscle conditions such as pain or injury.'),
('M045', 'Esomeprazole', 'Nexium', '2024-02-08', '2027-02-07', 'Proton pump inhibitor that reduces stomach acid production.'),
('M046', 'Famotidine', 'PepcidAC', '2024-09-15', '2027-09-14', 'Histamine-2 blocker that works by reducing the amount of acid the stomach produces.'),
('M047', 'Hydrocodone/Acetaminophen', 'Vicodin', '2024-01-11', '2027-01-10', 'Combination medicine used to relieve moderate to severe pain.'),
('M048', 'Pregabalin', 'Lyrica', '2024-06-19', '2027-06-18', 'Used to treat nerve and muscle pain, including fibromyalgia.'),
('M049', 'Glipizide', 'Glucotrol', '2023-10-04', '2026-10-03', 'Used with a proper diet and exercise program to control high blood sugar in people with type 2 diabetes.'),
('M050', 'Clonazepam', 'Klonopin', '2024-04-22', '2027-04-21', 'Benzodiazepine used to treat certain seizure disorders and panic disorder.'),
('M051', 'Diazepam', 'Valium', '2024-07-07', '2027-07-06', 'Used to treat anxiety, alcohol withdrawal, and seizures. It is also used to relieve muscle spasms.'),
('M052', 'Finasteride', 'Propecia', '2023-12-15', '2026-12-14', 'Used to treat male pattern hair loss and benign prostatic hyperplasia (BPH).'),
('M053', 'Spironolactone', 'Aldactone', '2024-08-21', '2027-08-20', 'Potassium-sparing diuretic (water pill) that prevents your body from absorbing too much salt.'),
('M054', 'Naproxen', 'Aleve', '2024-05-29', '2027-05-28', 'NSAID used to treat pain or inflammation caused by conditions such as arthritis or menstrual cramps.'),
('M055', 'Diclofenac', 'Voltaren', '2024-03-14', '2027-03-13', 'Nonsteroidal anti-inflammatory drug (NSAID) used to treat pain and other symptoms of arthritis.'),
('M056', 'Diphenhydramine', 'Benadryl', '2024-09-20', '2027-09-19', 'Antihistamine used to relieve symptoms of allergy, hay fever, and the common cold.'),
('M057', 'Calcium Carbonate', 'Tums', '2024-01-02', '2027-01-01', 'Dietary supplement used when the amount of calcium taken in the diet is not enough. Also an antacid.'),
('M058', 'Codeine', 'Tylenol #3', '2024-04-09', '2027-04-08', 'Opioid pain reliever and cough suppressant.'),
('M059', 'Mirtazapine', 'Remeron', '2023-11-07', '2026-11-06', 'Antidepressant used to treat major depressive disorder.'),
('M060', 'Risperidone', 'Risperdal', '2024-06-30', '2027-06-29', 'Antipsychotic medication used to treat schizophrenia, bipolar disorder, and irritability associated with autism.'),
('M061', 'Olanzapine', 'Zyprexa', '2024-02-22', '2027-02-21', 'Atypical antipsychotic used to treat schizophrenia and bipolar disorder.'),
('M062', 'Quetiapine', 'Seroquel', '2024-08-08', '2027-08-07', 'Antipsychotic medication used for the treatment of schizophrenia, bipolar disorder, and major depressive disorder.'),
('M063', 'Sumatriptan', 'Imitrex', '2024-05-17', '2027-05-16', 'Used to treat migraines. It helps to relieve headache, pain, and other migraine symptoms.'),
('M064', 'Ezetimibe', 'Zetia', '2023-12-28', '2026-12-27', 'Used to lower high cholesterol levels in the blood.'),
('M065', 'Fexofenadine', 'Allegra', '2024-09-25', '2027-09-24', 'Antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, and sneezing.');

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
-- Table structure for table `pharma_admin`
--

DROP TABLE IF EXISTS `pharma_admin`;
CREATE TABLE IF NOT EXISTS `pharma_admin` (
  `id` varchar(10) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `location` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pharma_admin`
--

INSERT INTO `pharma_admin` (`id`, `firstname`, `lastname`, `email`, `password`, `location`) VALUES
('PHA001', 'Jane', 'Doe', 'jdoe@pharma.admin', '123', 'City Pharmacy'),
('PHA002', 'Michael', 'Smith', 'msmith@pharma.admin', '123', 'HealthHub'),
('PHA003', 'Anna', 'Lopez', 'alopez@pharma.admin', '123', 'MedCenter'),
('PHA004', 'Robert', 'Cruz', 'rcruz@pharma.admin', '123', 'WellMed'),
('PHA005', 'Emily', 'Tan', 'etan@pharma.admin', '123', 'QuickMeds');

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
('P005', 'D005', 'C005', '2025-10-20', '2025-11-20'),
('P006', 'D001', 'C001', '2025-11-09', '2025-11-30'),
('P007', 'D001', 'C003', '2025-11-09', '2025-11-30'),
('P008', 'D001', 'C001', '2025-11-09', '2025-12-01');

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
('P005', 'M010', '1000mg tablet once daily', 30, 'Take with water to boost immune system.'),
('P006', 'M005', '500mg tablet every 6 hours', 10, 'Take after meals to relive pain'),
('P006', 'M011', '500mg tablet every 6 hours', 20, 'Take after meals to relieve pain'),
('P007', 'M003', '500mg tablet every 6 hours', 12, 'Take after meals to relieve pain'),
('P008', 'M003', '500 mg every 10 hours', 10, 'Take after meals to relieve pain');


-- --------------------------------------------------------

--
-- Table structure for table `prescription_templates`
--

DROP TABLE IF EXISTS `prescription_templates`;
CREATE TABLE IF NOT EXISTS `prescription_templates` (
  `templateID` int NOT NULL AUTO_INCREMENT,
  `doctorID` char(4) NOT NULL,
  `clientID` char(4) NOT NULL,
  `templateName` varchar(100) NOT NULL,
  `medicines` json NOT NULL,
  PRIMARY KEY (`templateID`),
  KEY `doctorID` (`doctorID`),
  KEY `clientID` (`clientID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `adminID` varchar(20) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `email` varchar(25) NOT NULL,
  `password` varchar(25) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`adminID`, `firstName`, `lastName`, `email`, `password`) VALUES
('A000', 'John', 'Santos', 'john.santos@example.com', '123'),
('A001', 'Maria', 'DelaCruz', 'maria.delacruz@example.co', '123'),
('A002', 'Kevin', 'Ramirez', 'kevin.ramirez@example.com', '123'),
('A003', 'Angela', 'Torres', 'angela.torres@example.com', '123'),
('A004', 'Patrick', 'Mendoza', 'patrick.mendoza@example.c', '123');

-- --------------------------------------------------------

--
-- Table structure for table `temp`
--

DROP TABLE IF EXISTS `temp`;
CREATE TABLE IF NOT EXISTS `temp` (
  `adminID` char(4) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`adminID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `temp`
--

INSERT INTO `temp` (`adminID`, `username`, `password`) VALUES
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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
