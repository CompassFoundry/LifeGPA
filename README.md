Life GPA is a tool grounded in ancient wisdom that helps you live your best life.

# Environment Variables

## Add Backend dotenv files to Render.
### Supabase Variables
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
SUPABASE_JWT_SECRET=

### Brevo Variables
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_BASE_URL=

## Add Frontend dotenv files to Netlify.
### Supabase Variables (postgres database)
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_ANON_KEY=

### Posthog Variables (product analytics)
REACT_APP_POSTHOG_KEY=

### Backend URL (Render)
REACT_APP_BACKEND_URL=

------------

# Supabase Setup
### Gather ENV Variables
* See above (add to Render and Netlify)
### Update Project Settings
* General Settings
  * Update Project Name
* Authentication
  * Change min password to 8 characters
  * Add custom SMTP settings (see Brevo Transactional Email Setup below)
### Authentication Settings
* Providers
  * Only enable Email provider for launch (add Confirm Email requirements once transactional email is fully configured)
* Rate Limits
  * Update to whatever makes sense for the project.
### Database
* Contact a project admin for tables and columns.


# Brevo Transactional Email Setup
### Configure Custom SMTP in Supabase 
* Update SMTP Provider Setings in Authentication
* smtp-relay.brevo.com
* Port 587
* Username (find in Brevo SMTP settings)
* Password (find in Brevo SMTP settings)

