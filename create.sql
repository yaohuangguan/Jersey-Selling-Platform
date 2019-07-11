CREATE TABLE users (
    id serial PRIMARY KEY,
    name text,
    username text UNIQUE,
    email text UNIQUE,
    password text
);

CREATE TABLE products (
    id serial PRIMARY KEY,
    name text,
    description text,
    category text,
    image text,
    price money
);

CREATE TABLE customizations (
    id serial PRIMARY KEY,
    name text,
    category text
);

CREATE TABLE orders (
    id serial PRIMARY KEY,
    customer_id integer REFERENCES users (id),
    created_at timestamp
);

CREATE TABLE order_lines (
    id serial PRIMARY KEY,
    order_id integer REFERENCES orders (id),
    product_id integer REFERENCES products(id),
    quantity integer,
    price money
);

CREATE TABLE order_line_customizations (
    id serial PRIMARY KEY,
    order_line_id integer REFERENCES order_lines (id),
    customization_id integer REFERENCES customizations (id)
);

INSERT INTO users VALUES (1, 'Michael Beck', 'beckmd', 'beckmd@miamioh.edu', '$2b$10$qtcZLq9ouJrwPn8jGSmcku1JKo2bWr9BGKH6LE37mll2ehdfIdFcS');

INSERT INTO products VALUES (2, 'Breadsticks', 'Garlic breadsticks and dipping sauce.', 'Sides', 'images/breadsticks.jpg', '$4.99');
INSERT INTO products VALUES (1, 'Veggie Lovers', 'Run it through the garden!', 'Pizzas', 'images/veggie.jpg', '$12.99');

INSERT INTO customizations VALUES (1, 'Pepperoni', 'Meat Topping');
INSERT INTO customizations VALUES (2, 'Jalepenos', 'Veggie Topping');

INSERT INTO orders VALUES (1, 1, '2019-04-07 14:51:08.131249');
INSERT INTO orders VALUES (2, 1, '2019-04-07 14:51:14.740154');

INSERT INTO order_lines VALUES (1, 1, 1, 1, '$12.99');
INSERT INTO order_lines VALUES (2, 2, 1, 1, '$12.99');
INSERT INTO order_lines VALUES (3, 2, 2, 2, '$9.98');

INSERT INTO order_line_customizations VALUES (1, 2, 1);