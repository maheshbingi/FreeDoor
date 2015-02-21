SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';


CREATE SCHEMA IF NOT EXISTS `freedoor` DEFAULT CHARACTER SET latin1 ;
USE `freedoor` ;


CREATE TABLE IF NOT EXISTS `freedoor`.`Category` (
  `categoryId` INT(11) NOT NULL auto_increment,
  `categoryName` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`categoryId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


CREATE TABLE IF NOT EXISTS `freedoor`.`User` (
  `userId` INT(11) NOT NULL auto_increment,
  `firstName` VARCHAR(45) NULL DEFAULT NULL,
  `lastName` VARCHAR(45) NULL DEFAULT NULL,
  `emailId` VARCHAR(45) NULL DEFAULT NULL,
  `mobile` BIGINT(15) NULL DEFAULT NULL,
  PRIMARY KEY (`userId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


CREATE TABLE IF NOT EXISTS `freedoor`.`Product` (
  `productId` INT(11) NOT NULL auto_increment,
  `productName` VARCHAR(45) NULL DEFAULT NULL,
  `quantity` INT(11) NULL DEFAULT NULL,
  `userId` INT(11) NULL DEFAULT NULL,
  `expectedOffer` VARCHAR(100) NULL DEFAULT NULL,
  `productDesc` VARCHAR(200) NULL DEFAULT NULL,
  `productExpiryDate` DATE NULL DEFAULT NULL,
  `isValid` TINYINT(1) NOT NULL DEFAULT 1,
  `categoryId` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`productId`),
  INDEX `userId_fk1_idx` (`userId` ASC),
  INDEX `categoryId_fk1_idx` (`categoryId` ASC),
  CONSTRAINT `categoryId_fk1`
    FOREIGN KEY (`categoryId`)
    REFERENCES `freedoor`.`Category` (`categoryId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `userId_fk1`
    FOREIGN KEY (`userId`)
    REFERENCES `freedoor`.`User` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


CREATE TABLE IF NOT EXISTS `freedoor`.`Offer` (
  `offerId` INT(11) NOT NULL auto_increment,
  `buyingQty` INT(11) NULL DEFAULT NULL,
  `offeredDetails` VARCHAR(100) NULL DEFAULT NULL,
  `buyerStatus` VARCHAR(45) NULL DEFAULT NULL,
  `sellerStatus` VARCHAR(45) NULL DEFAULT NULL,
  `offerExpiry` DATETIME NULL DEFAULT NULL,
  `productId` INT(11) NOT NULL,
  `buyerId` INT(11) NOT NULL,
  `lastModified` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`offerId`),
  INDEX `fk_Offer_Product1_idx` (`productId` ASC),
  INDEX `fk_Offer_User1_idx` (`buyerId` ASC),
  CONSTRAINT `fk_Offer_Product1`
    FOREIGN KEY (`productId`)
    REFERENCES `freedoor`.`Product` (`productId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Offer_User1`
    FOREIGN KEY (`buyerId`)
    REFERENCES `freedoor`.`User` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


CREATE TABLE IF NOT EXISTS `freedoor`.`Comment` (
  `commentId` INT(11) NOT NULL auto_increment,
  `commentDesc` VARCHAR(45) NULL DEFAULT NULL,
  `lastUpdated` DATETIME NULL DEFAULT NULL,
  `offerId` INT(11) NOT NULL,
  `userId` INT(11) NOT NULL,
  PRIMARY KEY (`commentId`),
  INDEX `fk_Comment_Offer1_idx` (`offerId` ASC),
  INDEX `fk_Comment_User1_idx` (`userId` ASC),
  CONSTRAINT `fk_Comment_Offer1`
    FOREIGN KEY (`offerId`)
    REFERENCES `freedoor`.`Offer` (`offerId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Comment_User1`
    FOREIGN KEY (`userId`)
    REFERENCES `freedoor`.`User` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


CREATE TABLE IF NOT EXISTS `freedoor`.`OfferHistory` (
  `offerHistoryId` INT(11) NOT NULL auto_increment,
  `modified` VARCHAR(105) NULL DEFAULT NULL,
  `lastModified` DATETIME NULL DEFAULT NULL,
  `offerId` INT(11) NOT NULL,
  PRIMARY KEY (`offerHistoryId`),
  INDEX `fk_OfferHistory_Offer1_idx` (`offerId` ASC),
  CONSTRAINT `fk_OfferHistory_Offer1`
    FOREIGN KEY (`offerId`)
    REFERENCES `freedoor`.`Offer` (`offerId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

INSERT INTO `freedoor`.`category` (`categoryId`, `categoryName`) VALUES ('1', 'Electronics');
INSERT INTO `freedoor`.`category` (`categoryId`, `categoryName`) VALUES ('2', 'Beauty, Health & Grocery');
INSERT INTO `freedoor`.`category` (`categoryId`, `categoryName`) VALUES ('3', 'Sports');
INSERT INTO `freedoor`.`category` (`categoryId`, `categoryName`) VALUES ('4', 'Books');
INSERT INTO `freedoor`.`category` (`categoryId`, `categoryName`) VALUES ('5', 'Clothing');
INSERT INTO `freedoor`.`category` (`categoryId`, `categoryName`) VALUES ('6', 'Music');

INSERT INTO `freedoor`.`user` (`userId`, `firstName`, `lastName`, `emailId`, `mobile`) VALUES ('1', 'Jayesh', 'Pandhe', 'jayesh@gmail.com', '4081231111');
INSERT INTO `freedoor`.`user` (`userId`, `firstName`, `lastName`, `emailId`, `mobile`) VALUES ('2', 'Amol', 'Pujari', 'amol@gmail.com', '4081232222');
INSERT INTO `freedoor`.`user` (`userId`, `firstName`, `lastName`, `emailId`, `mobile`) VALUES ('3', 'Mahesh', 'Bingi', 'mahesh@gmail.com', '4081233333');
INSERT INTO `freedoor`.`user` (`userId`, `firstName`, `lastName`, `emailId`, `mobile`) VALUES ('4', 'Amit', 'Borude', 'amit@gmail.com', '4081234444');
INSERT INTO `freedoor`.`user` (`userId`, `firstName`, `lastName`, `emailId`, `mobile`) VALUES ('5', 'Vishal', 'Chothani', 'vishal@gmail.com', '4081235555');
INSERT INTO `freedoor`.`user` (`userId`, `firstName`, `lastName`, `emailId`, `mobile`) VALUES ('6', 'Megha', 'Thakkar', 'megha@gmail.com', '4081236666');

INSERT INTO `freedoor`.`product` (`productId`, `productName`, `quantity`, `userId`, `expectedOffer`, `productDesc`, `productExpiryDate`, `categoryId`) VALUES ('1', 'Mac Air', '2', '3', 'Looking for 3 HP laptops', 'Brand new laptop', '2015-1-31', '1');
INSERT INTO `freedoor`.`product` (`productId`, `productName`, `quantity`, `userId`, `expectedOffer`, `productDesc`, `productExpiryDate`, `categoryId`) VALUES ('2', 'iPad', '5', '3', 'Want to exchange it with Nexus 9', 'Brand new packed pieces', '2015-01-31', '1');
INSERT INTO `freedoor`.`product` (`productId`, `productName`, `quantity`, `userId`, `expectedOffer`, `productDesc`, `productExpiryDate`, `categoryId`) VALUES ('3', 'Segate 1Tb hard drive', '2', '2', 'Looking for some great deal', 'Original packed piece', '2014-12-31', '1');
INSERT INTO `freedoor`.`product` (`productId`, `productName`, `quantity`, `userId`, `expectedOffer`, `productDesc`, `productExpiryDate`, `categoryId`) VALUES ('4', 'Yamaha electric guitar', '1', '1', 'I want to exchange it with Fender Acoustic box Dg8-S', 'Lightly used', '2015-03-20', '6');

INSERT INTO `freedoor`.`offer` (`buyingQty`, `offeredDetails`, `buyerStatus`, `sellerStatus`, `offerExpiry`, `productId`, `buyerId`) VALUES ('1', 'I will give 1 HP laptop', 'pending', 'pending', '2014-12-31', '1', '5');