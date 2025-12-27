const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const e = require('express');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; // In production, use env var

async function login(req, res) {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Check if user exists
        const user = await userModel.findByEmail(email);
        if (!user) {
            // Unified error message for security
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // specific handling if using hash logic, assuming password in DB is hashed
        // For now we compare. 
        // IMPORTANT: In a real app setup, we must ensure users are inserted with hashed passwords.
        // I will include a helper to create a user if needed for testing, but for Login, we just verify.

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create Token
        const token = jwt.sign(
            { userId: user.user_id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({
            message: 'Login successful',
            token,
            exprires_at: Date.now() + 3600 * 1000, // 1 hour from now
            user: {
                id: user.user_id,
                fullName: user.full_name,
                email: user.email,
                phone: user.phone_number,
                address: user.address,
                dob: user.birth_date,
                avatarUrl: user.avatar_url
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    login,

    register: async (req, res) => {
        try {
            const { first_name, last_name, email, phone, gender, dob, address, password, confirmPassword } = req.body;

            // 1. Validation matches frontend
            if (!email || !first_name || !last_name || !phone || !password || !dob || !gender) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            // Phone format (simple check)
            const phoneRegex = /^0\d{9}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ message: 'Invalid phone number format' });
            }

            // Password complexity
            // "At least 2 of 3 types: letters, numbers, symbols (excluding " and ')"
            let typesCount = 0;
            if (/[a-zA-Z]/.test(password)) typesCount++;
            if (/\d/.test(password)) typesCount++;
            if (/[^a-zA-Z0-9"']/.test(password)) typesCount++;

            if (password.length < 8 || typesCount < 2) {
                return res.status(400).json({ message: 'Password must be at least 8 chars and contain 2 of 3 types: letters, numbers, symbols.' });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }

            // 2. Check existence
            const existingUser = await userModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            // 3. Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // 4. Create user
            // Construct full name
            const fullName = `${first_name} ${last_name}`;

            const newUser = await userModel.create({
                full_name: fullName,
                email,
                password_hash: hashedPassword,
                birth_date: dob,
                phone,
                address,
                avatar_url: null // Default avatar logic can be added here
            });

            // 5. Response
            return res.status(201).json({
                message: 'Registration successful',
                user: {
                    id: newUser.user_id,
                    fullName: newUser.full_name,
                    email: newUser.email,
                    phone: newUser.phone_number,
                    address: newUser.address,
                    dob: newUser.birth_date,
                    avatarUrl: newUser.avatar_url
                }
            });

        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};
