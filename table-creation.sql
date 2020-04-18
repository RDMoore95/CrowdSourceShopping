CREATE TABLE Country (
    country_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    country_name VARCHAR(50) NOT NULL
);

CREATE TABLE User (
    user_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(320) NOT NULL,
    signup_date DATE NOT NULL,
    last_login DATETIME NOT NULL,
    user_country INT(10) UNSIGNED,
    FOREIGN KEY (user_country) REFERENCES Country (country_id)
);

CREATE TABLE State (
    state_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    state_name VARCHAR(2) NOT NULL
);

CREATE TABLE Store (
    store_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    store_name VARCHAR(50) NOT NULL,
    store_lat DECIMAL(10, 8) NOT NULL,
    store_long DECIMAL(11, 8) NOT NULL,
    store_active_flag TINYINT(1) NOT NULL,
    store_street VARCHAR(50),
    store_city VARCHAR(50),
    store_state INT(10) UNSIGNED,
    FOREIGN KEY (store_state) REFERENCES State (state_id),
    store_zip VARCHAR(10)
);

CREATE TABLE Item (
    item_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(50) NOT NULL,
    item_upc VARCHAR(12) NOT NULL,
    item_description VARCHAR(200) NOT NULL,
    date_added DATETIME NOT NULL,
    item_size INT(10) NOT NULL,
    item_size_unit VARCHAR(20)
);

CREATE TABLE User_Reputation_Category (
    user_reputation_category_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_reputation_category_name VARCHAR(50) NOT NULL
);

CREATE TABLE Store_Feedback_Category (
    store_feedback_category_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    store_feedback_category VARCHAR(50) NOT NULL
);

CREATE TABLE Shopping_List_History (
    shopping_list_history_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(10) UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES User (user_id),
    item_id INT(10) UNSIGNED,
    FOREIGN KEY (item_id) REFERENCES Item (item_id),
    time_added DATETIME NOT NULL,
    time_removed DATETIME
);

CREATE TABLE Shopping_List (
    shopping_list_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(10) UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES User (user_id),
    item_id INT(10) UNSIGNED,
    FOREIGN KEY (item_id) REFERENCES Item (item_id),
    time_added DATETIME NOT NULL,
    shopping_list_history_id INT(10) UNSIGNED,
    FOREIGN KEY (shopping_list_history_id) REFERENCES Shopping_List_History (shopping_list_history_id),
    item_quantity INT(10) NOT NULL
);

CREATE TABLE Store_Feedback (
    store_feedback_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    store_id INT(10) UNSIGNED,
    FOREIGN KEY (store_id) REFERENCES Store (store_id),
    user_id INT(10) UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES User (user_id),
    time_added DATETIME NOT NULL,
    store_feedback_text VARCHAR(200),
    store_feedback_category_id INT(10) UNSIGNED,
    FOREIGN KEY (store_feedback_category_id) REFERENCES Store_Feedback_Category (store_feedback_category_id)
);

CREATE TABLE Price_Feedback (
    price_feedback_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    store_id INT(10) UNSIGNED,
    FOREIGN KEY (store_id) REFERENCES Store(store_id),
    user_id INT(10) UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    item_id INT(10) UNSIGNED,
    FOREIGN KEY (item_id) REFERENCES Item(item_id),
    price DECIMAL(10,2) NOT NULL,
    price_currency VARCHAR(10) NOT NULL,
    sale_flag TINYINT(1) NOT NULL,
    price_feedback_text VARCHAR(200),
    time_added DATETIME NOT NULL
);

CREATE TABLE Store_Response (
    store_response_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    store_feedback_id INT(10) UNSIGNED,
    FOREIGN KEY (store_feedback_id) REFERENCES Store_Feedback(store_feedback_id),
    response_user_id INT(10)UNSIGNED,
    FOREIGN KEY (response_user_id) REFERENCES User(user_id),
    time_added DATETIME NOT NULL,
    store_response_text VARCHAR(200) NOT NULL,
    store_response_vote INT(10)
);

CREATE TABLE Price_Response (
    price_response_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    price_feedback_id INT(10) UNSIGNED,
    FOREIGN KEY (price_feedback_id) REFERENCES Price_Feedback(price_feedback_id),
    response_user_id INT(10) UNSIGNED,
    FOREIGN KEY (response_user_id) REFERENCES User(user_id),
    time_added DATETIME NOT NULL,
    price_response_text VARCHAR(200) NOT NULL,
    price_response_vote INT(10)
);

CREATE TABLE User_Reputation (
    user_reputation_id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(10) UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    user_reputation INT(10) NOT NULL,
    user_reputation_category_id INT(10) UNSIGNED,
    FOREIGN KEY (user_reputation_category_id) REFERENCES User_Reputation_Category(user_reputation_category_id),
    user_received_upvotes INT(20) UNSIGNED NOT NULL,
    user_received_downvotes INT(20) UNSIGNED NOT NULL,
    user_received_net INT(10) NOT NULL,
    user_given_upvotes INT(20) UNSIGNED NOT NULL,
    user_given_downvotes INT(20) UNSIGNED NOT NULL,
    user_given_net INT(10) NOT NULL
);