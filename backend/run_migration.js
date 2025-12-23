const fs = require('fs');
const path = require('path');
const db = require('./src/db');

async function runMigrations() {
    try {
        const args = process.argv.slice(2);
        const isReset = args.includes('--reset');

        const repoDatabase = path.join(__dirname, '..', 'database');
        const migrationsDir = path.join(repoDatabase, 'migrations');

        // 1. If --reset, execute schema.sql and data.sql first
        if (isReset) {
            console.log('>>> RESET MODE DETECTED: Re-applying schema and seed data...');
            const resetFiles = ['schema.sql', 'data.sql'];

            for (const file of resetFiles) {
                const sqlPath = path.join(repoDatabase, file);
                if (!fs.existsSync(sqlPath)) {
                    console.warn(`Skipping ${file} — not found at ${sqlPath}`);
                    continue;
                }

                console.log(`Running core SQL file: ${file}`);
                const sql = fs.readFileSync(sqlPath, 'utf8');
                try {
                    await db.query(sql);
                    console.log(`  -> ${file} applied successfully.`);
                } catch (innerErr) {
                    console.warn(`  -> ${file} failed: ${innerErr.message}`);
                }
            }
        } else {
            console.log('>>> MIGRATION MODE: Only running new migrations...');
        }

        // 2. Always run all migration files in database/migrations
        if (fs.existsSync(migrationsDir)) {
            const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

            if (files.length === 0) {
                console.log('No migration files found in database/migrations.');
            } else {
                console.log(`Found ${files.length} migration files. Processing...`);

                for (const file of files) {
                    const sqlPath = path.join(migrationsDir, file);
                    console.log(`Running migration: ${file}`);
                    const sql = fs.readFileSync(sqlPath, 'utf8');

                    try {
                        await db.query(sql);
                        console.log(`  -> ${file} applied successfully.`);
                    } catch (innerErr) {
                        // In a real migration system, we might want to track which migrations have run
                        // to avoid re-running them or erroring if they are not idempotent.
                        // For now, we warn.
                        console.warn(`  -> ${file} failed (might be already applied): ${innerErr.message}`);
                    }
                }
            }
        } else {
            console.warn(`Migrations directory not found at ${migrationsDir}`);
        }

        console.log('Database operation completed.');
    } catch (err) {
        console.error('Migration process failed:', err);
    } finally {
        process.exit();
    }
}

runMigrations();
