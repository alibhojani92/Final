/**
 * target.handler.js
 * --------------------------------
 * Phase-4: Daily target (set / get)
 * Uses D1 only
 * No UI / Router logic here
 */

import { dbGet, dbRun } from "../db/d1.js";
import {
  SQL_GET_USER_BY_TELEGRAM_ID,
  SQL_CREATE_USER,
  SQL_SET_DAILY_TARGET,
  SQL_GET_DAILY_TARGET
} from "../db/queries.js";

import { sendMessage } from "../services/telegram.service.js";
import { nowIST } from "../utils/time.util.js";

/**
 * Ensure user exists
 */
async function ensureUser(env, telegramUser) {
  let user = await dbGet(
    env,
    SQL_GET_USER_BY_TELEGRAM_ID,
    [telegramUser.id]
  );

  if (!user) {
    await dbRun(
      env,
      SQL_CREATE_USER,
      [
        telegramUser.id,
        telegramUser.username || null,
        telegramUser.first_name || null
      ]
    );

    user = await dbGet(
      env,
      SQL_GET_USER_BY_TELEGRAM_ID,
      [telegramUser.id]
    );
  }

  return user;
}

/**
 * SET DAILY TARGET
 * Command: /target <hours>
 * Example: /target 8
 */
export async function setDailyTarget(update, env) {
  const text = update.message.text.trim();
  const chatId = update.message.chat.id;
  const telegramUser = update.message.from;

  const parts = text.split(" ");
  if (parts.length !== 2 || isNaN(parts[1])) {
    return sendMessage(
      env,
      chatId,
      "❗ Usage: /target <hours>\n\nExample: /target 8"
    );
  }

  const hours = Number(parts[1]);
  if (hours <= 0 || hours > 24) {
    return sendMessage(
      env,
      chatId,
      "❗ Please set a valid target between 1 and 24 hours."
    );
  }

  const user = await ensureUser(env, telegramUser);

  const minutes = hours * 60;
  const today = nowIST().slice(0, 10); // YYYY-MM-DD

  await dbRun(
    env,
    SQL_SET_DAILY_TARGET,
    [user.id, minutes, today]
  );

  return sendMessage(
    env,
    chatId,
    `🎯 *Daily Target Set*\n\nYour study target for today:\n${hours} hours (${minutes} minutes)\n\nStay consistent for *GPSC Dental Class-2* 💪`
  );
}

/**
 * GET TODAY TARGET
 */
export async function getTodayTarget(env, userId, date) {
  return dbGet(
    env,
    SQL_GET_DAILY_TARGET,
    [userId, date]
  );
      }
export async function targetHandler(ctx) {
  return handleTarget(ctx);
}
