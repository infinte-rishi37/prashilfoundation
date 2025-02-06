-- Insert admin user
INSERT INTO admin_users (id, email)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin@prashilfoundation.com')
ON CONFLICT (email) DO NOTHING;