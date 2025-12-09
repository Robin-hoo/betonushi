const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create Token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    login
};
