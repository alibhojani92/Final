// src/bot/router.js
import { startHandler } from "../handlers/start.handler.js";
import { userHandler } from "../handlers/user.handler.js";
import { studyHandler } from "../handlers/study.handler.js";
import { targetHandler } from "../handlers/target.handler.js";
import { testHandler } from "../handlers/test.handler.js";
import { reportHandler } from "../handlers/report.handler.js";
import { adminHandler } from "../handlers/admin.handler.js";
import { helpHandler } from "../handlers/help.handler.js";

export async function routeUpdate(ctx) {
  const { text, callbackData } = ctx;

  try {
    /* =====================
       COMMAND ROUTING
    ====================== */

    if (text === "/start") return startHandler(ctx);

    if (
      text === "/r" ||
      text === "/study"
    )
      return studyHandler(ctx);

    if (text === "/target") return targetHandler(ctx);

    if (
      text === "/test" ||
      text === "/quiz"
    )
      return testHandler(ctx);

    if (text === "/report") return reportHandler(ctx);

    if (
      text === "/help" ||
      text === "/commands"
    )
      return helpHandler(ctx);

    /* ===== ADMIN COMMANDS ===== */
    if (
      text === "/admin" ||
      text === "/stats" ||
      text === "/rank" ||
      text === "/top"
    )
      return adminHandler(ctx);

    /* =====================
       CALLBACK ROUTING
    ====================== */

    if (callbackData?.startsWith("STUDY_"))
      return studyHandler(ctx);

    if (callbackData?.startsWith("TARGET_"))
      return targetHandler(ctx);

    if (callbackData?.startsWith("TEST_"))
      return testHandler(ctx);

    if (callbackData?.startsWith("REPORT_"))
      return reportHandler(ctx);

    if (callbackData?.startsWith("ADMIN_"))
      return adminHandler(ctx);

    if (callbackData?.startsWith("HELP_"))
      return helpHandler(ctx);

  } catch (err) {
    console.error("ROUTER ERROR:", err);
  }
}
