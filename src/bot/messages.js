/**
 * messages.js
 * -----------------------------
 * Centralized bot messages
 * Used across all phases (1–7)
 * NO logic allowed here
 */

// ==============================
// START / WELCOME
// ==============================
export const WELCOME_MESSAGE = `
Welcome to *GPSC Dental Class-2 Preparation Bot* 🦷

Your complete companion for:
• Smart study tracking
• Exam-oriented MCQ tests
• Performance analysis
• Consistent preparation

Choose an option below 👇
`;

// ==============================
// STUDY ZONE
// ==============================
export const STUDY_MENU_MESSAGE = `
📚 *Study Zone*

Track your daily study time with precision.
Start and stop sessions anytime.

Choose an action 👇
`;

export const STUDY_ALREADY_RUNNING = `
⚠️ *Study session already running*

You already have an active study session.
Please stop it before starting a new one.
`;

export const STUDY_STARTED_MESSAGE = `
▶️ *Study Started*

Focus mode ON 🔥
Your study time is being tracked accurately.

All the best for GPSC Dental Class-2 💪
`;

export const STUDY_STOPPED_MESSAGE = ({
  startTime,
  endTime,
  duration
}) => `
🎯 *Daily Study Summary*

Started at: ${startTime}
Stopped at: ${endTime}

Total studied today: ${duration}

Excellent discipline for *GPSC Dental Class-2* 🏆
`;

// ==============================
// TEST ZONE
// ==============================
export const TEST_MENU_MESSAGE = `
📝 *Test Zone*

Practice exam-level MCQs.
Track accuracy and speed.

Choose an option 👇
`;

export const TEST_NOT_AVAILABLE = `
⚠️ Tests will be activated soon.
Stay consistent with study meanwhile 💪
`;

export const TEST_STARTED_MESSAGE = `
📝 *Test Started*

Read the question carefully and select the correct answer 👇
`;

export const TEST_ANSWER_LOCKED = `
⏳ Time over!

Your answer has been auto-submitted.
`;

// ==============================
// PERFORMANCE
// ==============================
export const PERFORMANCE_MESSAGE = `
📊 *Performance Overview*

Detailed reports coming soon.
Stay regular with study & tests 📈
`;

// ==============================
// REVISION
// ==============================
export const REVISION_MESSAGE = `
🧠 *Revision & Weak Areas*

Smart revision system will help you
strengthen weak topics soon.
`;

// ==============================
// SCHEDULE & TARGET
// ==============================
export const SCHEDULE_MESSAGE = `
⏰ *Schedule & Target*

Set daily study targets.
Track remaining time precisely.
`;

// ==============================
// STREAK & RANK
// ==============================
export const STREAK_MESSAGE = `
🏆 *Streak & Rank*

Consistency beats intensity.
Maintain your streak daily 🔥
`;

// ==============================
// SETTINGS
// ==============================
export const SETTINGS_MESSAGE = `
⚙️ *Settings*

Customize your experience.
More options coming soon.
`;

// ==============================
// ADMIN
// ==============================
export const ADMIN_ACCESS_DENIED = `
⛔ *Access Denied*

This section is restricted to admins only.
`;

export const ADMIN_MENU_MESSAGE = `
👮 *Admin Panel*

Manage subjects, MCQs, reports,
and announcements from here.
`;

// ==============================
// HELP
// ==============================
export const HELP_MESSAGE = `
ℹ️ *Help & Commands*

/start  – Restart bot
/r      – Start study
/s      – Stop study

Use menu buttons for best experience.
`;

// ==============================
// COMMON
// ==============================
export const UNKNOWN_COMMAND = `
❓ Unknown command

Please use the menu buttons
or type /help for assistance.
`;
