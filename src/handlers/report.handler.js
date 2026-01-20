/**
 * report.handler.js
 * --------------------------------
 * Phase-4: Daily study report
 * Combines study sessions + daily target
 * NO router / UI changes here
 */

import { dbGet } from "../db/d1.js";
import {
  SQL_GET_USER_BY_TELEGRAM_ID,
  SQL_GET_TODAY_STUDY_TOTAL,
  SQL_GET_DAILY_TARGET
} from "../db/queries.js";

import { sendMessage } from "../services/telegram.service.js";
import { nowIST } from "../utils/time.util.js";

/**
 * Get today study report
 * Command: /report
 */
export async function dailyReport(update, env) {
  const chatId = update.message.chat.id;
  const telegramUser = update.message.from;

  // Fetch user
  const user = await dbGet(
    env,
    SQL_GET_USER_BY_TELEGRAM_ID,
    [telegramUser.id]
  );

  if (!user) {
    return sendMessage(
      env,
      chatId,
      "ℹ️ No study data found yet.\n\nStart studying using ▶️ Start Study."
    );
  }

  const today = nowIST().slice(0, 10); // YYYY-MM-DD

  // Total study minutes today
  const studyRow = await dbGet(
    env,
    SQL_GET_TODAY_STUDY_TOTAL,
    [user.id, today]
  );

  const studiedMinutes = studyRow?.total_minutes || 0;

  // Target (if any)
  const targetRow = await dbGet(
    env,
    SQL_GET_DAILY_TARGET,
    [user.id, today]
  );

  const targetMinutes = targetRow?.target_minutes || null;

  let message = `📊 *Today’s Study Report*\n\n`;
  message += `Total studied: ${formatDuration(studiedMinutes)}\n`;

  if (targetMinutes) {
    const remaining = Math.max(0, targetMinutes - studiedMinutes);

    message += `Daily target: ${formatDuration(targetMinutes)}\n`;
    message += `Remaining: ${formatDuration(remaining)}\n\n`;

    if (remaining === 0) {
      message += `🏆 *Target Achieved!*\nExcellent consistency today 💯`;
    } else {
      message += `Keep pushing 💪 *GPSC Dental Class-2*`;
    }
  } else {
    message += `\n🎯 No daily target set.\nUse /target <hours> to set one.`;
  }

  return sendMessage(env, chatId, message);
}

/**
 * Format minutes into Xh Ym
 */
function formatDuration(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
    }
// 🔒 Named export required by router
export async function reportHandler(chatId, update, env) {
  return handleReport(chatId, update, env);
    }
