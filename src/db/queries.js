/**
 * queries.js
 * --------------------------------
 * Centralized SQL queries
 * Phase-2 ONLY
 * NEVER execute queries here
 */

// ==============================
// USERS
// ==============================
export const SQL_GET_USER_BY_TELEGRAM_ID = `
  SELECT * FROM users WHERE telegram_id = ?;
`;

export const SQL_CREATE_USER = `
  INSERT INTO users (telegram_id, username, first_name)
  VALUES (?, ?, ?);
`;

// ==============================
// STUDY SESSIONS
// ==============================
export const SQL_START_STUDY_SESSION = `
  INSERT INTO study_sessions (user_id, start_time, date)
  VALUES (?, ?, ?);
`;

export const SQL_GET_ACTIVE_STUDY_SESSION = `
  SELECT * FROM study_sessions
  WHERE user_id = ? AND end_time IS NULL
  ORDER BY id DESC
  LIMIT 1;
`;

export const SQL_STOP_STUDY_SESSION = `
  UPDATE study_sessions
  SET end_time = ?, duration_minutes = ?
  WHERE id = ?;
`;

export const SQL_GET_TODAY_STUDY_TOTAL = `
  SELECT SUM(duration_minutes) AS total_minutes
  FROM study_sessions
  WHERE user_id = ? AND date = ?;
`;

// ==============================
// DAILY TARGETS
// ==============================
export const SQL_SET_DAILY_TARGET = `
  INSERT INTO daily_targets (user_id, target_minutes, date)
  VALUES (?, ?, ?)
  ON CONFLICT(user_id, date)
  DO UPDATE SET target_minutes = excluded.target_minutes;
`;

export const SQL_GET_DAILY_TARGET = `
  SELECT * FROM daily_targets
  WHERE user_id = ? AND date = ?;
`;

// ==============================
// SUBJECTS
// ==============================
export const SQL_GET_ALL_SUBJECTS = `
  SELECT * FROM subjects ORDER BY name ASC;
`;

export const SQL_ADD_SUBJECT = `
  INSERT INTO subjects (name)
  VALUES (?);
`;

// ==============================
// MCQS
// ==============================
export const SQL_GET_MCQS_BY_SUBJECT = `
  SELECT * FROM mcqs
  WHERE subject_id = ?
  ORDER BY RANDOM()
  LIMIT ?;
`;

export const SQL_ADD_MCQ = `
  INSERT INTO mcqs
  (subject_id, question, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

// ==============================
// TEST SESSIONS
// ==============================
export const SQL_CREATE_TEST_SESSION = `
  INSERT INTO test_sessions (user_id, start_time)
  VALUES (?, ?);
`;

export const SQL_FINISH_TEST_SESSION = `
  UPDATE test_sessions
  SET end_time = ?, score = ?, total_questions = ?
  WHERE id = ?;
`;

// ==============================
// TEST ANSWERS
// ==============================
export const SQL_ADD_TEST_ANSWER = `
  INSERT INTO test_answers
  (test_session_id, mcq_id, selected_option, is_correct)
  VALUES (?, ?, ?, ?);
`;

// ==============================
// ADMINS
// ==============================
export const SQL_IS_ADMIN = `
  SELECT * FROM admins WHERE telegram_id = ?;
`;

export const SQL_ADD_ADMIN = `
  INSERT INTO admins (telegram_id, role)
  VALUES (?, ?);
`;

// ==============================
// BROADCAST
// ==============================
export const SQL_LOG_BROADCAST = `
  INSERT INTO broadcasts (message)
  VALUES (?);
`;
