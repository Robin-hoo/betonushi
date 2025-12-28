CREATE OR REPLACE FUNCTION update_restaurant_rating(restaurantId INT)
RETURNS VOID AS $$
DECLARE
    new_rating DECIMAL;
    new_count INTEGER;
BEGIN
    -- Calculate the new average rating and count for the given restaurant
    SELECT 
        COALESCE(ROUND(AVG(rating)::numeric, 2), 0),
        COUNT(rating)
    INTO 
        new_rating, 
        new_count
    FROM 
        reviews
    WHERE 
        target_id = restaurantId AND type = 'restaurant';

    -- Update the restaurants table
    UPDATE restaurants
    SET 
        rating = new_rating,
        number_of_rating = new_count
    WHERE 
        restaurant_id = restaurantId;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT or UPDATE on reviews for restaurants
CREATE OR REPLACE FUNCTION trigger_update_restaurant_rating_insert_update()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.type = 'restaurant' THEN
        PERFORM update_restaurant_rating(NEW.target_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for DELETE on reviews for restaurants
CREATE OR REPLACE FUNCTION trigger_update_restaurant_rating_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.type = 'restaurant' THEN
        PERFORM update_restaurant_rating(OLD.target_id);
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for restaurants
DROP TRIGGER IF EXISTS review_restaurant_after_insert ON reviews;
CREATE TRIGGER review_restaurant_after_insert
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_update_restaurant_rating_insert_update();

DROP TRIGGER IF EXISTS review_restaurant_after_update ON reviews;
CREATE TRIGGER review_restaurant_after_update
AFTER UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_update_restaurant_rating_insert_update();

DROP TRIGGER IF EXISTS review_restaurant_after_delete ON reviews;
CREATE TRIGGER review_restaurant_after_delete
AFTER DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_update_restaurant_rating_delete();
