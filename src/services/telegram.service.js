const TELEGRAM_API = "https://api.telegram.org";

// 🔒 BOT TOKEN FROM GLOBAL (Cloudflare Worker env binding)
function getApiUrl(method) {
  return `${TELEGRAM_API}/bot${BOT_TOKEN}/${method}`;
}

export async function sendMessage(chatId, text, options = {}) {
  if (!chatId) {
    console.error("❌ sendMessage: chatId missing");
    return;
  }

  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    ...options
  };

  const res = await fetch(getApiUrl("sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("❌ sendMessage failed:", err);
  }
}

export async function editMessage(chatId, messageId, text, options = {}) {
  const payload = {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    ...options
  };

  await fetch(getApiUrl("editMessageText"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function answerCallback(callbackQueryId) {
  await fetch(getApiUrl("answerCallbackQuery"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId })
  });
}
