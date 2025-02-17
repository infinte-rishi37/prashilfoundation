/*
  # Update Finance Services Schema

  1. New Tables
    - `finance_categories` - Categories of financial services
    - `user_profiles` - Extended user information
  
  2. Changes
    - Update finance_services table structure
    - Add new fields for document services
    
  3. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Create finance categories table
CREATE TABLE IF NOT EXISTS finance_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('loan', 'document')),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES users(id),
  full_name text NOT NULL,
  address text NOT NULL,
  employment_type text NOT NULL CHECK (employment_type IN ('salaried', 'business', 'self_employed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Drop existing finance_services table
DROP TABLE IF EXISTS finance_services CASCADE;

-- Recreate finance_services table with new structure
CREATE TABLE finance_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES finance_categories(id),
  name text NOT NULL,
  description text NOT NULL,
  min_amount numeric,
  max_amount numeric,
  interest_rate numeric,
  processing_fee numeric,
  duration text,
  requirements text[],
  documents_required text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE finance_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to finance_categories"
  ON finance_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to finance_services"
  ON finance_services
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can manage their own profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insert initial categories
INSERT INTO finance_categories (name, type, description) VALUES
  ('Home Loan', 'loan', 'Housing finance solutions'),
  ('Education Loan', 'loan', 'Financial support for education'),
  ('Mortgage Loan', 'loan', 'Loans against property'),
  ('Reverse Mortgage', 'loan', 'Convert home equity into cash'),
  ('Government Schemes', 'loan', 'Government sponsored loan schemes'),
  ('ITR Filing', 'document', 'Income tax return filing services'),
  ('GST Services', 'document', 'GST registration and filing'),
  ('Identity Documents', 'document', 'PAN and Aadhar related services');

-- Insert services
INSERT INTO finance_services (
  category_id,
  name,
  description,
  min_amount,
  max_amount,
  interest_rate,
  processing_fee,
  duration,
  requirements,
  documents_required
) 
SELECT 
  id as category_id,
  name,
  description,
  CASE 
    WHEN type = 'loan' THEN 100000
    ELSE NULL
  END as min_amount,
  CASE 
    WHEN type = 'loan' THEN 10000000
    ELSE NULL
  END as max_amount,
  CASE 
    WHEN type = 'loan' THEN 8.5
    ELSE NULL
  END as interest_rate,
  CASE 
    WHEN type = 'loan' THEN 1
    ELSE NULL
  END as processing_fee,
  CASE 
    WHEN type = 'loan' THEN '1-30 years'
    ELSE NULL
  END as duration,
  CASE 
    WHEN type = 'loan' THEN ARRAY['Valid ID proof', 'Income proof', 'Address proof']
    ELSE ARRAY['Valid ID proof', 'Supporting documents']
  END as requirements,
  CASE 
    WHEN type = 'loan' THEN ARRAY['Aadhar card', 'PAN card', 'Income statements', 'Bank statements']
    ELSE ARRAY['Aadhar card', 'PAN card']
  END as documents_required
FROM finance_categories;

-- Create trigger for user_profiles updated_at
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();