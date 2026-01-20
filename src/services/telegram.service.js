/**
 * telegram.service.js
 * --------------------------------
 * Telegram API communication layer
 * Phase-1 ONLY
 * NEVER put business logic here
 */

/**
 * Internal helper: call Telegram API
 */
async function callTelegram(env, method, payload) {
  const url = `https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!data.ok) {
    console.error("sendMessage failed:", JSON.stringify(data));
  }

  return data;
}

/**
 * Send new message
 */
export async function sendMessage(env, chatId, text, replyMarkup = null) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown"
  };

  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }

  return callTelegram(env, "sendMessage", payload);
}

/**
 * Edit existing message (for inline keyboards)
 */
export async function editMessage(env, chatId, messageId, text, replyMarkup = null) {
  const payload = {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "Markdown"
  };

  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }

  return callTelegram(env, "editMessageText", payload);
}

/**
 * Answer callback query (prevents Telegram loading spinner)
 */
export async function answerCallback(env, callbackQueryId, text = "") {
  const payload = {
    callback_query_id: callbackQueryId,
    text,
    show_alert: false
  };

  return callTelegram(env, "answerCallbackQuery", payload);
      }
