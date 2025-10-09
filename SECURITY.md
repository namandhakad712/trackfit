# Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of RailTrack QR seriously. If you discover a security vulnerability, please follow these steps:

### Please DO NOT:
- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### Please DO:
1. **Email us directly** at [security@example.com] with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

2. **Allow time for a fix**: We aim to respond within 48 hours and provide a fix within 7 days for critical issues

3. **Coordinate disclosure**: We'll work with you on a coordinated disclosure timeline

## Security Best Practices

When using RailTrack QR:

### Environment Variables
- Never commit `.env.local` or `.env` files
- Use strong, unique values for all secrets
- Rotate keys regularly
- Use different keys for development and production

### Database Security
- Enable Row Level Security (RLS) on all tables
- Use service role key only in secure server environments
- Never expose service role key to client-side code
- Regularly review and update RLS policies

### Authentication
- Use strong passwords (minimum 8 characters)
- Enable MFA where possible
- Implement session timeout
- Regularly review user access

### API Security
- All API routes are protected with authentication
- Role-based access control is enforced
- Input validation on all endpoints
- Rate limiting recommended for production

### File Uploads
- Validate file types and sizes
- Scan uploaded files for malware
- Use secure storage with proper access controls
- Implement file size limits

## Known Security Considerations

1. **Service Role Key**: Must be kept secure and never exposed to client-side code
2. **RLS Policies**: Ensure all tables have appropriate RLS policies
3. **API Routes**: All protected routes require authentication
4. **File Storage**: Uploaded images are stored in Supabase Storage with access controls

## Security Updates

Security updates will be released as patch versions and announced via:
- GitHub Security Advisories
- Release notes
- Project README

## Acknowledgments

We appreciate the security research community and will acknowledge researchers who responsibly disclose vulnerabilities (with their permission).

---

Last updated: January 2025
