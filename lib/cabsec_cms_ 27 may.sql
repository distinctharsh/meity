-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.46 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.17.0.7270
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb3 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for cabsec_cms_hi
CREATE DATABASE IF NOT EXISTS `cabsec_cms_hi` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cabsec_cms_hi`;

-- Dumping structure for table cabsec_cms_hi.about_content
CREATE TABLE IF NOT EXISTS `about_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section_key` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_general_ci,
  `content_type` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'text',
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `file_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_size` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `section_key` (`section_key`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.about_content: ~15 rows (approximately)
DELETE FROM `about_content`;
INSERT INTO `about_content` (`id`, `section_key`, `title`, `content`, `content_type`, `display_order`, `is_active`, `file_url`, `file_size`, `file_name`, `created_at`, `updated_at`) VALUES
	(1, 'vision', 'Vision Statement', 'The Cabinet Secretariat functions directly under the Prime Minister. The administrative head of the Secretariat is the Cabinet Secretary who is also the ex-officio Chairman of the Civil Services Board. The business allocated to Cabinet Secretariat under the Government of India (Allocation of Business) Rules, 1961 includes (i) Secretarial assistance to the Cabinet and Cabinet Committees; and (ii) Rules of Business.', 'text', 1, 1, NULL, NULL, NULL, '2026-04-30 06:34:38', '2026-05-04 06:30:31'),
	(2, 'functions', 'Functions', 'The Cabinet Secretariat functions directly under the Prime Minister. The administrative head of the Secretariat is the Cabinet Secretary who is also the ex-officio Chairman of the Civil Services Board. The business allocated to Cabinet Secretariat under the Government of India (Allocation of Business) Rules, 1961 includes (i) Secretarial assistance to the Cabinet and Cabinet Committees; and (ii) Rules of Business.\n\nThe Cabinet Secretariat is responsible for the administration of the Government of India (Transaction of Business) Rules, 1961 and Government of India (Allocation of Business) Rules, 1961 facilitating smooth transaction of business in Ministries/ Departments of the Union Government. The Secretariat provides Secretarial assistance to the Cabinet and its Committees, and also assists in decision-making in Government by ensuring Inter-Ministerial coordination, ironing out differences amongst Ministries/Departments and evolving consensus through the instrumentality of the standing / ad hoc Committees of Secretaries. Through this mechanism, new policy initiatives are also promoted. Management of major crisis situations in the country and coordinating activities of various Ministries/Departments in such a situation is also one of the functions of the Cabinet Secretariat.', 'text', 2, 1, NULL, NULL, NULL, '2026-04-30 06:34:38', '2026-04-30 06:34:38'),
	(3, 'allocation_disposal', 'Allocation and disposal of Government Business', 'The Government of India (Allocation of Business) Rules, 1961 (AoB Rules) and the Government of India (Transaction of Business) Rules, 1961 (ToB Rules) have been framed under Article 77 (3) of the Constitution of India. The First Schedule to the AoB Rules specifies the Ministries, Department, Offices and Secretariats while the Second Schedule lists out the business allocated to different Ministries/ Departments of the Government of India.\n\nThe ToB Rules lay down the procedure for disposal of business and decision making in Government of India. The business of the Government of India is normally disposed of at various levels within the Ministries/ Departments by, or under the general or special directions of, the Minister-in-charge subject to requisite inter-Departmental consultations stipulated in the ToB Rules. Further, the ToB Rules specify the cases for which approval of the Prime Minister, the Cabinet and its Committees, and of the President is required. The cases that require approval of Cabinet are indicated in the Second Schedule to the ToB Rules, and those requiring approval of the Committees of the Cabinet are indicated in the First Schedule to the ToB Rules. The cases that require submission to the Prime Minister and the President are listed in the Third Schedule to the ToB Rules. Accordingly, while a significant portion of the Government business gets disposed of at the departmental level, certain cases, or class of cases that are important from the national perspective, require approval of the Cabinet or one of the Committees of the Cabinet.', 'text', 3, 1, NULL, NULL, NULL, '2026-04-30 06:34:38', '2026-04-30 06:34:38'),
	(4, 'support_cabinet_committees', 'Support to Cabinet Committees', 'The secretarial assistance, provided by the Cabinet Secretariat to the Cabinet and Cabinet committees, includes:\n\nConvening of the meetings of the Cabinet & its Committees on the orders of the Prime Minister.\nPreparation and circulation of the agenda and papers related to the cases on the agenda.\nPreparation of record of discussions.\nCirculation of the record of discussions after obtaining the approval of the Prime Minister.\nMonitoring implementation of decisions taken by the Cabinet and its Committees.\n\nThe Cabinet Secretariat is the custodian of the papers of the Cabinet meetings.', 'text', 4, 1, NULL, NULL, NULL, '2026-04-30 06:34:38', '2026-04-30 06:34:38'),
	(5, 'inter_ministerial_coordination', 'Promotion of Inter-Ministerial Coordination', 'Among the inter-Ministerial matters, the coordination is required for:\n\nRemoving difficulties.\nRemoving differences.\nOvercoming delays.\nCoordination in administrative action.\nCoordination of policies.\n\nWhile each Ministry is responsible for acting on its own for expeditious implementation of Government policies, plans and programmes, where inter-Ministerial cooperation is involved, they often seek the assistance of the Cabinet Secretariat. The inter-Ministerial problems are dealt with in the meetings of the Committees of Secretaries (COS). Committees are constituted for discussing specific matters and proposals emanating from various Secretaries to the Government and meetings are held under the chairmanship of the Cabinet Secretary. These committees have been able to break bottlenecks or secure mutually supporting inter-Ministerial action.\n\nThe discussions of the COS take place on the basis of a paper formulated by the principal Department concerned and the Department with a different point of view, if any, providing a supplementary note. The decisions or recommendations of the COS are unanimous. These proceedings are also circulated to and are followed up by the Departments. There are other important functions which it discharges, viz.\n\nMonitoring.\nCoordination.\nPromoting new policy initiatives.\n\nThe Cabinet Secretariat is seen as a useful mechanism by the Departments for promoting inter-Ministerial coordination since the Cabinet Secretary is also the head of the civil services. Ministries/ Departments through the system of monthly DO letters apprise the Cabinet Secretary about the following:\n\nPolicy and other matters pending due to prolonged inter-ministerial consultations;\nProposals / references pending for long;\nParticulars of any case in which there has been a departure from Rules of Business; and\nImportant matters / significant development(s).', 'text', 5, 1, NULL, NULL, NULL, '2026-04-30 06:34:38', '2026-04-30 06:34:38'),
	(6, 'objectives', 'Objectives', 'Before the adoption of the portfolio system in the Government of India, all Governmental business was disposed of by the Governor-General in Council, the Council functioning as a Joint Consultative Board. As the scale and complexity of business of the Government increased, the work of the various Departments was distributed amongst the members of the Council, only the more important cases being dealt with by the Governor-General or the Council collectively.\n\nThis procedure was legalized by the Indian Councils Act, 1861 during the time of Lord Canning, leading to the introduction of the portfolio system and the inception of the Executive Council of the Governor-General. The Secretariat of the Executive Council was headed by the Private Secretary to the Viceroy, but he did not attend the Council meetings. Lord Willingdon first started the practice of having his Private Secretary by his side at these meetings. Later, this practice continued and in November, 1935, the Viceroy\'s Private Secretary was given the additional designation of Secretary to the Executive Council. But these posts were separated subsequently, and a separate Secretary was appointed to the Executive Council as distinct from the Private Secretary to the Viceroy and Governor General.\n\nConstitution of the Interim Government in September 1946 brought a change in the name of this Office. On 5th September, 1946, the Secretariat of the Executive Council was designated as Cabinet Secretariat, and the Secretary to the Executive Council as Cabinet Secretary. It seems, however, at least in retrospect, that Independence brought a sort of change in the functions of the Cabinet Secretariat. It no longer remained concerned with only the work of circulating papers to Ministers and Ministries, but developed into an organization for effecting coordination between the Ministries.', 'text', 6, 1, NULL, NULL, NULL, '2026-04-30 06:34:38', '2026-04-30 06:34:38'),
	(7, 'development', 'Development', 'After independence, in 1949, an Economic Committee of the Cabinet was set up with its Secretariat at Ministry of Finance. In 1950, this was transferred to Cabinet Secretariat and designated as Economic Wing and ultimately merged with the Secretariat in 1955. In 1954, the Organisation and Methods Division was established under the Cabinet Secretariat which was later transferred to Ministry of Home Affairs during 1964. Presently, it is under Department of Administrative Reforms and Public Grievances.\n\nOn 1st October, 1947, the Defence Committee of the Cabinet was constituted. To assist the Cabinet Secretary in servicing the Defence Committee of the Cabinet, a Military Wing was established in the Cabinet Secretariat in October, 1947 itself. In 1970, the CCPA replaced the Defence Committee of the Cabinet and Internal Affairs Committee of the Cabinet. Secretarial assistance to the CCPA was provided by the Civil wing of the Cabinet Secretariat and the Military Wing of the Cabinet was providing assistance for Defence Minister\'s Committees, Chiefs of Staff Committees etc. As the Military Wing was not connected with any work within the Cabinet Secretariat and functionally linked to the Ministry of Defence, the Military Wing was transferred to the Ministry of Defence with effect from 1st July, 1991.\n\nDepartment of Statistics was created in April, 1961 under Cabinet Secretariat and transferred to Ministry of Planning in February, 1973. It was converted into a Ministry in October, 1999.\n\nDepartment of Special Economic Coordination was set up under Cabinet Secretariat in June, 1962, which was placed as Department of Co-ordination under newly created Ministry of Economic and Defence Co-ordination in November, 1962. Its work was transferred to Department of Co-ordination under Ministry of Finance on 11th September, 1963, and since 14th June, 1967, this department ceased to exist. Its work was transferred to Department of Economic Affairs under Ministry of Finance.\n\nAn Intelligence Wing was set up to provide secretarial assistance to the Joint Intelligence Committee in 1965.\n\nThe Bureau of Public Enterprises was brought under the Cabinet Secretariat for short duration from January, 1966 to June, 1966 and transferred to Department of Co-ordination under Ministry of Finance on 6th June, 1966. On 14th June, 1967, it was transferred to Department of Expenditure under Ministry of Finance. On 25th September, 1985, it was converted into a separate Department of Public Enterprises under Ministry of Industry, which was placed under Ministry of Heavy Industries and Public Enterprises on 15th October, 1999. Since 6th July, 2021, this department is under Ministry of Finance.', 'text', 7, 1, NULL, NULL, NULL, '2026-04-30 06:34:38', '2026-04-30 06:34:38'),
	(8, 'development_history', 'In June, 1970 three departments namely:', 'Department of Electronics\nDepartment of Scientific and Industrial Research and\nDepartment of Personnel\n\nwere created under Cabinet Secretariat and in July, 1970, Directorate General of Revenue Intelligence-cum-Directorate of Enforcement was set up under Department of Cabinet Affairs under Cabinet Secretariat and later this directorate was shifted to Department of Personnel in August, 1970.\n\nDepartment of Scientific and Industrial Research became independent department in May, 1971 and renamed as Department of Science and Technology. Since 4th January, 1985, it is under Ministry of Science and Technology with its initial nomenclature.\n\nThe Department of Electronics became independent department in 1971 and the Department of Personnel was renamed as D/o Personnel and Administrative Reforms on 07.02.1973. Department of Personnel and Administrative Reforms was transferred to the Ministry of Home Affairs from the Cabinet Secretariat in 1977. At present, it is a part of the Ministry of Personnel, Public Grievances and Pensions with a bifurcation as Department of Personnel and training and Department of Administrative Reforms and Public Grievances.\n\nDepartment of Ocean Development was created in July 1981 under Cabinet Secretariat and became independent department in February, 1982. It became a Ministry in February, 2006, and since July, 2006, its functions are being handled by Ministry of Earth Sciences.', 'text', 8, 1, NULL, NULL, NULL, '2026-04-30 06:34:38', '2026-04-30 06:34:38'),
	(9, 'dpg', 'Directorate Of Public Grievances (DPG)', 'The Directorate of Public Grievances was set up in the Cabinet Secretariat in March, 1988. Grievances can be filed either online or through post/drop-box with the Directorate of Public Grievance in respect of select Ministries/Departments/Organizations which have extensive public interface such as MTNL/BSNL, Railways, Posts, Insurance Companies, Public Sector Banks etc. (list is available at https://dpg.gov.in/Authpages/OgCovered.aspx).\n\nDepending on nature and gravity of the grievances, the Directorate either seeks comments or transfers the same for appropriate action to the concerned Department(s).', 'text', 9, 1, NULL, NULL, NULL, '2026-04-30 06:34:38', '2026-04-30 06:34:38'),
	(10, 'nacwc', 'National Authority Chemical Weapons Convention (NACWC)', 'The National Authority Chemical Weapons Convention was set up to fulfill India\'s obligations under the Chemical Weapons Convention (CWC). The CWC is a multilateral international treaty on the prohibition of development, production, stockpiling and use of Chemical Weapons. The Convention came into force on 29th April, 1997. As on 31st March, 2025, 193 States Parties (countries) have ratified or acceded to the treaty. The Organization for the Prohibition of Chemical Weapons (the OPCW), the implementing body for the Convention is based at the Hague, the Netherlands. The OPCW was awarded Nobel Peace Prize in 2013, in recognition of its efforts towards the global elimination of Chemical Weapons.\n\nThe National Authority Chemical Weapons Convention was constituted by the Cabinet Secretariat on 5th May, 1997. The Chemical Weapons Convention Act, 2000 (the Act), was enacted and came into force on 1st July, 2005. The Authority was established and notified under the CWC Act, 2000 on 13th June 2005.\n\nThe National Authority is headed by the Chairperson who shall have a rank equivalent to that of a Secretary to the Government of India and is supported by a suitable Technical Secretariat to look after its various functions. A high level Steering Committee under the chairmanship of the Cabinet Secretary with Home Secretary, Foreign Secretary, Secretary, Ministry of Defence, Secretary, Department of Revenue, Secretary, Department of Chemicals & Petrochemicals, Secretary, Department of Defence Research & Development and Secretary, Department of Commerce is established to oversee the functions of the Authority and exercise and perform powers of the Central Government, in accordance with the provisions of the aforesaid Act.\n\nThe National Authority is responsible for implementation of the CWC Act, liaison with OPCW and other States Parties (countries) to the Convention, fulfilling India\'s treaty obligations including timely submission of declarations, co-ordinating OPCW inspections, etc.', 'text', 10, 1, NULL, NULL, NULL, '2026-04-30 06:34:38', '2026-04-30 06:34:38'),
	(11, 'dbt_mission', 'Direct Benefit Transfer(DBT) Mission', 'DBT is a major reform initiative where benefits, cash or in kind, are delivered directly to targeted beneficiaries using Aadhaar. It envisages efficiency and inclusion in the delivery processes leading to greater accountability and transparency in the system.\n\nDBT Mission was created in the Planning Commission to act as a nodal point for implementation of DBT. The Mission was transferred to the Department of Expenditure in July 13 and shifted to Cabinet Secretariat w.e.f. 14.09.2015.', 'text', 11, 1, NULL, NULL, NULL, '2026-04-30 06:34:38', '2026-04-30 06:34:38'),
	(12, 'psa_office', 'Office of the Principal Scientific Adviser (O/o PSA)', 'The Office of the Principal Scientific Adviser to the Government of India (O/o of PSA) was set-up in November, 1999 primarily to:\n\nEvolve polices, strategies and missions for the generation of innovations and support systems for multiple applications,\nGenerate science and technology tasks in critical infrastructure, economic and social sectors in partnership with Government departments, institutions and industry,\n\nOffice of PSA also services the Prime Minister\'s Science, Technology and Innovation Advisory Council (PM-STIAC).\n\nFrom August, 2018, Office of PSA has been placed administratively under the Cabinet Secretariat.', 'text', 12, 1, NULL, NULL, NULL, '2026-04-30 06:34:39', '2026-04-30 06:34:39'),
	(13, 'cabinet_secretaries', 'Cabinet Secretaries', '', 'download', 13, 1, '/uploads/about/1777531209943-103007272.pdf', '324.94 KB', 'ChatGPT.pdf', '2026-04-30 06:34:39', '2026-04-30 06:40:09'),
	(14, 'work_distribution', 'Work Distribution', '', 'download', 14, 1, '/uploads/about/1777531217982-414624100.pdf', '119.47 KB', '5901f9cca66693ae4590cc226fe3f86e.pdf', '2026-04-30 06:34:39', '2026-04-30 06:40:17'),
	(15, 'organization_chart', 'Organization Chart', '', 'download', 15, 1, '/uploads/about/1777531230866-437747717.xlsx', '9.59 KB', 'Employee Family Details..xlsx', '2026-04-30 06:34:39', '2026-04-30 06:40:30');

-- Dumping structure for table cabsec_cms_hi.announcements
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `link_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `link_text` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.announcements: ~0 rows (approximately)
DELETE FROM `announcements`;

-- Dumping structure for table cabsec_cms_hi.audit_trails
CREATE TABLE IF NOT EXISTS `audit_trails` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ip` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `user` int DEFAULT NULL,
  `time` timestamp NULL DEFAULT NULL,
  `remarks` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6460 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping structure for table cabsec_cms_hi.cms_users
CREATE TABLE IF NOT EXISTS `cms_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('super_admin','admin','editor') COLLATE utf8mb4_general_ci DEFAULT 'editor',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.cms_users: ~1 rows (approximately)
DELETE FROM `cms_users`;
INSERT INTO `cms_users` (`id`, `username`, `email`, `password_hash`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, 'admin', 'admin@cabsec.gov.in', '$2a$10$z1rXO8Gq6xcCduSP641V5uDiXexfRdoxrBn338.t09TkLq0TgWKaq', 'super_admin', 1, '2025-09-15 09:03:11', '2026-04-30 07:11:56');

-- Dumping structure for table cabsec_cms_hi.directory_entries
CREATE TABLE IF NOT EXISTS `directory_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `tags_json` text COLLATE utf8mb4_general_ci,
  `phones_json` text COLLATE utf8mb4_general_ci,
  `emails_json` text COLLATE utf8mb4_general_ci,
  `address` text COLLATE utf8mb4_general_ci,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.directory_entries: ~2 rows (approximately)
DELETE FROM `directory_entries`;
INSERT INTO `directory_entries` (`id`, `role`, `name`, `tags_json`, `phones_json`, `emails_json`, `address`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, 'Senior Secretariat Assistant', 'Shri Ajay Kumar', '[]', '["011-24301551"]', '["dahiya[dot]ajay[at]cabsec[dot]gov[dot]in"]', '\nRoom No. Opposite-2002, Electronics Niketan, 6, CGO Complex, Lodhi Road, New Delhi: 110003', 0, 1, '2025-10-22 06:53:44', '2026-05-07 10:12:56'),
	(2, 'Additional Secretary', 'Shri Abhishek Singh', '[]', '["+91-11-24369222 (Office)"]', '["as[at]cabsec[dot]gov[dot]in"]', 'Electronics Niketan, 6, CGO Complex, Lodhi Road, New Delhi: 110003', 1, 1, '2025-10-22 06:58:41', '2026-05-07 10:13:02');

-- Dumping structure for table cabsec_cms_hi.footer
CREATE TABLE IF NOT EXISTS `footer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'main',
  `sections` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `social_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `copyright` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_type` (`type`),
  CONSTRAINT `footer_chk_1` CHECK (json_valid(`sections`)),
  CONSTRAINT `footer_chk_2` CHECK (json_valid(`social_links`))
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table cabsec_cms_hi.footer: ~1 rows (approximately)
DELETE FROM `footer`;
INSERT INTO `footer` (`id`, `type`, `sections`, `social_links`, `copyright`, `created_at`, `updated_at`) VALUES
	(1, 'main', '[{"title":"USEFUL LINKS","links":[{"label":"पुरालेख","url":"/archives"},{"label":"साइटमैप","url":"#"}]},{"title":"Website Policies","links":[{"label":"वेबसाइट नीतियाँ","url":"/policies/terms-of-use"},{"label":"मदद","url":"/help"}]},{"title":"Related Links","links":[{"label":"संबंधित लिंक","url":"/related-links"},{"label":"हमसे संपर्क करें","url":"/connect/contact-us"}]}]', '{"twitter":"","youtube":"","facebook":"","instagram":""}', 'यह वेबसाइट भारत सरकार के मंत्रिमंडल सचिवालय की है।', '2025-11-10 09:51:04', '2026-05-20 09:08:49');

-- Dumping structure for table cabsec_cms_hi.hero_slides
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_url` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `link_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.hero_slides: ~3 rows (approximately)
DELETE FROM `hero_slides`;
INSERT INTO `hero_slides` (`id`, `image_url`, `link_url`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(8, '/uploads/slider/1776922622999_ccto10.jpg', '', 0, 1, '2026-04-23 05:37:08', '2026-04-23 05:54:08'),
	(9, '/uploads/slider/1776922633774_nehgzf.jpg', '', 1, 1, '2026-04-23 05:37:22', '2026-04-23 05:54:09'),
	(10, '/uploads/slider/1776922661401_qurit3.jpg', '', 2, 1, '2026-04-23 05:37:42', '2026-04-23 05:54:09');

-- Dumping structure for table cabsec_cms_hi.important_links
CREATE TABLE IF NOT EXISTS `important_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `link_type` enum('url','file') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'url',
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.important_links: ~4 rows (approximately)
DELETE FROM `important_links`;
INSERT INTO `important_links` (`id`, `title`, `url`, `file_path`, `link_type`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, 'Secretary to GOI List', 'https://doptcirculars.nic.in/Default.aspx?URL=6G4WVPFk5ngz', NULL, 'url', 1, 1, '2026-05-06 12:22:38', '2026-05-06 12:22:38'),
	(2, 'Former Cabinet Secretary List', 'https://master-cabsec.digifootprint.gov.in/static/uploads/2025/06/39801d278cc54856899bd905a522e632.pdf', NULL, 'url', 2, 1, '2026-05-06 12:23:10', '2026-05-06 12:23:10'),
	(3, 'IGoT', 'https://igotkarmayogi.gov.in/#/', NULL, 'url', 3, 1, '2026-05-06 12:23:37', '2026-05-06 12:23:37'),
	(4, 'Test', NULL, '/uploads/important-links/59563377ca25aecacdfe800ebb09fded.pdf', 'file', 4, 1, '2026-05-12 08:53:14', '2026-05-12 08:53:14');

-- Dumping structure for table cabsec_cms_hi.media_library
CREATE TABLE IF NOT EXISTS `media_library` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `original_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `file_type` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `file_size` int NOT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `caption` text COLLATE utf8mb4_general_ci,
  `uploaded_by` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `media_library_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `cms_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.media_library: ~105 rows (approximately)
DELETE FROM `media_library`;
INSERT INTO `media_library` (`id`, `filename`, `original_name`, `file_path`, `file_type`, `file_size`, `alt_text`, `caption`, `uploaded_by`, `created_at`) VALUES
	(1, 'files-1759739848075-317601665.jpg', 'a.jpg', '/uploads/files-1759739848075-317601665.jpg', 'image/jpeg', 241210, NULL, NULL, 1, '2025-10-06 08:37:28'),
	(2, 'files-1760357100540-12009811.pdf', 'epfo.pdf', '/uploads/files-1760357100540-12009811.pdf', 'application/pdf', 48003, NULL, NULL, 1, '2025-10-13 12:05:00'),
	(3, 'files-1760516763214-28888982.pdf', 'blank.pdf', '/uploads/files-1760516763214-28888982.pdf', 'application/pdf', 4911, NULL, NULL, 1, '2025-10-15 08:26:03'),
	(4, 'files-1760518265959-877519462.pdf', 'blank.pdf', '/uploads/files-1760518265959-877519462.pdf', 'application/pdf', 4911, NULL, NULL, 1, '2025-10-15 08:51:05'),
	(5, 'files-1760520732952-999865479.pdf', 'blank.pdf', '/uploads/files-1760520732952-999865479.pdf', 'application/pdf', 4911, NULL, NULL, 1, '2025-10-15 09:32:12'),
	(6, 'files-1763550355140-698948065.pdf', 'a.pdf', '/report_document/files-1763550355140-698948065.pdf', 'application/pdf', 210307, NULL, NULL, 1, '2025-11-19 11:05:55'),
	(7, 'files-1765533973868-368690706.pdf', 'ghi0.pdf', '/report_document/files-1765533973868-368690706.pdf', 'application/pdf', 6027, NULL, NULL, 1, '2025-12-12 10:06:13'),
	(8, 'files-1765534677432-131831705.pdf', 'ghi0.pdf', '/report_document/files-1765534677432-131831705.pdf', 'application/pdf', 6027, NULL, NULL, 1, '2025-12-12 10:17:57'),
	(9, 'files-1765534717468-324792930.docx', 'jkl.docx', '/report_document/files-1765534717468-324792930.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 79693, NULL, NULL, 1, '2025-12-12 10:18:37'),
	(10, 'files-1765534725513-90825367.pdf', 'ghi4.pdf', '/report_document/files-1765534725513-90825367.pdf', 'application/pdf', 6027, NULL, NULL, 1, '2025-12-12 10:18:45'),
	(11, 'files-1765535913296-299219713.pdf', 'ghi2.pdf', '/report_document/files-1765535913296-299219713.pdf', 'application/pdf', 6027, NULL, NULL, 1, '2025-12-12 10:38:35'),
	(12, 'files-1765791908056-574257156.docx', 'files-1765534717468-324792930.docx', '/report_document/files-1765791908056-574257156.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 79693, NULL, NULL, 1, '2025-12-15 09:45:08'),
	(13, 'files-1765791945041-593409226.docx', 'files-1765534717468-324792930.docx', '/report_document/files-1765791945041-593409226.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 79693, NULL, NULL, 1, '2025-12-15 09:45:45'),
	(14, 'files-1765791990630-808926530.pdf', 'New Doc 2020-03-17 17.06.31.pdf', '/report_document/files-1765791990630-808926530.pdf', 'application/pdf', 380649, NULL, NULL, 1, '2025-12-15 09:46:30'),
	(15, 'files-1765792007084-993944943.pdf', 'New Doc 2020-03-17 17.06.31.pdf', '/report_document/files-1765792007084-993944943.pdf', 'application/pdf', 380649, NULL, NULL, 1, '2025-12-15 09:46:47'),
	(16, 'files-1765793763138-886569698.pdf', 'New Doc 2020-03-17 17.06.31.pdf', '/report_document/files-1765793763138-886569698.pdf', 'application/pdf', 380649, NULL, NULL, 1, '2025-12-15 10:16:03'),
	(17, 'files-1765793952045-406024670.pdf', 'New Doc 2020-03-17 17.06.31.pdf', '/report_document/files-1765793952045-406024670.pdf', 'application/pdf', 380649, NULL, NULL, 1, '2025-12-15 10:19:12'),
	(18, 'files-1765795657013-171147568.pdf', 'New Doc 2020-03-17 17.06.31.pdf', '/report_document/files-1765795657013-171147568.pdf', 'application/pdf', 380649, NULL, NULL, 1, '2025-12-15 10:47:37'),
	(19, 'files-1765863913850-731916043.pdf', 'New Doc 2020-03-17 17.06.31.pdf', '/report_document/files-1765863913850-731916043.pdf', 'application/pdf', 380649, NULL, NULL, 1, '2025-12-16 05:45:13'),
	(20, 'files-1765863913856-993021346.pdf', 'New Doc 2020-03-17 17.12.23.pdf', '/report_document/files-1765863913856-993021346.pdf', 'application/pdf', 635297, NULL, NULL, 1, '2025-12-16 05:45:14'),
	(21, 'files-1766036230564-234901859.pdf', 'Council of Ministers with Portfolios.pdf', '/report_document/files-1766036230564-234901859.pdf', 'application/pdf', 454335, NULL, NULL, 1, '2025-12-18 05:37:10'),
	(22, 'files-1766036535246-617283233.pdf', 'Council of Ministers with Portfolios.pdf', '/report_document/files-1766036535246-617283233.pdf', 'application/pdf', 454335, NULL, NULL, 1, '2025-12-18 05:42:15'),
	(23, 'files-1766036573348-841298135.pdf', 'Council of Ministers with Portfolios - Copy - Copy.pdf', '/report_document/files-1766036573348-841298135.pdf', 'application/pdf', 454335, NULL, NULL, 1, '2025-12-18 05:42:53'),
	(24, 'files-1766036573350-869467292.pdf', 'Council of Ministers with Portfolios - Copy (2).pdf', '/report_document/files-1766036573350-869467292.pdf', 'application/pdf', 454335, NULL, NULL, 1, '2025-12-18 05:42:53'),
	(25, 'files-1766036573354-236586119.pdf', 'Council of Ministers with Portfolios - Copy.pdf', '/report_document/files-1766036573354-236586119.pdf', 'application/pdf', 454335, NULL, NULL, 1, '2025-12-18 05:42:53'),
	(26, 'files-1766036573357-695536293.pdf', 'Council of Ministers with Portfolios.pdf', '/report_document/files-1766036573357-695536293.pdf', 'application/pdf', 454335, NULL, NULL, 1, '2025-12-18 05:42:53'),
	(27, 'file-1777959822593-633976319.pdf', 'ChatGPT.pdf', '/report_document/file-1777959822593-633976319.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 05:43:42'),
	(28, 'file-1777959893881-929305855.pdf', 'ChatGPT.pdf', '/report_document/file-1777959893881-929305855.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 05:44:53'),
	(29, 'file-1777959906615-71733489.pdf', 'ChatGPT.pdf', '/report_document/file-1777959906615-71733489.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 05:45:06'),
	(30, 'file-1777959917082-465876166.pdf', 'ChatGPT.pdf', '/report_document/file-1777959917082-465876166.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 05:45:17'),
	(31, 'file-1777959930722-969703747.pdf', 'ChatGPT.pdf', '/report_document/file-1777959930722-969703747.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 05:45:30'),
	(32, 'file-1777959945873-590978872.pdf', 'ChatGPT.pdf', '/report_document/file-1777959945873-590978872.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 05:45:45'),
	(33, 'file-1777959956196-352234508.pdf', 'ChatGPT.pdf', '/report_document/file-1777959956196-352234508.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 05:45:56'),
	(34, 'file-1777959969732-298326791.pdf', 'ChatGPT.pdf', '/report_document/file-1777959969732-298326791.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 05:46:09'),
	(35, 'file-1777959983650-682436314.pdf', 'ChatGPT.pdf', '/report_document/file-1777959983650-682436314.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 05:46:23'),
	(36, 'file-1777959996264-973797930.pdf', 'ChatGPT.pdf', '/report_document/file-1777959996264-973797930.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 05:46:36'),
	(37, 'file-1777960012379-867019956.pdf', 'ChatGPT.pdf', '/report_document/file-1777960012379-867019956.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 05:46:52'),
	(38, 'file-1777960023435-929188584.pdf', 'ChatGPT.pdf', '/report_document/file-1777960023435-929188584.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 05:47:03'),
	(39, 'file-1777960034207-35404351.pdf', 'ChatGPT.pdf', '/report_document/file-1777960034207-35404351.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 05:47:14'),
	(40, 'file-1777960048730-661263383.pdf', 'ChatGPT.pdf', '/report_document/file-1777960048730-661263383.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 05:47:28'),
	(41, 'file-1777965440790-814569059.pdf', 'ChatGPT.pdf', '/report_document/file-1777965440790-814569059.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 07:17:20'),
	(42, 'file-1777965466202-766366221.pdf', 'ChatGPT.pdf', '/report_document/file-1777965466202-766366221.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 07:17:46'),
	(43, 'file-1777965486105-327371154.pdf', 'ChatGPT.pdf', '/report_document/file-1777965486105-327371154.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-05 07:18:06'),
	(44, 'files-1778584918812-802359134.pdf', '1.pdf', '/report_document/files-1778584918812-802359134.pdf', 'application/pdf', 754157, NULL, NULL, 1, '2026-05-12 11:21:58'),
	(45, 'files-1778584948244-898075923.pdf', '2.pdf', '/report_document/files-1778584948244-898075923.pdf', 'application/pdf', 258527, NULL, NULL, 1, '2026-05-12 11:22:28'),
	(46, 'files-1778585788990-969352469.pdf', '0a2f314ad10ded9cff5828402cb007b1.pdf', '/report_document/files-1778585788990-969352469.pdf', 'application/pdf', 754157, NULL, NULL, 1, '2026-05-12 11:36:29'),
	(47, 'files-1778585854094-787414125.pdf', '0a2f314ad10ded9cff5828402cb007b1.pdf', '/report_document/files-1778585854094-787414125.pdf', 'application/pdf', 754157, NULL, NULL, 1, '2026-05-12 11:37:34'),
	(48, 'files-1778585854101-782031023.pdf', '2.pdf', '/report_document/files-1778585854101-782031023.pdf', 'application/pdf', 258527, NULL, NULL, 1, '2026-05-12 11:37:34'),
	(49, 'files-1778585854103-667759975.pdf', '3.pdf', '/report_document/files-1778585854103-667759975.pdf', 'application/pdf', 105660, NULL, NULL, 1, '2026-05-12 11:37:34'),
	(50, 'files-1778585854106-848678199.pdf', '4.pdf', '/report_document/files-1778585854106-848678199.pdf', 'application/pdf', 106785, NULL, NULL, 1, '2026-05-12 11:37:34'),
	(51, 'files-1778586097412-986033503.pdf', '5.pdf', '/report_document/files-1778586097412-986033503.pdf', 'application/pdf', 156470, NULL, NULL, 1, '2026-05-12 11:41:37'),
	(52, 'files-1778586097418-720925695.pdf', '6.pdf', '/report_document/files-1778586097418-720925695.pdf', 'application/pdf', 119988, NULL, NULL, 1, '2026-05-12 11:41:37'),
	(53, 'files-1778586097421-21868498.pdf', '7.pdf', '/report_document/files-1778586097421-21868498.pdf', 'application/pdf', 1889914, NULL, NULL, 1, '2026-05-12 11:41:37'),
	(54, 'files-1778586097427-609382287.pdf', '8.pdf', '/report_document/files-1778586097427-609382287.pdf', 'application/pdf', 147407, NULL, NULL, 1, '2026-05-12 11:41:37'),
	(55, 'files-1778586097429-507009994.pdf', '9.pdf', '/report_document/files-1778586097429-507009994.pdf', 'application/pdf', 351734, NULL, NULL, 1, '2026-05-12 11:41:37'),
	(56, 'files-1778586097432-51127442.pdf', '10.pdf', '/report_document/files-1778586097432-51127442.pdf', 'application/pdf', 351417, NULL, NULL, 1, '2026-05-12 11:41:37'),
	(57, 'files-1778586097435-393417943.pdf', '11.pdf', '/report_document/files-1778586097435-393417943.pdf', 'application/pdf', 108772, NULL, NULL, 1, '2026-05-12 11:41:37'),
	(58, 'files-1778586097437-894734925.pdf', '12.pdf', '/report_document/files-1778586097437-894734925.pdf', 'application/pdf', 474404, NULL, NULL, 1, '2026-05-12 11:41:37'),
	(59, 'files-1778586097443-472579238.pdf', '13.pdf', '/report_document/files-1778586097443-472579238.pdf', 'application/pdf', 108418, NULL, NULL, 1, '2026-05-12 11:41:37'),
	(60, 'files-1778586097445-593785170.pdf', '14.pdf', '/report_document/files-1778586097445-593785170.pdf', 'application/pdf', 2326889, NULL, NULL, 1, '2026-05-12 11:41:37'),
	(61, 'files-1778586437306-920539447.pdf', '1.pdf', '/report_document/files-1778586437306-920539447.pdf', 'application/pdf', 754157, NULL, NULL, 1, '2026-05-12 11:47:17'),
	(62, 'files-1778586437337-159741146.pdf', '2.pdf', '/report_document/files-1778586437337-159741146.pdf', 'application/pdf', 3635956, NULL, NULL, 1, '2026-05-12 11:47:17'),
	(63, 'files-1778586437508-542006527.pdf', '3.pdf', '/report_document/files-1778586437508-542006527.pdf', 'application/pdf', 2146297, NULL, NULL, 1, '2026-05-12 11:47:17'),
	(64, 'files-1778586437518-625128747.pdf', '4.pdf', '/report_document/files-1778586437518-625128747.pdf', 'application/pdf', 734240, NULL, NULL, 1, '2026-05-12 11:47:17'),
	(65, 'files-1778586437524-469899454.pdf', '5.pdf', '/report_document/files-1778586437524-469899454.pdf', 'application/pdf', 597436, NULL, NULL, 1, '2026-05-12 11:47:17'),
	(66, 'files-1778586437528-708040169.pdf', '6.pdf', '/report_document/files-1778586437528-708040169.pdf', 'application/pdf', 577203, NULL, NULL, 1, '2026-05-12 11:47:17'),
	(67, 'files-1778586437532-57659956.pdf', '7.pdf', '/report_document/files-1778586437532-57659956.pdf', 'application/pdf', 3164735, NULL, NULL, 1, '2026-05-12 11:47:17'),
	(68, 'files-1778586437543-415115812.pdf', '8.pdf', '/report_document/files-1778586437543-415115812.pdf', 'application/pdf', 71662, NULL, NULL, 1, '2026-05-12 11:47:17'),
	(69, 'files-1778586437544-720408423.pdf', '9.pdf', '/report_document/files-1778586437544-720408423.pdf', 'application/pdf', 842530, NULL, NULL, 1, '2026-05-12 11:47:17'),
	(70, 'files-1778586437549-818359496.pdf', '10.pdf', '/report_document/files-1778586437549-818359496.pdf', 'application/pdf', 399102, NULL, NULL, 1, '2026-05-12 11:47:17'),
	(71, 'files-1778586437551-270252084.pdf', '11.pdf', '/report_document/files-1778586437551-270252084.pdf', 'application/pdf', 1114232, NULL, NULL, 1, '2026-05-12 11:47:17'),
	(72, 'files-1778586437556-721531281.pdf', '12.pdf', '/report_document/files-1778586437556-721531281.pdf', 'application/pdf', 107527, NULL, NULL, 1, '2026-05-12 11:47:17'),
	(73, 'files-1778586437558-523474036.pdf', '13.pdf', '/report_document/files-1778586437558-523474036.pdf', 'application/pdf', 2269375, NULL, NULL, 1, '2026-05-12 11:47:17'),
	(74, 'files-1778586482903-979592852.pdf', '1.pdf', '/report_document/files-1778586482903-979592852.pdf', 'application/pdf', 1515782, NULL, NULL, 1, '2026-05-12 11:48:02'),
	(75, 'files-1778586482919-496892473.pdf', '2.pdf', '/report_document/files-1778586482919-496892473.pdf', 'application/pdf', 963210, NULL, NULL, 1, '2026-05-12 11:48:02'),
	(76, 'files-1778588926750-955091148.pdf', '1.pdf', '/report_document/files-1778588926750-955091148.pdf', 'application/pdf', 2009765, NULL, NULL, 1, '2026-05-12 12:28:46'),
	(77, 'files-1778588926765-657607427.pdf', '2.pdf', '/report_document/files-1778588926765-657607427.pdf', 'application/pdf', 63986, NULL, NULL, 1, '2026-05-12 12:28:46'),
	(78, 'files-1778588926767-303068527.pdf', '3.pdf', '/report_document/files-1778588926767-303068527.pdf', 'application/pdf', 64395, NULL, NULL, 1, '2026-05-12 12:28:46'),
	(79, 'files-1778588926769-810053368.pdf', '4.pdf', '/report_document/files-1778588926769-810053368.pdf', 'application/pdf', 110236, NULL, NULL, 1, '2026-05-12 12:28:46'),
	(80, 'files-1778588926771-954026993.pdf', '5.pdf', '/report_document/files-1778588926771-954026993.pdf', 'application/pdf', 1374132, NULL, NULL, 1, '2026-05-12 12:28:46'),
	(81, 'files-1778588926784-816957344.pdf', '6.pdf', '/report_document/files-1778588926784-816957344.pdf', 'application/pdf', 64428, NULL, NULL, 1, '2026-05-12 12:28:46'),
	(82, 'files-1778588926784-979485974.pdf', '7.pdf', '/report_document/files-1778588926784-979485974.pdf', 'application/pdf', 117736, NULL, NULL, 1, '2026-05-12 12:28:46'),
	(83, 'files-1778588926787-903468823.pdf', '8.pdf', '/report_document/files-1778588926787-903468823.pdf', 'application/pdf', 266599, NULL, NULL, 1, '2026-05-12 12:28:46'),
	(84, 'files-1778588926789-299919881.pdf', '9.pdf', '/report_document/files-1778588926789-299919881.pdf', 'application/pdf', 83208, NULL, NULL, 1, '2026-05-12 12:28:46'),
	(85, 'files-1778588926791-801195312.pdf', '10.pdf', '/report_document/files-1778588926791-801195312.pdf', 'application/pdf', 81853, NULL, NULL, 1, '2026-05-12 12:28:46'),
	(86, 'files-1778588926792-536861901.pdf', '11.pdf', '/report_document/files-1778588926792-536861901.pdf', 'application/pdf', 82034, NULL, NULL, 1, '2026-05-12 12:28:46'),
	(87, 'files-1778588926794-413225553.pdf', '12.pdf', '/report_document/files-1778588926794-413225553.pdf', 'application/pdf', 81812, NULL, NULL, 1, '2026-05-12 12:28:46'),
	(88, 'files-1778651029094-68596918.docx', 'ICAAAIML-2025 Copyright Volume 2.docx', '/report_document/files-1778651029094-68596918.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 52176, NULL, NULL, 1, '2026-05-13 05:43:49'),
	(89, 'files-1778655663578-645760730.pdf', 'ChatGPT.pdf', '/report_document/files-1778655663578-645760730.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-13 07:01:03'),
	(90, 'files-1778664057803-747627311.pdf', 'ChatGPT.pdf', '/report_document/files-1778664057803-747627311.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-13 09:20:57'),
	(91, 'files-1778664120121-868806192.pdf', '5901f9cca66693ae4590cc226fe3f86e.pdf', '/report_document/files-1778664120121-868806192.pdf', 'application/pdf', 122340, NULL, NULL, 1, '2026-05-13 09:22:00'),
	(92, 'files-1778664203648-980787344.pdf', '5901f9cca66693ae4590cc226fe3f86e.pdf', '/report_document/files-1778664203648-980787344.pdf', 'application/pdf', 122340, NULL, NULL, 1, '2026-05-13 09:23:23'),
	(93, 'files-1778664224498-552720493.pdf', '5901f9cca66693ae4590cc226fe3f86e.pdf', '/report_document/files-1778664224498-552720493.pdf', 'application/pdf', 122340, NULL, NULL, 1, '2026-05-13 09:23:44'),
	(94, 'files-1778664256039-392730042.pdf', '5901f9cca66693ae4590cc226fe3f86e.pdf', '/report_document/files-1778664256039-392730042.pdf', 'application/pdf', 122340, NULL, NULL, 1, '2026-05-13 09:24:16'),
	(95, 'files-1778664273113-779116533.pdf', '5901f9cca66693ae4590cc226fe3f86e.pdf', '/report_document/files-1778664273113-779116533.pdf', 'application/pdf', 122340, NULL, NULL, 1, '2026-05-13 09:24:33'),
	(96, 'files-1778664302153-486725820.pdf', '5901f9cca66693ae4590cc226fe3f86e.pdf', '/report_document/files-1778664302153-486725820.pdf', 'application/pdf', 122340, NULL, NULL, 1, '2026-05-13 09:25:02'),
	(97, 'files-1778664323824-407952927.pdf', '5901f9cca66693ae4590cc226fe3f86e.pdf', '/report_document/files-1778664323824-407952927.pdf', 'application/pdf', 122340, NULL, NULL, 1, '2026-05-13 09:25:23'),
	(98, 'files-1778664344245-162061482.pdf', '5901f9cca66693ae4590cc226fe3f86e.pdf', '/report_document/files-1778664344245-162061482.pdf', 'application/pdf', 122340, NULL, NULL, 1, '2026-05-13 09:25:44'),
	(99, 'files-1778664353066-227241097.pdf', 'ChatGPT.pdf', '/report_document/files-1778664353066-227241097.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-13 09:25:53'),
	(100, 'files-1778664353070-432936369.pdf', '5901f9cca66693ae4590cc226fe3f86e.pdf', '/report_document/files-1778664353070-432936369.pdf', 'application/pdf', 122340, NULL, NULL, 1, '2026-05-13 09:25:53'),
	(101, 'files-1778664393816-365499858.pdf', '5901f9cca66693ae4590cc226fe3f86e.pdf', '/report_document/files-1778664393816-365499858.pdf', 'application/pdf', 122340, NULL, NULL, 1, '2026-05-13 09:26:33'),
	(102, 'files-1778664440206-650638054.pdf', '5901f9cca66693ae4590cc226fe3f86e.pdf', '/report_document/files-1778664440206-650638054.pdf', 'application/pdf', 122340, NULL, NULL, 1, '2026-05-13 09:27:20'),
	(103, 'files-1778664469407-808596754.pdf', '5901f9cca66693ae4590cc226fe3f86e.pdf', '/report_document/files-1778664469407-808596754.pdf', 'application/pdf', 122340, NULL, NULL, 1, '2026-05-13 09:27:49'),
	(104, 'files-1778666287716-408867729.pdf', 'ChatGPT.pdf', '/report_document/files-1778666287716-408867729.pdf', 'application/pdf', 332743, NULL, NULL, 1, '2026-05-13 09:58:07'),
	(105, 'files-1778666287744-773175403.pdf', '5901f9cca66693ae4590cc226fe3f86e.pdf', '/report_document/files-1778666287744-773175403.pdf', 'application/pdf', 122340, NULL, NULL, 1, '2026-05-13 09:58:07');

-- Dumping structure for table cabsec_cms_hi.navigation_items
CREATE TABLE IF NOT EXISTS `navigation_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `is_show` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `navigation_items_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `navigation_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.navigation_items: ~32 rows (approximately)
DELETE FROM `navigation_items`;
INSERT INTO `navigation_items` (`id`, `name`, `link`, `parent_id`, `display_order`, `is_active`, `is_show`, `created_at`, `updated_at`) VALUES
	(1, 'मुखपृष्ठ', '/', NULL, 1, 1, 1, '2025-09-15 09:03:11', '2026-05-20 06:27:22'),
	(2, 'मंत्रिमण्डल सचिवालय', '', NULL, 2, 1, 1, '2025-09-15 09:03:11', '2026-05-20 06:27:52'),
	(3, 'प्रसाद', '', NULL, 5, 1, 1, '2025-09-15 09:03:11', '2026-05-20 06:27:59'),
	(4, 'दस्तावेज़', '', NULL, 3, 1, 1, '2025-09-15 09:03:11', '2026-05-20 06:28:06'),
	(5, 'मीडिया', '', NULL, 4, 1, 1, '2025-09-15 09:03:11', '2026-05-20 06:28:15'),
	(7, 'हमारे बारे में', '/cabinet-secretariat/about', 2, 0, 1, 1, '2025-09-15 09:03:11', '2026-05-20 06:28:25'),
	(10, 'रिक्तियां', '/offerings/vacancies', 3, 1, 1, 1, '2025-09-15 09:03:11', '2026-05-20 06:28:31'),
	(16, 'चित्र', '/media/photos', 5, 2, 1, 1, '2025-09-15 09:03:11', '2026-05-20 06:28:37'),
	(22, 'कनेक्ट करें', '', NULL, 6, 1, 1, '2025-09-23 10:58:51', '2026-05-20 06:28:38'),
	(32, 'हमारा संगठन', '/cabinet-secretariat/our-organization', 2, 1, 1, 1, '2025-09-24 10:06:57', '2026-05-20 06:28:54'),
	(36, 'हमारी टीम', '/cabinet-secretariat/our-team', 2, 2, 1, 1, '2025-10-17 05:50:45', '2026-05-20 06:29:15'),
	(37, 'निर्देशिका', '/connect/directory', 22, 4, 1, 1, '2025-10-22 04:59:19', '2026-05-20 06:29:09'),
	(48, 'मंत्रिमण्डल - विभाग-आवंटन', '/documents/council-of-ministers-portfolio-allocations', 4, 0, 1, 1, '2025-12-18 05:34:58', '2026-05-20 06:30:51'),
	(49, 'मंत्रिमण्डल समितियाँ - संघटन', '/documents/cabinet-committees-compositions', 4, 1, 1, 1, '2025-12-18 08:42:51', '2026-05-20 06:31:03'),
	(50, 'कारोबार के नियम', '/documents/rules-of-business', 4, 2, 1, 1, '2025-12-18 08:43:06', '2026-05-20 06:29:53'),
	(51, 'मंत्रिमंडल के नोटों पर निर्देश', '/documents/instructions-on-cabinet-notes', 4, 3, 1, 1, '2025-12-18 08:43:22', '2026-05-20 06:30:04'),
	(52, 'अन्य निर्देश और दिशानिर्देश', '/documents/other-instructions-and-guidelines', 4, 4, 1, 1, '2025-12-18 08:43:35', '2026-05-20 06:30:15'),
	(56, 'मंत्रिमंडल', '/cabinet-secretariat/council-of-ministers', 2, 3, 1, 1, '2026-04-24 06:16:55', '2026-05-20 06:30:26'),
	(57, 'मंत्रिमण्डल समितियां', '/cabinet-secretariat/cabinet-committees', 2, 4, 1, 1, '2026-04-24 06:59:11', '2026-05-20 06:31:15'),
	(58, 'कैबिनेट सचिव से भेंट', '/connect/meeting-the-cabinet-secretary', 22, 3, 1, 1, '2026-04-24 07:41:57', '2026-05-20 06:31:29'),
	(59, 'संसद के प्रश्न', '/connect/parliament-questions', 22, 2, 1, 1, '2026-04-24 07:49:13', '2026-05-20 06:31:45'),
	(60, 'हमसे संपर्क करें', '/connect/contact-us', 22, 0, 1, 1, '2026-04-24 08:55:19', '2026-05-20 06:31:55'),
	(61, 'नीतियाँ', '/policies', NULL, 0, 1, 0, '2026-04-29 09:18:13', '2026-05-20 06:32:13'),
	(62, 'उपयोग की शर्तें', '/policies/terms-of-use', 61, 0, 1, 1, '2026-04-29 09:18:33', '2026-05-20 06:32:35'),
	(63, 'गोपनीयता नीति', '/policies/privacy-policy', 61, 1, 1, 1, '2026-04-29 09:18:48', '2026-05-20 06:32:43'),
	(64, 'कॉपीराइट नीति', '/policies/copyright-policy', 61, 2, 1, 1, '2026-04-29 09:19:01', '2026-05-20 06:32:50'),
	(65, 'Bhashini Policy', '/policies/bhashini-policy', 61, 3, 1, 1, '2026-04-29 09:19:12', '2026-04-29 09:19:12'),
	(66, 'कुकी नीति', '/policies/cookie-policy', 61, 4, 1, 1, '2026-04-29 09:19:27', '2026-05-20 06:33:13'),
	(67, 'कुकी', '/cookies', NULL, 0, 1, 0, '2026-04-29 09:31:44', '2026-05-20 06:33:18'),
	(68, 'कुकी', '/cookies/cookie-setting', 67, 0, 1, 1, '2026-04-29 09:31:56', '2026-05-20 06:33:40'),
	(69, 'निविदाएँ', '/offerings/tenders', 3, 2, 1, 1, '2026-05-04 09:15:09', '2026-05-20 06:33:50'),
	(72, 'आरटीआई', '/connect/rti', 22, 1, 1, 1, '2026-05-05 05:53:32', '2026-05-20 06:34:07');

-- Dumping structure for table cabsec_cms_hi.offerings
CREATE TABLE IF NOT EXISTS `offerings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `icon` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `link_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `schemes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `vacancies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `whats_new` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`),
  CONSTRAINT `offerings_chk_1` CHECK (json_valid(`schemes`)),
  CONSTRAINT `offerings_chk_2` CHECK (json_valid(`vacancies`)),
  CONSTRAINT `offerings_chk_3` CHECK (json_valid(`whats_new`))
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.offerings: ~1 rows (approximately)
DELETE FROM `offerings`;
INSERT INTO `offerings` (`id`, `title`, `description`, `icon`, `link_url`, `category`, `display_order`, `is_active`, `created_at`, `updated_at`, `schemes`, `vacancies`, `whats_new`) VALUES
	(16, 'Complete AOB Rules', '', NULL, 'https://master-cabsec.digifootprint.gov.in/static/uploads/2025/06/22034aee4a2445812bacdeb87c1ad473.pdf', 'whats_new', 0, 1, '2026-04-23 06:14:13', '2026-04-23 06:14:13', NULL, NULL, NULL);

-- Dumping structure for table cabsec_cms_hi.our_team
CREATE TABLE IF NOT EXISTS `our_team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `designation` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photo_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone_primary` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone_secondary` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `profile_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `about_text` text COLLATE utf8mb4_general_ci,
  `office_title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `office_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `office_designation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `office_phone1` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `office_phone2` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `office_email1` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `office_email2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `office_fax` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.our_team: ~1 rows (approximately)
DELETE FROM `our_team`;
INSERT INTO `our_team` (`id`, `role`, `name`, `designation`, `photo_url`, `display_order`, `is_active`, `created_at`, `updated_at`, `email`, `phone_primary`, `phone_secondary`, `profile_url`, `about_text`, `office_title`, `office_name`, `office_designation`, `office_phone1`, `office_phone2`, `office_email1`, `office_email2`, `office_fax`) VALUES
	(4, '', 'Dr. T. V. Somanathan', 'CABINET SECRETARY', 'http://localhost:3000/images/our-team/a.jpg', 0, 1, '2026-04-23 11:55:26', '2026-05-05 09:58:23', 'cabinetsy@nic.in', '+91-11-23016696', '', '', 'CABINET SECRETARY', 'OFFICE OF CABINET SECRETARY', 'H.S. Rawat', 'Staff Officer to CS', '01123016696', '01123011241', '', '', '');

-- Dumping structure for table cabsec_cms_hi.our_team_contacts
CREATE TABLE IF NOT EXISTS `our_team_contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `person_id` int NOT NULL,
  `type` enum('phone','fax','email') COLLATE utf8mb4_general_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_contacts_person` (`person_id`),
  CONSTRAINT `fk_contacts_person` FOREIGN KEY (`person_id`) REFERENCES `our_team_people` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.our_team_contacts: ~35 rows (approximately)
DELETE FROM `our_team_contacts`;
INSERT INTO `our_team_contacts` (`id`, `person_id`, `type`, `value`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(25, 5, 'phone', '+91-11-23016696', 0, 1, '2026-04-23 11:58:21', '2026-04-23 11:58:21'),
	(26, 5, 'email', 'cabinetsy[at]nic[dot]in', 1, 1, '2026-04-23 11:58:21', '2026-04-23 11:58:21'),
	(30, 6, 'phone', ' +91-11-23016696', 0, 1, '2026-04-23 11:59:28', '2026-04-23 11:59:28'),
	(31, 6, 'phone', '+91-11-23011241', 1, 1, '2026-04-23 11:59:28', '2026-04-23 11:59:28'),
	(32, 6, 'email', 'harsh[dot]wardhan7169[at]gov[dot]in', 2, 1, '2026-04-23 11:59:28', '2026-04-23 11:59:28'),
	(33, 7, 'phone', '+91-11-23017075', 0, 1, '2026-04-23 12:00:28', '2026-04-23 12:00:28'),
	(34, 7, 'email', 'secycoord[at]gov[dot]in', 1, 1, '2026-04-23 12:00:28', '2026-04-23 12:00:28'),
	(35, 8, 'phone', ' +91-11-23016576', 0, 1, '2026-04-23 12:01:53', '2026-04-23 12:01:53'),
	(36, 8, 'email', ' kk[dot]pathak[at]nic[dot]in', 1, 1, '2026-04-23 12:01:53', '2026-04-23 12:01:53'),
	(37, 9, 'phone', ' +91-11-23012697', 0, 1, '2026-04-23 12:02:54', '2026-04-23 12:02:54'),
	(38, 9, 'email', 'satendra[dot]singhias[at]gov[dot]in', 1, 1, '2026-04-23 12:02:54', '2026-04-23 12:02:54'),
	(39, 10, 'email', ' srahul[at]ias[dot]nic[dot]in', 0, 1, '2026-04-23 12:03:25', '2026-04-23 12:03:25'),
	(40, 10, 'phone', ' +91-11-23012749', 1, 1, '2026-04-23 12:03:25', '2026-04-23 12:03:25'),
	(41, 11, 'phone', ' +91-11-23011791', 0, 1, '2026-04-23 12:31:00', '2026-04-23 12:31:00'),
	(42, 11, 'email', 'solomona[at]nic[dot]in', 1, 1, '2026-04-23 12:31:00', '2026-04-23 12:31:00'),
	(43, 12, 'phone', '+91-11-23018125', 0, 1, '2026-04-23 12:32:37', '2026-04-23 12:32:37'),
	(44, 12, 'email', 'kavita[dot]singh04[at]ias[dot]gov[dot]in', 1, 1, '2026-04-23 12:32:37', '2026-04-23 12:32:37'),
	(45, 13, 'email', ' nila[dot]mohnan[at]ias[dot]nic[dot]in', 0, 1, '2026-04-23 12:33:16', '2026-04-23 12:33:16'),
	(46, 13, 'phone', ' +91-11-23011964', 1, 1, '2026-04-23 12:33:16', '2026-04-23 12:33:16'),
	(47, 14, 'email', ' ayyaj[dot]tamboli[at]gov[dot]in', 0, 1, '2026-04-23 12:33:48', '2026-04-23 12:33:48'),
	(48, 14, 'phone', ' +91-11-23013662', 1, 1, '2026-04-23 12:33:48', '2026-04-23 12:33:48'),
	(49, 15, 'phone', ' +91-11-23792204', 0, 1, '2026-04-23 12:34:29', '2026-04-23 12:34:29'),
	(50, 15, 'email', 'anita[dot]tripathi76[at]gov[dot]in', 1, 1, '2026-04-23 12:34:29', '2026-04-23 12:34:29'),
	(71, 16, 'phone', '+91-11-23792357', 0, 1, '2026-04-23 12:38:53', '2026-04-23 12:38:53'),
	(72, 16, 'email', ' sweta[dot]mohnaty[at]ias[dot]nic[dot]in', 1, 1, '2026-04-23 12:38:53', '2026-04-23 12:38:53'),
	(73, 17, 'phone', ' +91-11-23013507', 0, 1, '2026-04-23 12:38:57', '2026-04-23 12:38:57'),
	(74, 17, 'email', ' menaka[dot]and[at]nic[dot]in', 1, 1, '2026-04-23 12:38:57', '2026-04-23 12:38:57'),
	(75, 18, 'phone', '+91-11-23018467', 0, 1, '2026-04-23 12:39:01', '2026-04-23 12:39:01'),
	(76, 18, 'email', ' ashish[dot]malhotra[at]nic[dot]in', 1, 1, '2026-04-23 12:39:01', '2026-04-23 12:39:01'),
	(77, 19, 'email', 'partha[dot]bhaskar[at]nic[dot]in', 0, 1, '2026-04-23 12:39:04', '2026-04-23 12:39:04'),
	(78, 19, 'phone', '+91-11-23788052', 1, 1, '2026-04-23 12:39:04', '2026-04-23 12:39:04'),
	(79, 20, 'email', 'mrunmai[dot]joshi[at]ias[dot]nic[dot]in', 0, 1, '2026-04-23 12:40:32', '2026-04-23 12:40:32'),
	(80, 20, 'phone', '+91-11-23016130', 1, 1, '2026-04-23 12:40:32', '2026-04-23 12:40:32'),
	(81, 21, 'phone', '+91-11-23792018', 0, 1, '2026-04-23 12:41:04', '2026-04-23 12:41:04'),
	(82, 21, 'email', 'namrata[dot]gandhi[at]nic[dot]in', 1, 1, '2026-04-23 12:41:04', '2026-04-23 12:41:04');

-- Dumping structure for table cabsec_cms_hi.our_team_people
CREATE TABLE IF NOT EXISTS `our_team_people` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `designation` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_general_ci,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_people_section` (`section_id`),
  CONSTRAINT `fk_people_section` FOREIGN KEY (`section_id`) REFERENCES `our_team_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.our_team_people: ~17 rows (approximately)
DELETE FROM `our_team_people`;
INSERT INTO `our_team_people` (`id`, `section_id`, `name`, `designation`, `address`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(5, 4, 'Dr. T.V. Somanathan', 'Cabinet Secretary', 'Seva Teerth,New Delhi - 110011', 0, 1, '2026-04-23 11:58:21', '2026-04-23 11:58:21'),
	(6, 5, 'Shri Harshwardhan Singh Rawat', 'Staff Officer', 'Seva Teerth,New Delhi - 110011', 0, 1, '2026-04-23 11:59:15', '2026-04-23 11:59:28'),
	(7, 6, 'Dr. Manoj Govil', 'Secretary (Coordination)', 'Seva Teerth,New Delhi - 110011', 0, 1, '2026-04-23 12:00:28', '2026-04-23 12:00:28'),
	(8, 7, 'Shri Keshav Kumar Pathak', 'Special Secretary', 'Seva Teerth,New Delhi - 110011', 0, 1, '2026-04-23 12:01:53', '2026-04-23 12:01:53'),
	(9, 8, 'Shri Satendra Singh', 'Additional Secretary', 'Seva Teerth,New Delhi - 110011', 0, 1, '2026-04-23 12:02:54', '2026-04-23 12:02:54'),
	(10, 8, 'Shri Rahul Sharma', 'Additional Secretary', 'Seva Teerth,New Delhi - 110011', 1, 1, '2026-04-23 12:03:25', '2026-04-23 12:03:25'),
	(11, 8, 'Shri Solomon Arokiaraj', 'Additional Secretary', 'Seva Teerth,New Delhi - 110011', 2, 1, '2026-04-23 12:31:00', '2026-04-23 12:31:00'),
	(12, 9, 'Ms. Kavita Singh', 'Joint Secretary', 'Seva Teerth,New Delhi - 110011', 0, 1, '2026-04-23 12:32:37', '2026-04-23 12:32:37'),
	(13, 9, 'Ms. Nila Mohanan', 'Joint Secretary', 'Seva Teerth,New Delhi - 110011', 1, 1, '2026-04-23 12:33:16', '2026-04-23 12:33:16'),
	(14, 9, 'Dr. Tamboli Ayyaj Fakirbhai', 'Joint Secretary', 'Seva Teerth,New Delhi - 110011', 2, 1, '2026-04-23 12:33:48', '2026-04-23 12:33:48'),
	(15, 10, 'Ms. Anita Tripathi', 'Director', 'Seva Teerth,New Delhi - 110011', 0, 1, '2026-04-23 12:34:29', '2026-04-23 12:34:29'),
	(16, 10, 'Ms. Sweta Mohanty', 'Director', 'Seva Teerth,New Delhi - 110011', 1, 1, '2026-04-23 12:35:01', '2026-04-23 12:38:53'),
	(17, 10, 'Ms. R. Menaka', 'Director', 'Seva Teerth,New Delhi - 110011', 2, 1, '2026-04-23 12:35:30', '2026-04-23 12:38:57'),
	(18, 10, 'Shri Ashish Malhotra', 'Director', 'Seva Teerth,New Delhi - 110011', 3, 1, '2026-04-23 12:36:07', '2026-04-23 12:39:01'),
	(19, 10, 'Shri Parthasarathy Bhaskar Devarakonda', 'Director', 'Seva Teerth,New Delhi - 110011', 4, 1, '2026-04-23 12:36:46', '2026-04-23 12:39:03'),
	(20, 11, 'Ms. Mrunmai S. Joshi', 'Deputy Secretary', 'Seva Teerth,New Delhi - 110011', 0, 1, '2026-04-23 12:40:32', '2026-04-23 12:40:32'),
	(21, 11, 'Ms. Namrata Gandhi', 'Deputy Secretary', 'Seva Teerth,New Delhi - 110011', 1, 1, '2026-04-23 12:41:04', '2026-04-23 12:41:04');

-- Dumping structure for table cabsec_cms_hi.our_team_sections
CREATE TABLE IF NOT EXISTS `our_team_sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.our_team_sections: ~8 rows (approximately)
DELETE FROM `our_team_sections`;
INSERT INTO `our_team_sections` (`id`, `title`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(4, ' Cabinet Secretary', 0, 1, '2026-04-23 11:57:13', '2026-04-23 11:57:13'),
	(5, 'Staff Officer to CS', 1, 1, '2026-04-23 11:58:37', '2026-04-23 11:58:37'),
	(6, 'Secretary (Coordination)', 2, 1, '2026-04-23 11:59:50', '2026-04-23 11:59:50'),
	(7, 'Special Secretary', 3, 1, '2026-04-23 12:01:11', '2026-04-23 12:01:11'),
	(8, 'Additional Secretary', 4, 1, '2026-04-23 12:02:03', '2026-04-23 12:02:03'),
	(9, 'Joint Secretary', 5, 1, '2026-04-23 12:32:00', '2026-04-23 12:32:00'),
	(10, ' Director', 6, 1, '2026-04-23 12:33:56', '2026-04-23 12:33:56'),
	(11, ' Deputy Secretary', 7, 1, '2026-04-23 12:39:26', '2026-04-23 12:39:26');

-- Dumping structure for table cabsec_cms_hi.page_headers
CREATE TABLE IF NOT EXISTS `page_headers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_path` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `background_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_path` (`page_path`),
  KEY `idx_page_headers_path` (`page_path`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.page_headers: ~4 rows (approximately)
DELETE FROM `page_headers`;
INSERT INTO `page_headers` (`id`, `page_path`, `background_url`, `created_at`, `updated_at`) VALUES
	(1, '/connect/test', 'https://www.meity.gov.in/static/uploads/2024/08/d4029ca3276dedf1e9583d9768ab0e5d.jpg', '2025-10-15 05:34:53', '2025-10-15 05:34:53'),
	(2, '/ministry/test', 'https://www.meity.gov.in/static/uploads/2024/08/73976be515cd567a6fdbfe364bff131f.jpg', '2025-10-15 05:35:25', '2025-10-15 05:35:25'),
	(3, '/ministry/test2', 'https://www.meity.gov.in/static/uploads/2024/08/d4029ca3276dedf1e9583d9768ab0e5d.jpg', '2025-10-15 05:35:54', '2025-10-15 05:35:54'),
	(4, '/related-links', 'https://master-cabsec.digifootprint.gov.in/static/uploads/2025/06/c9eb6cc608da2c0049dd9c4a8ea30f5c.jpg', '2026-05-06 11:45:57', '2026-05-06 11:45:57');

-- Dumping structure for table cabsec_cms_hi.page_templates
CREATE TABLE IF NOT EXISTS `page_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `template_key` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `schema_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `template_key` (`template_key`),
  CONSTRAINT `page_templates_chk_1` CHECK (json_valid(`schema_json`))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.page_templates: ~1 rows (approximately)
DELETE FROM `page_templates`;
INSERT INTO `page_templates` (`id`, `name`, `template_key`, `description`, `schema_json`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, 'Hero + Tabs', 'hero_tabs', 'Hero section at top with image/title/subtitle and tabbed content sections', '{"fields": [{"key": "hero_title", "label": "Hero Title", "type": "text", "required": true}, {"key": "hero_subtitle", "label": "Hero Subtitle", "type": "text", "required": false}, {"key": "hero_image_url", "label": "Hero Image URL", "type": "image", "required": false}, {"key": "tabs", "label": "Tabs", "type": "array", "itemSchema": {"fields": [{"key": "label", "label": "Tab Label", "type": "text", "required": true}, {"key": "content", "label": "Content HTML", "type": "richtext", "required": false}]}}]}', 1, '2025-11-07 08:37:25', '2025-11-07 08:37:25');

-- Dumping structure for table cabsec_cms_hi.pages
CREATE TABLE IF NOT EXISTS `pages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `parent_id` int DEFAULT NULL,
  `hero_title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hero_subtitle` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hero_image_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tabs_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `content_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `navigation_item_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  KEY `idx_navigation_item_id` (`navigation_item_id`),
  CONSTRAINT `fk_pages_navigation` FOREIGN KEY (`navigation_item_id`) REFERENCES `navigation_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pages_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `pages` (`id`) ON DELETE SET NULL,
  CONSTRAINT `pages_chk_1` CHECK (json_valid(`tabs_json`)),
  CONSTRAINT `pages_chk_2` CHECK (json_valid(`content_json`))
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.pages: ~14 rows (approximately)
DELETE FROM `pages`;
INSERT INTO `pages` (`id`, `title`, `slug`, `parent_id`, `hero_title`, `hero_subtitle`, `hero_image_url`, `tabs_json`, `content_json`, `display_order`, `is_active`, `created_at`, `updated_at`, `navigation_item_id`) VALUES
	(11, 'Our Organisation', '/cabinet-secretariat/our-organization', NULL, NULL, NULL, NULL, NULL, '{"html":"<!-- TOOLBAR -->\\r\\n<div class=\\"toolbar\\">\\r\\n\\r\\n  <!-- Search -->\\r\\n  <div class=\\"search-box\\">\\r\\n    <svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\">\\r\\n      <circle cx=\\"7\\" cy=\\"7\\" r=\\"5.5\\" stroke=\\"#9ca3af\\" stroke-width=\\"1.4\\" />\\r\\n      <path d=\\"M11 11l3 3\\" stroke=\\"#9ca3af\\" stroke-width=\\"1.4\\" stroke-linecap=\\"round\\" />\\r\\n    </svg>\\r\\n    <input type=\\"text\\" placeholder=\\"Search...\\" id=\\"searchInput\\" oninput=\\"filterCards()\\">\\r\\n  </div>\\r\\n\\r\\n  <!-- Right controls -->\\r\\n  <div class=\\"toolbar-right\\">\\r\\n\\r\\n    <!-- Category -->\\r\\n    <div class=\\"select-wrap\\">\\r\\n      <div class=\\"select-icon\\">\\r\\n        <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n          <path d=\\"M1 3h12M3 7h8M5 11h4\\" stroke=\\"#6b7280\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\" />\\r\\n        </svg>\\r\\n      </div>\\r\\n      <select>\\r\\n        <option>Category</option>\\r\\n        <option>Grievances</option>\\r\\n        <option>Scientific</option>\\r\\n        <option>Welfare</option>\\r\\n      </select>\\r\\n    </div>\\r\\n\\r\\n    <!-- Per page -->\\r\\n    <div class=\\"perpage-wrap\\">\\r\\n      <div class=\\"perpage-icon\\">\\r\\n        <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n          <rect x=\\"1\\" y=\\"1\\" width=\\"5\\" height=\\"5\\" rx=\\"1\\" stroke=\\"#6b7280\\" stroke-width=\\"1.2\\" />\\r\\n          <rect x=\\"8\\" y=\\"1\\" width=\\"5\\" height=\\"5\\" rx=\\"1\\" stroke=\\"#6b7280\\" stroke-width=\\"1.2\\" />\\r\\n          <rect x=\\"1\\" y=\\"8\\" width=\\"5\\" height=\\"5\\" rx=\\"1\\" stroke=\\"#6b7280\\" stroke-width=\\"1.2\\" />\\r\\n          <rect x=\\"8\\" y=\\"8\\" width=\\"5\\" height=\\"5\\" rx=\\"1\\" stroke=\\"#6b7280\\" stroke-width=\\"1.2\\" />\\r\\n        </svg>\\r\\n      </div>\\r\\n      <select>\\r\\n        <option>10 per page</option>\\r\\n        <option>20 per page</option>\\r\\n        <option>50 per page</option>\\r\\n      </select>\\r\\n    </div>\\r\\n\\r\\n  </div>\\r\\n</div>\\r\\n\\r\\n<!-- GRID -->\\r\\n<div class=\\"grid-wrap\\">\\r\\n  <div class=\\"cards-grid\\" id=\\"cardsGrid\\">\\r\\n\\r\\n    <!-- Card 1 -->\\r\\n    <div class=\\"org-card\\" data-title=\\"Directorate of Public Grievances\\">\\r\\n      <div class=\\"card-top\\">\\r\\n        <a class=\\"card-title\\">Directorate of Public Grievances</a>\\r\\n        <div class=\\"card-logo\\">\\r\\n          <div class=\\"emblem-placeholder\\">\\r\\n            <img src=\\"https://master-cabsec.digifootprint.gov.in/static/uploads/2025/06/0cbca02ed58db79ed162f0fb92649d4f.png\\">\\r\\n          </div>\\r\\n        </div>\\r\\n      </div>\\r\\n      <div class=\\"card-desc\\">\\r\\n        The Directorate of Public Grievances was set up in the Cabinet Secretariat in March, 1988. Grievances can be\\r\\n        filed either online or through post/drop-box with the Directorate of Public Grievance in respect of select\\r\\n        Ministries/Departments/Organizations which have extensive public interface such as M...\\r\\n      </div>\\r\\n      <div class=\\"card-footer\\">\\r\\n        <a class=\\"btn-external\\" href=\\"https://dpg.gov.in/default.aspx\\" title=\\"Open\\">\\r\\n          <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n            <path d=\\"M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"\\r\\n              stroke-linecap=\\"round\\" />\\r\\n            <path d=\\"M9 1h4v4M13 1L7 7\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"\\r\\n              stroke-linejoin=\\"round\\" />\\r\\n          </svg>\\r\\n        </a>\\r\\n      </div>\\r\\n    </div>\\r\\n\\r\\n    <!-- Card 2 -->\\r\\n    <div class=\\"org-card\\" data-title=\\"National Authority Chemical Weapons Convention (NACWC)\\">\\r\\n      <div class=\\"card-top\\">\\r\\n        <a class=\\"card-title\\">National Authority Chemical Weapons Convention (NACWC)</a>\\r\\n        <div class=\\"card-logo\\">\\r\\n          <div class=\\"emblem-placeholder\\">\\r\\n            <img src=\\"https://master-cabsec.digifootprint.gov.in/static/uploads/2025/06/0cbca02ed58db79ed162f0fb92649d4f.png\\">\\r\\n          </div>\\r\\n        </div>\\r\\n      </div>\\r\\n      <div class=\\"card-desc\\">\\r\\n        The National Authority Chemical Weapons Convention was constituted by the Cabinet Secretariat on 5th May, 1997.\\r\\n        The Chemical Weapons Convention Act, 2000 (the Act), was enacted and came into force on 1st July, 2005. The\\r\\n        Authority was established and notified under the CWC Act, 2000 on 13th June 2005...\\r\\n      </div>\\r\\n      <div class=\\"card-footer\\">\\r\\n        <a class=\\"btn-external\\" href=\\"https://nacwc.gov.in/\\" title=\\"Open\\">\\r\\n          <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n            <path d=\\"M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"\\r\\n              stroke-linecap=\\"round\\" />\\r\\n            <path d=\\"M9 1h4v4M13 1L7 7\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"\\r\\n              stroke-linejoin=\\"round\\" />\\r\\n          </svg>\\r\\n        </a>\\r\\n      </div>\\r\\n    </div>\\r\\n\\r\\n    <!-- Card 3 -->\\r\\n    <div class=\\"org-card\\" data-title=\\"Office of the Principal Scientific Adviser (O/o PSA)\\">\\r\\n      <div class=\\"card-top\\">\\r\\n        <a class=\\"card-title\\">Office of the Principal Scientific Adviser (O/o PSA)</a>\\r\\n        <div class=\\"card-logo\\">\\r\\n          <div class=\\"emblem-placeholder\\">\\r\\n            <img src=\\"https://master-cabsec.digifootprint.gov.in/static/uploads/2025/06/0cbca02ed58db79ed162f0fb92649d4f.png\\">\\r\\n          </div>\\r\\n        </div>\\r\\n      </div>\\r\\n      <div class=\\"card-desc\\">\\r\\n        The Government of India established the Office of the Principal Scientific Adviser (PSA) in November 1999. The\\r\\n        PSA\'s office aims to provide pragmatic and objective advice to the Prime Minister and the cabinet in matters of\\r\\n        Science and Technology. The Office of PSA was placed under the Cabinet Secret...\\r\\n      </div>\\r\\n      <div class=\\"card-footer\\">\\r\\n        <a class=\\"btn-external\\" href=\\"https://www.psa.gov.in/\\" title=\\"Open\\">\\r\\n          <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n            <path d=\\"M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"\\r\\n              stroke-linecap=\\"round\\" />\\r\\n            <path d=\\"M9 1h4v4M13 1L7 7\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"\\r\\n              stroke-linejoin=\\"round\\" />\\r\\n          </svg>\\r\\n        </a>\\r\\n      </div>\\r\\n    </div>\\r\\n\\r\\n    <!-- Card 4 -->\\r\\n    <div class=\\"org-card\\" data-title=\\"Direct Benefit Transfer (DBT)\\">\\r\\n      <div class=\\"card-top\\">\\r\\n        <a class=\\"card-title\\">Direct Benefit Transfer (DBT)</a>\\r\\n        <div class=\\"card-logo\\">\\r\\n          <div class=\\"emblem-placeholder\\"\\r\\n            style=\\"background:#fff3e0; border-radius:4px; width:100%; height:100%; margin:0; padding:4px;\\">\\r\\n            <img src=\\"https://master-cabsec.digifootprint.gov.in/static/uploads/2025/06/0cbca02ed58db79ed162f0fb92649d4f.png\\">\\r\\n          </div>\\r\\n        </div>\\r\\n      </div>\\r\\n      <div class=\\"card-desc\\">\\r\\n        DBT is a major reform initiative where benefits, cash or in kind, are delivered directly to targeted\\r\\n        beneficiaries using Aadhaar. It envisages efficiency and inclusion in the delivery processes leading to greater\\r\\n        accountability and transparency in the system. DBT Mission was created in the Planni...\\r\\n      </div>\\r\\n      <div class=\\"card-footer\\">\\r\\n        <a class=\\"btn-external\\" href=\\"https://dbtbharat.gov.in/\\" title=\\"Open\\">\\r\\n          <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n            <path d=\\"M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"\\r\\n              stroke-linecap=\\"round\\" />\\r\\n            <path d=\\"M9 1h4v4M13 1L7 7\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"\\r\\n              stroke-linejoin=\\"round\\" />\\r\\n          </svg>\\r\\n        </a>\\r\\n      </div>\\r\\n    </div>\\r\\n\\r\\n  </div>\\r\\n</div>","css":"/* â”€â”€ TOOLBAR â”€â”€ */\\r\\n.toolbar {\\r\\n  display: flex;\\r\\n  align-items: center;\\r\\n  justify-content: space-between;\\r\\n  padding: 20px 40px;\\r\\n  gap: 16px;\\r\\n  margin-top: 2%;\\r\\n}\\r\\n\\r\\n.search-box {\\r\\n  display: flex;\\r\\n  align-items: center;\\r\\n  gap: 10px;\\r\\n  border: 1.5px solid #d1d5db;\\r\\n  border-radius: 6px;\\r\\n  padding: 9px 16px;\\r\\n  width: 320px;\\r\\n  background: #fff;\\r\\n}\\r\\n\\r\\n.search-box svg {\\r\\n  flex-shrink: 0;\\r\\n  color: #9ca3af;\\r\\n}\\r\\n\\r\\n.search-box input {\\r\\n  border: none;\\r\\n  outline: none;\\r\\n  font-size: 0.9rem;\\r\\n  color: #374151;\\r\\n  width: 100%;\\r\\n  background: transparent;\\r\\n}\\r\\n\\r\\n.search-box input::placeholder {\\r\\n  color: #9ca3af;\\r\\n}\\r\\n\\r\\n.toolbar-right {\\r\\n  display: flex;\\r\\n  align-items: center;\\r\\n  gap: 12px;\\r\\n}\\r\\n\\r\\n.select-wrap {\\r\\n  display: flex;\\r\\n  align-items: center;\\r\\n  border: 1.5px solid #d1d5db;\\r\\n  border-radius: 6px;\\r\\n  overflow: hidden;\\r\\n  background: #fff;\\r\\n}\\r\\n\\r\\n.select-icon {\\r\\n  padding: 9px 12px;\\r\\n  border-right: 1px solid #e5e7eb;\\r\\n  display: flex;\\r\\n  align-items: center;\\r\\n}\\r\\n\\r\\n.select-wrap select {\\r\\n  border: none;\\r\\n  outline: none;\\r\\n  padding: 9px 32px 9px 12px;\\r\\n  font-size: 0.88rem;\\r\\n  color: #374151;\\r\\n  background: transparent;\\r\\n  appearance: none;\\r\\n  cursor: pointer;\\r\\n  min-width: 130px;\\r\\n}\\r\\n\\r\\n.perpage-wrap {\\r\\n  display: flex;\\r\\n  align-items: center;\\r\\n  border: 1.5px solid #d1d5db;\\r\\n  border-radius: 6px;\\r\\n  overflow: hidden;\\r\\n  background: #fff;\\r\\n}\\r\\n\\r\\n.perpage-icon {\\r\\n  padding: 9px 12px;\\r\\n  border-right: 1px solid #e5e7eb;\\r\\n  display: flex;\\r\\n  align-items: center;\\r\\n}\\r\\n\\r\\n.perpage-wrap select {\\r\\n  border: none;\\r\\n  outline: none;\\r\\n  padding: 9px 32px 9px 12px;\\r\\n  font-size: 0.88rem;\\r\\n  color: #374151;\\r\\n  background: transparent;\\r\\n  appearance: none;\\r\\n  cursor: pointer;\\r\\n}\\r\\n\\r\\n/* â”€â”€ GRID â”€â”€ */\\r\\n.grid-wrap {\\r\\n  padding: 0 40px 60px;\\r\\n}\\r\\n\\r\\n.cards-grid {\\r\\n  display: grid;\\r\\n  grid-template-columns: repeat(2, 1fr);\\r\\n  gap: 20px;\\r\\n}\\r\\n\\r\\n/* â”€â”€ CARD â”€â”€ */\\r\\n.org-card {\\r\\n  border: 1.5px solid #e5e7eb;\\r\\n  border-radius: 8px;\\r\\n  overflow: hidden;\\r\\n  display: flex;\\r\\n  flex-direction: column;\\r\\n  background: #fff;\\r\\n}\\r\\n\\r\\n.card-top {\\r\\n  display: flex;\\r\\n  justify-content: space-between;\\r\\n  align-items: flex-start;\\r\\n  padding: 20px 20px 0;\\r\\n  gap: 12px;\\r\\n}\\r\\n\\r\\n.card-title {\\r\\n  flex: 1;\\r\\n  text-decoration: none;\\r\\n  cursor: pointer;\\r\\n  font-size: 20px;\\r\\n  font-style: normal;\\r\\n  font-weight: 500;\\r\\n  font-family: \\"Noto Sans\\", sans-serif;\\r\\n  color: rgb(33, 74, 171);\\r\\n  background-color: transparent;\\r\\n}\\r\\n\\r\\n.card-title:hover {\\r\\n  text-decoration: underline;\\r\\n}\\r\\n\\r\\n.card-logo {\\r\\n  width: 100px;\\r\\n  height: 68px;\\r\\n  border-radius: 4px;\\r\\n  display: flex;\\r\\n  align-items: center;\\r\\n  justify-content: center;\\r\\n  flex-shrink: 0;\\r\\n  overflow: hidden;\\r\\n}\\r\\n\\r\\n.card-logo img {\\r\\n  width: 100%;\\r\\n  height: 100%;\\r\\n  object-fit: cover;\\r\\n}\\r\\n\\r\\n/* Ashoka emblem SVG placeholder */\\r\\n.emblem-placeholder {\\r\\n  display: flex;\\r\\n  flex-direction: column;\\r\\n  align-items: center;\\r\\n  justify-content: center;\\r\\n  gap: 4px;\\r\\n}\\r\\n\\r\\n\\r\\n.card-desc {\\r\\n  padding: 14px 20px 16px;\\r\\n  line-height: 1.7;\\r\\n  flex: 1;\\r\\n  font-size: 16px;\\r\\n  font-style: normal;\\r\\n  font-weight: 400;\\r\\n  font-family: \\"Noto Sans\\", sans-serif;\\r\\n  color: rgb(21, 2, 2);\\r\\n  background-color: transparent;\\r\\n}\\r\\n\\r\\n.card-footer {\\r\\n  padding: 0 20px 16px;\\r\\n  display: flex;\\r\\n  justify-content: flex-end;\\r\\n}\\r\\n\\r\\n.btn-external {\\r\\n  width: 34px;\\r\\n  height: 34px;\\r\\n  background: #dbeafe;\\r\\n  border: none;\\r\\n  border-radius: 6px;\\r\\n  display: flex;\\r\\n  align-items: center;\\r\\n  justify-content: center;\\r\\n  cursor: pointer;\\r\\n  transition: background 0.15s;\\r\\n  color: #1a3f7a;\\r\\n  text-decoration: none;\\r\\n}\\r\\n\\r\\n.btn-external:hover {\\r\\n  background: #bfdbfe;\\r\\n}\\r\\n\\r\\n/* â”€â”€ RESPONSIVE â”€â”€ */\\r\\n@media (max-width: 700px) {\\r\\n  .toolbar {\\r\\n    flex-direction: column;\\r\\n    align-items: stretch;\\r\\n    padding: 16px 16px;\\r\\n  }\\r\\n\\r\\n  .search-box {\\r\\n    width: 100%;\\r\\n  }\\r\\n\\r\\n  .grid-wrap {\\r\\n    padding: 0 16px 40px;\\r\\n  }\\r\\n\\r\\n  .cards-grid {\\r\\n    grid-template-columns: 1fr;\\r\\n  }\\r\\n}","js":"function filterCards() {\\r\\n  const q = document.getElementById(\'searchInput\').value.toLowerCase();\\r\\n  document.querySelectorAll(\'.org-card\').forEach(card => {\\r\\n    const title = card.getAttribute(\'data-title\').toLowerCase();\\r\\n    const desc = card.querySelector(\'.card-desc\').textContent.toLowerCase();\\r\\n    card.style.display = (title.includes(q) || desc.includes(q)) ? \'\' : \'none\';\\r\\n  });\\r\\n}"}', 0, 1, '2025-11-17 06:02:13', '2026-05-13 06:08:01', NULL),
	(15, 'List of council of ministers with portfolios', '/cabinet-secretariat/council-of-ministers', NULL, NULL, NULL, NULL, NULL, '{"html":"\\r\\n<div class=\\"title\\">LIST OF COUNCIL OF MINISTERS WITH PORTFOLIOS</div>\\r\\n<div class=\\"subtitle\\">(Sworn in on 09.06.2024)</div>\\r\\n\\r\\n<table>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name pm\\">Shri Narendra Modi</td>\\r\\n    <td>\\r\\n        Prime Minister and also in-charge of: Ministry of Personnel, Public Grievances and Pensions; \\r\\n        Department of Atomic Energy; Department of Space; All important policy issues; and All other portfolios not allocated to any Minister.\\r\\n    </td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td colspan=\\"2\\" class=\\"section\\">CABINET MINISTERS</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">1. Shri Raj Nath Singh</td>\\r\\n    <td>Minister of Defence.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">2. Shri Amit Shah</td>\\r\\n    <td>Minister of Home Affairs; and Minister of Cooperation.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">3. Shri Nitin Jairam Gadkari</td>\\r\\n    <td>Minister of Road Transport and Highways.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">4. Shri Jagat Prakash Nadda</td>\\r\\n    <td>Minister of Health and Family Welfare; and Minister of Chemicals and Fertilizers.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">5. Shri Shivraj Singh Chouhan</td>\\r\\n    <td>Minister of Agriculture and Farmers Welfare; and Minister of Rural Development.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">6. Smt. Nirmala Sitharaman</td>\\r\\n    <td>Minister of Finance; and Minister of Corporate Affairs.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">7. Dr. Subrahmanyam Jaishankar</td>\\r\\n    <td>Minister of External Affairs.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">8. Shri Manohar Lal</td>\\r\\n    <td>Minister of Housing and Urban Affairs; and Minister of Power.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">9. Shri H. D. Kumaraswamy</td>\\r\\n    <td>Minister of Heavy Industries; and Minister of Steel.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">10. Shri Piyush Goyal</td>\\r\\n    <td>Minister of Commerce and Industry.</td>\\r\\n</tr>\\r\\n\\r\\n\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">11. Shri Dharmendra Pradhan</td>\\r\\n    <td>Minister of Education.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">12. Shri Jitan Ram Manjhi</td>\\r\\n    <td>Minister of Micro, Small and Medium Enterprises.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">13. Shri Rajiv Ranjan Singh alias Lalan Singh</td>\\r\\n    <td>Minister of Panchayati Raj; and Minister of Fisheries, Animal Husbandry and Dairying.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">14. Shri Sarbananda Sonowal</td>\\r\\n    <td>Minister of Ports, Shipping and Waterways.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">15. Dr. Virendra Kumar</td>\\r\\n    <td>Minister of Social Justice and Empowerment.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">16. Shri Kinjarapu Ram Mohan Naidu</td>\\r\\n    <td>Minister of Civil Aviation.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">17. Shri Pralhad Joshi</td>\\r\\n    <td>Minister of Consumer Affairs, Food and Public Distribution; and Minister of New and Renewable Energy.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">18. Shri Jual Oram</td>\\r\\n    <td>Minister of Tribal Affairs.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">19. Shri Giriraj Singh</td>\\r\\n    <td>Minister of Textiles.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">20. Shri Ashwini Vaishnaw</td>\\r\\n    <td>Minister of Railways; Minister of Information and Broadcasting; and Minister of Electronics and Information Technology.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">21. Shri Jyotiraditya M. Scindia</td>\\r\\n    <td>Minister of Communications; and Minister of Development of North Eastern Region.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">22. Shri Bhupender Yadav</td>\\r\\n    <td>Minister of Environment, Forest and Climate Change.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">23. Shri Gajendra Singh Shekhawat</td>\\r\\n    <td>Minister of Culture; and Minister of Tourism.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">24. Smt. Annapurna Devi</td>\\r\\n    <td>Minister of Women and Child Development.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">25. Shri Kiren Rijiju</td>\\r\\n    <td>Minister of Parliamentary Affairs; and Minister of Minority Affairs.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">26. Shri Hardeep Singh Puri</td>\\r\\n    <td>Minister of Petroleum and Natural Gas.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">27. Dr. Mansukh Mandaviya</td>\\r\\n    <td>Minister of Labour and Employment; and Minister of Youth Affairs and Sports.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">28. Shri G. Kishan Reddy</td>\\r\\n    <td>Minister of Coal; and Minister of Mines.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">29. Shri Chirag Paswan</td>\\r\\n    <td>Minister of Food Processing Industries.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">30. Shri C. R. Patil</td>\\r\\n    <td>Minister of Jal Shakti.</td>\\r\\n</tr>\\r\\n\\r\\n\\r\\n\\r\\n<tr>\\r\\n    <td colspan=\\"2\\" class=\\"section\\">MINISTERS OF STATE (INDEPENDENT CHARGE)</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">1. Rao Inderjit Singh</td>\\r\\n    <td>\\r\\n        Minister of State (Independent Charge) of the Ministry of Statistics and Programme Implementation; \\r\\n        Minister of State (Independent Charge) of the Ministry of Planning; and Minister of State in the Ministry of Culture.\\r\\n    </td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">2. Dr. Jitendra Singh</td>\\r\\n    <td>\\r\\n        Minister of State (Independent Charge) of the Ministry of Science and Technology; \\r\\n        Minister of State (Independent Charge) of the Ministry of Earth Sciences; \\r\\n        Minister of State in the Prime Ministerâ€™s Office.\\r\\n    </td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">3. Shri Arjun Ram Meghwal</td>\\r\\n    <td>\\r\\n        Minister of State (Independent Charge) of the Ministry of Law and Justice; \\r\\n        and Minister of State in the Ministry of Parliamentary Affairs.\\r\\n    </td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">4. Shri Prataprao Jadhav</td>\\r\\n    <td>\\r\\n        Minister of State (Independent Charge) of the Ministry of Ayush; \\r\\n        and Minister of State in the Ministry of Health and Family Welfare.\\r\\n    </td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">5. Shri Jayant Chaudhary</td>\\r\\n    <td>\\r\\n        Minister of State (Independent Charge) of the Ministry of Skill Development and Entrepreneurship; \\r\\n        and Minister of State in the Ministry of Education.\\r\\n    </td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td colspan=\\"2\\" class=\\"section\\">MINISTERS OF STATE</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">1. Shri Jitin Prasada</td>\\r\\n    <td>\\r\\n        Minister of State in the Ministry of Commerce and Industry; \\r\\n        and Minister of State in the Ministry of Electronics and Information Technology.\\r\\n    </td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">2. Shri Shripad Yesso Naik</td>\\r\\n    <td>\\r\\n        Minister of State in the Ministry of Power; \\r\\n        and Minister of State in the Ministry of New and Renewable Energy.\\r\\n    </td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">3. Shri Pankaj Chaudhary</td>\\r\\n    <td>\\r\\n        Minister of State in the Ministry of Finance.\\r\\n    </td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">4. Shri Krishan Pal</td>\\r\\n    <td>\\r\\n        Minister of State in the Ministry of Cooperation.\\r\\n    </td>\\r\\n</tr>\\r\\n\\r\\n</table>\\r\\n\\r\\n<p class=\\"note\\">Note: Incorporates change in the name of the Minister of State (Independent Charge) at S.No. 4 (as on 02.07.2024).</p>","css":"/* Title */\\r\\n.title {\\r\\n    margin-top: 5%;\\r\\n    text-align: center;\\r\\n    font-size: 16px;\\r\\n    font-weight: 700;\\r\\n}\\r\\n\\r\\n.subtitle {\\r\\n    text-align: center;\\r\\n    margin: 5px 0 15px;\\r\\n    font-size: 16px;\\r\\n    font-weight: 700;\\r\\n}\\r\\n\\r\\n/* Table styling */\\r\\ntable {\\r\\n    width: 100%;\\r\\n    border-collapse: collapse;\\r\\n    font-size: 14px;\\r\\n}\\r\\n\\r\\ntd,\\r\\nth {\\r\\n    border: 1px solid #000;\\r\\n    padding: 6px 8px;\\r\\n    vertical-align: top;\\r\\n}\\r\\n\\r\\n/* Section headers */\\r\\n.section {\\r\\n    text-align: center;\\r\\n    font-weight: bold;\\r\\n    background: #f0f0f0;\\r\\n}\\r\\n\\r\\n/* Name column */\\r\\n.name {\\r\\n    white-space: nowrap;\\r\\n    font-size: 16px;\\r\\n    font-style: normal;\\r\\n    font-weight: 400;\\r\\n}\\r\\n\\r\\ntd {\\r\\n    font-size: 16px;\\r\\n    font-style: normal;\\r\\n    font-weight: 400;\\r\\n}\\r\\n\\r\\n.note{\\r\\n    font-style: italic;\\r\\n}","js":""}', 0, 1, '2026-04-23 12:47:04', '2026-05-07 09:12:11', NULL),
	(16, 'Cabinet Committees', '/cabinet-secretariat/cabinet-committees', NULL, NULL, NULL, NULL, NULL, '{"html":"<div class=\\"title\\">COMPOSITION OF THE CABINET COMMITTEES</div>\\r\\n<div class=\\"subtitle\\">(As on 03.07.2024)</div>\\r\\n\\r\\n<!-- 1 -->\\r\\n<div class=\\"section-heading\\">1. Appointments Committee of the Cabinet</div>\\r\\n<table>\\r\\n<tr>\\r\\n    <td colspan=\\"2\\" class=\\"section\\">Composition</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">1.</td>\\r\\n    <td>Prime Minister.</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">2.</td>\\r\\n    <td>Shri Amit Shah, Minister of Home Affairs; and Minister of Cooperation.</td>\\r\\n</tr>\\r\\n</table>\\r\\n\\r\\n<!-- 2 -->\\r\\n<div class=\\"section-heading\\">2. Cabinet Committee on Accommodation</div>\\r\\n<table>\\r\\n<tr>\\r\\n    <td colspan=\\"2\\" class=\\"section\\">Composition</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">1.</td>\\r\\n    <td>Shri Amit Shah, Minister of Home Affairs; and Minister of Cooperation.</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">2.</td>\\r\\n    <td>Shri Nitin Jairam Gadkari, Minister of Road Transport and Highways.</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">3.</td>\\r\\n    <td>Smt. Nirmala Sitharaman, Minister of Finance; and Minister of Corporate Affairs.</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">4.</td>\\r\\n    <td>Shri Manohar Lal, Minister of Housing and Urban Affairs; and Minister of Power.</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">5.</td>\\r\\n    <td>Shri Piyush Goyal, Minister of Commerce and Industry.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td colspan=\\"2\\" class=\\"section\\">Special Invitee</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td colspan=\\"2\\">\\r\\n        Dr. Jitendra Singh, Minister of State (Independent Charge) of the Ministry of Science and Technology; \\r\\n        Minister of State (Independent Charge) of the Ministry of Earth Sciences; \\r\\n        Minister of State in the Prime Minister\'s Office; \\r\\n        Minister of State in the Ministry of Personnel, Public Grievances and Pensions; \\r\\n        Minister of State in the Department of Atomic Energy; \\r\\n        and Minister of State in the Department of Space.\\r\\n    </td>\\r\\n</tr>\\r\\n</table>\\r\\n\\r\\n<!-- 3 -->\\r\\n<div class=\\"section-heading\\">3. Cabinet Committee on Economic Affairs</div>\\r\\n<table>\\r\\n<tr>\\r\\n    <td colspan=\\"2\\" class=\\"section\\">Composition</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">1.</td>\\r\\n    <td>Prime Minister.</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">2.</td>\\r\\n    <td>Shri Raj Nath Singh, Minister of Defence.</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">3.</td>\\r\\n    <td>Shri Amit Shah, Minister of Home Affairs; and Minister of Cooperation.</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">4.</td>\\r\\n    <td>Shri Nitin Jairam Gadkari, Minister of Road Transport and Highways.</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">5.</td>\\r\\n    <td>Shri Shivraj Singh Chouhan, Minister of Agriculture and Farmers Welfare; and Minister of Rural Development.</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">6.</td>\\r\\n    <td>Smt. Nirmala Sitharaman, Minister of Finance; and Minister of Corporate Affairs.</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">7.</td>\\r\\n    <td>Dr. Subrahmanyam Jaishankar, Minister of External Affairs.</td>\\r\\n</tr>\\r\\n\\r\\n<tr>\\r\\n    <td class=\\"name\\">8.</td>\\r\\n    <td>Shri H. D. Kumaraswamy, Minister of Heavy Industries; and Minister of Steel.</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">9.</td>\\r\\n    <td>Shri Piyush Goyal, Minister of Commerce and Industry.</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">10.</td>\\r\\n    <td>Shri Dharmendra Pradhan, Minister of Education.</td>\\r\\n</tr>\\r\\n<tr>\\r\\n    <td class=\\"name\\">11.</td>\\r\\n    <td>Shri Rajiv Ranjan Singh alias Lalan Singh, Minister of Panchayati Raj; and Minister of Fisheries, Animal Husbandry and Dairying.</td>\\r\\n</tr>\\r\\n</table>\\r\\n\\r\\n<!-- 4 -->\\r\\n<div class=\\"section-heading\\">4. Cabinet Committee on Parliamentary Affairs</div>\\r\\n<table>\\r\\n<tr><td colspan=\\"2\\" class=\\"section\\">Composition</td></tr>\\r\\n\\r\\n<tr><td class=\\"name\\">1.</td><td>Shri Raj Nath Singh, Minister of Defence.</td></tr>\\r\\n<tr><td class=\\"name\\">2.</td><td>Shri Amit Shah, Minister of Home Affairs; and Minister of Cooperation.</td></tr>\\r\\n<tr><td class=\\"name\\">3.</td><td>Shri Jagat Prakash Nadda, Minister of Health and Family Welfare; and Minister of Chemicals and Fertilizers.</td></tr>\\r\\n<tr><td class=\\"name\\">4.</td><td>Smt. Nirmala Sitharaman, Minister of Finance; and Minister of Corporate Affairs.</td></tr>\\r\\n<tr><td class=\\"name\\">5.</td><td>Shri Rajiv Ranjan Singh alias Lalan Singh, Minister of Panchayati Raj; and Minister of Fisheries, Animal Husbandry and Dairying.</td></tr>\\r\\n<tr><td class=\\"name\\">6.</td><td>Dr. Virendra Kumar, Minister of Social Justice and Empowerment.</td></tr>\\r\\n<tr><td class=\\"name\\">7.</td><td>Shri Kinjarapu Rammohan Naidu, Minister of Civil Aviation.</td></tr>\\r\\n<tr><td class=\\"name\\">8.</td><td>Shri Jual Oram, Minister of Tribal Affairs.</td></tr>\\r\\n<tr><td class=\\"name\\">9.</td><td>Shri Kiren Rijiju, Minister of Parliamentary Affairs; and Minister of Minority Affairs.</td></tr>\\r\\n<tr><td class=\\"name\\">10.</td><td>Shri C R Patil, Minister of Jal Shakti.</td></tr>\\r\\n\\r\\n<tr><td colspan=\\"2\\" class=\\"section\\">Special Invitees</td></tr>\\r\\n<tr>\\r\\n<td colspan=\\"2\\">\\r\\nShri Arjun Ram Meghwal, Minister of State (Independent Charge) of the Ministry of Law and Justice; and Minister of State in the Ministry of Parliamentary Affairs.<br>\\r\\nDr. L. Murugan, Minister of State in the Ministry of Information and Broadcasting; and Minister of State in the Ministry of Parliamentary Affairs.\\r\\n</td>\\r\\n</tr>\\r\\n</table>\\r\\n\\r\\n<!-- 5 -->\\r\\n<div class=\\"section-heading\\">5. Cabinet Committee on Political Affairs</div>\\r\\n<table>\\r\\n<tr><td colspan=\\"2\\" class=\\"section\\">Composition</td></tr>\\r\\n\\r\\n<tr><td class=\\"name\\">1.</td><td>Prime Minister.</td></tr>\\r\\n<tr><td class=\\"name\\">2.</td><td>Shri Raj Nath Singh, Minister of Defence.</td></tr>\\r\\n<tr><td class=\\"name\\">3.</td><td>Shri Amit Shah, Minister of Home Affairs; and Minister of Cooperation.</td></tr>\\r\\n<tr><td class=\\"name\\">4.</td><td>Shri Nitin Jairam Gadkari, Minister of Road Transport and Highways.</td></tr>\\r\\n<tr><td class=\\"name\\">5.</td><td>Shri Jagat Prakash Nadda, Minister of Health and Family Welfare; and Minister of Chemicals and Fertilizers.</td></tr>\\r\\n<tr><td class=\\"name\\">6.</td><td>Smt. Nirmala Sitharaman, Minister of Finance; and Minister of Corporate Affairs.</td></tr>\\r\\n<tr><td class=\\"name\\">7.</td><td>Shri Piyush Goyal, Minister of Commerce and Industry.</td></tr>\\r\\n<tr><td class=\\"name\\">8.</td><td>Shri Jitan Ram Manjhi, Minister of Micro, Small and Medium Enterprises.</td></tr>\\r\\n<tr><td class=\\"name\\">9.</td><td>Shri Sarbananda Sonowal, Minister of Ports, Shipping and Waterways.</td></tr>\\r\\n<tr><td class=\\"name\\">10.</td><td>Shri Kinjarapu Rammohan Naidu, Minister of Civil Aviation.</td></tr>\\r\\n<tr><td class=\\"name\\">11.</td><td>Shri Bhupender Yadav, Minister of Environment, Forest and Climate Change.</td></tr>\\r\\n<tr><td class=\\"name\\">12.</td><td>Smt. Annapurna Devi, Minister of Women and Child Development.</td></tr>\\r\\n<tr><td class=\\"name\\">13.</td><td>Shri Kiren Rijiju, Minister of Parliamentary Affairs; and Minister of Minority Affairs.</td></tr>\\r\\n<tr><td class=\\"name\\">14.</td><td>Shri G. Kishan Reddy, Minister of Coal; and Minister of Mines.</td></tr>\\r\\n</table>\\r\\n\\r\\n<!-- 6 -->\\r\\n<div class=\\"section-heading\\">6. Cabinet Committee on Security</div>\\r\\n<table>\\r\\n<tr><td colspan=\\"2\\" class=\\"section\\">Composition</td></tr>\\r\\n\\r\\n<tr><td class=\\"name\\">1.</td><td>Prime Minister.</td></tr>\\r\\n<tr><td class=\\"name\\">2.</td><td>Shri Raj Nath Singh, Minister of Defence.</td></tr>\\r\\n<tr><td class=\\"name\\">3.</td><td>Shri Amit Shah, Minister of Home Affairs; and Minister of Cooperation.</td></tr>\\r\\n<tr><td class=\\"name\\">4.</td><td>Smt. Nirmala Sitharaman, Minister of Finance; and Minister of Corporate Affairs.</td></tr>\\r\\n<tr><td class=\\"name\\">5.</td><td>Dr. Subrahmanyam Jaishankar, Minister of External Affairs.</td></tr>\\r\\n</table>\\r\\n\\r\\n<!-- 7 -->\\r\\n<div class=\\"section-heading\\">7. Cabinet Committee on Investment and Growth</div>\\r\\n<table>\\r\\n<tr><td colspan=\\"2\\" class=\\"section\\">Composition</td></tr>\\r\\n\\r\\n<tr><td class=\\"name\\">1.</td><td>Prime Minister.</td></tr>\\r\\n<tr><td class=\\"name\\">2.</td><td>Shri Raj Nath Singh, Minister of Defence.</td></tr>\\r\\n<tr><td class=\\"name\\">3.</td><td>Shri Amit Shah, Minister of Home Affairs; and Minister of Cooperation.</td></tr>\\r\\n<tr><td class=\\"name\\">4.</td><td>Shri Nitin Jairam Gadkari, Minister of Road Transport and Highways.</td></tr>\\r\\n<tr><td class=\\"name\\">5.</td><td>Smt. Nirmala Sitharaman, Minister of Finance; and Minister of Corporate Affairs.</td></tr>\\r\\n<tr><td class=\\"name\\">6.</td><td>Shri Piyush Goyal, Minister of Commerce and Industry.</td></tr>\\r\\n<tr><td class=\\"name\\">7.</td><td>Shri Pralhad Joshi, Minister of Consumer Affairs, Food and Public Distribution; and Minister of New and Renewable Energy.</td></tr>\\r\\n<tr><td class=\\"name\\">8.</td><td>Shri Giriraj Singh, Minister of Textiles.</td></tr>\\r\\n<tr><td class=\\"name\\">9.</td><td>Shri Ashwini Vaishnaw, Minister of Railways; Minister of Information and Broadcasting; and Minister of Electronics and Information Technology.</td></tr>\\r\\n<tr><td class=\\"name\\">10.</td><td>Shri Jyotiraditya M. Scindia, Minister of Communications; and Minister of Development of North Eastern Region.</td></tr>\\r\\n<tr><td class=\\"name\\">11.</td><td>Shri Hardeep Singh Puri, Minister of Petroleum and Natural Gas.</td></tr>\\r\\n<tr><td class=\\"name\\">12.</td><td>Shri Chirag Paswan, Minister of Food Processing Industries.</td></tr>\\r\\n\\r\\n<tr><td colspan=\\"2\\" class=\\"section\\">Special Invitees</td></tr>\\r\\n<tr>\\r\\n<td colspan=\\"2\\">\\r\\nRao Inderjit Singh, Minister of State (Independent Charge) of the Ministry of Statistics and Programme Implementation; Minister of State (Independent Charge) of the Ministry of Planning; and Minister of State in the Ministry of Culture.<br>\\r\\nShri Prataprao Jadhav, Minister of State (Independent Charge) of the Ministry of Ayush; and Minister of State in the Ministry of Health and Family Welfare.\\r\\n</td>\\r\\n</tr>\\r\\n</table>\\r\\n\\r\\n<!-- 8 -->\\r\\n<div class=\\"section-heading\\">8. Cabinet Committee on Skill, Employment and Livelihood</div>\\r\\n<table>\\r\\n<tr><td colspan=\\"2\\" class=\\"section\\">Composition</td></tr>\\r\\n\\r\\n<tr><td class=\\"name\\">1.</td><td>Prime Minister.</td></tr>\\r\\n<tr><td class=\\"name\\">2.</td><td>Shri Raj Nath Singh, Minister of Defence.</td></tr>\\r\\n<tr><td class=\\"name\\">3.</td><td>Shri Amit Shah, Minister of Home Affairs; and Minister of Cooperation.</td></tr>\\r\\n<tr><td class=\\"name\\">4.</td><td>Shri Nitin Jairam Gadkari, Minister of Road Transport and Highways.</td></tr>\\r\\n<tr><td class=\\"name\\">5.</td><td>Smt. Nirmala Sitharaman, Minister of Finance; and Minister of Corporate Affairs.</td></tr>\\r\\n<tr><td class=\\"name\\">6.</td><td>Shri Piyush Goyal, Minister of Commerce and Industry.</td></tr>\\r\\n<tr><td class=\\"name\\">7.</td><td>Shri Dharmendra Pradhan, Minister of Education.</td></tr>\\r\\n<tr><td class=\\"name\\">8.</td><td>Shri Ashwini Vaishnaw, Minister of Railways; Minister of Information and Broadcasting; and Minister of Electronics and Information Technology.</td></tr>\\r\\n<tr><td class=\\"name\\">9.</td><td>Shri Bhupender Yadav, Minister of Environment, Forest and Climate Change.</td></tr>\\r\\n<tr><td class=\\"name\\">10.</td><td>Shri Gajendra Singh Shekhawat, Minister of Culture; and Minister of Tourism.</td></tr>\\r\\n<tr><td class=\\"name\\">11.</td><td>Shri Hardeep Singh Puri, Minister of Petroleum and Natural Gas.</td></tr>\\r\\n<tr><td class=\\"name\\">12.</td><td>Dr. Mansukh Mandaviya, Minister of Labour and Employment; and Minister of Youth Affairs and Sports.</td></tr>\\r\\n\\r\\n<tr><td colspan=\\"2\\" class=\\"section\\">Special Invitee</td></tr>\\r\\n<tr><td class=\\"name\\">1.</td><td>Shri Jayant Chaudhary, Minister of State (Independent Charge) of the Ministry of Skill Development and Entrepreneurship; and Minister of State in the Ministry of Education.</td></tr>\\r\\n\\r\\n</table>","css":"/* Title */\\r\\n.title {\\r\\n    margin-top: 5%;\\r\\n    text-align: center;\\r\\n    font-weight: bold;\\r\\n    font-size: 18px;\\r\\n}\\r\\n\\r\\n.section-heading{\\r\\n    font-weight: 700;\\r\\n}\\r\\n\\r\\n.subtitle {\\r\\n    text-align: center;\\r\\n    margin: 5px 0 15px;\\r\\n    font-size: 14px;\\r\\n}\\r\\n\\r\\n/* Table styling */\\r\\ntable {\\r\\n    width: 100%;\\r\\n    border-collapse: collapse;\\r\\n    font-size: 14px;\\r\\n}\\r\\n\\r\\ntd, th {\\r\\n    border: 1px solid #000;\\r\\n    padding: 6px 8px;\\r\\n    vertical-align: top;\\r\\n}\\r\\n\\r\\n/* Section headers */\\r\\n.section {\\r\\n    text-align: center;\\r\\n    font-weight: bold;\\r\\n    background: #f0f0f0;\\r\\n}\\r\\n\\r\\n/* Name column */\\r\\n.name {\\r\\n    width: 30%;\\r\\n    white-space: nowrap;\\r\\n}\\r\\n\\r\\n/* Highlight PM row */\\r\\n.pm {\\r\\n    font-weight: bold;\\r\\n}","js":""}', 0, 1, '2026-04-24 06:58:15', '2026-04-24 07:03:25', NULL),
	(17, 'Meeting The Cabinet Secretary', '/connect/meeting-the-cabinet-secretary', NULL, NULL, NULL, NULL, NULL, '{"html":"<section class=\\"main-layout\\">\\r\\n    <div class=\\"gi-container\\">\\r\\n\\r\\n        <aside class=\\"sidebar-wrapper\\">\\r\\n            <div class=\\"vision-card\\">\\r\\n                <p>\\r\\n                    My Visit is an initiative by the Government of India to facilitate the common man. My Visit facility\\r\\n                    enables the citizens to have a smooth and simple process of making an appointment.of business in\\r\\n                    Ministries/ Departments of the Government.\\r\\n                </p>\\r\\n            </div>\\r\\n        </aside>\\r\\n\\r\\n        <main class=\\"content-wrapper\\">\\r\\n\\r\\n            <article class=\\"content-section\\">\\r\\n                <h2>Meeting the Cabinet Secretary.</h2>\\r\\n                <p>\\r\\n                    As is the existing practice, officers and others wishing to meet the Cabinet Secretary may seek\\r\\n                    appointments by sending an e-mail to cabinetsy(at)nic(dot)in or telephoning to\\r\\n                    011-23016696/23011241.\\r\\n                </p>\\r\\n                <p>\\r\\n                    In addition to the above method, as a convenience to Secretaries (who may need to meet on urgent\\r\\n                    official business) and to officers of State Governments (whose visits to Delhi may be infrequent),\\r\\n                    <strong>an \\"Open House\\" system (a specified period during which officers may come without appointment) is also being introduced</strong>\\r\\n                    on a trial basis, until further notice.\\r\\n                </p>\\r\\n                <p>The Open House timings are as follows:</p>\\r\\n\\r\\n                <table class=\\"open-house-table\\">\\r\\n                    <thead>\\r\\n                        <tr>\\r\\n                            <th>S. No.</th>\\r\\n                            <th>Class of officers</th>\\r\\n                            <th>Timing of Open House</th>\\r\\n                        </tr>\\r\\n                    </thead>\\r\\n                    <tbody>\\r\\n                        <tr>\\r\\n                            <td>1.</td>\\r\\n                            <td>Secretaries to Govt. of India and equivalent officers</td>\\r\\n                            <td rowspan=\\"2\\">10:00 a.m. to 10:20 a.m. on Tuesdays, Thursdays &amp; Fridays (except\\r\\n                                holidays)</td>\\r\\n                        </tr>\\r\\n                        <tr>\\r\\n                            <td>2.</td>\\r\\n                            <td>Visiting All India Service officers from State Governments (i.e. who are based outside\\r\\n                                Delhi)</td>\\r\\n                        </tr>\\r\\n                    </tbody>\\r\\n                </table>\\r\\n\\r\\n                <p>\\r\\n                    This will be on a first-come-first-served basis and limited to the specified time. Hence, if there\\r\\n                    are many visitors, some may not be able to meet. It is not intended for any long discussion. The\\r\\n                    Open House is also subject to cancellation without notice, if exigencies arise on a given day.\\r\\n                </p>\\r\\n                <p>\\r\\n                    Due to security restrictions in Rashtrapati Bhavan, those officers who wish to come during the Open\\r\\n                    House period and do not have the requisite passes, should communicate their name and vehicle number,\\r\\n                    in advance, to the Cabinet Secretary\'s office on telephone (Nos.011-23016696/23011241) so that\\r\\n                    messages can be sent to the Control Room for permitting their vehicle\'s entry in Rashtrapati Bhavan.\\r\\n                </p>\\r\\n            </article>\\r\\n\\r\\n        </main>\\r\\n    </div>\\r\\n</section>","css":"/* --- Layout Container --- */\\r\\n.main-layout {\\r\\n    width: 100%;\\r\\n}\\r\\n\\r\\n.gi-container {\\r\\n    /* max-width: 1200px; */\\r\\n    margin: 0 0;\\r\\n    padding: 40px 0px;\\r\\n    display: flex;\\r\\n    gap: 30px;\\r\\n    min-height: 100vh;\\r\\n}\\r\\n\\r\\n/* --- Responsive Tablet/Desktop --- */\\r\\n@media (min-width: 992px) {\\r\\n    .gi-container {\\r\\n        flex-direction: row;\\r\\n        align-items: flex-start;\\r\\n    }\\r\\n\\r\\n    .sidebar-wrapper {\\r\\n        flex: 1;\\r\\n        position: sticky;\\r\\n        top: 20px;\\r\\n    }\\r\\n\\r\\n    .content-wrapper {\\r\\n        flex: 2;\\r\\n    }\\r\\n}\\r\\n\\r\\n/* --- Sidebar Style --- */\\r\\n.vision-card {\\r\\n    background-color: #f3f4f6;\\r\\n    padding: 24px;\\r\\n    border-radius: 12px;\\r\\n}\\r\\n\\r\\n.vision-card p {\\r\\n    font-size: 24px;\\r\\n    font-style: normal;\\r\\n    font-weight: 500;\\r\\n    font-family: \\"Noto Sans\\", sans-serif;\\r\\n\\r\\n    color: rgb(22, 47, 106);\\r\\n}\\r\\n\\r\\n/* --- Main Content Style --- */\\r\\n.content-section {\\r\\n    margin-bottom: 40px;\\r\\n}\\r\\n\\r\\n.content-section h2 {\\r\\n    margin-bottom: 15px;\\r\\n    font-size: 24px;\\r\\n    font-style: normal;\\r\\n    font-weight: 400;\\r\\n    font-family: \\"Noto Sans\\", sans-serif;\\r\\n    color: rgb(22, 47, 106);\\r\\n}\\r\\n\\r\\n.content-section p {\\r\\n    margin-bottom: 15px;\\r\\n    line-height: 1.8;\\r\\n    font-size: 16px;\\r\\n    font-style: normal;\\r\\n    font-weight: 400;\\r\\n    font-family: \\"Noto Sans\\", sans-serif;\\r\\n    color: rgb(21, 2, 2);\\r\\n}\\r\\n\\r\\n.numbered-list {\\r\\n    padding-left: 20px;\\r\\n}\\r\\n\\r\\n.numbered-list li {\\r\\n    margin-bottom: 15px;\\r\\n    color: #4b5563;\\r\\n    font-size: 0.9rem;\\r\\n}\\r\\n\\r\\n/* --- Open House Table --- */\\r\\n.open-house-table {\\r\\n    width: 100%;\\r\\n    border-collapse: collapse;\\r\\n    margin: 20px 0 24px;\\r\\n    font-size: 0.88rem;\\r\\n}\\r\\n\\r\\n.open-house-table th,\\r\\n.open-house-table td {\\r\\n    border: 1px solid #d1d5db;\\r\\n    padding: 10px 14px;\\r\\n    text-align: left;\\r\\n    vertical-align: top;\\r\\n    line-height: 1.6;\\r\\n\\r\\n\\r\\n    font-size: 16px;\\r\\n    font-style: normal;\\r\\n    font-weight: 400;\\r\\n    font-family: \\"Noto Sans\\", sans-serif;\\r\\n\\r\\n    color: rgb(21, 2, 2);\\r\\n}\\r\\n\\r\\n.open-house-table thead tr {\\r\\n    background-color: #f3f4f6;\\r\\n}\\r\\n\\r\\n.open-house-table th {\\r\\n    font-size: 16px;\\r\\n    font-style: normal;\\r\\n    font-weight: 700;\\r\\n    font-family: \\"Noto Sans\\", sans-serif;\\r\\n    color: rgb(21, 2, 2);\\r\\n}\\r\\n\\r\\n.open-house-table td:first-child {\\r\\n    white-space: nowrap;\\r\\n    width: 60px;\\r\\n}\\r\\n\\r\\n/* --- Resource Items (Buttons) --- */\\r\\n.resource-group h2 {\\r\\n    color: #123a6b;\\r\\n    font-size: 1.4rem;\\r\\n    margin-bottom: 20px;\\r\\n}\\r\\n\\r\\n.link-item {\\r\\n    background-color: #f9fafb;\\r\\n    border-radius: 8px;\\r\\n    padding: 15px 20px;\\r\\n    display: flex;\\r\\n    justify-content: space-between;\\r\\n    align-items: center;\\r\\n    margin-bottom: 12px;\\r\\n}\\r\\n\\r\\n.item-meta {\\r\\n    display: flex;\\r\\n    align-items: center;\\r\\n    gap: 12px;\\r\\n    font-weight: 500;\\r\\n}\\r\\n\\r\\n.icon-blue {\\r\\n    color: #0f3c82;\\r\\n}\\r\\n\\r\\n.item-actions {\\r\\n    display: flex;\\r\\n    align-items: center;\\r\\n    gap: 15px;\\r\\n}\\r\\n\\r\\n.size-text {\\r\\n    font-size: 0.75rem;\\r\\n    color: #6b7280;\\r\\n}\\r\\n\\r\\n.btn-view {\\r\\n    background-color: #dbeafe;\\r\\n    color: #2563eb;\\r\\n    border: none;\\r\\n    padding: 6px 10px;\\r\\n    border-radius: 5px;\\r\\n    cursor: pointer;\\r\\n    display: flex;\\r\\n    transition: 0.2s;\\r\\n}\\r\\n\\r\\n.btn-view:hover {\\r\\n    background-color: #bfdbfe;\\r\\n}","js":""}', 0, 1, '2026-04-24 07:41:38', '2026-05-07 10:06:25', NULL),
	(18, 'Parliament Questions', '/connect/parliament-questions', NULL, NULL, NULL, NULL, NULL, '{"html":"<div class=\\"container\\">\\r\\n\\r\\n    <!-- Card 1 -->\\r\\n    <div class=\\"card\\">\\r\\n        <img src=\\"https://master-cabsec.digifootprint.gov.in/static/uploads/2025/06/101d191f89a90a73bc3eeb9c3f37b449.jpg\\" alt=\\"Lok Sabha\\">\\r\\n        <div class=\\"card-content\\">\\r\\n            <div class=\\"card-title\\">Lok Sabha Questions</div>\\r\\n            <div class=\\"card-link-row\\">\\r\\n                <a href=\\"https://sansad.in/ls/questions/questions-and-answers\\" target=\\"_blank\\" class=\\"card-link\\">\\r\\n                    https://sansad.in/ls/questions/questions-and-answers\\r\\n                </a>\\r\\n\\r\\n                <a class=\\"btn-external\\" href=\\"https://sansad.in/ls/questions/questions-and-answers\\" target=\\"_blank\\" title=\\"Open\\">\\r\\n                    <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n                        <path d=\\"M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"\\r\\n                        stroke-linecap=\\"round\\" />\\r\\n                        <path d=\\"M9 1h4v4M13 1L7 7\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"\\r\\n                        stroke-linejoin=\\"round\\" />\\r\\n                    </svg>\\r\\n                </a>\\r\\n            </div>\\r\\n        </div>\\r\\n    </div>\\r\\n\\r\\n    <!-- Card 2 -->\\r\\n    <div class=\\"card\\">\\r\\n        <img src=\\"https://master-cabsec.digifootprint.gov.in/static/uploads/2025/06/fb89f6a2bd685871747e718f828e2eaa.jpg\\" alt=\\"Rajya Sabha\\">\\r\\n        <div class=\\"card-content\\">\\r\\n            <div class=\\"card-title\\">Rajya Sabha Questions</div>\\r\\n            <div class=\\"card-link-row\\">\\r\\n                <a href=\\"https://sansad.in/rs/questions/questions-and-answers\\" target=\\"_blank\\" class=\\"card-link\\">\\r\\n                    https://sansad.in/rs/questions/questions-and-answers\\r\\n                </a>\\r\\n\\r\\n                <a class=\\"btn-external\\" href=\\"https://sansad.in/rs/questions/questions-and-answers\\" target=\\"_blank\\" title=\\"Open\\">\\r\\n                    <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n                        <path d=\\"M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"\\r\\n                        stroke-linecap=\\"round\\" />\\r\\n                        <path d=\\"M9 1h4v4M13 1L7 7\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"\\r\\n                        stroke-linejoin=\\"round\\" />\\r\\n                    </svg>\\r\\n                </a>\\r\\n\\r\\n\\r\\n            </div>\\r\\n        </div>\\r\\n    </div>\\r\\n\\r\\n</div>","css":".container {\\r\\n    display: flex;\\r\\n    gap: 25px;\\r\\n    justify-content: center;\\r\\n    flex-wrap: wrap;\\r\\n    margin-top: 2%;\\r\\n    margin-bottom: 2%;\\r\\n}\\r\\n\\r\\n.card {\\r\\n    width: 420px;\\r\\n    background: #fff;\\r\\n    border-radius: 12px;\\r\\n    overflow: hidden;\\r\\n    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);\\r\\n    border: 1px solid #ddd;\\r\\n    transition: 0.3s;\\r\\n}\\r\\n\\r\\n.card:hover {\\r\\n    transform: translateY(-4px);\\r\\n    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);\\r\\n}\\r\\n\\r\\n.card img {\\r\\n    width: 100%;\\r\\n    height: 200px;\\r\\n    object-fit: cover;\\r\\n}\\r\\n\\r\\n.card-content {\\r\\n    padding: 15px 18px 20px;\\r\\n}\\r\\n\\r\\n.card-title {\\r\\n    margin-bottom: 10px;\\r\\n    font-size: 20px;\\r\\n    font-style: normal;\\r\\n    font-weight: 500;\\r\\n    font-family: \\"Noto Sans\\", sans-serif;\\r\\n    color: rgb(21, 2, 2);\\r\\n}\\r\\n\\r\\n.card-link-row {\\r\\n    display: flex;\\r\\n    justify-content: space-between;\\r\\n    align-items: center;\\r\\n}\\r\\n\\r\\n.card-link {\\r\\n    text-decoration: none;\\r\\n    word-break: break-all;\\r\\n    font-size: 12px;\\r\\n    font-style: normal;\\r\\n    font-weight: 600;\\r\\n    font-family: \\"Noto Sans\\", sans-serif;\\r\\n    color: rgb(61, 64, 67);\\r\\n}\\r\\n\\r\\n.card-link:hover {\\r\\n    text-decoration: underline;\\r\\n}\\r\\n\\r\\n.icon-btn {\\r\\n    width: 32px;\\r\\n    height: 32px;\\r\\n    border-radius: 6px;\\r\\n    background: #e0e6f5;\\r\\n    display: flex;\\r\\n    align-items: center;\\r\\n    justify-content: center;\\r\\n    text-decoration: none;\\r\\n    color: #2a5db0;\\r\\n    font-size: 16px;\\r\\n}\\r\\n\\r\\n.icon-btn:hover {\\r\\n    background: #cdd7f0;\\r\\n}\\r\\n\\r\\n\\r\\n\\r\\n.btn-external {\\r\\n    width: 34px;\\r\\n    height: 34px;\\r\\n    background: #dbeafe;\\r\\n    border: none;\\r\\n    border-radius: 6px;\\r\\n    display: flex;\\r\\n    align-items: center;\\r\\n    justify-content: center;\\r\\n    cursor: pointer;\\r\\n    transition: background 0.15s;\\r\\n    text-decoration: none;\\r\\n\\r\\n    font-size: 24px;\\r\\n    font-style: normal;\\r\\n    font-weight: 400;\\r\\n    font-family: \\"Material Symbols Outlined\\";\\r\\n\\r\\n    color: rgb(22, 47, 106);\\r\\n}","js":""}', 0, 1, '2026-04-24 07:50:08', '2026-05-07 10:01:22', NULL),
	(20, 'Terms of Use', '/policies/terms-of-use', NULL, NULL, NULL, NULL, NULL, '{"html":"<div class=\\"container\\">\\r\\n\\r\\n  <p class=\\"text\\">\\r\\n    This website is designed, updated and maintained by Cabinet Secretariat, Government of India.\\r\\n  </p>\\r\\n\\r\\n  <p class=\\"text\\">\\r\\n    Though all efforts have been made to ensure the accuracy and currency of the content on this website, the same should not be construed as a statement of law or used for any legal purposes. In case of any ambiguity or doubts, users are advised to verify/check with the Cabinet Secretariat and/or other source(s), and to obtain appropriate professional advice.\\r\\n  </p>\\r\\n\\r\\n  <p class=\\"text\\">\\r\\n    Under no circumstances will Cabinet Secretariat be liable for any expense, loss or damage including, without limitation, indirect or consequential loss or damage, or any expense, loss or damage whatsoever arising from use, or loss of use, of data, arising out of or in connection with the use of this website.\\r\\n  </p>\\r\\n\\r\\n  <p class=\\"text\\">\\r\\n    These terms and conditions shall be governed by and construed in accordance with the Indian Laws. Any dispute arising under these terms and conditions shall be subject to the jurisdiction of the courts of India.\\r\\n  </p>\\r\\n\\r\\n  <p class=\\"text\\">\\r\\n    The information posted on this website could include hypertext links or pointers to information created and maintained by non-Government / private organisations. Cabinet Secretariat is providing these links and pointers solely for your information and convenience. When you select a link to an outside website, you are leaving the Cabinet Secretariat website and are subject to the privacy and security policies of the owners/sponsors of the outside website. Cabinet Secretariat does not guarantee the availability of such linked pages at all times. Cabinet Secretariat cannot authorise the use of copyrighted materials contained in linked websites. Users are advised to request such authorisation from the owner of the linked website. Cabinet Secretariat does not guarantee that linked websites comply with Indian Government Web Guidelines.\\r\\n  </p>\\r\\n\\r\\n  <div class=\\"heading\\">Disclaimer</div>\\r\\n\\r\\n  <p class=\\"text\\">\\r\\n    This website of the Cabinet Secretariat is being maintained for information purposes only. Even though every effort is taken to provide accurate and up to date information, officers making use of the circulars posted on the website are advised to get in touch with the Cabinet Secretariat whenever there is any doubt regarding the correctness of information contained therein. In the event of any conflict between the contents of circulars on the website and the hard copy of the circulars issued by Cabinet Secretariat, the information in the hard copy should be relied upon and the matter shall be brought to the notice of the Cabinet Secretariat.\\r\\n  </p>\\r\\n\\r\\n</div>","css":".container{\\r\\n  margin-top: 2%;\\r\\n   font-family: \\"Noto Sans\\", sans-serif;\\r\\n}\\r\\n\\r\\n\\r\\n  .text{\\r\\n    font-size: 14px;\\r\\n    line-height: 1.7;\\r\\n    margin-bottom: 14px;\\r\\n  }\\r\\n\\r\\n  .heading{\\r\\n    font-size: 20px;\\r\\n    font-weight: 500;\\r\\n    color: #2b5dab; /* blue heading */\\r\\n    margin: 25px 0 10px;\\r\\n  }","js":""}', 0, 1, '2026-04-29 09:21:08', '2026-05-12 09:29:25', NULL),
	(21, 'Privacy Policy', '/policies/privacy-policy', NULL, NULL, NULL, NULL, NULL, '{"html":"<div class=\\"container\\">\\r\\n\\r\\n  <p class=\\"text\\">\\r\\n    Cabinet Secretariat does not automatically capture any specific personal information from the user, (like name, phone number or e-mail address), that allows us to identify you individually.\\r\\n  </p>\\r\\n\\r\\n  <p class=\\"text\\">\\r\\n    If the Cabinet Secretariat website requests you to provide personal information, user will be informed for the particular purposes for which the information is gathered and adequate security measures will be taken to protect your personal information.\\r\\n  </p>\\r\\n\\r\\n  <p class=\\"text\\">\\r\\n    We do not sell or share any personally identifiable information volunteered on the Cabinet Secretariat website to any third party (public/private). Any information provided to this website will be protected from loss, misuse, unauthorized access or disclosure, alteration, or destruction.\\r\\n  </p>\\r\\n\\r\\n</div>","css":" .container{\\r\\n    max-width: 1100px;\\r\\n    margin: 40px auto;\\r\\n    padding: 0 20px;\\r\\n  }\\r\\n\\r\\n  .text{\\r\\n    font-size: 14px;\\r\\n    line-height: 1.7;\\r\\n    margin-bottom: 14px;\\r\\n  }","js":""}', 0, 1, '2026-04-29 09:22:14', '2026-04-29 09:54:07', NULL),
	(22, 'Copyright Policy', '/policies/copyright-policy', NULL, NULL, NULL, NULL, NULL, '{"html":"<p>Contents of this website may not be reproduced partially or fully, without due permission from Cabinet Secretariat. If referred to as a part of another website, the source must be appropriately acknowledged. The contents of this website can not be used in any misleading or objectionable context.</p>","css":"","js":"","no_scope":false}', 0, 1, '2026-04-29 09:22:41', '2026-04-29 09:22:41', NULL),
	(23, 'Bhashini Policy', '/policies/bhashini-policy', NULL, NULL, NULL, NULL, NULL, '{"html":"<p>â€œThis translation is generated by fully automated machine translation using BHASHINI.</p><p>Due to limitation in accuracy of Machine Translation Technology, the readers should refer to the English version in case of doubts/issues.â€</p>","css":"","js":"","no_scope":false}', 0, 1, '2026-04-29 09:23:35', '2026-04-29 09:23:35', NULL),
	(24, 'Cookie Policy', '/policies/cookie-policy', NULL, NULL, NULL, NULL, NULL, '{"html":"<div class=\\"cookie-wrapper\\">\\r\\n\\r\\n  <p class=\\"cookie-text\\">\\r\\n    Our website uses cookies to enhance your browsing experience, personalize content, and analyze our traffic.\\r\\n    Cookies help us understand how you interact with our site, remember your preferences, and improve your overall experience.\\r\\n    By continuing to use our website, you consent to our use of cookies in accordance with this policy.\\r\\n    You can adjust your cookie settings at any time through your browser settings.\\r\\n  </p>\\r\\n\\r\\n  <div class=\\"cookie-bar\\">\\r\\n    <a href=\\"#\\" class=\\"cookie-btn\\">MANAGE COOKIES</a>\\r\\n  </div>\\r\\n\\r\\n</div>","css":" .cookie-wrapper{\\r\\n    max-width: 1100px;\\r\\n    margin: 2% auto 10% auto;\\r\\n    padding: 0 20px;\\r\\n  }\\r\\n\\r\\n  .cookie-text{\\r\\n    font-size: 14px;\\r\\n    line-height: 1.7;\\r\\n    color: #222;\\r\\n    margin-bottom: 12px;\\r\\n  }\\r\\n\\r\\n  .cookie-bar{\\r\\n    background: #9fb5f5; /* light blue like screenshot */\\r\\n    padding: 10px 14px;\\r\\n    border-radius: 2px;\\r\\n    display: inline-block;\\r\\n    width: 100%;\\r\\n  }\\r\\n\\r\\n  .cookie-btn{\\r\\n    font-size: 12px;\\r\\n    font-weight: 500;\\r\\n    color: #0b2a6f;\\r\\n    text-decoration: none;\\r\\n    text-transform: uppercase;\\r\\n    letter-spacing: .5px;\\r\\n  }\\r\\n\\r\\n  .cookie-btn:hover{\\r\\n    text-decoration: underline;\\r\\n  }","js":""}', 0, 1, '2026-04-29 09:31:17', '2026-04-29 09:57:12', NULL),
	(25, 'Cookie Setting', '/cookies/cookie-setting', NULL, NULL, NULL, NULL, NULL, '{"html":"<div class=\\"container\\">\\r\\n\\r\\n    <p class=\\"desc\\">\\r\\n      Welcome to the Cookie Settings page, where you have the power to tailor your browsing experience.\\r\\n      Here, you\'ll find detailed information about the cookies we use, categorized as \\"Essential\\" and \\"Optional\\".\\r\\n      Make informed choices that align with your privacy preferences\\r\\n    </p>\\r\\n\\r\\n    <!-- ESSENTIAL -->\\r\\n    <h2>ESSENTIAL COOKIES</h2>\\r\\n\\r\\n    <div class=\\"card\\">\\r\\n      <div>\\r\\n        <h3>Session Cookies</h3>\\r\\n        <p>Ensures user session persistence, allowing seamless navigation on the website.<br>\\r\\n        (Essential for site functionality)</p>\\r\\n      </div>\\r\\n\\r\\n      <div class=\\"toggle-wrapper\\">\\r\\n        <span class=\\"toggle-label\\">Off</span>\\r\\n        <label class=\\"switch\\">\\r\\n          <input type=\\"checkbox\\" checked disabled>\\r\\n          <span class=\\"slider\\"></span>\\r\\n        </label>\\r\\n        <span class=\\"toggle-label\\">On</span>\\r\\n      </div>\\r\\n    </div>\\r\\n\\r\\n    <div class=\\"card\\">\\r\\n      <div>\\r\\n        <h3>Persistent cookies</h3>\\r\\n        <p>Remembers user preferences, such as language and region settings, for a personalized browsing experience.<br>\\r\\n        (Personalization)</p>\\r\\n      </div>\\r\\n\\r\\n      <div class=\\"toggle-wrapper\\">\\r\\n        <span class=\\"toggle-label\\">Off</span>\\r\\n        <label class=\\"switch\\">\\r\\n          <input type=\\"checkbox\\" checked disabled>\\r\\n          <span class=\\"slider\\"></span>\\r\\n        </label>\\r\\n        <span class=\\"toggle-label\\">On</span>\\r\\n      </div>\\r\\n    </div>\\r\\n\\r\\n    <!-- OPTIONAL -->\\r\\n    <h2>OPTIONAL COOKIES</h2>\\r\\n\\r\\n    <div class=\\"card\\">\\r\\n      <div>\\r\\n        <h3>Preference/functionality cookies</h3>\\r\\n        <p>Remembers user preferences, such as language and region settings, for a personalized browsing experience.<br>\\r\\n        (Personalization)</p>\\r\\n      </div>\\r\\n\\r\\n      <div class=\\"toggle-wrapper\\">\\r\\n        <span class=\\"toggle-label\\">Off</span>\\r\\n        <label class=\\"switch\\">\\r\\n          <input type=\\"checkbox\\">\\r\\n          <span class=\\"slider\\"></span>\\r\\n        </label>\\r\\n        <span class=\\"toggle-label\\">On</span>\\r\\n      </div>\\r\\n    </div>\\r\\n\\r\\n    <button class=\\"btn\\">Save Preferences</button>\\r\\n\\r\\n  </div>","css":".container {\\r\\n      max-width: 1000px;\\r\\n      margin: 2% auto;\\r\\n    }\\r\\n\\r\\n    .desc {\\r\\n      font-size: 14px;\\r\\n      line-height: 1.6;\\r\\n      margin-bottom: 30px;\\r\\n    }\\r\\n\\r\\n    h2 {\\r\\n      font-size: 18px;\\r\\n      margin: 25px 0 10px;\\r\\n      font-weight: 600;\\r\\n      color: #000;\\r\\n      letter-spacing: 0.5px;\\r\\n    }\\r\\n\\r\\n    .card {\\r\\n      background: #fff;\\r\\n      border: 1px solid #ddd;\\r\\n      border-radius: 6px;\\r\\n      padding: 15px 20px;\\r\\n      margin-bottom: 15px;\\r\\n      display: flex;\\r\\n      justify-content: space-between;\\r\\n      align-items: center;\\r\\n    }\\r\\n\\r\\n    .card h3 {\\r\\n      margin: 0;\\r\\n      font-size: 14px;\\r\\n      font-weight: 600;\\r\\n    }\\r\\n\\r\\n    .card p {\\r\\n      margin: 5px 0 0;\\r\\n      font-size: 13px;\\r\\n      color: #444;\\r\\n    }\\r\\n\\r\\n    .toggle-wrapper {\\r\\n      display: flex;\\r\\n      align-items: center;\\r\\n      gap: 8px;\\r\\n      font-size: 12px;\\r\\n    }\\r\\n\\r\\n    .toggle-label {\\r\\n      color: #666;\\r\\n    }\\r\\n\\r\\n    /* Toggle Switch */\\r\\n    .switch {\\r\\n      position: relative;\\r\\n      display: inline-block;\\r\\n      width: 40px;\\r\\n      height: 20px;\\r\\n    }\\r\\n\\r\\n    .switch input {\\r\\n      opacity: 0;\\r\\n      width: 0;\\r\\n      height: 0;\\r\\n    }\\r\\n\\r\\n    .slider {\\r\\n      position: absolute;\\r\\n      cursor: pointer;\\r\\n      inset: 0;\\r\\n      background-color: #ccc;\\r\\n      border-radius: 20px;\\r\\n      transition: 0.3s;\\r\\n    }\\r\\n\\r\\n    .slider:before {\\r\\n      position: absolute;\\r\\n      content: \\"\\";\\r\\n      height: 14px;\\r\\n      width: 14px;\\r\\n      left: 3px;\\r\\n      bottom: 3px;\\r\\n      background-color: white;\\r\\n      border-radius: 50%;\\r\\n      transition: 0.3s;\\r\\n    }\\r\\n\\r\\n    input:checked + .slider {\\r\\n      background-color: #1a3c6e;\\r\\n    }\\r\\n\\r\\n    input:checked + .slider:before {\\r\\n      transform: translateX(20px);\\r\\n    }\\r\\n\\r\\n    .btn {\\r\\n      margin-top: 20px;\\r\\n      background: #1a3c6e;\\r\\n      color: #fff;\\r\\n      border: none;\\r\\n      padding: 10px 18px;\\r\\n      font-size: 13px;\\r\\n      border-radius: 4px;\\r\\n      cursor: pointer;\\r\\n    }\\r\\n\\r\\n    .btn:hover {\\r\\n      background: #15325a;\\r\\n    }","js":""}', 0, 1, '2026-04-29 09:34:12', '2026-04-29 09:35:02', NULL),
	(26, 'Help', '/help', NULL, NULL, NULL, NULL, NULL, '{"html":"<div class=\\"container\\">\\r\\n\\r\\n  <!-- Search -->\\r\\n  <input type=\\"text\\" class=\\"search-box\\" placeholder=\\"Search...\\" />\\r\\n\\r\\n  <h1>Help</h1>\\r\\n\\r\\n  <h2>Accessibility</h2>\\r\\n\\r\\n  <p class=\\"text\\">\\r\\n    Know about the accessibility statement, accessibility features, and accessibility options. We are committed to ensure that the Cabinet Secretariat is accessible to all users irrespective of device in use, technology or ability. It has been built, with an aim, to provide maximum accessibility and usability to its visitors.\\r\\n  </p>\\r\\n\\r\\n  <p class=\\"text\\">\\r\\n    For example, a user with visual disability can access this Portal using assistive technologies, such as screen readers and magnifiers. We also aim to be standards compliant and follow principles of usability and universal design.\\r\\n  </p>\\r\\n\\r\\n  <h2>Viewing Information in Various File Formats</h2>\\r\\n\\r\\n  <p class=\\"text\\">\\r\\n    Provides information on how to access different file formats for viewing the required information. Your browser needs required plug-ins or software.\\r\\n  </p>\\r\\n\\r\\n  <!-- Table -->\\r\\n  <table>\\r\\n    <tr>\\r\\n      <th>Document Type</th>\\r\\n      <th>Plug-in for Download</th>\\r\\n    </tr>\\r\\n\\r\\n    <tr>\\r\\n      <td>Portable Document Format (PDF) files</td>\\r\\n      <td>\\r\\n        <a href=\\"https://helpx.adobe.com/acrobat/desktop/whats-new/whats-new-acrobat-desktop.html\\">Adobe Acrobat Reader</a><br>\\r\\n        <a href=\\"#\\">Convert a PDF file online into HTML or text format</a>\\r\\n      </td>\\r\\n    </tr>\\r\\n\\r\\n    <tr>\\r\\n      <td>Word files</td>\\r\\n      <td>\\r\\n        <a href=\\"https://www.microsoft.com/en-us/download/details.aspx\\">Word Viewer (in any version till 2003)</a><br>\\r\\n        <a href=\\"https://www.microsoft.com/en-us/download/details.aspx\\">Microsoft Office Compatibility Pack for Word</a>\\r\\n      </td>\\r\\n    </tr>\\r\\n\\r\\n    <tr>\\r\\n      <td>Excel files</td>\\r\\n      <td>\\r\\n        <a href=\\"https://www.microsoft.com/en-us/download/details.aspx\\">Excel Viewer 2003</a><br>\\r\\n        <a href=\\"https://www.microsoft.com/en-us/download/details.aspx\\">Microsoft Office Compatibility Pack for Excel</a>\\r\\n      </td>\\r\\n    </tr>\\r\\n\\r\\n    <tr>\\r\\n      <td>PowerPoint presentations</td>\\r\\n      <td>\\r\\n        <a href=\\"https://www.microsoft.com/en-us/download/details.aspx\\">PowerPoint Viewer 2003</a><br>\\r\\n        <a href=\\"https://www.microsoft.com/en-us/download/details.aspx\\">Microsoft Office Compatibility Pack for PowerPoint</a>\\r\\n      </td>\\r\\n    </tr>\\r\\n\\r\\n    <tr>\\r\\n      <td>Flash content</td>\\r\\n      <td>\\r\\n        <a href=\\"https://www.adobe.com/products/flashplayer/end-of-life-alternative.html\\">Adobe Flash Player</a>\\r\\n      </td>\\r\\n    </tr>\\r\\n\\r\\n  </table>\\r\\n\\r\\n  <h2>Viewing Information in Various File Formats</h2>\\r\\n\\r\\n  <p class=\\"text\\">\\r\\n    Provides information regarding access to different Screen Readers.\\r\\n  </p>\\r\\n\\r\\n  <p class=\\"text\\">\\r\\n    The Cabinet Secretariat fully complies with <a href=\\"https://guidelines.india.gov.in/\\">Guidelines for Indian Government Websites.</a> Visitors with visual impairments can access the portal using assistive technologies.\\r\\n  </p>\\r\\n\\r\\n  <p>\\r\\n    The information of the Portal is accessible with different screen readers, such as JAWS, NVDA, SAFA, Supernova and Window-Eyes.\\r\\n    \\r\\n    Following table lists the information about different screen readers:\\r\\n  </p>\\r\\n\\r\\n\\r\\n  <h3>Information related to the various screen readers</h3>\\r\\n\\r\\n<table>\\r\\n  <tr>\\r\\n    <th>Screen Reader</th>\\r\\n    <th>Website</th>\\r\\n    <th>Free/Commercial</th>\\r\\n  </tr>\\r\\n\\r\\n  <tr>\\r\\n    <td>Screen Access For All (SAFA)</td>\\r\\n    <td>\\r\\n      <a href=\\"https://www.nabdelhi.in/it-services/technology-training-center/downloads/\\" target=\\"_blank\\">\\r\\n        http://www.nabdelhi.in\\r\\n      </a>\\r\\n    </td>\\r\\n    <td>Free</td>\\r\\n  </tr>\\r\\n\\r\\n  <tr>\\r\\n    <td>Non Visual Desktop Access (NVDA)</td>\\r\\n    <td>\\r\\n      <a href=\\"https://www.nvaccess.org/\\" target=\\"_blank\\">\\r\\n        http://www.nvda-project.org\\r\\n      </a>\\r\\n    </td>\\r\\n    <td>Free</td>\\r\\n  </tr>\\r\\n\\r\\n  <tr>\\r\\n    <td>System Access To Go</td>\\r\\n    <td>\\r\\n      <a href=\\"https://www.satogo.com/en/\\" target=\\"_blank\\">\\r\\n        http://www.satogo.com\\r\\n      </a>\\r\\n    </td>\\r\\n    <td>Free</td>\\r\\n  </tr>\\r\\n\\r\\n  <tr>\\r\\n    <td>Thunder</td>\\r\\n    <td>\\r\\n      <a href=\\"http://screenreader.net/\\" target=\\"_blank\\">\\r\\n        http://www.screenreader.net\\r\\n      </a>\\r\\n    </td>\\r\\n    <td>Free</td>\\r\\n  </tr>\\r\\n\\r\\n  <tr>\\r\\n    <td>WebAnywhere</td>\\r\\n    <td>\\r\\n      <a href=\\"https://webinsight.cs.washington.edu/wa/content.php\\" target=\\"_blank\\">\\r\\n        http://webinsight.cs.washington.edu\\r\\n      </a>\\r\\n    </td>\\r\\n    <td>Free</td>\\r\\n  </tr>\\r\\n\\r\\n  <tr>\\r\\n    <td>Hal</td>\\r\\n    <td>\\r\\n      <a href=\\"https://yourdolphin.com/ScreenReader\\" target=\\"_blank\\">\\r\\n        http://www.yourdolphin.co.uk\\r\\n      </a>\\r\\n    </td>\\r\\n    <td>Commercial</td>\\r\\n  </tr>\\r\\n\\r\\n  <tr>\\r\\n    <td>JAWS</td>\\r\\n    <td>\\r\\n      <a href=\\"https://www.freedomscientific.com/\\" target=\\"_blank\\">\\r\\n        http://www.freedomscientific.com\\r\\n      </a>\\r\\n    </td>\\r\\n    <td>Commercial</td>\\r\\n  </tr>\\r\\n\\r\\n  <tr>\\r\\n    <td>Supernova</td>\\r\\n    <td>\\r\\n      <a href=\\"https://yourdolphin.com/SuperNova\\" target=\\"_blank\\">\\r\\n        http://www.yourdolphin.co.uk\\r\\n      </a>\\r\\n    </td>\\r\\n    <td>Commercial</td>\\r\\n  </tr>\\r\\n\\r\\n  <tr>\\r\\n    <td>Window-Eyes</td>\\r\\n    <td>\\r\\n      <a href=\\"https://vispero.com/?utm_source=gwmicro.com&utm_medium=referral&utm_campaign=parked\\" target=\\"_blank\\">\\r\\n        http://www.gwmicro.com\\r\\n      </a>\\r\\n    </td>\\r\\n    <td>Commercial</td>\\r\\n  </tr>\\r\\n\\r\\n</table>\\r\\n\\r\\n</div>","css":"/* Container */\\r\\n.container{\\r\\n  max-width: 1100px;\\r\\n  margin: 30px auto;\\r\\n  padding: 0 20px;\\r\\n}\\r\\n\\r\\n/* Search box */\\r\\n.search-box{\\r\\n  width: 260px;\\r\\n  border: 1px solid #7aa0ff;\\r\\n  padding: 8px 10px;\\r\\n  font-size: 14px;\\r\\n  outline: none;\\r\\n}\\r\\n\\r\\n/* Headings */\\r\\nh1{\\r\\n  font-size: 22px;\\r\\n  margin: 20px 0 10px;\\r\\n}\\r\\n\\r\\nh2{\\r\\n  font-size: 18px;\\r\\n  margin: 20px 0 10px;\\r\\n}\\r\\n\\r\\n/* Paragraph */\\r\\n.text{\\r\\n  font-size: 14px;\\r\\n  line-height: 1.7;\\r\\n  margin-bottom: 12px;\\r\\n}\\r\\n\\r\\n/* Table */\\r\\ntable{\\r\\n  width:100%;\\r\\n  border-collapse: collapse;\\r\\n  margin: 15px 0;\\r\\n  font-size: 14px;\\r\\n}\\r\\n\\r\\nth, td{\\r\\n  border:1px solid #999;\\r\\n  padding:10px;\\r\\n  vertical-align: top;\\r\\n}\\r\\n\\r\\nth{\\r\\n  background:#f2f2f2;\\r\\n  text-align:left;\\r\\n  font-weight:500;\\r\\n}\\r\\n\\r\\n/* Links */\\r\\na{\\r\\n  color:#1a5fd0;\\r\\n  text-decoration:none;\\r\\n}\\r\\n\\r\\na:hover{\\r\\n  text-decoration:underline;\\r\\n}","js":""}', 0, 1, '2026-04-29 10:02:24', '2026-04-29 10:23:40', NULL),
	(27, 'Related Links', '/related-links', NULL, NULL, NULL, NULL, NULL, '{"html":"<div class=\\"container\\">\\r\\n    <div class=\\"search-container\\">\\r\\n        <i class=\\"fas fa-search search-icon\\"></i>\\r\\n        <input type=\\"text\\" placeholder=\\"Search Related Links\\">\\r\\n    </div>\\r\\n\\r\\n    <div class=\\"links-wrapper\\">\\r\\n        <div class=\\"link-card\\">\\r\\n            <span class=\\"link-text\\">Global Tender Enquiry Proposal</span>\\r\\n            <a href=\\"https://esamiksha.gov.in/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\" class=\\"visit-btn\\"><i class=\\"fas fa-external-link-alt\\"></i>\\r\\n                <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n                    <path d=\\"M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"\\r\\n                        stroke-linecap=\\"round\\" />\\r\\n                    <path d=\\"M9 1h4v4M13 1L7 7\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"\\r\\n                        stroke-linejoin=\\"round\\" />\\r\\n                </svg>\\r\\n                VISIT WEBSITE</a>\\r\\n        </div>\\r\\n\\r\\n        <div class=\\"link-card\\">\\r\\n            <span class=\\"link-text\\">Secretary List</span>\\r\\n            <a href=\\"https://doptcirculars.nic.in/Default.aspx?URL=6G4WVPFk5ngz\\"\\r\\n                class=\\"visit-btn\\"><i class=\\"fas fa-external-link-alt\\"></i>\\r\\n                <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n                    <path d=\\"M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"\\r\\n                        stroke-linecap=\\"round\\" />\\r\\n                    <path d=\\"M9 1h4v4M13 1L7 7\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"\\r\\n                        stroke-linejoin=\\"round\\" />\\r\\n                </svg> VISIT WEBSITE</a>\\r\\n        </div>\\r\\n\\r\\n        <div class=\\"link-card\\">\\r\\n            <span class=\\"link-text\\">Chief Secretary List</span>\\r\\n            <a href=\\"https://doptcirculars.nic.in/Default.aspx?URL=DFcTMmz52pRG\\"\\r\\n                class=\\"visit-btn\\"><i class=\\"fas fa-external-link-alt\\"></i>\\r\\n                <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n                    <path d=\\"M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"\\r\\n                        stroke-linecap=\\"round\\" />\\r\\n                    <path d=\\"M9 1h4v4M13 1L7 7\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"\\r\\n                        stroke-linejoin=\\"round\\" />\\r\\n                </svg>\\r\\n                VISIT WEBSITE</a>\\r\\n        </div>\\r\\n\\r\\n        <div class=\\"link-card\\">\\r\\n            <span class=\\"link-text\\">Employee Corner</span>\\r\\n            <a href=\\"https://pfms.nic.in/Home.aspx\\" class=\\"visit-btn\\"><i class=\\"fas fa-external-link-alt\\"></i>\\r\\n                <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n                    <path d=\\"M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"\\r\\n                        stroke-linecap=\\"round\\" />\\r\\n                    <path d=\\"M9 1h4v4M13 1L7 7\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"\\r\\n                        stroke-linejoin=\\"round\\" />\\r\\n                </svg>\\r\\n                VISIT WEBSITE</a>\\r\\n        </div>\\r\\n\\r\\n        <div class=\\"link-card\\">\\r\\n            <span class=\\"link-text\\">eResource</span>\\r\\n            <a href=\\"https://eresource.gov.in//login/login.php\\"\\r\\n                class=\\"visit-btn\\"><i class=\\"fas fa-external-link-alt\\"></i>\\r\\n                <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n                    <path d=\\"M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"\\r\\n                        stroke-linecap=\\"round\\" />\\r\\n                    <path d=\\"M9 1h4v4M13 1L7 7\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"\\r\\n                        stroke-linejoin=\\"round\\" />\\r\\n                </svg>\\r\\n                VISIT WEBSITE</a>\\r\\n        </div>\\r\\n\\r\\n        <div class=\\"link-card\\">\\r\\n            <span class=\\"link-text\\">Data.gov.in</span>\\r\\n            <a href=\\"https://www.data.gov.in/\\" class=\\"visit-btn\\"><i class=\\"fas fa-external-link-alt\\"></i>\\r\\n                <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n                    <path d=\\"M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"\\r\\n                        stroke-linecap=\\"round\\" />\\r\\n                    <path d=\\"M9 1h4v4M13 1L7 7\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"\\r\\n                        stroke-linejoin=\\"round\\" />\\r\\n                </svg>\\r\\n                VISIT WEBSITE</a>\\r\\n        </div>\\r\\n\\r\\n        <div class=\\"link-card\\">\\r\\n            <span class=\\"link-text\\">MyGov</span>\\r\\n            <a href=\\"https://www.mygov.in/\\" class=\\"visit-btn\\"><i class=\\"fas fa-external-link-alt\\"></i>\\r\\n                <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n                    <path d=\\"M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"\\r\\n                        stroke-linecap=\\"round\\" />\\r\\n                    <path d=\\"M9 1h4v4M13 1L7 7\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"\\r\\n                        stroke-linejoin=\\"round\\" />\\r\\n                </svg>\\r\\n                VISIT WEBSITE</a>\\r\\n        </div>\\r\\n\\r\\n        <div class=\\"link-card\\">\\r\\n            <span class=\\"link-text\\">DigiLocker</span>\\r\\n            <a href=\\"https://www.digilocker.gov.in/\\" class=\\"visit-btn\\"><i class=\\"fas fa-external-link-alt\\"></i>\\r\\n                <svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 14 14\\" fill=\\"none\\">\\r\\n                    <path d=\\"M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\"\\r\\n                        stroke-linecap=\\"round\\" />\\r\\n                    <path d=\\"M9 1h4v4M13 1L7 7\\" stroke=\\"currentColor\\" stroke-width=\\"1.3\\" stroke-linecap=\\"round\\"\\r\\n                        stroke-linejoin=\\"round\\" />\\r\\n                </svg>\\r\\n                VISIT WEBSITE</a>\\r\\n        </div>\\r\\n    </div>\\r\\n</div>","css":"* {\\r\\n    margin: 0;\\r\\n    padding: 0;\\r\\n    box-sizing: border-box;\\r\\n    font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif;\\r\\n}\\r\\n\\r\\nbody {\\r\\n    background-color: #fcfcfc; /* Light background as seen in image */\\r\\n    display: flex;\\r\\n    justify-content: center;\\r\\n    padding: 40px 20px;\\r\\n}\\r\\n\\r\\n.container {\\r\\n    width: 100%;\\r\\n    max-width: 900px;\\r\\n}\\r\\n\\r\\n/* Search Bar Styling */\\r\\n.search-container {\\r\\n    position: relative;\\r\\n    margin-bottom: 25px;\\r\\n}\\r\\n\\r\\n.search-icon {\\r\\n    position: absolute;\\r\\n    left: 15px;\\r\\n    top: 50%;\\r\\n    transform: translateY(-50%);\\r\\n    color: #4a7c92;\\r\\n    font-size: 18px;\\r\\n}\\r\\n\\r\\n.search-container input {\\r\\n    width: 100%;\\r\\n    padding: 12px 12px 12px 45px;\\r\\n    border: 1.5px solid #4a74d4; /* Blue border */\\r\\n    border-radius: 6px;\\r\\n    font-size: 16px;\\r\\n    color: #555;\\r\\n    outline: none;\\r\\n}\\r\\n\\r\\n/* Links Wrapper */\\r\\n.links-wrapper {\\r\\n    display: flex;\\r\\n    flex-direction: column;\\r\\n    gap: 12px; /* Spacing between cards */\\r\\n}\\r\\n\\r\\n/* Individual Link Card */\\r\\n.link-card {\\r\\n    background: #fff;\\r\\n    border: 1px solid #e0e0e0;\\r\\n    border-radius: 8px;\\r\\n    display: flex;\\r\\n    justify-content: space-between;\\r\\n    align-items: center;\\r\\n    padding: 10px 15px;\\r\\n    transition: box-shadow 0.3s ease;\\r\\n}\\r\\n\\r\\n.link-card:hover {\\r\\n    box-shadow: 0 2px 8px rgba(0,0,0,0.05);\\r\\n}\\r\\n\\r\\n.link-text {\\r\\n    font-size: 16px;\\r\\n    color: #333;\\r\\n    font-weight: 500;\\r\\n}\\r\\n\\r\\n/* Visit Website Button */\\r\\n.visit-btn {\\r\\n    background-color: #dbe4ff; /* Very light blue background */\\r\\n    color: #2c54c1; /* Strong blue text */\\r\\n    text-decoration: none;\\r\\n    font-size: 12px;\\r\\n    font-weight: bold;\\r\\n    padding: 10px 20px;\\r\\n    border-radius: 6px;\\r\\n    display: flex;\\r\\n    align-items: center;\\r\\n    gap: 8px;\\r\\n    transition: background 0.3s ease;\\r\\n}\\r\\n\\r\\n.visit-btn:hover {\\r\\n    background-color: #c9d6ff;\\r\\n}\\r\\n\\r\\n.visit-btn i {\\r\\n    font-size: 14px;\\r\\n}\\r\\n\\r\\n/* Responsive adjustment */\\r\\n@media (max-width: 600px) {\\r\\n    .link-card {\\r\\n        flex-direction: column;\\r\\n        align-items: flex-start;\\r\\n        gap: 10px;\\r\\n    }\\r\\n    .visit-btn {\\r\\n        width: 100%;\\r\\n        justify-content: center;\\r\\n    }\\r\\n}","js":""}', 0, 1, '2026-04-29 10:29:58', '2026-04-29 12:35:15', NULL),
	(29, 'Cabinet Secretary', '/cabinet-secretariat/cabinet-secretary', NULL, NULL, NULL, NULL, NULL, '{"html":"<!DOCTYPE html>\\r\\n<html lang=\\"en\\">\\r\\n<head>\\r\\n  <meta charset=\\"UTF-8\\">\\r\\n  <title>Profile</title>\\r\\n  <link rel=\\"stylesheet\\" href=\\"style.css\\">\\r\\n</head>\\r\\n<body>\\r\\n\\r\\n<div class=\\"container\\">\\r\\n  \\r\\n  <div class=\\"profile-card\\">\\r\\n    \\r\\n    <!-- Left Image -->\\r\\n    <div class=\\"profile-image\\">\\r\\n      <img src=\\"http://localhost:3000/images/our-team/a.jpg\\" alt=\\"Profile Photo\\">\\r\\n    </div>\\r\\n\\r\\n    <!-- Right Content -->\\r\\n    <div class=\\"profile-content\\">\\r\\n     <h2>Dr. T. V. Somanathan</h2><h3><strong>CABINET SECRETARY</strong></h3><p>Dr. T. V. Somanathan is a distinguished Indian Administrative Service officer of the 1987 batch, Tamil Nadu cadre, currently serving as the <strong>Cabinet Secretary of India</strong> since <strong>30 August 2024</strong>. With an illustrious career spanning over three decades, he has held several key positions at both national and international levels.</p><p>Prior to his appointment as Cabinet Secretary, Dr. Somanathan served as the <strong>Finance Secretary of India</strong>, heading the <strong>Department of Expenditure</strong>. His earlier roles at the Centre include serving as <strong>Additional Secretary</strong> and <strong>Joint Secretary in the Prime Ministerâ€™s Office (PMO)</strong>, where he played a pivotal role in various governance and policy initiatives.</p><p>Internationally, Dr. Somanathan served as <strong>Director, Corporate Affairs</strong> at the <strong>World Bank Group</strong> in Washington, D.C., having initially joined through its prestigious <strong>Young Professionals Program</strong>. His expertise in public finance and economic policy has been widely recognized both in India and abroad.</p><p>In the Ministry of Corporate Affairs, he contributed significantly as <strong>Joint Secretary</strong>, focusing on reforms and regulatory frameworks that enhanced corporate governance.</p><h3><strong>Educational Qualifications</strong></h3><ul><li><strong>Ph.D. in Economics</strong>, University of Calcutta</li><li><strong>Executive Development Program</strong>, Harvard Business School</li><li><strong>Chartered Accountant (CA)</strong></li><li><strong>Cost Accountant (CMA)</strong></li><li><strong>Company Secretary (CS)</strong></li></ul><p>Dr. Somanathan combines deep academic insight with practical administrative experience, making him one of Indiaâ€™s most respected civil servants. His professional journey reflects a commitment to excellence, integrity, and nation-building.</p>\\r\\n\\r\\n    </div>\\r\\n\\r\\n  </div>\\r\\n\\r\\n</div>\\r\\n\\r\\n</body>\\r\\n</html>","css":"body {\\r\\n  margin: 0;\\r\\n  font-family: Arial, sans-serif;\\r\\n}\\r\\n\\r\\n.container {\\r\\n  display: flex;\\r\\n  justify-content: center;\\r\\n  padding: 40px;\\r\\n}\\r\\n\\r\\n.profile-card {\\r\\n  display: flex;\\r\\n  gap: 40px;\\r\\n  padding: 30px;\\r\\n  max-width: 1100px;\\r\\n  width: 100%;\\r\\n}\\r\\n\\r\\n.profile-image img {\\r\\n  width: 280px;\\r\\n  height: auto;\\r\\n  object-fit: cover;\\r\\n}\\r\\n\\r\\n.profile-content {\\r\\n  flex: 1;\\r\\n}\\r\\n\\r\\n.profile-content h1 {\\r\\n  margin: 0;\\r\\n  font-size: 24px;\\r\\n  color: #1a2a5a;\\r\\n}\\r\\n\\r\\n.profile-content h3 {\\r\\n  margin-top: 5px;\\r\\n  font-size: 14px;\\r\\n  letter-spacing: 1px;\\r\\n}\\r\\n\\r\\n.profile-content p {\\r\\n  font-size: 14px;\\r\\n  line-height: 1.6;\\r\\n  color: #333;\\r\\n}\\r\\n\\r\\n.profile-content h4 {\\r\\n  margin-top: 20px;\\r\\n  font-size: 16px;\\r\\n}\\r\\n\\r\\n.profile-content ul {\\r\\n  padding-left: 20px;\\r\\n}\\r\\n\\r\\n.profile-content ul li {\\r\\n  margin-bottom: 8px;\\r\\n  font-size: 14px;\\r\\n}","js":""}', 0, 1, '2026-05-05 10:29:48', '2026-05-13 06:01:52', NULL);

-- Dumping structure for table cabsec_cms_hi.partner_logos
CREATE TABLE IF NOT EXISTS `partner_logos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.partner_logos: ~6 rows (approximately)
DELETE FROM `partner_logos`;
INSERT INTO `partner_logos` (`id`, `title`, `image_url`, `alt_text`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, '', '/uploads/media/1778068414059_vxjcco.jpg', 'pm', 0, 1, '2026-05-06 11:55:42', '2026-05-06 11:55:42'),
	(2, '', '/uploads/media/1778068572833_41lxg2.jpg', 'Data Gov.in', 1, 1, '2026-05-06 11:56:27', '2026-05-06 11:56:27'),
	(3, '', '/uploads/media/1778068598881_q9mnrj.jpg', '97482eee88b8f2a19bf5d9780077830c', 0, 1, '2026-05-06 11:56:39', '2026-05-06 11:56:39'),
	(4, '', '/uploads/media/1778068611289_6grf2q.jpg', '916e9ab3e813d51ff056b428eaedac42', 4, 1, '2026-05-06 11:56:54', '2026-05-06 11:56:54'),
	(5, '', '/uploads/media/1778068624420_qk6hqv.jpg', 'cebc17a8f9c8fe7643156e9ea2d1741d', 5, 1, '2026-05-06 11:57:06', '2026-05-06 11:57:06'),
	(6, '', '/uploads/media/1778068636290_w4oql3.jpg', 'dd10418bcbdd24e8c56f2ca2ef3c85a8', 7, 1, '2026-05-06 11:57:18', '2026-05-06 11:57:18');

-- Dumping structure for table cabsec_cms_hi.photo_galleries
CREATE TABLE IF NOT EXISTS `photo_galleries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date` date NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `photo_galleries_chk_1` CHECK (json_valid(`images`))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.photo_galleries: ~1 rows (approximately)
DELETE FROM `photo_galleries`;
INSERT INTO `photo_galleries` (`id`, `title`, `date`, `images`, `created_at`, `updated_at`) VALUES
	(2, 'test', '2025-06-05', '[{"url":"/uploads/media/1777447061526_3iy1bq.jpg","alt":""}]', '2026-04-28 12:54:11', '2026-04-29 07:17:42');

-- Dumping structure for table cabsec_cms_hi.pm_quotes
CREATE TABLE IF NOT EXISTS `pm_quotes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quote_text` text COLLATE utf8mb4_general_ci NOT NULL,
  `author` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'Prime Minister',
  `image_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `event_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quote_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.pm_quotes: ~1 rows (approximately)
DELETE FROM `pm_quotes`;
INSERT INTO `pm_quotes` (`id`, `quote_text`, `author`, `image_url`, `event_url`, `quote_date`, `created_at`, `updated_at`) VALUES
	(1, 'भारत आज सिर्फ growth कि वजह से नहीं जाना जा रहा बल्कि governance,\n transparency और innovation के नए benchmarks सेट कर रहा है|\n\n', 'PMâ€™s address on the 17th Civil Services Day', 'http://localhost:3000/images/pm/pm-modi.jpg', 'https://www.pmindia.gov.in/en/news_updates/pms-address-on-the-17th-civil-services-day/?comment=disable', '2026-04-18', '2025-10-14 07:45:11', '2026-05-20 06:25:48');

-- Dumping structure for table cabsec_cms_hi.recent_docs
CREATE TABLE IF NOT EXISTS `recent_docs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `link_url` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.recent_docs: ~4 rows (approximately)
DELETE FROM `recent_docs`;
INSERT INTO `recent_docs` (`id`, `title`, `description`, `link_url`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, 'Orders and Notices', 'Assigning the work related to SCOMET and Wassenaar Arrangement to IPHW Division', NULL, 0, 1, '2025-10-14 12:50:42', '2025-11-07 09:51:24'),
	(2, 'Gazettes Notifications', 'Recruitment Rules for Group \'A\' S&T posts', NULL, 1, 1, '2025-10-14 12:51:08', '2025-10-14 12:51:08'),
	(3, 'Gazettes Notifications', 'LDCE Rules for the posts of PA', NULL, 2, 1, '2025-10-14 12:51:24', '2025-11-07 09:51:21'),
	(4, 'Gazettes Notifications', 'LDCE Rules for the posts of ASO', NULL, 3, 1, '2025-10-14 12:51:38', '2025-10-14 12:51:38');

-- Dumping structure for table cabsec_cms_hi.report_files
CREATE TABLE IF NOT EXISTS `report_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `original_name` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `file_url` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL,
  `file_type` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_report_files_report` (`report_id`),
  CONSTRAINT `report_files_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.report_files: ~12 rows (approximately)
DELETE FROM `report_files`;
INSERT INTO `report_files` (`id`, `report_id`, `original_name`, `file_url`, `file_type`, `file_size`, `created_at`) VALUES
	(58, 20, 'Council of Ministers with Portfolios', '/report_document/a/b/c/a.pdf', 'application/pdf', 122340, '2026-05-13 09:23:25'),
	(59, 20, 'Council of Ministers with Portfolios', '/report_document/files-1778664224498-552720493.pdf', 'application/pdf', 122340, '2026-05-13 09:23:48'),
	(60, 21, '1/34/1/2024-Cab dated', '/report_document/files-1778664256039-392730042.pdf', 'application/pdf', 122340, '2026-05-13 09:24:22'),
	(61, 21, '1/34/1/2024-Cab dated', '/report_document/files-1778664273113-779116533.pdf', 'application/pdf', 122340, '2026-05-13 09:24:35'),
	(62, 22, 'Swearing of New Ministers', '/report_document/files-1778664302153-486725820.pdf', 'application/pdf', 122340, '2026-05-13 09:25:17'),
	(63, 22, 'Swearing of New Ministers', '/report_document/files-1778664323824-407952927.pdf', 'application/pdf', 122340, '2026-05-13 09:25:29'),
	(64, 20, 'Council of Ministers with Portfolios', '/report_document/files-1778664344245-162061482.pdf', 'application/pdf', 122340, '2026-05-13 09:25:47'),
	(65, 20, 'Council of Ministers with Portfolios', '/report_document/files-1778664353066-227241097.pdf', 'application/pdf', 332743, '2026-05-13 09:25:56'),
	(66, 20, 'Council of Ministers with Portfolios', '/report_document/files-1778664353070-432936369.pdf', 'application/pdf', 122340, '2026-05-13 09:25:56'),
	(67, 23, 'Cabinet Committees', '/report_document/files-1778664393816-365499858.pdf', 'application/pdf', 122340, '2026-05-13 09:26:35'),
	(68, 24, '1/20/1/2024-Cab', '/report_document/files-1778664440206-650638054.pdf', 'application/pdf', 122340, '2026-05-13 09:27:34'),
	(69, 24, '1/20/1/2024-cab.', '/report_document/files-1778664469407-808596754.pdf', 'application/pdf', 122340, '2026-05-13 09:27:57');

-- Dumping structure for table cabsec_cms_hi.reports
CREATE TABLE IF NOT EXISTS `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('pdf','group','link') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pdf',
  `year` int DEFAULT NULL,
  `size` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_url` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nav_item_id` int DEFAULT NULL,
  `item_count` int DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_archived` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reports_active` (`is_active`),
  KEY `idx_reports_year` (`year`),
  KEY `idx_reports_nav_item_id` (`nav_item_id`),
  KEY `idx_reports_archived` (`is_archived`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.reports: ~5 rows (approximately)
DELETE FROM `reports`;
INSERT INTO `reports` (`id`, `title`, `type`, `year`, `size`, `file_url`, `nav_item_id`, `item_count`, `display_order`, `is_active`, `is_archived`, `created_at`, `updated_at`) VALUES
	(20, 'Council of Ministers', 'group', 2026, NULL, NULL, 48, NULL, 0, 1, 0, '2026-05-13 09:21:02', '2026-05-13 09:25:56'),
	(21, ' Change In Portfolios', 'group', 2026, NULL, NULL, 48, NULL, 1, 1, 0, '2026-05-13 09:24:22', '2026-05-13 09:24:35'),
	(22, ' Swearing of New Ministers', 'group', 2026, NULL, NULL, 48, NULL, 2, 1, 0, '2026-05-13 09:25:17', '2026-05-13 09:25:29'),
	(23, 'Cabinet Committees', 'group', 2026, NULL, '', 49, NULL, 3, 1, 0, '2026-05-13 09:26:35', '2026-05-13 09:26:35'),
	(24, 'Amendments to ToB Rules', 'group', 2026, NULL, NULL, 50, NULL, 4, 1, 0, '2026-05-13 09:27:34', '2026-05-13 09:27:57');

-- Dumping structure for table cabsec_cms_hi.rti_items
CREATE TABLE IF NOT EXISTS `rti_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section_id` int NOT NULL,
  `title` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `file_url` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_size` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_type` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rti_items_section` (`section_id`),
  KEY `idx_rti_items_order` (`display_order`),
  KEY `idx_rti_items_active` (`is_active`),
  CONSTRAINT `rti_items_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `rti_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.rti_items: ~17 rows (approximately)
DELETE FROM `rti_items`;
INSERT INTO `rti_items` (`id`, `section_id`, `title`, `file_url`, `file_size`, `file_type`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, 8, 'Budget Allocation (13.03.2025)', '/report_document/file-1777959822593-633976319.pdf', '324.94 KB', 'PDF', 0, 1, '2026-05-05 05:43:48', '2026-05-05 05:43:48'),
	(2, 8, 'Budget Allocation (23.08.2024)', '/report_document/file-1777959893881-929305855.pdf', '324.94 KB', 'PDF', 1, 1, '2026-05-05 05:44:55', '2026-05-05 05:44:55'),
	(3, 8, 'Budget Allocation (26.03.2024)', '/report_document/file-1777959906615-71733489.pdf', '324.94 KB', 'PDF', 2, 1, '2026-05-05 05:45:07', '2026-05-05 05:45:07'),
	(4, 8, 'Budget Allocation (24.03.2023)', '/report_document/file-1777959917082-465876166.pdf', '324.94 KB', 'PDF', 3, 1, '2026-05-05 05:45:18', '2026-05-05 05:45:18'),
	(5, 8, 'Budget Allocation (03.03.2022)', '/report_document/file-1777959930722-969703747.pdf', '324.94 KB', 'PDF', 4, 1, '2026-05-05 05:45:31', '2026-05-05 05:45:31'),
	(6, 8, 'Budget Allocation (17.01.2022)', '/report_document/file-1777959945873-590978872.pdf', '324.94 KB', 'PDF', 5, 1, '2026-05-05 05:45:46', '2026-05-05 05:45:46'),
	(7, 8, 'Budget Allocation (17.03.2021)', '/report_document/file-1777959956196-352234508.pdf', '324.94 KB', 'PDF', 6, 1, '2026-05-05 05:45:56', '2026-05-05 05:45:56'),
	(8, 1, 'Work Allocation of CPIOs & FAAs', '/report_document/file-1777959969732-298326791.pdf', '324.94 KB', 'PDF', 0, 1, '2026-05-05 05:46:10', '2026-05-05 05:46:10'),
	(9, 2, 'Record Officer', '/report_document/file-1777959983650-682436314.pdf', '324.94 KB', 'PDF', 0, 1, '2026-05-05 05:46:24', '2026-05-05 05:46:24'),
	(10, 3, 'Categories of Documents', '/report_document/file-1777959996264-973797930.pdf', '324.94 KB', 'PDF', 0, 1, '2026-05-05 05:46:36', '2026-05-05 05:46:36'),
	(11, 4, 'ISTM', '/report_document/file-1777960012379-867019956.pdf', '324.94 KB', 'PDF', 0, 1, '2026-05-05 05:46:53', '2026-05-05 05:46:53'),
	(12, 5, 'FAQ Under Right to Information Act 2005', '/report_document/file-1777960023435-929188584.pdf', '324.94 KB', 'PDF', 0, 1, '2026-05-05 05:47:05', '2026-05-05 05:47:05'),
	(13, 6, 'Work Distribution', '/report_document/file-1777960034207-35404351.pdf', '324.94 KB', 'PDF', 0, 1, '2026-05-05 05:47:14', '2026-05-05 05:47:14'),
	(14, 7, 'Officials Monthly Remuneration', '/report_document/file-1777960048730-661263383.pdf', '324.94 KB', 'PDF', 0, 1, '2026-05-05 05:47:29', '2026-05-05 05:47:29'),
	(15, 17, 'Request Form/ Facilities/ Fee', '/report_document/file-1777965440790-814569059.pdf', '324.94 KB', 'PDF', 0, 1, '2026-05-05 07:17:22', '2026-05-05 07:17:22'),
	(16, 18, 'Organization Chart', '/report_document/file-1777965466202-766366221.pdf', '324.94 KB', 'PDF', 0, 1, '2026-05-05 07:17:46', '2026-05-05 07:17:46'),
	(17, 19, 'Quarterly Report', '/report_document/file-1777965486105-327371154.pdf', '324.94 KB', 'PDF', 0, 1, '2026-05-05 07:18:06', '2026-05-05 07:18:06');

-- Dumping structure for table cabsec_cms_hi.rti_page_content
CREATE TABLE IF NOT EXISTS `rti_page_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'RTI',
  `intro_heading` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'Power and Duties of Officials',
  `intro_bullets` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `is_active` tinyint(1) DEFAULT '1',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `rti_page_content_chk_1` CHECK (json_valid(`intro_bullets`))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.rti_page_content: ~2 rows (approximately)
DELETE FROM `rti_page_content`;
INSERT INTO `rti_page_content` (`id`, `page_title`, `intro_heading`, `intro_bullets`, `is_active`, `updated_at`) VALUES
	(1, 'RTI', 'Power and Duties of Officials', '["To Provide Secretarial assistance to the Cabinet and Cabinet Committees.",\r\n  "To Frame Rules of Business."]', 1, '2026-05-05 07:12:45'),
	(2, 'RTI', 'Power and Duties of Officials', '["To Provide Secretarial assistance to the Cabinet and Cabinet Committees.",\r\n  "To Frame Rules of Business."]', 1, '2026-05-05 05:40:54');

-- Dumping structure for table cabsec_cms_hi.rti_sections
CREATE TABLE IF NOT EXISTS `rti_sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rti_sections_order` (`display_order`),
  KEY `idx_rti_sections_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.rti_sections: ~11 rows (approximately)
DELETE FROM `rti_sections`;
INSERT INTO `rti_sections` (`id`, `title`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, '1. CPIO and Appellate Authorities', 1, 1, '2026-05-05 05:31:13', '2026-05-05 05:31:13'),
	(2, '2. Record Officer', 2, 1, '2026-05-05 05:31:13', '2026-05-05 05:31:13'),
	(3, '3. Categories of Documents', 3, 1, '2026-05-05 05:31:13', '2026-05-05 05:31:13'),
	(4, '4. ISTM', 4, 1, '2026-05-05 05:31:13', '2026-05-05 05:31:13'),
	(5, '5. FAQ Under Right to Information Act 2005', 5, 1, '2026-05-05 05:31:13', '2026-05-05 05:31:13'),
	(6, '6. Work Distribution', 6, 1, '2026-05-05 05:31:13', '2026-05-05 05:31:13'),
	(7, '7. Officials Monthly Remuneration', 7, 1, '2026-05-05 05:31:13', '2026-05-05 05:31:13'),
	(8, '8. Budget Allocation', 8, 1, '2026-05-05 05:31:13', '2026-05-05 05:31:13'),
	(17, '9. Request Form/ Facilities/ Fee', 9, 1, '2026-05-05 07:16:45', '2026-05-05 07:17:01'),
	(18, '10. Organization Chart', 10, 1, '2026-05-05 07:17:37', '2026-05-05 07:17:37'),
	(19, '11. Quarterly Report', 11, 1, '2026-05-05 07:17:57', '2026-05-05 07:17:57');

-- Dumping structure for table cabsec_cms_hi.social_media_posts
CREATE TABLE IF NOT EXISTS `social_media_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `platform` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `post_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.social_media_posts: ~0 rows (approximately)
DELETE FROM `social_media_posts`;

-- Dumping structure for table cabsec_cms_hi.vacancies_tenders
CREATE TABLE IF NOT EXISTS `vacancies_tenders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('vacancy','tender') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'vacancy',
  `description` text COLLATE utf8mb4_general_ci,
  `tender_id` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `published_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_size` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_archived` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_vacancies_tenders_type` (`type`),
  KEY `idx_vacancies_tenders_published` (`published_date`),
  KEY `idx_vacancies_tenders_active` (`is_active`,`is_archived`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.vacancies_tenders: ~5 rows (approximately)
DELETE FROM `vacancies_tenders`;
INSERT INTO `vacancies_tenders` (`id`, `title`, `type`, `description`, `tender_id`, `published_date`, `due_date`, `file_name`, `file_size`, `is_active`, `is_archived`, `created_at`, `updated_at`) VALUES
	(8, 'Filling of two posts of Staff Car Driver in Cabsec', 'vacancy', 'Filling up of one (01) post of Staff Car Driver(Ordinary Grade) [Group â€œCâ€, non-Gazetted, non-Ministerial, Pay Level â€“ 2 ] in Cabinet Secretariat on deputation / absorption basis. (14/11/2022)', NULL, '0000-00-00', NULL, '1777901209286-y8mgvpc75p.pdf', '324.9 KB', 1, 0, '2026-05-04 13:26:49', '2026-05-22 06:31:46'),
	(9, 'Tenders (2020)', 'tender', NULL, 'cabsec-2020', '2020-11-06', '2020-11-06', '1777901282064-jnzx41cwyz.pdf', '324.9 KB', 1, 0, '2026-05-04 13:28:02', '2026-05-08 08:51:13'),
	(10, 'Vacancies (2020)', 'vacancy', 'Vacancies (2020)\nFilling up the post of Data Entry Operator Grade â€œCâ€ (DEO Gr. â€œCâ€) in Level-6 of pay matrix (7th CPC scale) in Cabinet Secretariat on deputation basis. (26/02/2020)', NULL, '2020-02-26', NULL, '1777901534391-a1vnxmel8oj.pdf', '324.9 KB', 1, 0, '2026-05-04 13:32:14', '2026-05-06 09:04:35'),
	(11, 'Tenders (2019)', 'tender', NULL, 'cabsec-2019', '2019-09-12', '2019-09-21', '1777901606986-qka9ial9nlm.pdf', '324.9 KB', 1, 0, '2026-05-04 13:33:27', '2026-05-06 07:26:46'),
	(12, 'Tenders (2018)', 'tender', NULL, 'cabsec-2018', '2018-06-18', '2018-06-18', '1778224879056-mo56rw0fco.pdf', '324.9 KB', 1, 0, '2026-05-08 07:21:19', '2026-05-08 07:21:19');

-- Dumping structure for table cabsec_cms_hi.whats_new
CREATE TABLE IF NOT EXISTS `whats_new` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `type` enum('pdf','link') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'link',
  `file_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `external_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms_hi.whats_new: ~1 rows (approximately)
DELETE FROM `whats_new`;
INSERT INTO `whats_new` (`id`, `title`, `description`, `type`, `file_url`, `external_url`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, 'Complete AOB Rules', NULL, 'pdf', '/uploads/media/1778069861747_n96w54.pdf', NULL, 1, 1, '2026-05-06 12:17:43', '2026-05-06 12:17:43');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
