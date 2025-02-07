# Database Structure Documentation

[Previous content remains the same until Triggers section...]

## Row Level Security (RLS) Policies

### courses
- **Only admins can modify courses**: Allows authenticated admin users to perform all operations
- **Anyone can read courses**: Allows both anonymous and authenticated users to read courses

### college_plans
- **Anyone can read college plans**: Allows both anonymous and authenticated users to read college plans

### messages
- **Admin users can read all messages**: Allows admins to read all messages and users to read their own
- **Admin users can update messages**: Allows admins to update any message
- **Users can insert own messages**: Allows users to create messages for themselves
- **Users can read own messages**: Allows users to read their own messages

### users
- **Allow users to insert their own record**: Allows anonymous users to create their own user record
- **Allow public sign-up**: Allows anonymous users to sign up
- **Users can read own data**: Allows users to read their own data

### admin_users
- **Allow public to read admin_users**: Allows anonymous users to read admin users
- **Allow authenticated to read admin_users**: Allows authenticated users to read admin users

### eduguide_services
- **Allow public read access**: Allows both anonymous and authenticated users to read services

### finance_services
- **Allow public read access**: Allows both anonymous and authenticated users to read services

## Constraints

### Type Constraints
- **courses_type_check**: Ensures type is either 'Domestic' or 'Abroad'
- **courses_mode_check**: Ensures mode is either 'Online' or 'Offline'
- **eduguide_services_category_check**: Ensures category is either 'career_counselling' or 'college_admission'
- **finance_services_type_check**: Ensures type is either 'Domestic' or 'Abroad'

### Domain Constraints
- **cardinal_number_domain_check**: Ensures value is >= 0
- **yes_or_no_check**: Ensures value is either 'YES' or 'NO'

### Authentication Constraints
- **users_email_change_confirm_status_check**: Ensures status is between 0 and 2
- **resource_id not empty**: Ensures resource_id is either NULL or not empty
- **domain not empty**: Ensures domain length is > 0
- **metadata_xml not empty**: Ensures metadata_xml length is > 0
- **metadata_url not empty**: Ensures metadata_url is either NULL or not empty
- **entity_id not empty**: Ensures entity_id length is > 0
- **request_id not empty**: Ensures request_id length is > 0
- **one_time_tokens_token_hash_check**: Ensures token_hash length is > 0

### Encryption Constraints
- **key_key_context_check**: Ensures key_context length is 8
- **pgsodium_raw**: Ensures proper key configuration for encryption

## Notes
- All tables include created_at and updated_at timestamps
- UUID is used for all primary keys
- Email fields are unique where applicable
- Timestamps use timestamptz for timezone awareness
- Automatic timestamp updates are handled by triggers
- Encryption is handled automatically for sensitive data
- Row Level Security (RLS) is implemented for data access control
- Type constraints ensure data consistency
- Authentication constraints maintain security