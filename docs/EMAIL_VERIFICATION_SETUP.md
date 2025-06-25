# Email Verification Setup Guide

This guide explains how to properly configure email verification for the BrevEdu platform using Firebase Authentication.

## Overview

The platform implements a secure email verification flow where:
1. Users register with email/password
2. System sends verification email with a link to `/verify-email`
3. Users click the link to verify their email
4. Only verified users can sign in

## Critical Configuration Requirements

### 1. Environment Variable Setup

The `VITE_APP_URL` environment variable is **critical** for email verification to work:

```bash
# Development
VITE_APP_URL=http://localhost:5173

# Production
VITE_APP_URL=https://your-domain.com
```

**Why this matters:**
- Firebase uses this URL to generate verification email links
- The link format is: `${VITE_APP_URL}/verify-email?oobCode=...`
- If this variable is wrong, users will be redirected to invalid URLs

### 2. Firebase Authorized Domains

You **MUST** whitelist your domain in Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Authentication > Settings > Authorized Domains**
4. Click **Add Domain**
5. Add your domain:
   - For development: `localhost`
   - For production: `your-domain.com` (without https://)

**Without this step, verification emails will redirect to an unauthorized page.**

## Implementation Details

### Registration Flow

```typescript
// In AuthContext.tsx
const register = async (email: string, password: string, name: string) => {
  // 1. Create Firebase user
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  // 2. Update profile with name
  await updateProfile(result.user, { displayName: name });
  
  // 3. Send verification email
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const actionCodeSettings = {
    url: `${baseUrl}/verify-email`,
    handleCodeInApp: true,
  };
  await sendEmailVerification(result.user, actionCodeSettings);
  
  // 4. Sign user out (they must verify email first)
  await signOut(auth);
};
```

### Login Flow

```typescript
// In AuthContext.tsx
const login = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  
  // Check if email is verified
  if (!result.user.emailVerified) {
    // Send new verification email
    await sendEmailVerification(result.user, actionCodeSettings);
    
    // Sign out the user
    await signOut(auth);
    
    // Show error message
    throw new Error('Please verify your email before logging in. We\'ve sent you a new verification link.');
  }
  
  return result;
};
```

### Verification Page

The `/verify-email` page handles the verification process:

```typescript
// In VerifyEmailPage.tsx
const verifyEmail = async () => {
  // Get oobCode from URL parameters or hash fragment
  let oobCode = searchParams.get('oobCode');
  
  // Fallback: check hash fragment for oobCode
  if (!oobCode) {
    const hash = window.location.hash;
    // Parse hash manually...
  }
  
  if (!oobCode) {
    setError('Invalid verification link');
    return;
  }
  
  // Apply verification code
  await applyActionCode(auth, oobCode);
};
```

## Troubleshooting

### Common Issues

#### 1. "Invalid verification link" Error

**Symptoms:**
- Users see "Invalid verification link" message
- oobCode is missing from URL

**Causes:**
- `VITE_APP_URL` not set or incorrect
- Email client truncated the verification link
- Link was copied incorrectly

**Solutions:**
- Verify `VITE_APP_URL` matches your actual domain
- Check that the full verification link is preserved
- Test with different email clients

#### 2. Blank Page After Clicking Email Link

**Symptoms:**
- Clicking verification link shows blank page
- Browser shows "unauthorized domain" error

**Causes:**
- Domain not whitelisted in Firebase Authorized Domains
- `VITE_APP_URL` points to wrong domain

**Solutions:**
- Add your domain to Firebase Authorized Domains
- Ensure `VITE_APP_URL` matches the domain in Authorized Domains

#### 3. 404 Error on Verification

**Symptoms:**
- Verification link leads to 404 page
- Route `/verify-email` not found

**Causes:**
- `VITE_APP_URL` points to wrong application
- Routing not configured properly

**Solutions:**
- Verify `VITE_APP_URL` points to correct application
- Ensure `/verify-email` route exists in your router

#### 4. Verification Link Expired

**Symptoms:**
- "This verification link has expired" error
- Link worked before but not now

**Causes:**
- Firebase verification codes expire after a certain time
- User clicked an old verification link

**Solutions:**
- Generate new verification email
- Implement "resend verification" functionality

### Testing Email Verification

#### Development Testing

1. Set up local environment:
   ```bash
   VITE_APP_URL=http://localhost:5173
   ```

2. Add `localhost` to Firebase Authorized Domains

3. Test registration flow:
   - Register new user
   - Check email for verification link
   - Click link and verify it redirects to `localhost:5173/verify-email`
   - Confirm verification completes successfully

#### Production Testing

1. Set production environment:
   ```bash
   VITE_APP_URL=https://your-domain.com
   ```

2. Add `your-domain.com` to Firebase Authorized Domains

3. Deploy and test:
   - Register with real email address
   - Check verification email
   - Confirm link redirects to production domain
   - Verify email verification works end-to-end

### Debug Checklist

When email verification isn't working:

- [ ] `VITE_APP_URL` is set correctly
- [ ] Domain is whitelisted in Firebase Authorized Domains
- [ ] Verification email contains correct link format
- [ ] `/verify-email` route exists and is accessible
- [ ] oobCode is present in verification URL
- [ ] Firebase project configuration is correct
- [ ] No browser extensions blocking the verification process

## Security Considerations

### Best Practices

1. **Always verify emails**: Never allow unverified users to access protected features
2. **Use HTTPS in production**: Ensure verification links use secure connections
3. **Validate oobCode**: Always validate the verification code before applying it
4. **Handle errors gracefully**: Provide clear error messages and recovery options
5. **Rate limiting**: Consider implementing rate limiting for verification email requests

### Environment Security

1. **Protect environment variables**: Never commit `.env` files to version control
2. **Use different Firebase projects**: Separate development and production environments
3. **Rotate API keys**: Regularly update Firebase API keys and configuration
4. **Monitor unauthorized domains**: Regularly review Firebase Authorized Domains list

## Advanced Configuration

### Custom Email Templates

Firebase allows customizing verification email templates:

1. Go to Firebase Console > Authentication > Templates
2. Select "Email address verification"
3. Customize the email template
4. Ensure the action URL points to your domain

### Multiple Environments

For multiple environments (dev, staging, production):

```bash
# Development
VITE_APP_URL=http://localhost:5173

# Staging
VITE_APP_URL=https://staging.your-domain.com

# Production
VITE_APP_URL=https://your-domain.com
```

Add all domains to Firebase Authorized Domains.

### Custom Verification Flow

For advanced use cases, you can implement custom verification flows:

1. Generate custom verification tokens
2. Send custom emails with your own templates
3. Handle verification on your backend
4. Update Firebase user verification status

## Support

If you continue to experience issues with email verification:

1. Check the Firebase Console for error logs
2. Review browser network requests for failed API calls
3. Test with different email providers
4. Verify Firebase project configuration
5. Contact Firebase support for platform-specific issues

Remember: Email verification is critical for security and user experience. Take time to properly configure and test this feature before deploying to production.