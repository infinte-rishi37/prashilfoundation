-- Create admin user
DO $$
BEGIN
  -- First ensure the admin user exists in auth.users
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@prashilfoundation.com'
  ) THEN
    -- Insert into auth.users with a proper password hash
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      role,
      raw_app_meta_data,
      raw_user_meta_data
    ) VALUES (
      'c105e106-d6a5-4e37-9e98-f2d2f1d2e123',
      '00000000-0000-0000-0000-000000000000',
      'admin@prashilfoundation.com',
      crypt('Admin@123', gen_salt('bf')), -- This creates a proper password hash
      now(),
      now(),
      now(),
      'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{}'
    );
  END IF;

  -- Then ensure the admin exists in admin_users
  INSERT INTO admin_users (id, email)
  VALUES (
    'c105e106-d6a5-4e37-9e98-f2d2f1d2e123',
    'admin@prashilfoundation.com'
  )
  ON CONFLICT (email) DO NOTHING;
END
$$;