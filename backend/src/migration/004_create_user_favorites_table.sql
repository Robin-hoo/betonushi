-- Migration: Create user_favorites table
-- This table stores the relationship between users and their favorite dishes
-- Each row represents one user's favorite dish

CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    food_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_food
        FOREIGN KEY (food_id)
        REFERENCES food(id)
        ON DELETE CASCADE,
    
    -- Prevent duplicate favorites
    CONSTRAINT unique_user_food
        UNIQUE (user_id, food_id)
);

-- Index for faster lookups by user
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);

-- Index for faster lookups by food
CREATE INDEX idx_user_favorites_food_id ON user_favorites(food_id);
