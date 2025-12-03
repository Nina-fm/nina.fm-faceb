---
'nina.fm-faceb': minor
---

SuperTokens authentication integration - Face B admin interface

**Breaking Changes:**

- Existing users must reset their passwords after migration (automatic email sent)
- Legacy JWT authentication deprecated (backward compatible during transition)

**New Features:**

- SuperTokens authentication with email/password
- Invitation system for new admins (email workflow with auto role assignment)
- FirstName/LastName fields in user profiles
- Auto-login after signup via invitation
- Session management with secure cookies

**User Experience:**

- Simplified login flow at `/auth/login`
- Password reset flow at `/auth/reset-password`
- Invitation acceptance flow at `/auth/accept-invitation`
- Profile with firstName/lastName display
- Automatic session persistence across Face B

**Security:**

- Cookie-based sessions (domain: .nina.fm)
- HTTPS-only cookies in production
- SameSite=lax for CSRF protection
- Auto-refresh token rotation

**Technical:**

- Uses Nina.fm API SuperTokens backend
- No local SuperTokens configuration required (proxied via API)
- Already configured with API_URL=https://api.nina.fm in .env.prod

**Deployment:**

- No additional GitHub Secrets/Variables required
- No manual configuration needed (API handles everything)
- Ready to deploy immediately after API deployment

Production-ready - No preparation required on Face B side.
