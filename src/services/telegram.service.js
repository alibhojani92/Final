export async function sendMessage(chatId, text, options = {}, env = {}) {
  // 🔁 backward compatibility
  if (env && !env.BOT_TOKEN && options?.BOT_TOKEN) {
    env = options;
    options = {};
  }

  if (!env?.BOT_TOKEN) {
    console.error("❌ BOT_TOKEN missing", { chatId });
    return;
  }

  const res = await fetch(
    `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        ...options,
      }),
    }
  );

  if (!res.ok) {
    console.error("❌ sendMessage failed:", await res.text());
  }
}
