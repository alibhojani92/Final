/**
 * router.js
 * ------------------------------------------------
 * Central update router
 * Phase-1 → Phase-6 FINAL
 * 🔒 DO NOT MODIFY AFTER THIS
 */

import {
  isCommandUpdate,
  isCallbackUpdate,
  isValidCommand,
  normalizeCommand,
  isValidCallback,
  extractChatId
} from "./validator.js";

import {
  mainMenuKeyboard,
  studyMenuKeyboard,
  testMenuKeyboard,
  adminMenuKeyboard,
  helpKeyboard
} from "./keyboards.js";

import {
  WELCOME_MESSAGE,
  STUDY_MENU_MESSAGE,
  TEST_MENU_MESSAGE,
  PERFORMANCE_MESSAGE,
  REVISION_MESSAGE,
  SCHEDULE_MESSAGE,
  STREAK_MESSAGE,
  SETTINGS_MESSAGE,
  ADMIN_MENU_MESSAGE,
  HELP_MESSAGE,
  UNKNOWN_COMMAND
} from "./messages.js";

import { sendMessage, editMessage } from "../services/telegram.service.js";

// Phase-3
import { startStudy, stopStudy } from "../handlers/study.handler.js";

// Phase-4
import { setDailyTarget } from "../handlers/target.handler.js";
import { dailyReport } from "../handlers/report.handler.js";

// Phase-5
import { startTest, handleTestAnswer } from "../handlers/test.handler.js";

// Phase-6
import { broadcastMessage } from "../handlers/admin.handler.js";

/**
 * MAIN ROUTER
 */
export async function routeUpdate(update, env) {
  try {
    if (isCommandUpdate(update)) {
      return handleCommand(update, env);
    }
    if (isCallbackUpdate(update)) {
      return handleCallback(update, env);
    }
  } catch (err) {
    console.error("ROUTER ERROR:", err);
  }
}

/**
 * COMMAND HANDLER
 */
async function handleCommand(update, env) {
  const text = update.message.text;
  const chatId = extractChatId(update);

  if (!isValidCommand(text)) {
    return sendMessage(env, chatId, UNKNOWN_COMMAND);
  }

  const command = normalizeCommand(text);

  switch (command) {
    case "/start":
      return sendMessage(env, chatId, WELCOME_MESSAGE, mainMenuKeyboard());

    case "/help":
      return sendMessage(env, chatId, HELP_MESSAGE, helpKeyboard());

    // Study
    case "/r":
      return startStudy(update, env);
    case "/s":
      return stopStudy(update, env);

    // Target / Report
    case "/target":
      return setDailyTarget(update, env);
    case "/report":
      return dailyReport(update, env);

    // Test
    case "/test":
      return startTest(update, env);

    // Admin
    case "/broadcast":
      return broadcastMessage(update, env);

    default:
      return sendMessage(env, chatId, UNKNOWN_COMMAND);
  }
}

/**
 * CALLBACK HANDLER
 */
async function handleCallback(update, env) {
  const data = update.callback_query.data;
  const chatId = extractChatId(update);
  const messageId = update.callback_query.message.message_id;

  if (!isValidCallback(data)) return;

  // Test answers
  if (data.startsWith("TEST_")) {
    return handleTestAnswer(update, env);
  }

  switch (data) {
    case "MENU_STUDY":
      return editMessage(env, chatId, messageId, STUDY_MENU_MESSAGE, studyMenuKeyboard());

    case "MENU_TEST":
      return editMessage(env, chatId, messageId, TEST_MENU_MESSAGE, testMenuKeyboard());

    case "MENU_ADMIN":
      return editMessage(env, chatId, messageId, ADMIN_MENU_MESSAGE, adminMenuKeyboard());

    case "MENU_HELP":
      return editMessage(env, chatId, messageId, HELP_MESSAGE, helpKeyboard());

    case "BACK_TO_MAIN":
      return editMessage(env, chatId, messageId, WELCOME_MESSAGE, mainMenuKeyboard());

    case "STUDY_START":
      return startStudy(update, env);

    case "STUDY_STOP":
      return stopStudy(update, env);

    default:
      return;
  }
  }
