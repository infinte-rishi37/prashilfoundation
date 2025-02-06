/*
  # Add EduGuide Services Table

  1. New Tables
    - `eduguide_services`
      - `id` (uuid, primary key)
      - `category` (text) - 'career_counselling' or 'college_admission'
      - `name` (text)
      - `description` (text)
      - `fee` (numeric)
      - `min_students` (integer, nullable)
      - `location` (text) - 'INDIA' or 'ABROAD'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for public read access
*/

CREATE TABLE IF NOT EXISTS eduguide_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('career_counselling', 'college_admission')),
  name text NOT NULL,
  description text NOT NULL,
  fee numeric NOT NULL,
  min_students integer,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE eduguide_services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to eduguide_services"
  ON eduguide_services
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert initial data
INSERT INTO eduguide_services (category, name, description, fee, min_students, location) VALUES
  ('career_counselling', 'Expert Guidance', 'Expert guidance for students from class 10 and above', 750, NULL, NULL),
  ('career_counselling', 'Complete Analysis Package', 'Software based analysis + Expert guidance for student and parents (Class 10+)', 3500, NULL, NULL),
  ('career_counselling', 'Institutional Analysis', 'Software based analysis for organizations like schools and colleges', 750, 50, NULL),
  ('college_admission', 'Domestic Admission Package', 'Course and college guidance + financial guidance for Indian institutions', 750, NULL, 'INDIA'),
  ('college_admission', 'International Admission Package', 'Course and college guidance + financial guidance + VISA processing for international institutions', 6500, NULL, 'ABROAD');