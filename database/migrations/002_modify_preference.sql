-- Add survey support columns for the preference table
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS target_name VARCHAR(255);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS priorities VARCHAR(255);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS private_room VARCHAR(255);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS group_size VARCHAR(255);
