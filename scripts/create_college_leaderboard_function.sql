-- Create function to get college leaderboard
-- This aggregates team points by college

CREATE OR REPLACE FUNCTION get_college_leaderboard()
RETURNS TABLE (
  college_name TEXT,
  team_count BIGINT,
  total_points BIGINT,
  total_kills BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.college_name,
    COUNT(t.id) as team_count,
    COALESCE(SUM(t.total_points), 0) as total_points,
    COALESCE(SUM(t.total_kills), 0) as total_kills
  FROM teams t
  GROUP BY t.college_name
  ORDER BY total_points DESC;
END;
$$ LANGUAGE plpgsql;
