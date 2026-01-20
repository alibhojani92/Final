/**
 * time.util.js
 * --------------------------------
 * IST time & duration helpers
 * Phase-3 ONLY
 * No side effects, pure functions
 */

/**
 * Get current IST datetime in ISO format
 * Example: 2026-01-21T06:10:00+05:30
 */
export function nowIST() {
  const now = new Date();

  // Convert to IST (+05:30)
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffsetMs);

  return istTime.toISOString().replace("Z", "+05:30");
}

/**
 * Format IST ISO datetime to readable time
 * Example: 06:10 AM
 */
export function formatIST(isoString) {
  const date = new Date(isoString);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata"
  });
}

/**
 * Difference between two ISO datetimes in minutes
 */
export function diffMinutes(startIso, endIso) {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();

  return Math.max(0, Math.round((end - start) / 60000));
    }
