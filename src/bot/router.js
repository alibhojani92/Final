/**
 * router.js
 * --------------------------------
 * Central update router (ONE TIME FILE)
 * Phase-1 only
 * NEVER modify after this phase
 */

import {
  isCommandUpdate,
  isCallbackUpdate,
  isValidCommand,
  normalizeCommand,
  isValidCallback,
  extractChatId,
  extractUserId
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
  ADMIN_ACCESS_DENIED,
  HELP_MESSAGE,
  UNKNOWN_COMMAND
} from "./messages.js";

import { sendMessage, editMessage } from "../services/telegram.service.js";

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

    return;
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
      return sendMessage(
        env,
        chatId,
        WELCOME_MESSAGE,
        mainMenuKeyboard()
      );

    case "/help":
      return sendMessage(
        env,
        chatId,
        HELP_MESSAGE,
        helpKeyboard()
      );

    // Short commands for study (logic later in Phase-3)
    case "/r":
      return sendMessage(
        env,
        chatId,
        STUDY_MENU_MESSAGE,
        studyMenuKeyboard()
      );

    case "/s":
      return sendMessage(
        env,
        chatId,
        STUDY_MENU_MESSAGE,
        studyMenuKeyboard()
      );

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

  if (!isValidCallback(data)) {
    return;
  }

  switch (data) {
    // ----------------------------
    // MAIN MENU
    // ----------------------------
    case "MENU_STUDY":
      return editMessage(
        env,
        chatId,
        update.callback_query.message.message_id,
        STUDY_MENU_MESSAGE,
        studyMenuKeyboard()
      );

    case "MENU_TEST":
      return editMessage(
        env,
        chatId,
        update.callback_query.message.message_id,
        TEST_MENU_MESSAGE,
        testMenuKeyboard()
      );

    case "MENU_PERFORMANCE":
      return editMessage(
        env,
        chatId,
        update.callback_query.message.message_id,
        PERFORMANCE_MESSAGE,
        mainMenuKeyboard()
      );

    case "MENU_REVISION":
      return editMessage(
        env,
        chatId,
        update.callback_query.message.message_id,
        REVISION_MESSAGE,
        mainMenuKeyboard()
      );

    case "MENU_SCHEDULE":
      return editMessage(
        env,
        chatId,
        update.callback_query.message.message_id,
        SCHEDULE_MESSAGE,
        mainMenuKeyboard()
      );

    case "MENU_STREAK":
      return editMessage(
        env,
        chatId,
        update.callback_query.message.message_id,
        STREAK_MESSAGE,
        mainMenuKeyboard()
      );

    case "MENU_SETTINGS":
      return editMessage(
        env,
        chatId,
        update.callback_query.message.message_id,
        SETTINGS_MESSAGE,
        mainMenuKeyboard()
      );

    case "MENU_ADMIN":
      // Actual admin validation comes in Phase-7
      return editMessage(
        env,
        chatId,
        update.callback_query.message.message_id,
        ADMIN_MENU_MESSAGE,
        adminMenuKeyboard()
      );

    case "MENU_HELP":
      return editMessage(
        env,
        chatId,
        update.callback_query.message.message_id,
        HELP_MESSAGE,
        helpKeyboard()
      );

    // ----------------------------
    // STUDY (LOGIC LATER)
    // ----------------------------
    case "STUDY_START":
    case "STUDY_STOP":
      return; // Phase-3 handles logic

    // ----------------------------
    // TEST (LOGIC LATER)
    // ----------------------------
    case "TEST_START":
    case "TEST_PRACTICE":
    case "TEST_ANSWER_A":
    case "TEST_ANSWER_B":
    case "TEST_ANSWER_C":
    case "TEST_ANSWER_D":
      return; // Phase-5 handles logic

    // ----------------------------
    // COMMON
    // ----------------------------
    case "BACK_TO_MAIN":
      return editMessage(
        env,
        chatId,
        update.callback_query.message.message_id,
        WELCOME_MESSAGE,
        mainMenuKeyboard()
      );

    default:
      return;
  }
}
