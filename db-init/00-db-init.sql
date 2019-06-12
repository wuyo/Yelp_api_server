-- MySQL dump 10.13  Distrib 5.7.22, for Linux (x86_64)
--
-- Host: localhost    Database: courses
-- ------------------------------------------------------
-- Server version	5.7.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` char(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
  (0,"Admin","admin@courses.com","$2a$08$Y00/JO/uN9n0dHKuudRX2eKksWMIHXDLzHWKuz/K67alAYsZRRike","admin"),
  (1,"Nick Arzner","nick@block15.com","$2a$08$Y2IHnr/PU9tzG5HKrHGJH.zH3HAvlR5i5puD5GZ1sHA/mVrHKci72","instructor"),
  (2,"Tori Lockwood","lori@robnetts.com","$2a$08$bAKRXPs6fUPhqjZy55TIeO1e.aXud4LD81awrYncaCKJoMsg/s0c.","instructor"),
  (3,"Joel Rea","joel@lickspigot.com","$2a$08$WvRkJm.bz3zoRnmA.aQZBewLopoe00nA4qbzbnLyS4eRbm2MFNkMO","instructor"),
  (4,"The Owners","owners@firstalt.coop","$2a$08$FBStm3plzBCnh/MPIUsJ0.f7kJkp6aH47haXHb3HY.Gfygan7e8He","student"),
  (5,"Kim Marchesi","kim@localboyzhawaiiancafe.com","$2a$08$q8njvTTel9JDR.BQbb1cD.XL73CR.QCOXLnofdpd9orbv0dzWGir.","instructor"),
  (6,"William McCanless","william@interzoneorganic1","$2a$08$U7IXbbolDIk0SRlmH/dnT.FBCvf.EMvorShGlM65XeQFr./P0rhqe","instructor"),
  (7,"Paul Turner","paul@darksidecinema.com","$2a$08$Kb1f8JbT/9kl.wRuRsRoYO19ddMcc79zXvfUcwchJJ1qHxVMDJN1K","instructor"),
  (8,"Allan Stuart","allan@allanscoffee.com","$2a$08$ALw6f6NIpdptAUhhezTjhezjjnMLcbBP/uRnqVCwYNSWBdno6y2I6","student"),
  (9,"Winco Employees","employees@wincofoods.com","$2a$08$64je8REF7I4j4bQuJKIdXO09VkCXJqoaF18znHs/a3zuKi/olDR/S","instructor"),
  (10,"Philip Wilson","philib@bookbin.com","$2a$08$Ev.K7sU3yWrCUECK2O2a5.eA8mbvVEImv/EyYka1yhRxQFKIbxrfS","instructor"),
  (11,"Fred Meyer","fred@fredmeyer.com","$2a$08$ljdJ4mrSIEXsaiEMu29xUuEFAOj43gL5rcR7wCq8Rl2z/bqzf.xuC","student"),
  (12,"Mike Easter","mike@cyclotopia.com","$2a$08$Apk5L0bDogb4G6ZtoKluPeZXCxye0qdNZCah9TJX9QvdRqZ5hwWAy","student"),
  (13,"Casey Collett","casey@oregoncoffeeandtea.com","$2a$08$5SL3bkbe5S1WnE6rWciiX.9HAfXG/UGbZAQU7K0S4XTNGIHapPBy2","student"),
  (14,"John Semadeni","john@corvalliscycleryinc.com","$2a$08$xIku71t6OFFN9Ztil1Kh2eQWk/0lC8C.UThx3PwAwYCSMxdzpPhTO","student"),
  (15,"Alex Spaeth","alex@spaethlumber.com","$2a$08$H9dDFONytVUgh2ZcCQlHL.8uP6RricbtoCk2vsr/roTBtGkYLUivS","student"),
  (16,"Tristan James","tristan@newmorningbakery.com","$2a$08$pJFEMJNiTa7azhokPUnXZusS6NMqT3eBJE45sX6Kli380PZoM2nje","student");
  ;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `description` varchar(500),
  `subject` varchar(255) NOT NULL,
  `number` mediumint(3) NOT NULL,
  `title` varchar(255) NOT NULL,
  `term` char(5) NOT NULL,
  `instructorId` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_instructorId` (`instructorId`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`instructorId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES
  (0,"CS",100,"Intro CS","Fall",1),
  (1,"CS",101,"Intro CS","Fall",1),
  (2,"CS",102,"Intro CS2","Fall",2),
  (3,"CS",201,"Intro CS3","Winter",1),
  (4,"CS",201,"Intro C++","Fall",3),
  (5,"PAC",101,"BALLET","Fall",4),
  (6,"PAC",102,"BALLET 2","Winter",4),
  (7,"PAC",201,"Yoga","Spring",5),
  (8,"BA",101,"Intro BA","Fall",6),
  (9,"BA",102,"Intro BA 2","Winter",6),
  (10,"SUS",101,"Intr SUS","Spring",7),
  (11,"SUS",102,"Intro SUS 2","Summer",7),
  (12,"GEOG",101,"Intro GEOG","Fall",8),
  (13,"GEOG",102,"Intro GEOG 2","Spring",8),
  (14,"MUS",101,"Intro MUS","Fall",9),
  (15,"MUS",102,"Intro MUS 2","Winter",9);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `enroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enroll` (
  `course_id`  mediumint(9) NOT NULL,
  `student_id` mediumint(9) NOT NULL,
  PRIMARY KEY (`course_id`, `student_id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_course_id` (`course_id`),
  CONSTRAINT `enroll_ibfk_1` FOREIGN KEY (`student_is`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enroll_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `assignments`
--

-- DROP TABLE IF EXISTS `assignments`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!40101 SET character_set_client = utf8 */;
-- CREATE TABLE `assignments` (
--   `id` mediumint(9) NOT NULL AUTO_INCREMENT,
--   `title` varchar(255) NOT NULL,
--   `points` mediumint(9) NOT NULL,
--   `due`
--   `caption` text,
--   `userid` mediumint(9) NOT NULL,
--   `courseid` mediumint(9) NOT NULL,
--   PRIMARY KEY (`id`),
--   KEY `idx_userid` (`userid`),
--   KEY `idx_courseid` (`courseid`),
--   CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`) ON DELETE CASCADE
-- ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
-- /*!40101 SET character_set_client = @saved_cs_client */;
--
-- --
-- -- Dumping data for table `assignments`
-- --
--
-- LOCK TABLES `assignments` WRITE;
-- /*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
-- INSERT INTO `assignments` VALUES
--   (1,NULL,11,15),
--   (2,NULL,7,2),
--   (3,'Hops',2,3),
--   (4,'Sticky Hands',14,18),
--   (5,NULL,5,2),
--   (6,'Popcorn!',11,7),
--   (7,'This is my dinner.',8,5),
--   (8,'Big fermentor',5,18),
--   (9,'Cake!',6,16),
--   (10,NULL,2,5);
-- /*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
-- UNLOCK TABLES;
--
-- --
-- -- Table structure for table `reviews`
-- --
--
-- DROP TABLE IF EXISTS `reviews`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!40101 SET character_set_client = utf8 */;
-- CREATE TABLE `reviews` (
--   `id` mediumint(9) NOT NULL AUTO_INCREMENT,
--   `dollars` tinyint(4) NOT NULL,
--   `stars` float NOT NULL,
--   `review` text,
--   `userid` mediumint(9) NOT NULL,
--   `courseid` mediumint(9) NOT NULL,
--   PRIMARY KEY (`id`),
--   KEY `idx_userid` (`userid`),
--   KEY `idx_courseid` (`courseid`),
--   CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`) ON DELETE CASCADE
-- ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
-- /*!40101 SET character_set_client = @saved_cs_client */;
--
-- --
-- -- Dumping data for table `reviews`
-- --
--
-- LOCK TABLES `reviews` WRITE;
-- /*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
-- INSERT INTO `reviews` VALUES
--   (1,1,4.5,'Cheap, delicious food.',8,5),
--   (2,2,4,NULL,11,15),
--   (3,2,5,'Try the hazlenut torte.  It\'s the best!',6,16),
--   (4,1,5,'Joel, the owner, is super friendly and helpful.',2,3),
--   (5,1,5,'A Corvallis gem.',11,7),
--   (6,1,5,'Yummmmmmm!',2,5),
--   (7,2,4,NULL,7,2),
--   (8,1,4,'How many fasteners can one room hold?',5,2),
--   (9,1,4,'Good beer, good food, though limited selection.',14,18),
--   (10,2,4.5,NULL,5,18);
-- /*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
-- UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-16  6:47:05
