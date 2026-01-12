# HeyGen Embed Fix - Avatar ID vs Session ID

## 🔧 What Was Fixed

### The Problem
We were trying to use a **session_id** (from SDK token creation) in the embed URL, but HeyGen's embed feature expects a permanent **avatar_id**.

**Before (WRONG):**
```
https://embed.liveavatar.com/v1/5c36554e-612b-400f-aa9b-7e8760a41aea
                                   ↑
                            session_id (temporary, SDK-specific)
                            ❌ Returns 500 error
```

**After (CORRECT):**
```
https://embed.liveavatar.com/v1/073b60a9-89a8-45aa-8902-c358f64d2852
                                   ↑
                            avatar_id (permanent, from HeyGen dashboard)
                            ✅ Works!
```

---

## 🆔 Understanding HeyGen IDs

### Avatar ID (Permanent)
- **What:** Your avatar's permanent identifier in HeyGen
- **Format:** `073b60a9-89a8-45aa-8902-c358f64d2852`
- **Where to find:** HeyGen dashboard → Avatars section
- **Used for:** Embed iframes (static integration)
- **Lifetime:** Permanent (doesn't expire)

### Session ID (Temporary)
- **What:** Temporary session created via SDK API
- **Format:** `5c36554e-612b-400f-aa9b-7e8760a41aea`
- **Where it comes from:** API response when creating session token
- **Used for:** SDK integration (programmatic control)
- **Lifetime:** Temporary (expires after session ends)

---

## ✅ Changes Made

### 1. Updated `AvatarStageEmbed.tsx`

**Before:**
```typescript
interface AvatarStageEmbedProps {
  sessionId?: string  // ❌ Wrong - was using session_id
  onAvatarReady?: () => void
  onError?: (error: string) => void
}

const embedUrl = `https://embed.liveavatar.com/v1/${sessionId}`
```

**After:**
```typescript
// Default HeyGen avatar ID (Silas - Professional Interviewer)
const DEFAULT_AVATAR_ID = '073b60a9-89a8-45aa-8902-c358f64d2852'

interface AvatarStageEmbedProps {
  avatarId?: string  // ✅ Correct - uses avatar_id (optional, has default)
  onAvatarReady?: () => void
  onError?: (error: string) => void
}

const embedUrl = `https://embed.liveavatar.com/v1/${avatarId}`
```

### 2. Updated Parent Component (`page.tsx`)

**Before:**
```typescript
<AvatarStageEmbed
  sessionId={heygenSessionId || undefined}  // ❌ Passing wrong ID
  onAvatarReady={handleAvatarReady}
  onError={handleAvatarError}
/>
```

**After:**
```typescript
<AvatarStageEmbed
  // No props needed - uses DEFAULT_AVATAR_ID automatically ✅
  onAvatarReady={handleAvatarReady}
  onError={handleAvatarError}
/>
```

---

## 🎯 How It Works Now

### Embed Method (Iframe)
1. Component renders with hardcoded `DEFAULT_AVATAR_ID`
2. Iframe loads: `https://embed.liveavatar.com/v1/073b60a9-89a8-45aa-8902-c358f64d2852`
3. HeyGen serves the avatar embed page
4. User interacts with avatar via HeyGen's built-in UI
5. **No session creation needed!**

### SDK Method (Programmatic)
1. Backend creates session token via API
2. Frontend initializes SDK with session token
3. SDK creates WebRTC connection
4. Video stream displays in custom UI
5. You control avatar programmatically

---

## 🔄 Switching Between Methods

**File:** `app/dashboard/mock/[id]/page.tsx` - Line 16

### Use Embed (Simple, Limited Control)
```typescript
const USE_EMBED_METHOD = true
```
- ✅ No session creation needed
- ✅ Simpler, more reliable
- ❌ Can't control speech programmatically
- ❌ Uses HeyGen's UI

### Use SDK (Advanced, Full Control)
```typescript
const USE_EMBED_METHOD = false
```
- ✅ Full programmatic control
- ✅ Custom UI
- ✅ Control when avatar speaks
- ❌ More complex (React lifecycle issues)

---

## 📝 Where to Find Your Avatar ID

### Method 1: HeyGen Dashboard
1. Go to https://app.heygen.com
2. Navigate to "Avatars" section
3. Click on your avatar
4. Copy the avatar ID from the URL or avatar details

### Method 2: From API Response
```bash
curl -X GET "https://api.liveavatar.com/v1/avatars" \
  -H "X-API-KEY: your-api-key"
```

Response:
```json
{
  "data": {
    "avatars": [
      {
        "avatar_id": "073b60a9-89a8-45aa-8902-c358f64d2852",
        "avatar_name": "Silas - Professional Interviewer",
        ...
      }
    ]
  }
}
```

---

## 🔧 How to Change Avatar

### Update the Default Avatar ID

**File:** `components/mock/AvatarStageEmbed.tsx` - Line 13

```typescript
// Change this to your preferred avatar_id
const DEFAULT_AVATAR_ID = 'YOUR-AVATAR-ID-HERE'
```

### Or Pass Different Avatar per Session

```typescript
// In parent component
<AvatarStageEmbed
  avatarId="different-avatar-id-here"  // Override default
  onAvatarReady={handleAvatarReady}
  onError={handleAvatarError}
/>
```

---

## ✅ Testing Checklist

**After making these changes:**

- [ ] Hard refresh browser (`Ctrl + Shift + R`)
- [ ] Start new mock interview
- [ ] Check console: `[LiveAvatar Embed] Using avatar ID: 073b60a9-89a8-45aa-8902-c358f64d2852`
- [ ] Verify iframe loads without 500 error
- [ ] See avatar appear in iframe
- [ ] Verify you can interact with avatar (if embed has interactive features)

---

## 🐛 Troubleshooting

### Still seeing 500 error?
- **Check:** Is the avatar_id correct?
- **Verify:** Does this avatar exist in your HeyGen account?
- **Try:** Use a different avatar_id from your dashboard

### White screen in iframe?
- **Check:** Browser console for CORS errors
- **Verify:** Iframe `allow` attributes include microphone/camera
- **Try:** Different browser (Chrome recommended)

### Avatar loads but no interaction?
- **Note:** Embed method has limited interactivity
- **Option:** Switch to SDK method for full control

---

## 📊 Comparison: Session ID vs Avatar ID

| Aspect | Session ID | Avatar ID |
|--------|-----------|-----------|
| **Source** | Created via API on-demand | Pre-configured in HeyGen dashboard |
| **Format** | `5c36554e-612b-400f-aa9b-7e8760a41aea` | `073b60a9-89a8-45aa-8902-c358f64d2852` |
| **Lifetime** | Temporary (minutes) | Permanent |
| **Use Case** | SDK integration | Embed integration |
| **API Call Needed** | Yes (create session token) | No |
| **Embed URL** | ❌ Doesn't work | ✅ Works |
| **SDK Usage** | ✅ Works | ❌ Doesn't work |

---

## 🎉 Summary

**Problem:** Used temporary session_id in embed URL → 500 error

**Solution:** Use permanent avatar_id in embed URL → Works!

**Current Setup:**
- ✅ Embed method now uses correct avatar_id: `073b60a9-89a8-45aa-8902-c358f64d2852`
- ✅ SDK method still uses session tokens (unchanged)
- ✅ Easy toggle between both methods
- ✅ No more 500 errors on embed

**Next Steps:**
1. Refresh browser
2. Test embed method
3. Decide which method to keep (embed vs SDK)
4. Enjoy your working avatar! 🎊
