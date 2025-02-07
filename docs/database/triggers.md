# Database Triggers

## Timestamp Update Triggers

### Handle Updated At Function
```sql
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Table Triggers
```sql
CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER college_plans_updated_at
  BEFORE UPDATE ON college_plans
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
```

## Response Triggers

### Update Responded At Function
```sql
CREATE OR REPLACE FUNCTION update_responded_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.admin_response IS NOT NULL AND OLD.admin_response IS NULL THEN
    NEW.responded_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Response Trigger
```sql
CREATE TRIGGER set_responded_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_responded_at();
```