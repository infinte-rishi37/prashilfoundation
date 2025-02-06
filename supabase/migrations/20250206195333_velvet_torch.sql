-- Create finance_services table
CREATE TABLE IF NOT EXISTS finance_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  min_amount numeric NOT NULL,
  max_amount numeric NOT NULL,
  interest_rate numeric NOT NULL,
  processing_fee numeric NOT NULL,
  duration text NOT NULL,
  type text NOT NULL CHECK (type IN ('Domestic', 'Abroad')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE finance_services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to finance_services"
  ON finance_services
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert initial data
INSERT INTO finance_services (
  name, description, min_amount, max_amount, 
  interest_rate, processing_fee, duration, type
) VALUES
  (
    'Basic Education Loan',
    'Affordable education loan for domestic studies with minimal documentation',
    100000, 1000000, 8.5, 1, '1-7 years', 'Domestic'
  ),
  (
    'Merit Scholar Loan',
    'Special loan scheme for meritorious students with lower interest rates',
    100000, 2000000, 7.5, 0.5, '1-10 years', 'Domestic'
  ),
  (
    'Professional Course Loan',
    'Tailored loan for professional and technical courses',
    200000, 3000000, 9, 1, '1-12 years', 'Domestic'
  ),
  (
    'Global Education Loan',
    'Comprehensive loan package for international education',
    1000000, 10000000, 10, 1.5, '1-15 years', 'Abroad'
  ),
  (
    'Premium Study Abroad Loan',
    'Premium loan scheme with higher limits and flexible repayment options',
    2000000, 20000000, 11, 2, '1-15 years', 'Abroad'
  );