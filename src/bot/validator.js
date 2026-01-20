/**
 * validator.js
 * --------------------------------
 * Central validation helpers
 * Used by router.js ONLY
 * NO business logic allowed
 */

// ==============================
// COMMAND VALIDATION
// ==============================
const ALLOWED_COMMANDS = new Set([
  "/start",
  "/help",
  "/r",   // start study
  "/s"    // stop study
]);

export function isValidCommand(text = "") {
  if (!text.startsWith("/")) return false;
  const cmd = text.split(" ")[0];
  return ALLOWED_COMMANDS.has(cmd);
}

export function normalizeCommand(text = "") {
  return text.trim().split(" ")[0];
}

// ==============================
// CALLBACK VALIDATION
// ==============================
const ALLOWED_CALLBACKS = new Set([
  // Main menu
  "MENU_STUDY",
  "MENU_TEST",
  "MENU_PERFORMANCE",
  "MENU_REVISION",
  "MENU_SCHEDULE",
  "MENU_STREAK",
  "MENU_SETTINGS",
  "MENU_ADMIN",
  "MENU_HELP",

  // Study
  "STUDY_START",
  "STUDY_STOP",

  // Test
  "TEST_START",
  "TEST_PRACTICE",
  "TEST_ANSWER_A",
  "TEST_ANSWER_B",
  "TEST_ANSWER_C",
  "TEST_ANSWER_D",

  // Admin
  "ADMIN_ADD_SUBJECT",
  "ADMIN_ADD_MCQ",
  "ADMIN_VIEW_REPORTS",
  "ADMIN_BROADCAST",

  // Common
  "BACK_TO_MAIN"
]);

export function isValidCallback(data = "") {
  return ALLOWED_CALLBACKS.has(data);
}

// ==============================
// CHAT TYPE VALIDATION
// ==============================
export function isPrivateChat(update) {
  return update?.message?.chat?.type === "private" ||
         update?.callback_query?.message?.chat?.type === "private";
}

// ==============================
// USER / CHAT EXTRACTORS
// ==============================
export function extractChatId(update) {
  if (update.message) return update.message.chat.id;
  if (update.callback_query) return update.callback_query.message.chat.id;
  return null;
}

export function extractUserId(update) {
  if (update.message) return update.message.from.id;
  if (update.callback_query) return update.callback_query.from.id;
  return null;
}

// ==============================
// UPDATE TYPE CHECKS
// ==============================
export function isCommandUpdate(update) {
  return Boolean(update?.message?.text?.startsWith("/"));
}

export function isCallbackUpdate(update) {
  return Boolean(update?.callback_query?.data);
  }
