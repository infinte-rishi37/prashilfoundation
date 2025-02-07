# Database Documentation

This documentation provides a comprehensive overview of the database structure and configuration.

## Contents

1. [Table Structures](./tables.md)
2. [Indexes](./indexes.md)
3. [Triggers](./triggers.md)
4. [Policies](./policies.md)
5. [Constraints](./constraints.md)

## Overview

The database is designed to support the Prashil Foundation's education and financial services platform. It implements:

- Secure user authentication and authorization
- Role-based access control
- Automated timestamp management
- Data integrity constraints
- Row-level security

## General Notes

- All tables use UUID for primary keys
- Timestamps use timestamptz for timezone awareness
- Email fields are unique where applicable
- Automatic timestamp updates via triggers
- Encryption for sensitive data
- Row Level Security (RLS) for access control
- Type constraints for data consistency