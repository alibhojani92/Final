/**
 * test.engine.js
 * ------------------------------------------------
 * Phase-5: Test execution engine (MCQ logic only)
 * No Telegram calls
 * No DB schema edits here
 */

import { nowIST } from "../utils/time.util.js";

/**
 * Create a new test session (in-memory structure)
 */
export function createTestSession({ userId, questions }) {
  return {
    userId,
    questions,
    currentIndex: 0,
    answers: [],
    startedAt: nowIST(),
    questionStartedAt: nowIST(),
    finished: false
  };
}

/**
 * Get current question
 */
export function getCurrentQuestion(session) {
  if (session.currentIndex >= session.questions.length) {
    return null;
  }
  return session.questions[session.currentIndex];
}

/**
 * Save user answer
 */
export function submitAnswer(session, selectedOption) {
  const question = getCurrentQuestion(session);
  if (!question) return null;

  const isCorrect = selectedOption === question.correct_option;

  session.answers.push({
    question_id: question.id,
    selected_option: selectedOption,
    correct_option: question.correct_option,
    is_correct: isCorrect,
    answered_at: nowIST()
  });

  session.currentIndex += 1;
  session.questionStartedAt = nowIST();

  return {
    isCorrect,
    correctOption: question.correct_option,
    explanation: question.explanation
  };
}

/**
 * Handle auto-submit when time runs out
 */
export function autoSubmit(session) {
  const question = getCurrentQuestion(session);
  if (!question) return null;

  session.answers.push({
    question_id: question.id,
    selected_option: null,
    correct_option: question.correct_option,
    is_correct: false,
    answered_at: nowIST()
  });

  session.currentIndex += 1;
  session.questionStartedAt = nowIST();

  return {
    isCorrect: false,
    correctOption: question.correct_option,
    explanation: question.explanation
  };
}

/**
 * Check if test is finished
 */
export function isTestFinished(session) {
  return session.currentIndex >= session.questions.length;
}

/**
 * Calculate final result
 */
export function calculateResult(session) {
  const total = session.questions.length;
  const correct = session.answers.filter(a => a.is_correct).length;

  return {
    totalQuestions: total,
    correctAnswers: correct,
    scoreText: `${correct} / ${total}`,
    accuracy: Math.round((correct / total) * 100)
  };
    }
