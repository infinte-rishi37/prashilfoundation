# Database Triggers

## Admin Audit Triggers

### Audit Logging Function
```sql
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

  -- Determine action type and data
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
    admin_id, action, table_name, record_id, old_data, new_data
  ) VALUES (
    admin_id, action_type, TG_TABLE_NAME,
    CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
    old_data, new_data
  );

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Audit Triggers
```sql
CREATE TRIGGER audit_applications_trigger
  AFTER INSERT OR UPDATE OR DELETE ON applications
  FOR EACH ROW EXECUTE FUNCTION log_admin_action();

CREATE TRIGGER audit_messages_trigger
  AFTER INSERT OR UPDATE OR DELETE ON messages
  FOR EACH ROW EXECUTE FUNCTION log_admin_action();
```

[Previous triggers remain unchanged...]