# LiveAvatar Migration - Complete Implementation

## Overview

Successfully migrated the mock interview system from HeyGen Streaming API to **LiveAvatar API** with the **LiveAvatar Web SDK**. This migration provides:

- ✅ **JWT-based authentication** (3-segment tokens)
- ✅ **Conversational AI avatars** with custom personas
- ✅ **Client-side SDK** for better performance
- ✅ **Custom avatar support** (like your "Silas" avatar)
- ✅ **Unified account settings** for avatar configuration

## What Changed

### 1. SDK Package
**Before:** `@heygen/streaming-avatar` (deprecated)
**After:** `@heygen/liveavatar-web-sdk` (production-ready)

### 2. API Endpoint
**Before:** `api.heygen.com/v1/streaming` (base64 tokens)
**After:** `api.liveavatar.com/v1/sessions` (JWT tokens)

### 3. Authentication
**Before:** HeyGen API Key → Base64 token (1 segment)
**After:** LiveAvatar API Key → JWT token (3 segments: header.payload.signature)

## Files Modified

### Backend Changes

#### 1. `lib/config/env.ts`
Added LiveAvatar API key configuration:

```typescript
// LiveAvatar (New - Production)
liveavatar: {
  apiKey: process.env.LIVEAVATAR_API_KEY || '',
},
```

Also updated OpenAI models:
- `modelMain`: `gpt-4o-mini` (from `gpt-4-turbo-preview`)
- `modelHeavy`: `gpt-4o` (from `gpt-4`)

#### 2. `lib/clients/heygenClient.ts`
**Updated `createLiveAvatarSession()`:**
- Changed endpoint to `api.liveavatar.com/v1/sessions/token`
- Uses `env.liveavatar.apiKey` instead of `env.heygen.apiKey`
- Returns JWT token (validated as 3 segments)
- Supports custom avatar and voice configuration

**Added new functions:**
- `getLiveAvatarAvatars()` - Fetch avatars from LiveAvatar API
- `getLiveAvatarVoices()` - Fetch voices from LiveAvatar API

#### 3. `app/api/heygen/avatars/route.ts`
Updated to use `getLiveAvatarAvatars()` instead of `getAvailableAvatars()`

### Frontend Changes

#### 4. `components/mock/AvatarStage.tsx`
**Complete rewrite using LiveAvatar Web SDK:**

```typescript
import { LiveAvatarSession } from '@heygen/liveavatar-web-sdk'

// Create session
const session = new LiveAvatarSession(sessionToken, {
  voiceChat: false,
})

// Start session
await session.start()

// Attach video stream
session.attach(videoRef.current)

// Make avatar speak
session.message(text)

// Cleanup
session.stop()
```

**Key features:**
- React Strict Mode protection (prevents double initialization)
- Expose `speakViaAvatar()` helper function
- Proper cleanup on unmount
- Error handling with user-friendly messages

#### 5. `components/account/IntegrationsTab.tsx`
Updated to save avatar configuration to **both** storage locations:
- `preferences.heygen.avatar_id` (for backward compatibility)
- `mock_avatar_id` (for mock interviews)

This fixes the issue where avatar selections in account settings weren't applying to mock interviews.

### Mock Interview Flow

#### 6. `app/dashboard/mock/[id]/page.tsx`
Already properly configured to:
- Fetch session token from `/api/mock/[id]/init-session`
- Pass token to `<AvatarStage>`
- Use `speakViaAvatar()` for avatar speech

#### 7. `app/api/mock/[id]/init-session/route.ts`
Already properly configured to:
- Read user's avatar preferences from profile
- Create LiveAvatar session token
- Return token to client

## Environment Variables Required

Add to your `.env.local`:

```env
# LiveAvatar API (Production)
LIVEAVATAR_API_KEY=your_liveavatar_api_key_here

# HeyGen API (Legacy - can be removed later)
HEYGEN_API_KEY=your_heygen_api_key_here

# OpenAI (Updated models)
OPENAI_MODEL_MAIN=gpt-4o-mini
OPENAI_MODEL_HEAVY=gpt-4o
```

## How It Works

### 1. Session Initialization
```
User starts mock interview
    ↓
Frontend calls: POST /api/mock/[id]/init-session
    ↓
Backend reads user preferences (avatar_id, voice_id)
    ↓
Backend calls LiveAvatar API: POST /v1/sessions/token
    ↓
Backend receives JWT token (3 segments)
    ↓
Backend returns token to frontend
```

### 2. Avatar Connection
```
Frontend receives JWT token
    ↓
Create LiveAvatarSession with token
    ↓
Call session.start()
    ↓
SDK connects via WebRTC automatically
    ↓
Call session.attach(videoElement)
    ↓
Avatar appears in video element
    ↓
Avatar ready callback fired
```

### 3. Avatar Speaking
```
Backend generates question text
    ↓
Frontend receives question
    ↓
Call speakViaAvatar(questionText)
    ↓
SDK calls session.message(text)
    ↓
Avatar speaks the text
    ↓
Avatar speaking animations visible
```

### 4. Cleanup
```
User finishes interview or navigates away
    ↓
React useEffect cleanup runs
    ↓
Call session.stop()
    ↓
WebRTC connection closed
    ↓
Video stream released
```

## Custom Avatar Support

Your custom "Silas" avatar is fully supported:

1. **Avatar Selection**: Users can select "Silas" in Account Settings → Integrations
2. **Persona Prompt**: The LiveAvatar portal configuration includes your full recruiter persona
3. **Opening Intro**: The greeting "Hey there! I'm Silas from LiveAvatar..." is configured in the portal
4. **Voice Configuration**: Custom voice can be configured per avatar

The system will:
- Use the selected avatar ID when creating sessions
- Apply the persona prompt configured in LiveAvatar portal
- Use the custom voice if configured

## Token Format

### Before (HeyGen Streaming API)
```
Base64-encoded JSON (1 segment):
eyJ0b2tlbiI6IjRhNzNjZjE5NzY5MjQxNzZhMjllNjk5ZDMxNmVhYTE5IiwidG9rZW5fdHlwZSI6InNhX2Zyb21fcmVndWxhciIsImNyZWF0ZWRfYXQiOjE3NjY4MjEwNjZ9

Decoded:
{
  "token": "4a73cf19769241...",
  "token_type": "sa_from_regular",
  "created_at": 1766821066
}
```

### After (LiveAvatar API)
```
JWT (3 segments):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Structure:
header.payload.signature
```

## Error Handling

### Common Issues and Solutions

#### 1. "Invalid token: Not enough segments"
- **Cause**: Using base64 token with LiveAvatar SDK
- **Solution**: Verify `LIVEAVATAR_API_KEY` is set correctly
- **Check**: Token should have 3 segments separated by dots

#### 2. "401 Unauthorized"
- **Cause**: Wrong API key for LiveAvatar
- **Solution**: Update `.env.local` with correct `LIVEAVATAR_API_KEY`
- **Check**: Ensure using LiveAvatar key, not HeyGen key

#### 3. Avatar stuck on "Connecting..."
- **Cause**: Token creation failed or SDK error
- **Solution**: Check browser console for detailed error logs
- **Check**: Verify token is JWT format in network tab

#### 4. Avatar selection not applying
- **Cause**: Data mismatch between account settings and mock interviews
- **Solution**: Already fixed - now saves to both locations
- **Check**: Verify `mock_avatar_id` column is updated

## Deprecated Files (Not Needed)

The following API routes are **no longer used** with LiveAvatar SDK:

- ❌ `app/api/mock/heygen/speak/route.ts` - SDK handles speaking client-side
- ❌ `app/api/mock/heygen/ice/route.ts` - SDK handles WebRTC automatically
- ❌ `app/api/mock/heygen/sdp/route.ts` - SDK handles WebRTC automatically

These can be kept for backward compatibility or removed in a cleanup task.

## Testing Checklist

To verify the migration works correctly:

### 1. Environment Setup
- [ ] `LIVEAVATAR_API_KEY` is set in `.env.local`
- [ ] Run `npm install` to ensure `@heygen/liveavatar-web-sdk` is installed
- [ ] Restart dev server: `npm run dev`

### 2. Account Settings
- [ ] Navigate to Account Settings → Integrations
- [ ] Avatars dropdown loads successfully
- [ ] Select "Silas" (or another avatar)
- [ ] Click "Save Settings"
- [ ] Verify success message appears

### 3. Mock Interview Session
- [ ] Start a new mock interview session
- [ ] Verify "Connecting to AI interviewer..." appears
- [ ] Avatar video should appear (Silas or selected avatar)
- [ ] Avatar should speak welcome message
- [ ] Avatar should speak interview questions
- [ ] Check browser console for JWT token validation (3 segments ✅)

### 4. Error Scenarios
- [ ] Test with no internet (should show connection error)
- [ ] Test with invalid API key (should show 401 error)
- [ ] Test closing tab during interview (cleanup should work)

## Database Schema

Ensure these columns exist in `profiles` table:

```sql
-- Mock interview avatar settings
mock_avatar_id TEXT DEFAULT 'default',
mock_voice_id TEXT DEFAULT 'default',
mock_avatar_quality TEXT DEFAULT 'medium',

-- Backward compatibility
preferences JSONB DEFAULT '{}'::jsonb
```

## Next Steps

1. **Test the complete flow** using the checklist above
2. **Verify custom "Silas" avatar** works with persona
3. **Optional cleanup**: Remove deprecated HeyGen routes
4. **Monitor logs**: Check for any JWT token validation warnings
5. **Production deploy**: Ensure `LIVEAVATAR_API_KEY` is set in production environment

## Support Resources

- **LiveAvatar Docs**: https://docs.liveavatar.com
- **Web SDK Guide**: https://docs.liveavatar.com/web-sdk
- **API Reference**: https://docs.liveavatar.com/api-reference
- **Portal**: https://app.liveavatar.com (for avatar management)

## Migration Summary

| Aspect | Before | After |
|--------|--------|-------|
| SDK Package | `@heygen/streaming-avatar` | `@heygen/liveavatar-web-sdk` |
| API Endpoint | `api.heygen.com` | `api.liveavatar.com` |
| Token Format | Base64 (1 segment) | JWT (3 segments) |
| API Key | `HEYGEN_API_KEY` | `LIVEAVATAR_API_KEY` |
| Connection | Server-side WebRTC | Client-side SDK |
| Speaking | Server API calls | Client SDK calls |
| Cleanup | Manual | Automatic |
| Custom Avatars | Limited | Full support |
| OpenAI Model | `gpt-4-turbo-preview` | `gpt-4o-mini` |

---

**Status**: ✅ Migration Complete - Ready for Testing
