// src/bot/router.js

import { sendMessage } from "../services/telegram.service.js";

// command handlers
import { startHandler } from "../handlers/start.handler.js";
import { studyHandler } from "../handlers/study.handler.js";
import { targetHandler } from "../handlers/target.handler.js";
import { testHandler } from "../handlers/test.handler.js";
import { reportHandler } from "../handlers/report.handler.js";
import { adminHandler } from "../handlers/admin.handler.js";
import { helpHandler } from "../handlers/help.handler.js";

export async function routeUpdate(update, env) {
  try {
    // 🔒 GLOBAL chat_id rule
    const chatId =
      update.message?.chat?.id ||
      update.callback_query?.message?.chat?.id;

    if (!chatId) {
      console.error("❌ chatId not found in update");
      return;
    }

    // ======================
    // COMMANDS (/start, /r)
    // ======================
    if (update.message?.text) {
      const text = update.message.text.trim();

      if (text === "/start") {
        return await startHandler(chatId, update, env);
      }

      if (text === "/r") {
        return await reportHandler(chatId, update, env);
      }

      if (text === "/help" || text === "/?") {
        return await helpHandler(chatId, update, env);
      }
    }

    // ======================
    // CALLBACK BUTTONS
    // ======================
    if (update.callback_query) {
      const data = update.callback_query.data;

      switch (data) {
        case "STUDY_START":
        case "STUDY_STOP":
          return await studyHandler(chatId, update, env);

        case "TARGET_MENU":
          return await targetHandler(chatId, update, env);

        case "TEST_MENU":
          return await testHandler(chatId, update, env);

        case "ADMIN_PANEL":
          return await adminHandler(chatId, update, env);

        case "BACK_TO_MAIN":
          return await startHandler(chatId, update, env);

        default:
          console.warn("⚠️ Unknown callback:", data);
          return;
      }
    }
  } catch (err) {
    console.error("❌ ROUTER FATAL ERROR:", err);

    // 🔴 user should ALWAYS get reply
    try {
      const chatId =
        update.message?.chat?.id ||
        update.callback_query?.message?.chat?.id;

      if (chatId) {
        await sendMessage(
          chatId,
          "⚠️ Temporary error. Please try again."
        );
      }
    } catch (e) {
      console.error("❌ Failed to send fallback message");
    }
  }
                                    }
