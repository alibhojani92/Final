// src/engine/ranking.engine.js
// PHASE-7: Ranking & Leaderboard Engine
// Used by admin + student views
// No dependency on UI or router

/**
 * Get global ranking based on total study time + test accuracy
 * @param {object} db - D1 database binding
 */
export async function getGlobalRanking(db) {
  const result = await db
    .prepare(`
      SELECT 
        u.id,
        u.name,
        IFNULL(SUM(s.total_minutes), 0) AS study_minutes,
        IFNULL(AVG(t.accuracy), 0) AS avg_accuracy,
        (
          IFNULL(SUM(s.total_minutes), 0) * 0.6 +
          IFNULL(AVG(t.accuracy), 0) * 0.4
        ) AS score
      FROM users u
      LEFT JOIN daily_study_summary s ON s.user_id = u.id
      LEFT JOIN test_reports t ON t.user_id = u.id
      GROUP BY u.id
      ORDER BY score DESC
    `)
    .all();

  return result.results || [];
}

/**
 * Get top N students
 * @param {object} db
 * @param {number} limit
 */
export async function getTopRankers(db, limit = 10) {
  const result = await db
    .prepare(`
      SELECT 
        u.name,
        IFNULL(SUM(s.total_minutes), 0) AS study_minutes,
        IFNULL(AVG(t.accuracy), 0) AS avg_accuracy
      FROM users u
      LEFT JOIN daily_study_summary s ON s.user_id = u.id
      LEFT JOIN test_reports t ON t.user_id = u.id
      GROUP BY u.id
      ORDER BY 
        (IFNULL(SUM(s.total_minutes),0) * 0.6 + IFNULL(AVG(t.accuracy),0) * 0.4) DESC
      LIMIT ?
    `)
    .bind(limit)
    .all();

  return result.results || [];
}

/**
 * Get individual user rank
 * @param {object} db
 * @param {number} userId
 */
export async function getUserRank(db, userId) {
  const ranks = await getGlobalRanking(db);

  const index = ranks.findIndex((r) => r.id === userId);
  if (index === -1) return null;

  return {
    rank: index + 1,
    totalStudents: ranks.length,
    studyMinutes: Math.round(ranks[index].study_minutes),
    avgAccuracy: Math.round(ranks[index].avg_accuracy),
  };
}
