/**
 * keyboards.js
 * -----------------------------
 * UI keyboard definitions ONLY
 * Used across all phases (1–7)
 * NEVER put logic here
 */

// ==============================
// MAIN MENU
// ==============================
export function mainMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "📚 Study Zone", callback_data: "MENU_STUDY" }],
      [{ text: "📝 Test Zone", callback_data: "MENU_TEST" }],
      [{ text: "📊 Performance", callback_data: "MENU_PERFORMANCE" }],
      [{ text: "🧠 Revision & Weak Areas", callback_data: "MENU_REVISION" }],
      [{ text: "⏰ Schedule & Target", callback_data: "MENU_SCHEDULE" }],
      [{ text: "🏆 Streak & Rank", callback_data: "MENU_STREAK" }],
      [{ text: "⚙️ Settings", callback_data: "MENU_SETTINGS" }],
      [{ text: "👮 Admin Panel", callback_data: "MENU_ADMIN" }],
      [{ text: "ℹ️ Help", callback_data: "MENU_HELP" }]
    ]
  };
}

// ==============================
// STUDY ZONE
// ==============================
export function studyMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "▶️ Start Study", callback_data: "STUDY_START" }],
      [{ text: "⏹️ Stop Study", callback_data: "STUDY_STOP" }],
      [{ text: "⬅️ Back to Main Menu", callback_data: "BACK_TO_MAIN" }]
    ]
  };
}

// ==============================
// TEST ZONE
// ==============================
export function testMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "📝 Start Test", callback_data: "TEST_START" }],
      [{ text: "📘 Practice MCQs", callback_data: "TEST_PRACTICE" }],
      [{ text: "⬅️ Back to Main Menu", callback_data: "BACK_TO_MAIN" }]
    ]
  };
}

// ==============================
// TEST QUESTION (OPTIONS)
// ==============================
export function mcqOptionsKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "A", callback_data: "TEST_ANSWER_A" }],
      [{ text: "B", callback_data: "TEST_ANSWER_B" }],
      [{ text: "C", callback_data: "TEST_ANSWER_C" }],
      [{ text: "D", callback_data: "TEST_ANSWER_D" }]
    ]
  };
}

// ==============================
// ADMIN PANEL
// ==============================
export function adminMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "➕ Add Subject", callback_data: "ADMIN_ADD_SUBJECT" }],
      [{ text: "➕ Add MCQ", callback_data: "ADMIN_ADD_MCQ" }],
      [{ text: "📊 View Reports", callback_data: "ADMIN_VIEW_REPORTS" }],
      [{ text: "📢 Broadcast Message", callback_data: "ADMIN_BROADCAST" }],
      [{ text: "⬅️ Back to Main Menu", callback_data: "BACK_TO_MAIN" }]
    ]
  };
}

// ==============================
// HELP
// ==============================
export function helpKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "⬅️ Back to Main Menu", callback_data: "BACK_TO_MAIN" }]
    ]
  };
        }
