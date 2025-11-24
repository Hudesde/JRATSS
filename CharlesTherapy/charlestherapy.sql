-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: CharlesTherapy
-- --

-- Server version	8.0.42-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bigfive`
--

DROP TABLE IF EXISTS `bigfive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bigfive` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `neuroticismo` decimal(4,2) NOT NULL,
  `extraversion` decimal(4,2) NOT NULL,
  `apertura` decimal(4,2) NOT NULL,
  `amabilidad` decimal(4,2) NOT NULL,
  `responsabilidad` decimal(4,2) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `bigfive_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bigfive`
--

LOCK TABLES `bigfive` WRITE;
/*!40000 ALTER TABLE `bigfive` DISABLE KEYS */;
INSERT INTO `bigfive` VALUES (1, 1, 3.50, 4.20, 3.80, 4.00, 3.90, '2025-06-04 22:31:21'),
(2, 2, 2.80, 3.60, 4.10, 3.70, 4.20, '2025-06-04 22:31:21'),
(3, 3, 4.00, 4.50, 3.90, 4.30, 4.10, '2025-06-04 22:31:21'),
(4, 4, 3.20, 3.80, 4.00, 3.60, 3.70, '2025-06-04 22:31:21'),
(5, 5, 2.90, 3.50, 3.80, 4.10, 4.00, '2025-06-04 22:31:21');
/*!40000 ALTER TABLE `bigfive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cita`
--

DROP TABLE IF EXISTS `cita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cita` (
  `id_cita` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `especialista_id` int NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `estado` text COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_cita`),
  KEY `id_paciente` (`paciente_id`),
  KEY `id_especialista` (`especialista_id`),
  CONSTRAINT `cita_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cita_ibfk_2` FOREIGN KEY (`especialista_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mensajes`
--

DROP TABLE IF EXISTS `mensajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajes` (
  `id_mensaje` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `id_especialista` int NOT NULL,
  `mensaje` text COLLATE utf8mb4_general_ci NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_mensaje`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes`
--

LOCK TABLES `mensajes` WRITE;
/*!40000 ALTER TABLE `mensajes` DISABLE KEYS */;
/*!40000 ALTER TABLE `mensajes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observaciones`
--

DROP TABLE IF EXISTS `observaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `observaciones` (
  `id_observacion` int NOT NULL AUTO_INCREMENT,
  `id_cita` int NOT NULL,
  `observacion` text COLLATE utf8mb4_general_ci NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_observacion`),
  KEY `id_cita` (`id_cita`),
  CONSTRAINT `observaciones_ibfk_1` FOREIGN KEY (`id_cita`) REFERENCES `cita` (`id_cita`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observaciones`
--

LOCK TABLES `observaciones` WRITE;
/*!40000 ALTER TABLE `observaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `observaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `usuario` text COLLATE utf8mb4_general_ci NOT NULL,
  `correo` text COLLATE utf8mb4_general_ci NOT NULL,
  `password` text COLLATE utf8mb4_general_ci NOT NULL,
  `rol` text COLLATE utf8mb4_general_ci NOT NULL,
  `bigFive` tinyint(1) NOT NULL DEFAULT '0',
  `cedula` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `especialidad` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` (`usuario`, `correo`, `password`, `rol`, `bigFive`, `cedula`, `especialidad`) VALUES
('paciente1', 'paciente1@mail.com', 'password1', 'Paciente', 0, NULL, NULL),
('paciente2', 'paciente2@mail.com', 'password2', 'Paciente', 0, NULL, NULL),
('paciente3', 'paciente3@mail.com', 'password3', 'Paciente', 0, NULL, NULL),
('paciente4', 'paciente4@mail.com', 'password4', 'Paciente', 0, NULL, NULL),
('paciente5', 'paciente5@mail.com', 'password5', 'Paciente', 0, NULL, NULL),
('paciente6', 'paciente6@mail.com', 'password6', 'Paciente', 0, NULL, NULL),
('paciente7', 'paciente7@mail.com', 'password7', 'Paciente', 0, NULL, NULL),
('paciente8', 'paciente8@mail.com', 'password8', 'Paciente', 0, NULL, NULL),
('paciente9', 'paciente9@mail.com', 'password9', 'Paciente', 0, NULL, NULL),
('paciente10', 'paciente10@mail.com', 'password10', 'Paciente', 0, NULL, NULL),

('especialista1', 'especialista1@mail.com', 'password11', 'Especialista', 0, 'CED001', 'Psicólogo clínico'),
('especialista2', 'especialista2@mail.com', 'password12', 'Especialista', 0, 'CED002', 'Psicólogo educativo'),
('especialista3', 'especialista3@mail.com', 'password13', 'Especialista', 0, 'CED003', 'Psicólogo organizacional o laboral'),
('especialista4', 'especialista4@mail.com', 'password14', 'Especialista', 0, 'CED004', 'Psicólogo forense'),
('especialista5', 'especialista5@mail.com', 'password15', 'Especialista', 0, 'CED005', 'Psicólogo de la salud'),
('especialista6', 'especialista6@mail.com', 'password16', 'Especialista', 0, 'CED006', 'Psicólogo deportivo'),
('especialista7', 'especialista7@mail.com', 'password17', 'Especialista', 0, 'CED007', 'Psicólogo neuropsicólogo'),
('especialista8', 'especialista8@mail.com', 'password18', 'Especialista', 0, 'CED008', 'Psicólogo social'),
('especialista9', 'especialista9@mail.com', 'password19', 'Especialista', 0, 'CED009', 'Psicólogo infantil o del desarrollo'),
('especialista10', 'especialista10@mail.com', 'password20', 'Especialista', 0, 'CED010', 'Psicólogo cognitivo-conductual');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-04 22:31:21
