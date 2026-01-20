// src/handlers/admin.handler.js
// PHASE-7: Admin Analytics & Ranking Handler
// Admin-only commands & callbacks
// Depends ONLY on engines + services (no router logic here)

import { getGlobalRanking, getTopRankers } from "../engine/ranking.engine.js";
import { getSystemAnalytics } from "../engine/analytics.engine.js";
import { sendMessage } from "../services/telegram.service.js";
import { isAdmin } from "../config/permissions.js";

/**
 * Handle admin commands & callbacks
 */
export async function adminHandler(ctx) {
  const { db, chatId, userId, text, callbackData } = ctx;

  // 🔐 Admin check
  if (!isAdmin(userId)) {
    return sendMessage(chatId, "⛔ Access denied. Admins only.");
  }

  /* =========================
     ADMIN COMMANDS
  ========================== */

  if (text === "/admin") {
    return sendMessage(
      chatId,
      `👮 Admin Panel

Choose an option:
• /stats – System analytics
• /rank – Global ranking
• /top – Top performers
`
    );
  }

  if (text === "/stats") {
    const stats = await getSystemAnalytics(db);

    return sendMessage(
      chatId,
      `📊 System Analytics

👥 Total Students: ${stats.totalUsers}
📚 Total Study Hours: ${stats.totalStudyHours} hrs
📝 Total Tests Taken: ${stats.totalTests}
🎯 Avg Accuracy: ${stats.avgAccuracy}%
`
    );
  }

  if (text === "/rank") {
    const ranking = await getGlobalRanking(db);

    if (!ranking.length) {
      return sendMessage(chatId, "No ranking data available yet.");
    }

    let msg = "🏆 Global Ranking (Top 10)\n\n";

    ranking.slice(0, 10).forEach((u, i) => {
      msg += `${i + 1}. ${u.name || "Student"} – ${Math.round(
        u.study_minutes
      )} min | ${Math.round(u.avg_accuracy)}%\n`;
    });

    return sendMessage(chatId, msg);
  }

  if (text === "/top") {
    const top = await getTopRankers(db, 5);

    if (!top.length) {
      return sendMessage(chatId, "No data available.");
    }

    let msg = "🔥 Top Performers\n\n";

    top.forEach((u, i) => {
      msg += `${i + 1}. ${u.name || "Student"}\n   📚 ${
        Math.round(u.study_minutes)
      } min | 🎯 ${Math.round(u.avg_accuracy)}%\n`;
    });

    return sendMessage(chatId, msg);
  }

  /* =========================
     ADMIN CALLBACKS (FUTURE)
  ========================== */

  if (callbackData === "ADMIN_DASHBOARD") {
    return sendMessage(
      chatId,
      "👮 Admin dashboard coming soon.\nUse commands for now."
    );
  }
}
