-- ====================================
-- Betomeshi Database Schema
-- PostgreSQL Database
-- ====================================

-- Drop tables if exists (in reverse order of dependencies)
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS restaurant_facilities CASCADE;
DROP TABLE IF EXISTS restaurant_foods CASCADE;
DROP TABLE IF EXISTS food_images CASCADE;
DROP TABLE IF EXISTS food_ingredients CASCADE;
DROP TABLE IF EXISTS food_flavors CASCADE;
DROP TABLE IF EXISTS food_food_types CASCADE;
DROP TABLE IF EXISTS food_types CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE; 
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS foods CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS flavors CASCADE;
DROP TABLE IF EXISTS regions CASCADE;
DROP TABLE IF EXISTS conversation_phrases CASCADE;
DROP TABLE IF EXISTS i18n CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ====================================
-- Core Tables
-- ====================================

-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    birth_date DATE,
    avatar_url VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Regions table
CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- User preferences table
CREATE TABLE user_preferences (
    preference_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    favorite_taste VARCHAR(255),
    disliked_ingredients VARCHAR(255),
    dietary_criteria VARCHAR(255),
    target_name VARCHAR(255),
    priorities VARCHAR(255),
    private_room VARCHAR(255),
    group_size VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================
-- Food Related Tables
-- ====================================

-- Flavors table
CREATE TABLE flavors (
    flavor_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Ingredients table
CREATE TABLE ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Foods table
CREATE TABLE foods (
    food_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    story TEXT,
    ingredient TEXT,
    taste TEXT,
    style TEXT,
    comparison TEXT,
    region_id INTEGER REFERENCES regions(region_id),
    view_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    number_of_rating INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food flavors (many-to-many)
CREATE TABLE food_flavors (
    food_id INTEGER NOT NULL REFERENCES foods(food_id) ON DELETE CASCADE,
    flavor_id INTEGER NOT NULL REFERENCES flavors(flavor_id) ON DELETE CASCADE,
    intensity_level INTEGER CHECK (intensity_level >= 1 AND intensity_level <= 5),
    PRIMARY KEY (food_id, flavor_id)
);

-- Food ingredients (many-to-many)
CREATE TABLE food_ingredients (
    food_id INTEGER NOT NULL REFERENCES foods(food_id) ON DELETE CASCADE,
    ingredient_id INTEGER NOT NULL REFERENCES ingredients(ingredient_id) ON DELETE CASCADE,
    PRIMARY KEY (food_id, ingredient_id)
);

-- Food types (e.g., 麺料理, ご飯もの, パン料理, 惣菜物, サラダ, 鍋料理)
CREATE TABLE food_types (
    food_type_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Mapping table between foods and types (many-to-many)
CREATE TABLE food_food_types (
    food_id INTEGER NOT NULL REFERENCES foods(food_id) ON DELETE CASCADE,
    food_type_id INTEGER NOT NULL REFERENCES food_types(food_type_id) ON DELETE CASCADE,
    PRIMARY KEY (food_id, food_type_id)
);

-- Food images (one-to-many)
CREATE TABLE food_images (
    food_image_id SERIAL PRIMARY KEY,
    food_id INTEGER NOT NULL REFERENCES foods(food_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,  -- Changed from VARCHAR(255) to TEXT to support long URLs (base64 images)
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE
);

-- ====================================
-- Restaurant Related Tables
-- ====================================

-- Restaurants table
CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    open_time TIME,
    close_time TIME,
    price_range VARCHAR(50),
    phone_number VARCHAR(20)
);

-- Translateable content tables for Foods and Restaurants
CREATE TABLE IF NOT EXISTS food_translations (
    translation_id SERIAL PRIMARY KEY,
    food_id INTEGER NOT NULL REFERENCES foods(food_id) ON DELETE CASCADE,
    lang VARCHAR(5) NOT NULL,
    name VARCHAR(255),
    story TEXT,
    ingredient TEXT,
    taste TEXT,
    style TEXT,
    comparison TEXT,
    UNIQUE(food_id, lang)
);

CREATE TABLE IF NOT EXISTS restaurant_translations (
    translation_id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    lang VARCHAR(5) NOT NULL,
    name VARCHAR(255),
    address TEXT,
    UNIQUE(restaurant_id, lang)
);

-- Restaurant foods (many-to-many)
CREATE TABLE restaurant_foods (
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    food_id INTEGER NOT NULL REFERENCES foods(food_id) ON DELETE CASCADE,
    price DECIMAL(10, 2),
    is_recommended BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (restaurant_id, food_id)
);

-- Restaurant facilities (many-to-many)
CREATE TABLE restaurant_facilities (
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    facility_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (restaurant_id, facility_name)
);

-- ====================================
-- User Interaction Tables
-- ====================================

-- Reviews table (polymorphic - can review foods or restaurants)
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    target_id INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('food', 'restaurant')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites table (polymorphic - can favorite foods or restaurants)
CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    target_id INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('food', 'restaurant')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, target_id, type)
);

-- ====================================
-- Conversation Phrases Table
-- ====================================

-- Conversation phrases for language learning
CREATE TABLE conversation_phrases (
    phrase_id SERIAL PRIMARY KEY,
    category VARCHAR(255),
    content TEXT
);

-- ====================================
-- Internationalization Table
-- ====================================

-- I18n translations
CREATE TABLE i18n (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL,
    lang VARCHAR(10) NOT NULL,
    value TEXT,
    UNIQUE (key, lang)
);

-- ====================================
-- Indexes for Performance
-- ====================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Food indexes
CREATE INDEX idx_foods_region ON foods(region_id);
CREATE INDEX idx_foods_name ON foods(name);

-- Restaurant indexes
CREATE INDEX idx_restaurants_name ON restaurants(name);
CREATE INDEX idx_restaurants_location ON restaurants(latitude, longitude);

-- Review indexes
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_target ON reviews(target_id, type);
CREATE INDEX idx_reviews_created ON reviews(created_at);

-- Favorite indexes
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_target ON favorites(target_id, type);

-- I18n indexes
CREATE INDEX idx_i18n_key_lang ON i18n(key, lang);

-- User preferences indexes
CREATE INDEX idx_user_preferences_user ON user_preferences(user_id);

-- ====================================
-- FUNCTIONS AND TRIGGERS FOR AUTOMATIC RATING UPDATES
-- ====================================

-- ============================
-- FUNCTION: Update food rating and number of ratings
-- ============================

CREATE OR REPLACE FUNCTION update_food_rating(foodId INT)
RETURNS VOID AS $$
BEGIN
    UPDATE foods
    SET 
        number_of_rating = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE target_id = foodId AND type = 'food'
        ),
        rating = (
            SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0) 
            FROM reviews 
            WHERE target_id = foodId AND type = 'food'
        )
    WHERE food_id = foodId;
END;
$$ LANGUAGE plpgsql;

-- ============================
-- TRIGGER FUNCTIONS
-- ============================

-- Trigger function for INSERT & UPDATE
CREATE OR REPLACE FUNCTION trigger_update_food_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update rating for food reviews
    IF NEW.type = 'food' THEN
        PERFORM update_food_rating(NEW.target_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for DELETE
CREATE OR REPLACE FUNCTION trigger_update_food_rating_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update rating for food reviews
    IF OLD.type = 'food' THEN
        PERFORM update_food_rating(OLD.target_id);
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- ============================
-- CREATE TRIGGERS
-- ============================

-- AFTER INSERT
DROP TRIGGER IF EXISTS review_after_insert ON reviews;
CREATE TRIGGER review_after_insert
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_update_food_rating();

-- AFTER UPDATE
DROP TRIGGER IF EXISTS review_after_update ON reviews;
CREATE TRIGGER review_after_update
AFTER UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_update_food_rating();

-- AFTER DELETE
DROP TRIGGER IF EXISTS review_after_delete ON reviews;
CREATE TRIGGER review_after_delete
AFTER DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_update_food_rating_delete();

-- ====================================
-- Comments
-- ====================================

COMMENT ON TABLE users IS 'User accounts and authentication';
COMMENT ON TABLE user_preferences IS 'User food preferences, dietary restrictions, and survey metadata';
COMMENT ON TABLE regions IS 'Vietnamese geographical regions';
COMMENT ON TABLE foods IS 'Vietnamese foods';
COMMENT ON TABLE flavors IS 'Flavor profiles (sweet, sour, spicy, etc.)';
COMMENT ON TABLE ingredients IS 'Food ingredients';
COMMENT ON TABLE food_flavors IS 'Many-to-many relationship between foods and flavors';
COMMENT ON TABLE food_ingredients IS 'Many-to-many relationship between foods and ingredients';
COMMENT ON TABLE food_images IS 'Multiple images for each food item';
COMMENT ON TABLE restaurants IS 'Restaurant locations and information';
COMMENT ON TABLE restaurant_foods IS 'Foods available at each restaurant';
COMMENT ON TABLE restaurant_facilities IS 'Restaurant amenities (parking, card payment, etc.)';
COMMENT ON TABLE reviews IS 'User reviews for foods and restaurants';
COMMENT ON TABLE favorites IS 'User favorites for foods and restaurants';
COMMENT ON TABLE conversation_phrases IS 'Japanese conversation phrases for food-related situations';
COMMENT ON TABLE i18n IS 'Internationalization translations';

