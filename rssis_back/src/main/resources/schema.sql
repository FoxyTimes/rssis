SET client_encoding TO 'UTF8';

DROP TABLE IF EXISTS sales_products CASCADE;
DROP TABLE IF EXISTS returns_products CASCADE;
DROP TABLE IF EXISTS writeoffs_products CASCADE;
DROP TABLE IF EXISTS shipments_products CASCADE;

DROP TABLE IF EXISTS saleData CASCADE;
DROP TABLE IF EXISTS returns CASCADE;
DROP TABLE IF EXISTS writeoffs CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;

DROP TABLE IF EXISTS productData CASCADE;
DROP TABLE IF EXISTS staff CASCADE;

DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS statuses CASCADE;

DROP TABLE IF EXISTS returns_reasons CASCADE;
DROP TABLE IF EXISTS writeoffs_reasons CASCADE;


CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    unit VARCHAR(20) NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    payment_method VARCHAR(20) NOT NULL DEFAULT 'CASH'
);

CREATE TABLE statuses (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL
);


CREATE TABLE productData (
    id SERIAL PRIMARY KEY,
    cost NUMERIC(10,2) CHECK (cost >= 0),
    barcode VARCHAR(20),
    name VARCHAR(50) NOT NULL,
    unit_id INTEGER REFERENCES units(id) NOT NULL,
    minimum INTEGER CHECK (minimum >= 0),
    remains INTEGER CHECK (remains >= 0),
    category_id INTEGER REFERENCES categories(id)
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);


CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(60) NOT NULL,
    login VARCHAR(60) NOT NULL UNIQUE,
    role_id INTEGER REFERENCES roles(id) NOT NULL,
    password_hash VARCHAR(100) NOT NULL
);


CREATE TABLE saleData (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_method INTEGER REFERENCES payment_methods(id) NOT NULL DEFAULT 1,
    status_id INTEGER REFERENCES statuses(id) NOT NULL DEFAULT 1,
    staff_id INTEGER REFERENCES staff(id) NOT NULL
);


CREATE TABLE sales_products(
    product_id INTEGER REFERENCES productData(id),
    sale_id INTEGER REFERENCES saleData(id) ON DELETE CASCADE,
    count NUMERIC(10,3) NOT NULL,
    cost NUMERIC(10,2) CHECK (cost >= 0),
    PRIMARY KEY (sale_id, product_id)
);


CREATE TABLE returns_reasons(
    id SERIAL PRIMARY KEY,
    reason VARCHAR(50)
);


CREATE TABLE returns(
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reason_id INTEGER REFERENCES returns_reasons(id),
    staff_id INTEGER REFERENCES staff(id) NOT NULL
);


CREATE TABLE returns_products(
    product_id INTEGER REFERENCES productData(id),
    return_id INTEGER REFERENCES returns(id) ON DELETE CASCADE,
    count NUMERIC(10,3) NOT NULL,
    cost NUMERIC(10,2) CHECK (cost >= 0),
    PRIMARY KEY (return_id, product_id)
);


CREATE TABLE writeoffs_reasons(
      id SERIAL PRIMARY KEY,
      reason VARCHAR(50)
);


CREATE TABLE writeoffs(
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reason_id INTEGER REFERENCES writeoffs_reasons(id),
    staff_id INTEGER REFERENCES staff(id) NOT NULL
);


CREATE TABLE writeoffs_products(
    product_id INTEGER REFERENCES productData(id),
    writeoff_id INTEGER REFERENCES writeoffs(id) ON DELETE CASCADE,
    count NUMERIC(10,3) NOT NULL,
    cost NUMERIC(10,2) CHECK (cost >= 0),
    PRIMARY KEY (writeoff_id, product_id)
);


CREATE TABLE shipments(
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    provider VARCHAR(50),
    staff_id INTEGER REFERENCES staff(id) NOT NULL
);


CREATE TABLE shipments_products(
    product_id INTEGER REFERENCES productData(id),
    shipment_id INTEGER REFERENCES shipments(id) ON DELETE CASCADE,
    count NUMERIC(10,3) NOT NULL,
    cost NUMERIC(10,2) CHECK (cost >= 0),
    PRIMARY KEY (shipment_id, product_id)
);



INSERT INTO units (unit) VALUES
        ('кг'),
        ('литр'),
        ('шт');


INSERT INTO roles (role) VALUES
        ('admin'),
        ('cashier'),
        ('manager');


INSERT INTO payment_methods (payment_method) VALUES
        ('CASH'),
        ('CARD');


INSERT INTO statuses (status) VALUES
        ('pending'),
        ('completed'),
        ('canceled');



INSERT INTO productData (cost, barcode, name, unit_id, minimum, remains) VALUES
        (180.00,'100000000001','Яблоки',1,10,50),
        (160.00,'100000000002','Бананы',1,10,40),
        (220.00,'100000000003','Апельсины',1,10,35),
        (45.00,'100000000004','Картофель',1,20,100),
        (55.00,'100000000005','Лук',1,20,80),
        (280.00,'100000000006','Помидоры',1,15,60),
        (240.00,'100000000007','Огурцы',1,15,55),
        (50.00,'100000000008','Морковь',1,20,90),
        (520.00,'100000000009','Куриное филе',1,5,30),
        (420.00,'100000000010','Свинина',1,5,25),
        (85.00,'100000000011','Молоко',2,10,70),
        (90.00,'100000000012','Кефир',2,10,65),
        (55.00,'100000000013','Йогурт',3,15,100),
        (720.00,'100000000014','Сыр',1,5,20),
        (180.00,'100000000015','Масло',3,5,25),
        (55.00,'100000000016','Хлеб',3,20,120),
        (35.00,'100000000017','Булочка',3,20,110),
        (95.00,'100000000018','Макароны',3,10,80),
        (120.00,'100000000019','Рис',1,10,60),
        (140.00,'100000000020','Гречка',1,10,55),
        (85.00,'100000000021','Сахар',1,10,70),
        (25.00,'100000000022','Соль',1,10,90),
        (420.00,'100000000023','Кофе',3,5,40),
        (220.00,'100000000024','Чай',3,5,45),
        (120.00,'100000000025','Сок',2,10,60),
        (95.00,'100000000026','Газировка',2,10,50),
        (480.00,'100000000027','Колбаса',1,5,35),
        (780.00,'100000000028','Говядина',1,5,20),
        (95.00,'100000000029','Сметана',3,10,40),
        (140.00,'100000000030','Творог',3,10,30);



INSERT INTO staff (full_name, login, role_id, password_hash) VALUES
    ('Админ Админович','admin',1,'$2a$10$dk14YgJRU6feuptOW.8AxOtJY/2QzX8hW3A5QE38e.HB9bSAixU32');


INSERT INTO returns_reasons (reason) VALUES
    ('expired date');

INSERT INTO writeoffs_reasons (reason) VALUES
    ('expired date');