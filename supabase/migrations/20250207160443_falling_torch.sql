/*
  # Applications Table Setup

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `service_type` (text, check constraint for type)
      - `service_id` (uuid)
      - `status` (text, check constraint for status)
      - `admin_response` (text, nullable)
      - `created_at` (timestamptz)
      - `responded_at` (timestamptz, nullable)

  2. Security
    - Enable RLS on applications table
    - Add policies for users and admins
*/

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  service_type text NOT NULL CHECK (service_type IN ('educare', 'eduguide', 'finance')),
  service_id uuid NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_response text,
  created_at timestamptz DEFAULT now(),
  responded_at timestamptz
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pending applications"
  ON applications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admin users can read all applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admin users can update applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

-- Create trigger for responded_at
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