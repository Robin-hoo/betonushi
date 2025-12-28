ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 2) DEFAULT 0;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS number_of_rating INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION update_restaurant_rating(restaurantId INT)
RETURNS VOID AS $$
BEGIN
    UPDATE restaurants
    SET
        number_of_rating = (
            SELECT COUNT(*)
            FROM reviews
            WHERE target_id = restaurantId AND type = 'restaurant'
        ),
        rating = (
            SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
            FROM reviews
            WHERE target_id = restaurantId AND type = 'restaurant'
        )
    WHERE restaurant_id = restaurantId;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trigger_update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'restaurant' THEN
        PERFORM update_restaurant_rating(NEW.target_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trigger_update_restaurant_rating_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.type = 'restaurant' THEN
        PERFORM update_restaurant_rating(OLD.target_id);
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS review_restaurant_insert ON reviews;
CREATE TRIGGER review_restaurant_insert
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_update_restaurant_rating();

DROP TRIGGER IF EXISTS review_restaurant_update ON reviews;
CREATE TRIGGER review_restaurant_update
AFTER UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_update_restaurant_rating();

DROP TRIGGER IF EXISTS review_restaurant_delete ON reviews;
CREATE TRIGGER review_restaurant_delete
AFTER DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_update_restaurant_rating_delete();

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT DISTINCT target_id FROM reviews WHERE type = 'restaurant'
    LOOP
        PERFORM update_restaurant_rating(r.target_id);
    END LOOP;
END $$;