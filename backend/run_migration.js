const fs = require('fs');
const path = require('path');
const db = require('./src/db');

async function runMigrations() {
    try {
        // Run only schema.sql and data.sql from the repository root `database` folder
        const repoDatabase = path.join(__dirname, '..', 'database');
        const targets = ['schema.sql', 'data.sql'];

        for (const file of targets) {
            const sqlPath = path.join(repoDatabase, file);
            if (!fs.existsSync(sqlPath)) {
                console.warn(`Skipping ${file} — not found at ${sqlPath}`);
                continue;
            }

            console.log(`Running SQL file: ${file}`);
            const sql = fs.readFileSync(sqlPath, 'utf8');
            try {
                await db.query(sql);
                console.log(`  -> ${file} applied successfully.`);
            } catch (innerErr) {
                // Keep going; most migrations/seeds are idempotent.
                console.warn(`  -> ${file} failed: ${innerErr.message}`);
            }
        }

        console.log('Selected SQL files completed.');
    } catch (err) {
        console.error('Migration process failed:', err);
    } finally {
        process.exit();
    }
}

runMigrations();
