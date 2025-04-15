# Supabase Edge Functions

This directory contains Supabase Edge Functions for managing organization members and users.

## Development

1. Install Supabase CLI
2. Run `supabase start` to start local development
3. Run `supabase functions serve` to run functions locally
4. Run `supabase functions deploy <function-name>` to deploy a specific function

## Functions

### create-member
Creates a new admin user (owner, admin, or viewer) with authentication details.
- Creates auth user
- Creates user profile in `users` table
- Creates organization admin entry in `organization_admins` table
- Returns the created user details

### delete-member
Deletes an admin user and all associated data.
- Deletes auth user
- Deletes user profile from `users` table
- Deletes organization admin entry from `organization_admins` table (cascade)

### grant-access
Grants access to a regular member by converting them to an admin user.
- Moves user from `organization_members` to `organization_admins`
- Creates auth user
- Creates user profile in `users` table
- Deletes entry from `organization_members`
- Returns the created user details

### revoke-access
Revokes access from an admin user by converting them to a regular member.
- Moves user from `organization_admins` to `organization_members`
- Deletes auth user
- Deletes user profile from `users` table
- Deletes entry from `organization_admins`
- Returns success message

## Database Schema

### organization_admins
Stores admin users (owner, admin, viewer) with their roles.
- user_id: string (references auth.users)
- organization_id: string
- role: 'owner' | 'admin' | 'viewer'

### organization_members
Stores regular members without authentication.
- id: string
- email: string
- firstName: string
- lastName: string
- position: string
- organization_id: string

### users
Stores user profiles for admin users.
- id: string (references auth.users)
- email: string
- firstName: string
- lastName: string
- position: string 