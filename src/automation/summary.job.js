/**
 * summary.job.js
 * --------------------------------
 * Phase-6: Night summary job
 */

import { dbAll, dbGet } from "../db/d1.js";
import { sendMessage } from "../services/telegram.service.js";
import { nowIST } from "../utils/time.util.js";

/**
 * Queries
 */
const SQL_GET_ACTIVE_USERS = `
SELECT id, telegram_id
FROM users
WHERE is_active = 1
`;

const SQL_GET_TODAY_STUDY = `
SELECT COALESCE(SUM(total_minutes), 0) AS minutes
FROM study_sessions
WHERE user_id = ?
  AND date(started_at) = ?
`;

const SQL_GET_TODAY_TARGET = `
SELECT target_minutes
FROM daily_targets
WHERE user_id = ?
  AND date = ?
`;

const SQL_GET_TODAY_TESTS = `
SELECT
  COUNT(*) AS total_tests,
  COALESCE(AVG(accuracy), 0) AS avg_accuracy
FROM test_results
WHERE user_id = ?
  AND date(created_at) = ?
`;

export async function runSummaryJob(env) {
  const today = nowIST().slice(0, 10); // YYYY-MM-DD
  const users = await dbAll(env, SQL_GET_ACTIVE_USERS);

  if (!users || users.length === 0) {
    console.log("Summary job: No active users");
    return;
  }

  for (const user of users) {
    try {
      const studyRow = await dbGet(
        env,
        SQL_GET_TODAY_STUDY,
        [user.id, today]
      );

      const targetRow = await dbGet(
        env,
        SQL_GET_TODAY_TARGET,
        [user.id, today]
      );

      const testRow = await dbGet(
        env,
        SQL_GET_TODAY_TESTS,
        [user.id, today]
      );

      const studied = studyRow?.minutes || 0;
      const target = targetRow?.target_minutes || null;
      const remaining = target ? Math.max(0, target - studied) : null;

      let message =
        `📊 *Daily Summary – GPSC Dental Class-2*\n\n` +
        `Study: ${formatMinutes(studied)}\n`;

      if (target) {
        message +=
          `Target: ${formatMinutes(target)}\n` +
          `Remaining: ${formatMinutes(remaining)}\n\n`;
      } else {
        message += `Target: Not set\n\n`;
      }

      message +=
        `Tests taken: ${testRow?.total_tests || 0}\n` +
        `Accuracy: ${Math.round(testRow?.avg_accuracy || 0)}%\n\n` +
        `Consistency builds rank 🏆`;

      await sendMessage(env, user.telegram_id, message);
    } catch (err) {
      console.error(
        "Summary job failed:",
        user.telegram_id,
        err.message
      );
    }
  }

  console.log(`Summary job sent to ${users.length} users`);
}

/**
 * Utility: minutes → Xh Ym
 */
function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;

  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
