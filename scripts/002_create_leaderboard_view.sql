-- Create a materialized view for leaderboard calculations
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  t.id as team_id,
  t.team_name,
  t.college_name,
  t.game,
  COUNT(DISTINCT mr.match_id) as matches_played,
  COALESCE(SUM(mr.total_points), 0) as total_points,
  COALESCE(SUM(mr.kills), 0) as total_kills,
  COALESCE(AVG(mr.placement), 0) as avg_placement,
  MAX(mr.updated_at) as last_match_date
FROM teams t
LEFT JOIN match_results mr ON t.id = mr.team_id AND mr.verified = true
GROUP BY t.id, t.team_name, t.college_name, t.game
ORDER BY total_points DESC, total_kills DESC;

-- Create function to calculate points based on placement and kills
CREATE OR REPLACE FUNCTION calculate_match_points(
  placement INTEGER,
  kills INTEGER,
  game_type TEXT
) RETURNS INTEGER AS $$
BEGIN
  -- BGMI/Free Fire scoring: Placement points + Kill points
  IF game_type IN ('BGMI', 'Free Fire') THEN
    RETURN CASE 
      WHEN placement = 1 THEN 10
      WHEN placement = 2 THEN 6
      WHEN placement = 3 THEN 5
      WHEN placement = 4 THEN 4
      WHEN placement = 5 THEN 3
      WHEN placement = 6 THEN 2
      WHEN placement = 7 THEN 1
      WHEN placement = 8 THEN 1
      ELSE 0
    END + kills;
  -- Clash Royale scoring: Win = 3 points, Loss = 0 points
  ELSIF game_type = 'Clash Royale' THEN
    RETURN CASE 
      WHEN placement = 1 THEN 3
      ELSE 0
    END;
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
