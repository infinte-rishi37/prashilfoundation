/*
  # Add FAQ Management

  1. New Tables
    - `faqs` table for storing FAQ entries
      - `id` (uuid, primary key)
      - `question` (text)
      - `answer` (text) 
      - `section` (text) - Indicates where FAQ appears (home, educare, eduguide, finance, support)
      - `order` (integer) - Controls display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for admin management
*/

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  section text NOT NULL CHECK (section IN ('home', 'educare', 'eduguide', 'finance', 'support')),
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to faqs"
  ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin users can manage faqs"
  ON faqs
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

-- Create trigger for updated_at
CREATE TRIGGER set_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert initial data
INSERT INTO faqs (question, answer, section, "order") VALUES
  -- Home page FAQs
  ('What services does Prashil Foundation offer?', 'We offer education coaching, education counselling, and loan consultancy services to help students achieve their academic and career goals.', 'home', 1),
  ('How can I apply for education coaching?', 'You can apply for education coaching by creating an account, browsing our available courses, and submitting an application through our website.', 'home', 2),
  ('What types of loans do you provide consultation for?', 'We provide consultation for education loans, including both domestic and international study programs. Our experts help you understand different loan options and guide you through the application process.', 'home', 3),
  ('Do you offer online counselling sessions?', 'Yes, we offer both online and in-person counselling sessions. You can choose the format that works best for you when scheduling a session.', 'home', 4),
  ('How long does the application process take?', 'The application process typically takes 2-3 business days. We''ll keep you updated on the status of your application through your dashboard.', 'home', 5),

  -- Educare FAQs
  ('What courses do you offer?', 'We offer a wide range of courses including STET, CTET, Hindi NET/JRF, BPSSC preparation, and competitive exam coaching. We also provide training for IELTS, GRE, TOEFL, and personality development.', 'educare', 1),
  ('Are the classes available online?', 'Yes, we offer both online and offline classes to accommodate different learning preferences and schedules.', 'educare', 2),
  ('What is the duration of courses?', 'Course duration varies depending on the program. Each course has a specific timeline designed to ensure comprehensive preparation.', 'educare', 3),
  ('Do you provide study materials?', 'Yes, we provide comprehensive study materials, practice tests, and regular assessments as part of our courses.', 'educare', 4),

  -- EduGuide FAQs
  ('How does career counselling work?', 'Our career counselling involves psychometric assessment, one-on-one sessions with experts, and detailed guidance based on your interests and aptitude.', 'eduguide', 1),
  ('What age groups do you counsel?', 'We provide counselling services for students from class 10 onwards, including college students and working professionals seeking career transitions.', 'eduguide', 2),
  ('Do you help with college admissions?', 'Yes, we provide comprehensive support for college admissions, including course selection, application process, and documentation.', 'eduguide', 3),
  ('What is the counselling process?', 'The process includes initial assessment, detailed counselling sessions, career mapping, and continuous guidance throughout your academic journey.', 'eduguide', 4),

  -- Finance FAQs
  ('What types of loans do you assist with?', 'We assist with education loans, home loans, mortgage loans, and various government-sponsored schemes.', 'finance', 1),
  ('What documents are required for loan application?', 'Required documents typically include identity proof, address proof, income proof, and academic documents. Specific requirements vary by loan type.', 'finance', 2),
  ('How long does loan processing take?', 'Loan processing time varies by type and amount but typically takes 7-14 working days after complete documentation.', 'finance', 3),
  ('Do you help with document services?', 'Yes, we assist with GST registration, PAN card, Aadhaar card, and other essential document services.', 'finance', 4),

  -- Support FAQs
  ('How do I track my application status?', 'You can track your application status in the Applications section of your dashboard. Each application shows its current status and progress.', 'support', 1),
  ('How can I update my profile information?', 'Go to the Profile section in your dashboard where you can update your personal information, contact details, and preferences.', 'support', 2),
  ('What should I do if I face technical issues?', 'If you encounter any technical issues, please use the support form to contact our technical team. We''ll respond within 24 hours.', 'support', 3),
  ('How can I contact customer support?', 'You can reach our support team through the contact form in your dashboard or by using the WhatsApp button for immediate assistance.', 'support', 4);