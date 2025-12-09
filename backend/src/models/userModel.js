const db = require('../db');

/**
 * Find a user by their email address.
 * @param {string} email 
 * @returns {Promise<object|null>} The user object or null if not found.
 */
async function findByEmail(email) {
    const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}

module.exports = {
    findByEmail,
    create: async (userData) => {
        const { name, email, password, first_name, last_name, phone, gender, dob, address } = userData;
        const result = await db.query(
            `INSERT INTO users (name, email, password, first_name, last_name, phone, gender, dob, address) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
             RETURNING *`,
            [name, email, password, first_name, last_name, phone, gender, dob, address]
        );
        return result.rows[0];
    }
};
