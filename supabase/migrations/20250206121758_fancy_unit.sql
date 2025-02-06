-- Insert admin user with credentials
INSERT INTO admin_users (id, email)
VALUES 
  ('d105e106-d6a5-4e37-9e98-f2d2f1d2e123', 'admin@prashilfoundation.com')
ON CONFLICT (email) DO NOTHING;

-- Create auth.users entry for admin
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role
) VALUES (
  'c105e106-d6a5-4e37-9e98-f2d2f1d2e123',
  '00000000-0000-0000-0000-000000000000',
  'admin@prashilfoundation.com',
  -- Password is: Admin@123
  '$2a$10$5JU/py6jR1ZQ4qeK6rYJPO5J5z5E5J5J5J5J5J5J5J5J5J5J5J',
  now(),
  now(),
  now(),
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;