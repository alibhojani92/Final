/**
 * reminder.job.js
 * --------------------------------
 * Phase-6: Study reminder job
 */

import { dbAll } from "../db/d1.js";
import { sendMessage } from "../services/telegram.service.js";
import { nowIST } from "../utils/time.util.js";

/**
 * Users who have NOT studied today
 */
const SQL_GET_USERS_WITHOUT_STUDY_TODAY = `
SELECT u.telegram_id
FROM users u
LEFT JOIN study_sessions s
  ON u.id = s.user_id
  AND date(s.started_at) = ?
WHERE s.id IS NULL
  AND u.is_active = 1
`;

export async function runReminderJob(env) {
  const today = nowIST().slice(0, 10); // YYYY-MM-DD

  const users = await dbAll(
    env,
    SQL_GET_USERS_WITHOUT_STUDY_TODAY,
    [today]
  );

  if (!users || users.length === 0) {
    console.log("Reminder job: No pending users");
    return;
  }

  const message =
    `⏰ *Gentle Reminder*\n\n` +
    `You haven’t started studying today.\n` +
    `Even 30 minutes matters 📚`;

  for (const u of users) {
    try {
      await sendMessage(env, u.telegram_id, message);
    } catch (err) {
      console.error(
        "Reminder job send failed:",
        u.telegram_id,
        err.message
      );
    }
  }

  console.log(`Reminder job sent to ${users.length} users`);
}
