// src/handlers/help.handler.js
import { sendMessage } from "../services/telegram.service.js";

export async function helpHandler(ctx) {
  const { chatId } = ctx;

  return sendMessage(
    chatId,
    `ℹ️ Help Menu

Student Commands:
/start
/r
/target
/test
/report

Admin Commands:
/admin
/stats
/rank
/top
`
  );
}
