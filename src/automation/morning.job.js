/**
 * morning.job.js
 * --------------------------------
 * Phase-6: Morning motivation job
 */

import { dbAll } from "../db/d1.js";
import { sendMessage } from "../services/telegram.service.js";

/**
 * Fetch all active users
 * (Assumes users table with is_active flag)
 */
const SQL_GET_ACTIVE_USERS = `
SELECT telegram_id
FROM users
WHERE is_active = 1
`;

export async function runMorningJob(env) {
  const users = await dbAll(env, SQL_GET_ACTIVE_USERS);

  if (!users || users.length === 0) {
    console.log("Morning job: No active users");
    return;
  }

  const message =
    `🌅 *Good Morning – GPSC Dental Class-2* 🦷\n\n` +
    `A focused 6–8 hours today can change your rank.\n` +
    `Start strong 💪`;

  for (const u of users) {
    try {
      await sendMessage(env, u.telegram_id, message);
    } catch (err) {
      console.error(
        "Morning job send failed:",
        u.telegram_id,
        err.message
      );
    }
  }

  console.log(`Morning job sent to ${users.length} users`);
}
