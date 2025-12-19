const db = require('../db');

async function check() {
  try {
    console.log('Checking localized food name for food_id=1 with lang=en');
    const res = await db.query(
      `SELECT f.food_id, f.name as default_name, ft.lang, ft.name as translated_name
       FROM foods f
       LEFT JOIN food_translations ft ON ft.food_id = f.food_id AND ft.lang = $1
       WHERE f.food_id = $2`,
      ['en', 1]
    );

    console.log(res.rows);

    console.log('Checking localized restaurant name for restaurant_id=1 with lang=ja');
    const res2 = await db.query(
      `SELECT r.restaurant_id, r.name as default_name, rt.lang, rt.name as translated_name
       FROM restaurants r
       LEFT JOIN restaurant_translations rt ON rt.restaurant_id = r.restaurant_id AND rt.lang = $1
       WHERE r.restaurant_id = $2`,
      ['ja', 1]
    );

    console.log(res2.rows);
  } catch (err) {
    console.error('Error checking translations:', err);
  } finally {
    process.exit(0);
  }
}

check();