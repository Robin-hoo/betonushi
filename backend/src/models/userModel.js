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
        const { full_name, email, password_hash, birth_date } = userData;
        const result = await db.query(
            `INSERT INTO users (full_name, email, password_hash, birth_date) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [full_name, email, password_hash, birth_date]
        );
        return result.rows[0];
    }
};
