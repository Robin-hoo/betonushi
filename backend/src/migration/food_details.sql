-- ============================
-- CREATE TABLES
-- ============================

CREATE TABLE IF NOT EXISTS food (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    story TEXT,
    ingredient TEXT,
    taste TEXT,
    style TEXT,
    comparison TEXT,
    rating FLOAT DEFAULT 0,
    number_of_rating INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS review (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    comment TEXT,
    rating FLOAT NOT NULL CHECK (rating >= 0 AND rating <= 5),
    food_id INT NOT NULL,
    FOREIGN KEY (food_id) REFERENCES food(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS food_image (
    id SERIAL PRIMARY KEY,
    path TEXT NOT NULL,
    food_id INT NOT NULL,
    FOREIGN KEY (food_id) REFERENCES food(id) ON DELETE CASCADE
);

-- ============================
-- FUNCTION: update rating + number of rating
-- ============================

CREATE OR REPLACE FUNCTION update_food_rating(foodId INT)
RETURNS VOID AS $$
BEGIN
    UPDATE food
    SET 
        number_of_rating = (
            SELECT COUNT(*) FROM review WHERE food_id = foodId
        ),
        rating = (
            SELECT COALESCE(AVG(rating), 0) FROM review WHERE food_id = foodId
        )
    WHERE id = foodId;
END;
$$ LANGUAGE plpgsql;

-- ============================
-- TRIGGERS UPDATE RATING
-- ============================

-- Trigger function for INSERT & UPDATE
CREATE OR REPLACE FUNCTION trigger_update_food_rating()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_food_rating(NEW.food_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for DELETE
CREATE OR REPLACE FUNCTION trigger_update_food_rating_delete()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_food_rating(OLD.food_id);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- AFTER INSERT
CREATE TRIGGER review_after_insert
AFTER INSERT ON review
FOR EACH ROW
EXECUTE FUNCTION trigger_update_food_rating();

-- AFTER UPDATE
CREATE TRIGGER review_after_update
AFTER UPDATE ON review
FOR EACH ROW
EXECUTE FUNCTION trigger_update_food_rating();

-- AFTER DELETE
CREATE TRIGGER review_after_delete
AFTER DELETE ON review
FOR EACH ROW
EXECUTE FUNCTION trigger_update_food_rating_delete();
