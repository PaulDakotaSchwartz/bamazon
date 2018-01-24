DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPad", "electronics", 1200, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Android Tablet", "electronics", 600, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone8", "electronics", 750, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("apples", "groceries", 5, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("bananas", "groceries", 2, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("grapes", "groceries", 4, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("pillows", "bedding", 30, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("comforters", "bedding", 100, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("sheets", "bedding", 50, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("ninja", "mercenaries", 10000, 2);

SELECT * FROM products;