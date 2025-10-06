# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Zoodo platform.

## Prerequisites

1. A Google Cloud Platform account
2. Access to the Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your project ID

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google OAuth2 API" if not already enabled

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add the following authorized redirect URIs:
   - `http://localhost:8080/login/oauth2/code/google` (for development)
   - `https://yourdomain.com/login/oauth2/code/google` (for production)
5. Click "Create"
6. Copy the Client ID and Client Secret

## Step 4: Configure Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

Or set them as system environment variables:

```bash
export GOOGLE_CLIENT_ID=your-google-client-id-here
export GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## Step 5: Update Application Properties

The backend is already configured to use these environment variables in `application.properties`:

```properties
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID:your-google-client-id}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET:your-google-client-secret}
```

## Step 6: Test the Integration

1. Start the backend server
2. Navigate to the login page
3. Click the "Continue with Google" button
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you should be redirected back to the application

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**: Make sure the redirect URI in your Google OAuth configuration exactly matches the one in your application properties.

2. **"invalid_client" error**: Check that your Client ID and Client Secret are correct.

3. **"access_denied" error**: Make sure the Google+ API is enabled in your Google Cloud project.

### Development vs Production

- For development: Use `http://localhost:8080/login/oauth2/code/google`
- For production: Use `https://yourdomain.com/login/oauth2/code/google`

## Security Notes

1. Never commit your Client Secret to version control
2. Use environment variables for sensitive configuration
3. Regularly rotate your OAuth credentials
4. Monitor OAuth usage in the Google Cloud Console

## Additional Configuration

You can customize the OAuth flow by modifying the configuration in `SecurityConfig.java`:

```java
.oauth2Login(oauth2 -> oauth2
    .defaultSuccessUrl("/api/oauth/google/success", true)
    .failureUrl("/api/oauth/google/failure")
)
```

## Support

If you encounter any issues, check the Google OAuth documentation or the Spring Security OAuth2 documentation for more detailed information.
