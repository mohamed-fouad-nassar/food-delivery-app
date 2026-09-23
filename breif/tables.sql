-- function for updated_at timestamp --
CREATE
OR REPLACE FUNCTION update_modified_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-------------------------------------------------------------------------
-- USER TABLE --
CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE user_role AS ENUM ('customer', 'owner', 'delivery', 'admin');
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone VARCHAR(25),
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  status user_status NOT NULL DEFAULT 'pending',
  jid TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- tigger update for updated_at
DROP TRIGGER IF EXISTS update_users_modtime ON users;
CREATE TRIGGER update_users_modtime BEFORE
UPDATE
  ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
-------------------------------------------------------------------------
-- ADDRESSES TABLE --
CREATE TABLE IF NOT EXISTS addresses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  lat NUMERIC(9, 6),
  lng NUMERIC(9, 6),
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id INT NOT NULL,
  CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
-- tigger update for updated_at
DROP TRIGGER IF EXISTS update_addresses_modtime ON addresses;
CREATE TRIGGER update_addresses_modtime BEFORE
UPDATE
  ON addresses FOR EACH ROW EXECUTE FUNCTION update_modified_column();
-- unique index to enforce one default address per user
CREATE UNIQUE INDEX uq_user_default_address ON addresses(user_id)
WHERE
  is_default = TRUE;
-------------------------------------------------------------------------
-- DELIVERY PROFILE TABLE --
CREATE TYPE delivery_profile_status AS ENUM ('available', 'busy', 'offline');
CREATE TABLE IF NOT EXISTS delivery_profiles (
  id SERIAL PRIMARY KEY,
  status delivery_profile_status NOT NULL DEFAULT 'offline',
  lat NUMERIC(9, 6),
  lng NUMERIC(9, 6),
  vehicle_type VARCHAR(50),
  rating DECIMAL(2, 1) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id INT NOT NULL UNIQUE,
  CONSTRAINT fk_delivery_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
-- tigger update for updated_at
DROP TRIGGER IF EXISTS update_delivery_profiles_modtime ON delivery_profiles;
CREATE TRIGGER update_delivery_profiles_modtime BEFORE
UPDATE
  ON delivery_profiles FOR EACH ROW EXECUTE FUNCTION update_modified_column();
-------------------------------------------------------------------------
-- RESTAURANT TABLE --
CREATE TYPE restaurant_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  cover_url TEXT,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  lat NUMERIC(9, 6),
  lng NUMERIC(9, 6),
  status restaurant_status NOT NULL DEFAULT 'pending',
  description TEXT,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  cuisine_type TEXT,
  rating DECIMAL(2, 1) NOT NULL DEFAULT 0,
  operation_hours JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id INT NOT NULL UNIQUE,
  CONSTRAINT fk_restaurants_user FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE RESTRICT
);
-- tigger update for updated_at
DROP TRIGGER IF EXISTS update_restaurants_modtime ON restaurants;
CREATE TRIGGER update_restaurants_modtime BEFORE
UPDATE
  ON restaurants FOR EACH ROW EXECUTE FUNCTION update_modified_column();
-------------------------------------------------------------------------
-- MEUN CATEGORY TABLE --
CREATE TABLE IF NOT EXISTS menu_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  restaurant_id INT NOT NULL,
  CONSTRAINT fk_menu_category_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE RESTRICT,
  -- unique constraint foreach category with restaurant
  CONSTRAINT uq_menu_category_restaurant_name UNIQUE (restaurant_id, name)
);
-- tigger update for updated_at
DROP TRIGGER IF EXISTS update_menu_categories_modtime ON menu_categories;
CREATE TRIGGER update_menu_categories_modtime BEFORE
UPDATE
  ON menu_categories FOR EACH ROW EXECUTE FUNCTION update_modified_column();
-------------------------------------------------------------------------
-- MENU ITEM TABLE --
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  unit_price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  prep_time_minutes INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  menu_category_id INT NOT NULL,
  CONSTRAINT fk_menu_items_category FOREIGN KEY (menu_category_id) REFERENCES menu_categories(id) ON DELETE RESTRICT
);
-- tigger update for updated_at
DROP TRIGGER IF EXISTS update_menu_items_modtime ON menu_items;
CREATE TRIGGER update_menu_items_modtime BEFORE
UPDATE
  ON menu_items FOR EACH ROW EXECUTE FUNCTION update_modified_column();
-------------------------------------------------------------------------
-- PAYMENT METHOD TABLE --
CREATE TABLE IF NOT EXISTS payment_methods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  code VARCHAR(50) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  restaurant_id INT NOT NULL,
  CONSTRAINT fk_payment_method_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE RESTRICT,
  -- unique constraint foreach method with restaurant
  CONSTRAINT uq_payment_method_code UNIQUE (restaurant_id, code)
);
-------------------------------------------------------------------------
-- ORDER TABLE --
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'refunded');
CREATE TYPE order_status AS ENUM (
  'pending',
  'accepted',
  'preparing',
  'ready_for_pickup',
  'picked_up',
  'on_the_way',
  'delivered',
  'cancelled'
);
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  status order_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  estimated_delivery_time TIMESTAMPTZ,
  payment_method_id INT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_lat NUMERIC(9, 6),
  delivery_lng NUMERIC(9, 6),
  CONSTRAINT fk_order_payment_method FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE RESTRICT,
  customer_id INT NOT NULL,
  CONSTRAINT fk_order_user FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT,
  restaurant_id INT NOT NULL,
  CONSTRAINT fk_order_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE RESTRICT,
  delivery_profile_id INT,
  CONSTRAINT fk_order_delivery_profile FOREIGN KEY (delivery_profile_id) REFERENCES delivery_profiles(id) ON DELETE RESTRICT,
  delivery_address_id INT NOT NULL,
  CONSTRAINT fk_order_delivery_address FOREIGN KEY (delivery_address_id) REFERENCES addresses(id) ON DELETE RESTRICT
);
-------------------------------------------------------------------------
-- ORDER ITEM TABLE --
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  menu_item_id INT,
  CONSTRAINT fk_menu_items_order FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT,
  order_id INT NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT
);
-------------------------------------------------------------------------
-- REVIEW FOOD TABLE --
CREATE TABLE IF NOT EXISTS food_reviews (
  id SERIAL PRIMARY KEY,
  comment TEXT,
  rating SMALLINT NOT NULL CHECK (
    rating BETWEEN 1
    AND 5
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  order_id INT NOT NULL UNIQUE,
  CONSTRAINT fk_food_review_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
  user_id INT NOT NULL,
  CONSTRAINT fk_food_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  restaurant_id INT NOT NULL,
  CONSTRAINT fk_food_review_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE RESTRICT
);
-------------------------------------------------------------------------
-- REVIEW DELIVERY TABLE --
CREATE TABLE IF NOT EXISTS delivery_reviews (
  id SERIAL PRIMARY KEY,
  comment TEXT,
  rating SMALLINT NOT NULL CHECK (
    rating BETWEEN 1
    AND 5
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  order_id INT NOT NULL UNIQUE,
  CONSTRAINT fk_delivery_review_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
  user_id INT NOT NULL,
  CONSTRAINT fk_delivery_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  delivery_profile_id INT NOT NULL,
  CONSTRAINT fk_delivery_review_delivery_profile FOREIGN KEY (delivery_profile_id) REFERENCES delivery_profiles(id) ON DELETE RESTRICT
);
-------------------------------------------------------------------------
