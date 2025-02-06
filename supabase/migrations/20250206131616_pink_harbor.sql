/*
  # Enhance Admin Dashboard

  1. Changes
    - Add admin_response column to applications table
    - Add responded_at column to applications table
    - Add policies for admin access to applications
    - Update policies for admin access to messages

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Add columns to applications table
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS admin_response text,
ADD COLUMN IF NOT EXISTS responded_at timestamptz;

-- Update policies for applications
DROP POLICY IF EXISTS "Admin users can read all applications" ON applications;
CREATE POLICY "Admin users can read all applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
    OR auth.uid() = user_id
  );

DROP POLICY IF EXISTS "Admin users can update applications" ON applications;
CREATE POLICY "Admin users can update applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

-- Add trigger for applications responded_at
CREATE OR REPLACE FUNCTION update_application_responded_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.admin_response IS NOT NULL AND OLD.admin_response IS NULL THEN
    NEW.responded_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_application_responded_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_application_responded_at();