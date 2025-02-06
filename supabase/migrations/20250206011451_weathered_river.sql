/*
  # Add admin functionality and message tokens

  1. New Tables
    - `admin_users` - For storing admin credentials
    - Add token field to messages table
    - Add response field to messages table

  2. Security
    - Enable RLS on admin_users table
    - Add policies for admin access
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add new columns to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS token text DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS admin_response text,
ADD COLUMN IF NOT EXISTS responded_at timestamptz;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY "Admin users can read all data"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
    OR auth.uid() = user_id
  );

CREATE POLICY "Admin users can update messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

-- Add trigger for responded_at
CREATE OR REPLACE FUNCTION update_responded_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.admin_response IS NOT NULL AND OLD.admin_response IS NULL THEN
    NEW.responded_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_responded_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_responded_at();