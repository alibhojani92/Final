/**
 * admin.handler.js
 * --------------------------------
 * Phase-6: Admin manual actions
 * Currently supports: /broadcast
 */

import { dbAll } from "../db/d1.js";
import { sendMessage } from "../services/telegram.service.js";

/**
 * Admin check
 * (Assumes users table has role = 'admin')
 */
const SQL_GET_ADMIN = `
SELECT id
FROM users
WHERE telegram_id = ?
  AND role = 'admin'
`;

/**
 * Get all active users
 */
const SQL_GET_ACTIVE_USERS = `
SELECT telegram_id
FROM users
WHERE is_active = 1
`;

/**
 * /broadcast <message>
 */
export async function broadcastMessage(update, env) {
  const chat = update.message.chat;
  const text = update.message.text;

  // Only private chat
  if (chat.type !== "private") {
    return;
  }

  const telegramId = update.message.from.id;

  // Check admin permission
  const admin = await dbAll(
    env,
    SQL_GET_ADMIN,
    [telegramId]
  );

  if (!admin || admin.length === 0) {
    return sendMessage(
      env,
      chat.id,
      "❌ You are not authorized to use this command."
    );
  }

  const message = text.replace("/broadcast", "").trim();

  if (!message) {
    return sendMessage(
      env,
      chat.id,
      "⚠️ Usage:\n/broadcast <message>"
    );
  }

  const users = await dbAll(env, SQL_GET_ACTIVE_USERS);

  if (!users || users.length === 0) {
    return sendMessage(
      env,
      chat.id,
      "ℹ️ No active users found."
    );
  }

  const broadcastText =
    `📢 *Announcement*\n\n${message}`;

  let sent = 0;

  for (const u of users) {
    try {
      await sendMessage(env, u.telegram_id, broadcastText);
      sent++;
    } catch (err) {
      console.error(
        "Broadcast send failed:",
        u.telegram_id,
        err.message
      );
    }
  }

  return sendMessage(
    env,
    chat.id,
    `✅ Broadcast sent to ${sent} users.`
  );
    }
