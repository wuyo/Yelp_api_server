docker network create --driver bridge mysql-net

docker run -d --name mysql-server --network mysql-net -p "3306:3306" -e "MYSQL_RANDOM_ROOT_PASSWORD=yes" -e "MYSQL_DATABASE=yelp" -e "MYSQL_USER=yelp" -e "MYSQL_PASSWORD=yelp123" mysql:5

docker run --rm -it --network mysql-net -v ${PWD}:/home/ mysql:5 mysql -h mysql-server -u yelp -p

docker run -it --network mysql-net mysql:5 --name ass2 -e "PORT=8080" -v `pwd`:/home/ass2 -p 34567:8080 ubuntu:latest /bin/bash


docker run -d --network mysql-net --name yelp -p 8000:8000 yelp


docker run --rm -it --network mysql-net	mysql:5	mysql -h mysql-server -u bookaplace -p

docker run --rm -it --network mysql-net -v `pwd`:/home/ass2 -p 8000:8000 node /bin/bash

docker run --rm -it --network mysql-net -v ${PWD}:/home/ass2 -p 8000:8000 node /bin/bash


 docker run --rm -it --network mysql-net mysql:5 mysqldump --databases yelp -u yelp --password="yelp123" -h mysql-server > dump2.sql

 docker exec mysql-server /usr/bin/mysqldump -u yelp --password=yelp123 yelp > backup.sql


 ass4

 //docker run -it -p 28000:27017 --name mongoClient mongo:latest mongo

 docker run -d --name rabbitmq-server --network ass4-net -p "5672:5672" -p "15672:15672" rabbitmq:3-management

 docker run --name rabbitmq-server --network ass4-net -p "5672:5672" -p "15672:15672" rabbitmq:3-management

 docker run --rm -it --network ass4-net -v ${PWD}:/home/offline-work -p 8000:8000 node:11 /bin/bash

 docker run --rm -it --network ass4-net -v `pwd`:/home/offline-work -p 8000:8000 node:11 /bin/bash

 docker run -d --name mongodb --network ass4-net -p "27017:27017" -v ${PWD}/db-init/:/docker-entrypoint-initdb.d -e "MONGO_INITDB_ROOT_USERNAME=root" -e "MONGO_INITDB_ROOT_PASSWORD=hunter2" -e "MONGO_INITDB_DATABASE=businesses" mongo:latest


* docker run -d --name mongodb --network ass4-net -p "27017:27017" -v `pwd`/db-init/:/docker-entrypoint-initdb.d -v `pwd`/mongodb:/home/mongodb -e "MONGO_INITDB_ROOT_USERNAME=root" -e "MONGO_INITDB_ROOT_PASSWORD=hunter2" -e "MONGO_INITDB_DATABASE=businesses" mongo:latest

 docker run -d --name mongodb --network ass4-net -p "27017:27017" -v ${PWD}/db-init/:/docker-entrypoint-initdb.d -v ${PWD}/mongodb:/home/mongodb mongo:latest

 docker run --name mongodb --network ass4-net -p "27017:27017" -v ${PWD}/db-init/:/docker-entrypoint-initdb.d -v ${PWD}/mongodb:/home/mongodb mongo:latest

 mongodb://businesses:hunter2@mongodb:27017/businesses




 final:

 docker run -d --name mysql-server --network final-net -p "3306:3306" -v ${PWD}/db-init/00-db-init.sql:/docker-entrypoint-initdb.d/00-db-init.sql -e "MYSQL_RANDOM_ROOT_PASSWORD=yes" -e "MYSQL_DATABASE=tarpaulin" -e "MYSQL_USER=nexus" -e "MYSQL_PASSWORD=hunter2" mysql:5

 docker run --rm -it --network final-net mysql:5 mysql -h mysql-server -u nexus -p

 docker run --rm -it --network final-net -v ${PWD}:/home/final -p 8000:8000 node:11 /bin/bash

 * docker run -d --name mongodb --network final-net -p "27017:27017" -v `pwd`/db-init/:/docker-entrypoint-initdb.d -v `pwd`/mongodb:/home/mongodb -e "MONGO_INITDB_ROOT_USERNAME=root" -e "MONGO_INITDB_ROOT_PASSWORD=hunter2" -e "MONGO_INITDB_DATABASE=tarpaulin" mongo:latest

 docker run -d --name mongodb --network final-net -p "27017:27017" -v ${PWD}/db-init/01-db-init.js:/docker-entrypoint-initdb.d/01-db-init.js -v ${PWD}/mongodb:/home/mongodb -e "MONGO_INITDB_ROOT_USERNAME=root" -e "MONGO_INITDB_ROOT_PASSWORD=hunter2" -e "MONGO_INITDB_DATABASE=tarpaulin" mongo:latest

 docker run --rm -it --network final-net -p 28000:27017 --name mongoClient mongo:latest mongo --host mongodb --username root --password hunter2

 docker run -d --name rabbitmq-server --network final-net -p "5672:5672" -p "15672:15672" rabbitmq:3-management

 db.createUser({
			user: "nexus",
			pwd: "hunter2",
			roles: [ { role: "readWrite", db: "tarpaulin" } ]
		})

 export MONGO_HOST=mongodb
 export MONGO_DB_NAME=businesses
 export MONGO_USER=businesses
 export MYSQL_PASSWORD=hunter2
 export MONGO_PORT=27017
 export RABBITMQ_HOST=rabbitmq-server

 SET MONGO_PORT=27017
 SET MONGO_HOST=localhost
 SET MONGO_DB_NAME=businesses
 SET MONGO_USER=businesses
 SET MYSQL_PASSWORD=hunter2


 docker run -d --name rabbitmq-server -p "5672:5672" -p "15672:15672" rabbitmq:3-management




CREATE TABLE business (
  id MEDIUMINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  ownerid MEDIUMINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state CHAR(2) NOT NULL,
  zip CHAR(5) NOT NULL,
  phone VARCHAR(12) NOT NULL,
  category VARCHAR(255) NOT NULL,
  subcategory VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  INDEX idx_ownerid (ownerid)
);

CREATE TABLE photos (
  id MEDIUMINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  userid MEDIUMINT NOT NULL,
  businessid MEDIUMINT NOT NULL,
  caption VARCHAR(255),
  FOREIGN KEY (businessid) REFERENCES business(id),
  INDEX idx_ownerid (userid)
);

CREATE TABLE reviews (
  id MEDIUMINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  userid MEDIUMINT NOT NULL,
  businessid MEDIUMINT NOT NULL,
  dollars DECIMAL(1) UNSIGNED NOT NULL,
  stars DECIMAL(3,1) UNSIGNED NOT NULL,
  review VARCHAR(255),
  FOREIGN KEY (businessid) REFERENCES business(id),
  INDEX idx_ownerid (userid)
);




INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (0,0,'Block 15','300 SW Jefferson Ave.','Corvallis','OR',97333,'541-758-2077','Restaurant','Brewpub','http://block15.com');
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (1,1,'Corvallis Brewing Supply','119 SW 4th St.','Corvallis','OR',97333,'541-758-1674','Shopping','Brewing Supply','http://www.lickspigot.com');
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (2,2,'Robnett''s Hardware','400 SW 2nd St.','Corvallis','OR',97333,'541-753-5531','Shopping','Hardware',NULL);
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (3,3,'First Alternative Co-op North Store','2855 NW Grant Ave.','Corvallis','OR',97330,'541-452-3115','Shopping','Groceries',NULL);
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (4,4,'WinCo Foods','2335 NW Kings Blvd.','Corvallis','OR',97330,'541-753-7002','Shopping','Groceries',NULL);
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (5,5,'Fred Meyer','777 NW Kings Blvd.','Corvallis','OR',97330,'541-753-9116','Shopping','Groceries',NULL);
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (6,6,'Interzone','1563 NW Monroe Ave.','Corvallis','OR',97330,'541-754-5965','Restaurant','Coffee Shop',NULL);
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (7,7,'The Beanery Downtown','500 SW 2nd St.','Corvallis','OR',97333,'541-753-7442','Restaurant','Coffee Shop',NULL);
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (8,8,'Local Boyz','1425 NW Monroe Ave.','Corvallis','OR',97330,'541-754-5338','Restaurant','Hawaiian',NULL);
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (9,9,'Darkside Cinema','215 SW 4th St.','Corvallis','OR',97333,'541-752-4161','Entertainment','Movie Theater','http://darksidecinema.com');
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (10,10,'The Book Bin','215 SW 4th St.','Corvallis','OR',97333,'541-752-0040','Shopping','Book Store',NULL);
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (11,11,'Cyclotopia','435 SW 2nd St.','Corvallis','OR',97333,'541-757-9694','Shopping','Bicycle Shop',NULL);
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (12,12,'Corvallis Cyclery','344 SW 2nd St.','Corvallis','OR',97333,'541-752-5952','Shopping','Bicycle Shop',NULL);
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (13,13,'Oregon Coffee & Tea','215 NW Monroe Ave.','Corvallis','OR',97333,'541-752-2421','Shopping','Tea House','http://www.oregoncoffeeandtea.com');
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (14,14,'Spaeth Lumber','1585 NW 9th St.','Corvallis','OR',97330,'541-752-1930','Shopping','Hardware',NULL);
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (15,15,'New Morning Bakery','219 SW 2nd St.','Corvallis','OR',97333,'541-754-0181','Restaurant','Bakery',NULL);
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (16,3,'First Alternative Co-op South Store','1007 SE 3rd St.','Corvallis','OR',97333,'541-753-3115','Shopping','Groceries',NULL);
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (17,7,'The Beanery Monroe','2541 NW Monroe Ave.','Corvallis','OR',97330,'541-757-0828','Restaurant','Coffee Shop',NULL);
INSERT INTO business(id,ownerid,name,address,city,state,zip,phone,category,subcategory,website) VALUES (18,0,'Block 15 Brewery & Tap Room','3415 SW Deschutes St.','Corvallis','OR',97333,'541-752-2337','Restaurant','Brewpub','http://block15.com');


INSERT INTO photos(id,userid,businessid,caption) VALUES (0,7,8,'This is my dinner.');
INSERT INTO photos(id,userid,businessid,caption) VALUES (1,25,2,NULL);
INSERT INTO photos(id,userid,businessid,caption) VALUES (2,26,1,'Hops');
INSERT INTO photos(id,userid,businessid,caption) VALUES (3,21,14,NULL);
INSERT INTO photos(id,userid,businessid,caption) VALUES (4,28,18,'Sticky Hands');
INSERT INTO photos(id,userid,businessid,caption) VALUES (5,21,9,'Popcorn!');
INSERT INTO photos(id,userid,businessid,caption) VALUES (6,26,8,NULL);
INSERT INTO photos(id,userid,businessid,caption) VALUES (7,25,18,'Big fermentor');
INSERT INTO photos(id,userid,businessid,caption) VALUES (8,20,2,NULL);
INSERT INTO photos(id,userid,businessid,caption) VALUES (9,6,15,'Cake!');

INSERT INTO reviews(id,userid,businessid,dollars,stars,review) VALUES (0,7,8,1,4.5,'Cheap, delicious food.');
INSERT INTO reviews(id,userid,businessid,dollars,stars,review) VALUES (1,25,2,1,4,'How many fasteners can one room hold?');
INSERT INTO reviews(id,userid,businessid,dollars,stars,review) VALUES (2,26,1,1,5,'Joel, the owner, is super friendly and helpful.');
INSERT INTO reviews(id,userid,businessid,dollars,stars,review) VALUES (3,21,14,2,4,NULL);
INSERT INTO reviews(id,userid,businessid,dollars,stars,review) VALUES (4,28,18,1,4,'Good beer, good food, though limited selection.');
INSERT INTO reviews(id,userid,businessid,dollars,stars,review) VALUES (5,21,9,1,5,'A Corvallis gem.');
INSERT INTO reviews(id,userid,businessid,dollars,stars,review) VALUES (6,26,8,1,5,'Yummmmmmm!');
INSERT INTO reviews(id,userid,businessid,dollars,stars,review) VALUES (7,25,18,2,4.5,NULL);
INSERT INTO reviews(id,userid,businessid,dollars,stars,review) VALUES (8,20,2,2,4,NULL);
INSERT INTO reviews(id,userid,businessid,dollars,stars,review) VALUES (9,6,15,2,5,'Try the hazlenut torte.  It''s the best!');
