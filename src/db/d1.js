/**
 * d1.js
 * --------------------------------
 * Cloudflare D1 database wrapper
 * Phase-2 ONLY
 * All raw SQL stays in queries.js
 */

/**
 * Execute SELECT queries
 */
export async function dbSelect(env, sql, params = []) {
  try {
    const stmt = env.DB.prepare(sql);
    const result = await stmt.bind(...params).all();
    return result.results || [];
  } catch (err) {
    console.error("D1 SELECT ERROR:", err.message);
    throw err;
  }
}

/**
 * Execute INSERT / UPDATE / DELETE
 */
export async function dbRun(env, sql, params = []) {
  try {
    const stmt = env.DB.prepare(sql);
    const result = await stmt.bind(...params).run();
    return result;
  } catch (err) {
    console.error("D1 RUN ERROR:", err.message);
    throw err;
  }
}

/**
 * Execute SELECT ONE (single row)
 */
export async function dbGet(env, sql, params = []) {
  try {
    const stmt = env.DB.prepare(sql);
    const result = await stmt.bind(...params).first();
    return result || null;
  } catch (err) {
    console.error("D1 GET ERROR:", err.message);
    throw err;
  }
}

/**
 * Transaction helper (future-safe)
 */
export async function dbTransaction(env, callback) {
  try {
    return await env.DB.batch(callback(env.DB));
  } catch (err) {
    console.error("D1 TRANSACTION ERROR:", err.message);
    throw err;
  }
}
export async function dbAll(db, sql, params = []) {
  return await db.prepare(sql).bind(...params).all();
}

