/**
 * timer.util.js
 * ------------------------------------------------
 * Phase-5: Question timer utility
 * Pure timing helper (no Telegram, no DB)
 */

const QUESTION_TIME_MS = 5 * 60 * 1000;     // 5 minutes
const WARNING_TIME_MS = 2 * 60 * 1000;      // last 2 minutes

/**
 * Start question timer
 *
 * @param {Object} params
 * @param {Function} params.onWarning - called at 2 min remaining
 * @param {Function} params.onTimeout - called when time ends
 */
export function startQuestionTimer({ onWarning, onTimeout }) {
  let warningTimeoutId = null;
  let finalTimeoutId = null;

  // 2-minute warning
  warningTimeoutId = setTimeout(() => {
    try {
      onWarning && onWarning();
    } catch (e) {
      console.error("Timer warning error:", e);
    }
  }, QUESTION_TIME_MS - WARNING_TIME_MS);

  // Final timeout
  finalTimeoutId = setTimeout(() => {
    try {
      onTimeout && onTimeout();
    } catch (e) {
      console.error("Timer timeout error:", e);
    }
  }, QUESTION_TIME_MS);

  return {
    cancel() {
      if (warningTimeoutId) clearTimeout(warningTimeoutId);
      if (finalTimeoutId) clearTimeout(finalTimeoutId);
    }
  };
}

/**
 * Export constants (used by UI text if needed)
 */
export const QUESTION_TIME_MINUTES = 5;
export const WARNING_TIME_MINUTES = 2;
