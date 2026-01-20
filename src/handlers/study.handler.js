/**
 * study.handler.js
 * --------------------------------
 * Phase-3: Study system (start / stop)
 * Uses D1 as single source of truth
 * Router & UI remain untouched
 */

import {
  dbGet,
  dbRun
} from "../db/d1.js";

import {
  SQL_GET_USER_BY_TELEGRAM_ID,
  SQL_CREATE_USER,
  SQL_GET_ACTIVE_STUDY_SESSION,
  SQL_START_STUDY_SESSION,
  SQL_STOP_STUDY_SESSION
} from "../db/queries.js";

import {
  STUDY_ALREADY_RUNNING,
  STUDY_STARTED_MESSAGE,
  STUDY_STOPPED_MESSAGE
} from "../bot/messages.js";

import { sendMessage } from "../services/telegram.service.js";
import { nowIST, formatIST, diffMinutes } from "../utils/time.util.js";

/**
 * Ensure user exists in DB
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
 * START STUDY
 */
export async function startStudy(update, env) {
  const telegramUser = update.message?.from || update.callback_query?.from;
  const chatId = update.message?.chat?.id || update.callback_query?.message?.chat?.id;

  const user = await ensureUser(env, telegramUser);

  const active = await dbGet(
    env,
    SQL_GET_ACTIVE_STUDY_SESSION,
    [user.id]
  );

  if (active) {
    return sendMessage(env, chatId, STUDY_ALREADY_RUNNING);
  }

  const startTime = nowIST();
  const date = startTime.slice(0, 10); // YYYY-MM-DD

  await dbRun(
    env,
    SQL_START_STUDY_SESSION,
    [user.id, startTime, date]
  );

  return sendMessage(
    env,
    chatId,
    STUDY_STARTED_MESSAGE
  );
}

/**
 * STOP STUDY
 */
export async function stopStudy(update, env) {
  const telegramUser = update.message?.from || update.callback_query?.from;
  const chatId = update.message?.chat?.id || update.callback_query?.message?.chat?.id;

  const user = await ensureUser(env, telegramUser);

  const active = await dbGet(
    env,
    SQL_GET_ACTIVE_STUDY_SESSION,
    [user.id]
  );

  if (!active) {
    return sendMessage(
      env,
      chatId,
      "ℹ️ No active study session found.\n\nStart studying first using ▶️ Start Study."
    );
  }

  const endTime = nowIST();
  const durationMinutes = diffMinutes(active.start_time, endTime);

  await dbRun(
    env,
    SQL_STOP_STUDY_SESSION,
    [endTime, durationMinutes, active.id]
  );

  return sendMessage(
    env,
    chatId,
    STUDY_STOPPED_MESSAGE({
      startTime: formatIST(active.start_time),
      endTime: formatIST(endTime),
      duration: formatDuration(durationMinutes)
    })
  );
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
