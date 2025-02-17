/*
  # Update Finance Services Structure

  1. Changes
    - Drop existing finance tables
    - Create new finance_services table with simplified structure
    - Add RLS policies for the new table

  2. New Table Structure
    - id (uuid, primary key)
    - serviceName (text)
    - category (text)
    - description (text)
    - created_at (timestamptz)
    - updated_at (timestamptz)
*/

-- Drop existing tables
DROP TABLE IF EXISTS finance_services CASCADE;
DROP TABLE IF EXISTS finance_categories CASCADE;

-- Create new finance_services table
CREATE TABLE finance_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serviceName text NOT NULL,
  category text NOT NULL CHECK (category IN ('loan', 'document')),
  description text NOT NULL,
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

-- Create trigger for updated_at
CREATE TRIGGER set_finance_services_updated_at
  BEFORE UPDATE ON finance_services
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert initial data
INSERT INTO finance_services (serviceName, category, description) VALUES
  -- Loan Services
  ('Home Loan', 'loan', 'Comprehensive home financing solutions with competitive interest rates'),
  ('Mortgage Loan', 'loan', 'Secure loans against property with flexible repayment options'),
  ('Education Loan', 'loan', 'Financial support for higher education with student-friendly terms'),
  ('Reverse Mortgage Scheme', 'loan', 'Convert home equity into retirement income for seniors'),
  ('Government Sponsored Schemes', 'loan', 'Access to various government-backed loan programs'),
  
  -- Document Services
  ('ITR Filing', 'document', 'Professional assistance with income tax return preparation and submission'),
  ('GST Filing', 'document', 'Timely and accurate GST return filing services'),
  ('GST Registration', 'document', 'Complete support for GST registration process'),
  ('PAN Card Modification', 'document', 'Assistance with PAN card detail updates and corrections'),
  ('Aadhar Card Modification', 'document', 'Help with Aadhar card information updates and changes');