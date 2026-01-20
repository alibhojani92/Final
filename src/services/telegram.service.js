const TELEGRAM_API = "https://api.telegram.org";

function apiUrl(env, method) {
  return `${TELEGRAM_API}/bot${env.BOT_TOKEN}/${method}`;
}

export async function sendMessage(chatId, text, options = {}, env) {
  if (!env?.BOT_TOKEN) {
    console.error("❌ BOT_TOKEN missing in env");
    return;
  }

  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    ...options
  };

  const res = await fetch(apiUrl(env, "sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    console.error("❌ sendMessage failed:", await res.text());
  }
}

export async function editMessage(chatId, messageId, text, options = {}, env) {
  const payload = {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    ...options
  };

  await fetch(apiUrl(env, "editMessageText"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function answerCallback(callbackQueryId, env) {
  await fetch(apiUrl(env, "answerCallbackQuery"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId })
  });
    }
