-- ================================
-- USERS
-- ================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- STUDY SESSIONS
-- ================================
CREATE TABLE IF NOT EXISTS study_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  duration_minutes INTEGER,
  date TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ================================
-- DAILY TARGETS
-- ================================
CREATE TABLE IF NOT EXISTS daily_targets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  target_minutes INTEGER NOT NULL,
  date TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ================================
-- SUBJECTS
-- ================================
CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- MCQS
-- ================================
CREATE TABLE IF NOT EXISTS mcqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option TEXT NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT,
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- ================================
-- TEST SESSIONS
-- ================================
CREATE TABLE IF NOT EXISTS test_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  start_time TEXT,
  end_time TEXT,
  score INTEGER,
  total_questions INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ================================
-- TEST ANSWERS
-- ================================
CREATE TABLE IF NOT EXISTS test_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_session_id INTEGER NOT NULL,
  mcq_id INTEGER NOT NULL,
  selected_option TEXT,
  is_correct INTEGER,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(id),
  FOREIGN KEY (mcq_id) REFERENCES mcqs(id)
);

-- ================================
-- ADMINS
-- ================================
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin'
);

-- ================================
-- BROADCAST LOG
-- ================================
CREATE TABLE IF NOT EXISTS broadcasts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT NOT NULL,
  sent_at TEXT DEFAULT CURRENT_TIMESTAMP
);
