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
  role_id uuid REFERENCES admin_roles(id),
  created_at timestamptz DEFAULT now()
);
```

### admin_roles
```sql
CREATE TABLE admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### admin_permissions
```sql
CREATE TABLE admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### admin_role_permissions
```sql
CREATE TABLE admin_role_permissions (
  role_id uuid REFERENCES admin_roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES admin_permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);
```

### admin_audit_logs
```sql
CREATE TABLE admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  old_data jsonb,
  new_data jsonb,
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
  category text NOT NULL CHECK (category IN ('career_counselling', 'college_admission')),
  name text NOT NULL,
  description text NOT NULL,
  fee numeric NOT NULL,
  min_students integer,
  location text,
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
  description text NOT NULL,
  min_amount numeric NOT NULL,
  max_amount numeric NOT NULL,
  interest_rate numeric NOT NULL,
  processing_fee numeric NOT NULL,
  duration text NOT NULL,
  type text NOT NULL CHECK (type IN ('Domestic', 'Abroad')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Applications

### applications
```sql
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  service_type text NOT NULL CHECK (service_type IN ('educare', 'eduguide', 'finance')),
  service_id uuid NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_response text,
  created_at timestamptz DEFAULT now(),
  responded_at timestamptz
);
```

## Communication

### messages
```sql
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  content text NOT NULL,
  token text DEFAULT gen_random_uuid(),
  admin_response text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  responded_at timestamptz
);
```