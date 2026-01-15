# HeyGen Streaming Avatar SDK Integration

## Overview

This document describes the **correct** way to integrate HeyGen's Interactive Avatar using their official Streaming Avatar SDK. This replaces the previous manual LiveKit integration approach.

## Why SDK Instead of Manual LiveKit?

HeyGen **strongly recommends** using the Streaming Avatar SDK for Node.js/web environments because:

1. **Simpler Integration**: Handles all LiveKit complexity internally
2. **Better React Support**: Designed to work seamlessly with React's lifecycle
3. **Automatic State Management**: SDK manages connection states, events, and cleanup
4. **Official Support**: This is the recommended integration path from HeyGen
5. **No More Timing Issues**: SDK handles initialization and ready states automatically

## Architecture

### Old Approach (Manual LiveKit) ❌

```
Frontend → API → HeyGen.create_session() → Returns LiveKit URL + Token
Frontend → Manual LiveKit Client Connection → Track Events → Attach Video
Frontend → API → HeyGen.speak() → Avatar Speaks
```

**Problems:**
- React Strict Mode caused double-initialization
- Manual timing management required
- Connection state errors ("Session is not in correct state")
- Complex cleanup logic
- More prone to bugs

### New Approach (SDK) ✅

```
Frontend → API → HeyGen.create_token() → Returns SDK Token
Frontend → StreamingAvatar SDK → Handles Everything Internally
Frontend → SDK.speak() → Avatar Speaks Directly
```

**Benefits:**
- SDK handles all connection management
- Event-driven architecture (STREAM_READY, AVATAR_START_TALKING, etc.)
- Automatic cleanup
- Works perfectly with React Strict Mode
- Much simpler code

## Implementation

### 1. Install SDK

```bash
npm install @heygen/streaming-avatar livekit-client
```

### 2. Create SDK Token (Backend)

**File: `lib/clients/heygenClient.ts`**

```typescript
export async function createSDKToken(): Promise<string> {
  const response = await fetch(`${HEYGEN_API_URL}.create_token`, {
    method: 'POST',
    headers: {
      'X-Api-Key': env.heygen.apiKey,
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()
  return data.data?.token || ''
}
```

### 3. API Endpoint Returns SDK Token

**File: `app/api/mock/[id]/init-session/route.ts`**

```typescript
// Create SDK token
const sdkToken = await createSDKToken()

// Return to frontend
return successResponse({
  sdk_token: sdkToken,
  avatar_id: profile?.mock_avatar_id,
  voice_id: profile?.mock_voice_id,
  quality: profile?.mock_avatar_quality || 'medium',
})
```

### 4. Frontend Component Uses SDK

**File: `components/mock/AvatarStage.tsx`**

```typescript
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
} from '@heygen/streaming-avatar'

export function AvatarStage({ sdkToken, avatarId, voiceId, quality, onAvatarReady }: Props) {
  const avatarRef = useRef<StreamingAvatar | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!sdkToken || initialized.current) return
    initialized.current = true

    const initializeAvatar = async () => {
      const avatar = new StreamingAvatar({ token: sdkToken })
      avatarRef.current = avatar

      // Listen for stream ready
      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        videoRef.current.srcObject = event.detail
        onAvatarReady?.()
      })

      // Listen for avatar speaking
      avatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
        setIsSpeaking(true)
      })

      // Start avatar session
      await avatar.createStartAvatar({
        quality: AvatarQuality.Medium,
        avatarName: avatarId,
        voice: voiceId ? { voiceId } : undefined,
      })
    }

    initializeAvatar()

    return () => {
      avatarRef.current?.stopAvatar()
    }
  }, [sdkToken])
}
```

### 5. Speaking is Direct (No API Call)

```typescript
// Old way (via API):
await fetch('/api/mock/heygen/speak', {
  method: 'POST',
  body: JSON.stringify({ session_id, text }),
})

// New way (via SDK):
await avatar.speak({
  text: "Hello!",
  task_type: TaskType.REPEAT
})
```

## Key SDK Events

| Event | When It Fires | Use Case |
|-------|--------------|----------|
| `STREAM_READY` | Video stream ready | Attach to `<video>` element |
| `STREAM_DISCONNECTED` | Connection lost | Show error state |
| `AVATAR_START_TALKING` | Avatar begins speaking | Update UI (show animation) |
| `AVATAR_STOP_TALKING` | Avatar finishes speaking | Update UI (stop animation) |
| `USER_START` | User interaction detected | Handle user input |

## React Strict Mode Handling

The SDK approach handles React Strict Mode correctly:

```typescript
const initialized = useRef(false)

useEffect(() => {
  // Prevent double initialization
  if (initialized.current) {
    console.log('[Avatar SDK] Already initialized, skipping...')
    return
  }
  initialized.current = true

  // Initialize avatar...
}, [sdkToken])
```

**Why this works:**
- First mount: `initialized.current = false` → Initialize
- Unmount (Strict Mode): Cleanup runs
- Second mount: `initialized.current = true` → Skip initialization ✅

## Testing Instructions

1. **Start dev server**: `npm run dev`

2. **Check server console** for:
   ```
   [Mock Init] Creating HeyGen SDK token...
   [Mock Init] HeyGen SDK token created successfully
   ```

3. **Check browser console** for:
   ```
   [Avatar SDK] Creating StreamingAvatar instance...
   [Avatar SDK] Starting avatar session...
   [Avatar SDK] Stream ready, attaching to video element
   [Avatar SDK] Avatar session started successfully
   [Avatar SDK] Avatar started talking
   ```

4. **Expected behavior:**
   - Avatar video appears within 2-3 seconds
   - Avatar speaks with voice and lip-sync
   - No "Session is not in correct state" errors
   - No LiveKit disconnection errors
   - Works correctly in React Strict Mode (dev)

## Files Changed

1. `package.json` - Added `@heygen/streaming-avatar` dependency
2. `lib/clients/heygenClient.ts` - Added `createSDKToken()` function
3. `app/api/mock/[id]/init-session/route.ts` - Returns SDK token instead of LiveKit credentials
4. `components/mock/AvatarStage.tsx` - Complete rewrite using SDK
5. `app/dashboard/mock/[id]/page.tsx` - Updated to use SDK approach

## References

- **Official SDK Docs**: https://docs.heygen.com/docs/streaming-avatar-sdk
- **API Reference**: https://docs.heygen.com/docs/streaming-avatar-sdk-reference
- **LiveKit Integration Guide**: https://docs.heygen.com/docs/streaming-api-integration-with-livekit-v2
- **NPM Package**: https://www.npmjs.com/package/@heygen/streaming-avatar

## Migration Notes

If you're migrating from manual LiveKit integration:

1. ❌ Remove `livekit-client` direct usage
2. ❌ Remove `/api/mock/heygen/speak` API calls for speak (can keep for logging)
3. ❌ Remove manual connection state management
4. ✅ Use SDK's `speak()` method directly
5. ✅ Listen to SDK events for state changes
6. ✅ Let SDK handle cleanup automatically

The SDK does all the heavy lifting. You just need to:
- Create a token
- Initialize the SDK
- Listen to events
- Call `speak()` when needed
