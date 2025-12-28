-- Add rating and number_of_rating to restaurants table
ALTER TABLE restaurants
ADD COLUMN rating DECIMAL(3, 2) DEFAULT 0.00,
ADD COLUMN number_of_rating INTEGER DEFAULT 0;
