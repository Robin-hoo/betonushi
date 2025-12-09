const fs = require('fs');
const path = require('path');
const db = require('./src/db');

async function runMigrations() {
    try {
        const migrationDir = path.join(__dirname, 'src', 'migration');
        const files = fs.readdirSync(migrationDir).filter(f => f.endsWith('.sql')).sort();

        console.log(`Found ${files.length} migration files.`);

        for (const file of files) {
            console.log(`Running migration: ${file}`);
            const sqlPath = path.join(migrationDir, file);
            const sql = fs.readFileSync(sqlPath, 'utf8');
            try {
                await db.query(sql);
                console.log(`  -> Success.`);
            } catch (innerErr) {
                console.warn(`  -> Failed (might already exist): ${innerErr.message}`);
            }
        }
        console.log('All migrations completed.');
    } catch (err) {
        console.error('Migration process failed:', err);
    } finally {
        process.exit();
    }
}

runMigrations();
