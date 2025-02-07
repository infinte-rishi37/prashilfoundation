# Database Tables

## User Management

### users
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### admin_users
```sql
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## Educational Services

### courses
```sql
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('Domestic', 'Abroad')),
  mode text NOT NULL CHECK (mode IN ('Online', 'Offline')),
  fees numeric NOT NULL,
  start_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### eduguide_services
```sql
CREATE TABLE eduguide_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('career_counselling', 'college_admission')),
  location text,
  fee numeric NOT NULL,
  min_students integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### college_plans
```sql
CREATE TABLE college_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  features text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Financial Services

### finance_services
```sql
CREATE TABLE finance_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('Domestic', 'Abroad')),
  description text NOT NULL,
  min_amount numeric NOT NULL,
  max_amount numeric NOT NULL,
  interest_rate numeric NOT NULL,
  processing_fee numeric NOT NULL,
  duration text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Communication

### messages
```sql
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  token text DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  admin_response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  responded_at timestamptz
);
```