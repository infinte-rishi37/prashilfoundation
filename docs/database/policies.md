# Row Level Security (RLS) Policies

## Admin Policies

### Admin Roles
```sql
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
```

### Admin Permissions
```sql
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
```

### Admin Role Permissions
```sql
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
```

### Admin Audit Logs
```sql
CREATE POLICY "Admin users can read audit logs"
  ON admin_audit_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users));
```

[Previous policies remain unchanged...]