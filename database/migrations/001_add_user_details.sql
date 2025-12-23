
-- Migration to add phone_number and address to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;

UPDATE users
SET phone_number = '0123456789',
    address = '123, Anytown, Hanoi, Vietnam';


