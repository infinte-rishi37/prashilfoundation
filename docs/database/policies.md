# Row Level Security (RLS) Policies

## Course Policies

```sql
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can modify courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Anyone can read courses"
  ON courses
  FOR SELECT
  TO anon, authenticated
  USING (true);
```

## Message Policies

```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read all messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING ((auth.uid() IN (SELECT id FROM admin_users)) OR (auth.uid() = user_id));

CREATE POLICY "Admin users can update messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Users can insert own messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

## User Policies

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to insert their own record"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (id = auth.uid());

CREATE POLICY "Allow public sign-up"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

## Service Policies

```sql
ALTER TABLE eduguide_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to eduguide_services"
  ON eduguide_services
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to finance_services"
  ON finance_services
  FOR SELECT
  TO anon, authenticated
  USING (true);
```