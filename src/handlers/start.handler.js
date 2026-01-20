// src/handlers/start.handler.js

import { sendMessage } from "../services/telegram.service.js";
import { mainMenuKeyboard } from "../bot/keyboards.js";

export async function startHandler(ctx) {
  const chatId = ctx.chat.id;

  const text =
`Welcome to GPSC Dental Class-2 Preparation Bot 🦷

Your complete companion for:
• Smart study tracking
• Exam-oriented MCQ tests
• Performance analysis
• Consistent preparation

Choose an option below 👇`;

  await sendMessage(chatId, text, {
    reply_markup: mainMenuKeyboard()
  });
}
