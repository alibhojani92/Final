/**
 * cron.js
 * --------------------------------
 * Phase-6: Cron schedule configuration
 * All times are IST (handled in jobs)
 */

/**
 * Cron expressions (Cloudflare Workers)
 * NOTE: Cloudflare cron runs in UTC
 * IST offset (+05:30) is handled inside job logic
 */

export const CRON_SCHEDULES = {
  // 06:00 IST → 00:30 UTC
  MORNING_MOTIVATION: "30 0 * * *",

  // 14:00 IST → 08:30 UTC
  STUDY_REMINDER: "30 8 * * *",

  // 22:00 IST → 16:30 UTC
  NIGHT_SUMMARY: "30 16 * * *"
};

/**
 * Job identifiers (used by scheduler)
 */
export const CRON_JOBS = {
  MORNING: "morning_motivation",
  REMINDER: "study_reminder",
  SUMMARY: "night_summary"
};
