/*
  # Admin Features Enhancement

  1. New Tables
    - `admin_roles` - Define different admin role types
    - `admin_permissions` - Define granular permissions
    - `admin_role_permissions` - Junction table for roles and permissions
    - `admin_audit_logs` - Track admin actions

  2. Changes
    - Add role_id to admin_users table
    - Add audit logging triggers

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies
    - Add audit logging
*/

-- Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_permissions table
CREATE TABLE IF NOT EXISTS admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_role_permissions junction table
CREATE TABLE IF NOT EXISTS admin_role_permissions (
  role_id uuid REFERENCES admin_roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES admin_permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);

-- Create admin_audit_logs table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add role_id to admin_users
ALTER TABLE admin_users
ADD COLUMN role_id uuid REFERENCES admin_roles(id);

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_roles
CREATE POLICY "Admin users can read roles"
  ON admin_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Super admins can manage roles"
  ON admin_roles
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT au.id 
      FROM admin_users au
      JOIN admin_roles ar ON au.role_id = ar.id
      WHERE ar.name = 'super_admin'
    )
  );

-- Create policies for admin_permissions
CREATE POLICY "Admin users can read permissions"
  ON admin_permissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Super admins can manage permissions"
  ON admin_permissions
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT au.id 
      FROM admin_users au
      JOIN admin_roles ar ON au.role_id = ar.id
      WHERE ar.name = 'super_admin'
    )
  );

-- Create policies for admin_role_permissions
CREATE POLICY "Admin users can read role permissions"
  ON admin_role_permissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Super admins can manage role permissions"
  ON admin_role_permissions
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT au.id 
      FROM admin_users au
      JOIN admin_roles ar ON au.role_id = ar.id
      WHERE ar.name = 'super_admin'
    )
  );

-- Create policies for admin_audit_logs
CREATE POLICY "Admin users can read audit logs"
  ON admin_audit_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Create audit logging function
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER AS $$
DECLARE
  admin_id uuid;
  action_type text;
  old_data jsonb;
  new_data jsonb;
BEGIN
  -- Get current admin user
  SELECT id INTO admin_id
  FROM admin_users
  WHERE id = auth.uid();

  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'CREATE';
    old_data := null;
    new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'UPDATE';
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
  ELSE
    action_type := 'DELETE';
    old_data := to_jsonb(OLD);
    new_data := null;
  END IF;

  -- Insert audit log
  INSERT INTO admin_audit_logs (
    admin_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data
  ) VALUES (
    admin_id,
    action_type,
    TG_TABLE_NAME,
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    old_data,
    new_data
  );

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers
CREATE TRIGGER audit_applications_trigger
  AFTER INSERT OR UPDATE OR DELETE ON applications
  FOR EACH ROW EXECUTE FUNCTION log_admin_action();

CREATE TRIGGER audit_messages_trigger
  AFTER INSERT OR UPDATE OR DELETE ON messages
  FOR EACH ROW EXECUTE FUNCTION log_admin_action();

-- Insert initial roles and permissions
INSERT INTO admin_roles (name, description) VALUES
  ('super_admin', 'Full system access and control'),
  ('admin', 'General administrative access'),
  ('moderator', 'Limited administrative access');

INSERT INTO admin_permissions (name, description) VALUES
  ('manage_users', 'Can manage user accounts'),
  ('manage_applications', 'Can manage applications'),
  ('manage_messages', 'Can manage messages'),
  ('view_audit_logs', 'Can view audit logs'),
  ('manage_admins', 'Can manage admin users'),
  ('manage_roles', 'Can manage roles and permissions');

-- Assign permissions to roles
INSERT INTO admin_role_permissions (role_id, permission_id)
SELECT 
  r.id as role_id,
  p.id as permission_id
FROM admin_roles r
CROSS JOIN admin_permissions p
WHERE r.name = 'super_admin';

INSERT INTO admin_role_permissions (role_id, permission_id)
SELECT 
  r.id as role_id,
  p.id as permission_id
FROM admin_roles r
CROSS JOIN admin_permissions p
WHERE r.name = 'admin'
  AND p.name IN ('manage_users', 'manage_applications', 'manage_messages', 'view_audit_logs');

INSERT INTO admin_role_permissions (role_id, permission_id)
SELECT 
  r.id as role_id,
  p.id as permission_id
FROM admin_roles r
CROSS JOIN admin_permissions p
WHERE r.name = 'moderator'
  AND p.name IN ('manage_applications', 'manage_messages');