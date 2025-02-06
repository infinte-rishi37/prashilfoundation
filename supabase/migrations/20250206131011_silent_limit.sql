/*
  # Fix admin_users table RLS policies

  1. Changes
    - Add policy to allow authenticated users to read admin_users table
    - This is needed for checking admin status during login
  
  2. Security
    - Only allows reading, no modifications
    - Required for login flow to work properly
*/

-- Drop any existing policies on admin_users
DROP POLICY IF EXISTS "Allow authenticated to read admin_users" ON admin_users;

-- Create new policy to allow authenticated users to read admin_users
CREATE POLICY "Allow authenticated to read admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow public to read admin_users
CREATE POLICY "Allow public to read admin_users"
  ON admin_users
  FOR SELECT
  TO anon
  USING (true);