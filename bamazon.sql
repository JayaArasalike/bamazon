DROP DATABASE IF EXISTS bamazon_DB; 

CREATE DATABASE bamazon_DB; 

USE bamazon_DB; 

CREATE TABLE products (   
position INT NOT NULL,   
artist VARCHAR(100) NULL, 
topsongs VARCHAR(100) NULL,  
year INT NULL,   
raw_total DECIMAL(10,4) NOT NULL,   
raw_usa DECIMAL(10,4) NOT NULL,   
raw_uk DECIMAL(10,4) NOT NULL,    
raw_eur DECIMAL(10,4) NOT NULL, 
raw_row DECIMAL(10,4) NOT NULL, 
PRIMARY KEY (position) 
); 