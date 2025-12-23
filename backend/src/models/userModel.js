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
        const { full_name, email, password_hash, birth_date, phone, address, avatar_url } = userData;
        const result = await db.query(
            `INSERT INTO users (full_name, email, password_hash, birth_date, phone_number, address, avatar_url) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
            [full_name, email, password_hash, birth_date, phone, address, avatar_url]
        );
        return result.rows[0];
    },
    update: async (userId, updateData) => {
        const { full_name, phone, address, birth_date } = updateData;
        const result = await db.query(
            `UPDATE users 
             SET full_name = COALESCE($1, full_name),
                 phone_number = COALESCE($2, phone_number),
                 address = COALESCE($3, address),
                 birth_date = COALESCE($4, birth_date)
             WHERE user_id = $5
             RETURNING *`,
            [full_name, phone, address, birth_date, userId]
        );
        return result.rows[0];
    }
};
