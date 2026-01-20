// src/services/telegram.service.js

const TELEGRAM_API = "https://api.telegram.org";

function getApiUrl(token, method) {
  return `${TELEGRAM_API}/bot${token}/${method}`;
}

/**
 * Send message to Telegram
 * @param {number} chatId
 * @param {string} text
 * @param {object} options
 */
export async function sendMessage(chatId, text, options = {}, env) {
  if (!chatId) {
    console.error("❌ sendMessage: chatId missing");
    return;
  }

  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: "HTML",
    ...options
  };

  const url = getApiUrl(env.BOT_TOKEN, "sendMessage");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("❌ sendMessage failed:", errText);
  }
}

/**
 * Answer callback query (remove loading state)
 */
export async function answerCallback(callbackQueryId, env, text = "") {
  const payload = {
    callback_query_id: callbackQueryId,
    text
  };

  const url = getApiUrl(env.BOT_TOKEN, "answerCallbackQuery");

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
    }
