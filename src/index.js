// src/index.js

import { routeUpdate } from "./bot/router.js";

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    try {
      const update = await request.json();
      console.log("TELEGRAM UPDATE:", JSON.stringify(update));

      await routeUpdate(update, env);
      return new Response("OK", { status: 200 });
    } catch (err) {
      console.error("INDEX ERROR:", err);
      return new Response("OK", { status: 200 });
    }
  },
};
