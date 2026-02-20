-- One Hello Database Schema
-- Run this in your Supabase SQL Editor

-- Challenges (static reference data)
CREATE TABLE IF NOT EXISTS challenges (
  id integer PRIMARY KEY,
  day_number integer NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL,
  tips text
);

-- Seed challenge data
INSERT INTO challenges (id, day_number, name, description, tips) VALUES
  (1, 1, 'First Hello', 'Smile & say hello to one stranger', 'Start with people in service roles - baristas, cashiers, or someone waiting in line next to you.'),
  (2, 2, 'Weather Chat', 'Comment on something you''re both experiencing such as the weather', 'Look for shared experiences - "Beautiful day, isn''t it?" Works great in elevators, bus stops, or parks.'),
  (3, 3, 'Helping Hand', 'Ask a stranger for a small favor, the time, directions, a photo', 'People love to help! Ask for directions, the time, or a restaurant recommendation.'),
  (4, 4, 'Compliment', 'Give a stranger a genuine compliment', 'Compliment something they chose - their shoes, bag, phone case, or hairstyle.'),
  (5, 5, 'How Are You?', 'Ask one stranger how their day is going', 'After your initial hello, follow up with "How''s your day going?" and actually listen.'),
  (6, 6, 'Getting Personal', 'Ask a stranger a personal question to get to know them', 'Try "What do you do?" or "Are you from around here?" Show genuine curiosity.'),
  (7, 7, 'Taking Names', 'Get the name of someone new. Log it here so you don''t forget', 'Say "I''m [your name], by the way" - they''ll almost always share theirs.')
ON CONFLICT (id) DO NOTHING;

-- Hellos table
CREATE TABLE IF NOT EXISTS hellos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text,
  location text,
  notes text,
  challenge_id integer REFERENCES challenges(id),
  challenge_name text,
  has_details boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  current_challenge_day integer DEFAULT 1,
  challenge_completed boolean DEFAULT false,
  last_hello_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hellos_user_id ON hellos(user_id);
CREATE INDEX IF NOT EXISTS idx_hellos_created_at ON hellos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hellos_user_created ON hellos(user_id, created_at DESC);

-- Row Level Security
ALTER TABLE hellos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own hellos"
  ON hellos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hellos"
  ON hellos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hellos"
  ON hellos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own hellos"
  ON hellos FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (true);
