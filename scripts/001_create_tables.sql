-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL UNIQUE,
  college_name TEXT NOT NULL,
  game TEXT NOT NULL CHECK (game IN ('BGMI', 'Free Fire', 'Clash Royale')),
  captain_name TEXT NOT NULL,
  captain_email TEXT NOT NULL,
  captain_phone TEXT NOT NULL,
  player_2_name TEXT,
  player_2_email TEXT,
  player_3_name TEXT,
  player_3_email TEXT,
  player_4_name TEXT,
  player_4_email TEXT,
  player_5_name TEXT,
  player_5_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game TEXT NOT NULL CHECK (game IN ('BGMI', 'Free Fire', 'Clash Royale')),
  match_number INTEGER NOT NULL,
  match_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game, match_number)
);

-- Create match_results table for storing team scores per match
CREATE TABLE IF NOT EXISTS match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  kills INTEGER DEFAULT 0,
  placement INTEGER,
  total_points INTEGER DEFAULT 0,
  screenshot_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, team_id)
);

-- Create OCR processing queue table
CREATE TABLE IF NOT EXISTS ocr_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_result_id UUID NOT NULL REFERENCES match_results(id) ON DELETE CASCADE,
  screenshot_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  extracted_data JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Create admin users table (references auth.users)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_teams_game ON teams(game);
CREATE INDEX IF NOT EXISTS idx_teams_college ON teams(college_name);
CREATE INDEX IF NOT EXISTS idx_matches_game ON matches(game);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_match_results_match ON match_results(match_id);
CREATE INDEX IF NOT EXISTS idx_match_results_team ON match_results(team_id);
CREATE INDEX IF NOT EXISTS idx_match_results_verified ON match_results(verified);
CREATE INDEX IF NOT EXISTS idx_ocr_queue_status ON ocr_queue(status);

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocr_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams (public read, no write for now - will be handled via server actions)
CREATE POLICY "teams_select_all" ON teams FOR SELECT USING (true);

-- RLS Policies for matches (public read)
CREATE POLICY "matches_select_all" ON matches FOR SELECT USING (true);

-- RLS Policies for match_results (public read)
CREATE POLICY "match_results_select_all" ON match_results FOR SELECT USING (true);

-- RLS Policies for admin_users (only admins can read)
CREATE POLICY "admin_users_select_own" ON admin_users FOR SELECT USING (auth.uid() = id);

-- RLS Policies for ocr_queue (only admins can access)
CREATE POLICY "ocr_queue_admin_all" ON ocr_queue FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  )
);
