// src/engine/analytics.engine.js
// PHASE-7: Admin Analytics Engine
// READ-ONLY for other phases

import { nowIST } from "../utils/time.util.js";

/**
 * Fetch institute-wide analytics for admin
 * @param {object} db - D1 database binding
 */
export async function getInstituteAnalytics(db) {
  const today = nowIST().slice(0, 10); // YYYY-MM-DD

  // total students
  const totalStudents = await db
    .prepare(`SELECT COUNT(*) as count FROM users`)
    .first();

  // active today (any study or test today)
  const activeToday = await db
    .prepare(
      `
      SELECT COUNT(DISTINCT user_id) as count
      FROM activity_log
      WHERE date = ?
      `
    )
    .bind(today)
    .first();

  // average study time today
  const avgStudy = await db
    .prepare(
      `
      SELECT AVG(total_minutes) as avg_minutes
      FROM daily_study_summary
      WHERE date = ?
      `
    )
    .bind(today)
    .first();

  // average test accuracy
  const avgAccuracy = await db
    .prepare(
      `
      SELECT AVG(accuracy) as avg_accuracy
      FROM test_reports
      `
    )
    .first();

  // top performers (accuracy based)
  const topPerformers = await db
    .prepare(
      `
      SELECT u.name, AVG(t.accuracy) as accuracy
      FROM test_reports t
      JOIN users u ON u.id = t.user_id
      GROUP BY t.user_id
      ORDER BY accuracy DESC
      LIMIT 5
      `
    )
    .all();

  return {
    totalStudents: totalStudents?.count || 0,
    activeToday: activeToday?.count || 0,
    avgStudyMinutes: Math.round(avgStudy?.avg_minutes || 0),
    avgAccuracy: Math.round(avgAccuracy?.avg_accuracy || 0),
    topPerformers: topPerformers?.results || [],
  };
    }
