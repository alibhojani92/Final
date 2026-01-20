/**
 * test.handler.js
 * ------------------------------------------------
 * Phase-5: MCQ Test Handler (Telegram-facing)
 * Private chat only
 */

import {
  createTestSession,
  getCurrentQuestion,
  submitAnswer,
  autoSubmit,
  isTestFinished,
  calculateResult
} from "../engine/test.engine.js";

import {
  sendMessage,
  editMessage
} from "../services/telegram.service.js";

import { dbAll, dbRun } from "../db/d1.js";
import {
  SQL_GET_RANDOM_MCQ_SET,
  SQL_SAVE_TEST_RESULT,
  SQL_SAVE_TEST_ANSWER
} from "../db/queries.js";

import { nowIST } from "../utils/time.util.js";

const TEST_SESSION_TTL = 60 * 60; // 1 hour

/**
 * /test command – entry point
 */
export async function startTest(update, env) {
  const chat = update.message.chat;

  if (chat.type !== "private") {
    return sendMessage(
      env,
      chat.id,
      "❌ Tests can be taken only in private chat."
    );
  }

  // Fetch 20 random MCQs
  const questions = await dbAll(env, SQL_GET_RANDOM_MCQ_SET, [20]);

  if (!questions || questions.length === 0) {
    return sendMessage(
      env,
      chat.id,
      "⚠️ No questions available at the moment."
    );
  }

  const session = createTestSession({
    userId: chat.id,
    questions
  });

  await env.TEST_KV.put(
    `test:${chat.id}`,
    JSON.stringify(session),
    { expirationTtl: TEST_SESSION_TTL }
  );

  return sendQuestion(env, chat.id, session);
}

/**
 * Handle option selection (callback)
 */
export async function handleTestAnswer(update, env) {
  const chatId = update.callback_query.message.chat.id;
  const data = update.callback_query.data;

  const raw = await env.TEST_KV.get(`test:${chatId}`);
  if (!raw) return;

  const session = JSON.parse(raw);

  const option = data.replace("TEST_", "");

  const result = submitAnswer(session, option);

  // Save answer
  await dbRun(env, SQL_SAVE_TEST_ANSWER, [
    session.userId,
    session.answers.at(-1).question_id,
    option,
    result.isCorrect ? 1 : 0,
    nowIST()
  ]);

  await env.TEST_KV.put(
    `test:${chatId}`,
    JSON.stringify(session),
    { expirationTtl: TEST_SESSION_TTL }
  );

  const feedback =
    `✅ Answer saved\n\n` +
    `Correct Answer: ${result.correctOption}\n` +
    `Explanation:\n${result.explanation}`;

  await sendMessage(env, chatId, feedback);

  if (isTestFinished(session)) {
    return finishTest(env, chatId, session);
  }

  return sendQuestion(env, chatId, session);
}

/**
 * Auto-submit when timer expires
 */
export async function handleTestTimeout(chatId, env) {
  const raw = await env.TEST_KV.get(`test:${chatId}`);
  if (!raw) return;

  const session = JSON.parse(raw);

  const result = autoSubmit(session);

  await dbRun(env, SQL_SAVE_TEST_ANSWER, [
    session.userId,
    session.answers.at(-1).question_id,
    null,
    0,
    nowIST()
  ]);

  await env.TEST_KV.put(
    `test:${chatId}`,
    JSON.stringify(session),
    { expirationTtl: TEST_SESSION_TTL }
  );

  const feedback =
    `⏰ Time’s up!\n\n` +
    `Correct Answer: ${result.correctOption}\n` +
    `Explanation:\n${result.explanation}`;

  await sendMessage(env, chatId, feedback);

  if (isTestFinished(session)) {
    return finishTest(env, chatId, session);
  }

  return sendQuestion(env, chatId, session);
}

/**
 * Send MCQ question
 */
async function sendQuestion(env, chatId, session) {
  const q = getCurrentQuestion(session);
  if (!q) return;

  const text =
    `Q${session.currentIndex + 1}/${session.questions.length}\n\n` +
    `${q.question}\n\n` +
    `A. ${q.option_a}\n` +
    `B. ${q.option_b}\n` +
    `C. ${q.option_c}\n` +
    `D. ${q.option_d}\n\n` +
    `⏱ Time left: 05:00`;

  const keyboard = {
    inline_keyboard: [
      [{ text: "A", callback_data: "TEST_A" }],
      [{ text: "B", callback_data: "TEST_B" }],
      [{ text: "C", callback_data: "TEST_C" }],
      [{ text: "D", callback_data: "TEST_D" }]
    ]
  };

  return sendMessage(env, chatId, text, keyboard);
}

/**
 * Finish test
 */
async function finishTest(env, chatId, session) {
  const result = calculateResult(session);

  await dbRun(env, SQL_SAVE_TEST_RESULT, [
    session.userId,
    result.correctAnswers,
    result.totalQuestions,
    result.accuracy,
    nowIST()
  ]);

  await env.TEST_KV.delete(`test:${chatId}`);

  const message =
    `🏁 Test Completed – GPSC Dental Class-2\n\n` +
    `Score: ${result.scoreText}\n` +
    `Accuracy: ${result.accuracy}%\n\n` +
    `Great effort 💪 Keep practicing 🦷`;

  return sendMessage(env, chatId, message);
}
export async function testHandler(ctx) {
  return handleTest(ctx);
                    }
