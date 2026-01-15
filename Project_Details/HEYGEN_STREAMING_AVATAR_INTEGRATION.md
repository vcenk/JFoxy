# HeyGen Streaming Avatar SDK Integration - DEPRECATED

> ⚠️ **This document is DEPRECATED**
>
> The app has been migrated to **LiveAvatar Web SDK** for production use.
>
> **See:** `LIVEAVATAR_MIGRATION_COMPLETE.md` for current implementation.

## Overview

This document describes the **deprecated** implementation of HeyGen's Interactive Avatar using the official `@heygen/streaming-avatar` package with HeyGen Streaming API.

## Why Streaming Avatar SDK, Not LiveAvatar SDK?

### Token Compatibility Issue

**HeyGen Streaming API** (`api.heygen.com`) returns **base64-encoded JSON tokens**:
```json
{
  "token": "4a73cf19...",
  "token_type": "sa_from_regular",
  "created_at": 1766821066
}
```

**LiveAvatar SDK** (`@heygen/liveavatar-web-sdk`) requires **JWT tokens** (3 segments: header.payload.signature).

**Solution**: Use `@heygen/streaming-avatar` SDK which is designed for HeyGen Streaming API tokens.

## Architecture

### Backend Flow
```
1. Client requests session initialization
2. Server calls HeyGen Streaming API: POST /v1/streaming.create_token
3. Server gets base64 token
4. Server returns token to client
```

### Frontend Flow
```
1. Client receives session token
2. Create StreamingAvatar with token
3. Listen for STREAM_READY event
4. Attach stream to video element
5. Use avatar.speak() to make avatar talk
6. Call avatar.stopAvatar() on cleanup
```

## Implementation

### 1. Package Installation

```bash
npm install @heygen/streaming-avatar
```

### 2. Backend: Create Session Token

**File: `lib/clients/heygenClient.ts`**

```typescript
export async function createLiveAvatarSession(config: {
  avatarId?: string
  voiceId?: string
}): Promise<{ sessionToken: string }> {
  const tokenResponse = await fetch(`${HEYGEN_API_URL}.create_token`, {
    method: 'POST',
    headers: {
      'X-Api-Key': env.heygen.apiKey,
      'Content-Type': 'application/json',
    },
  })

  const tokenData = await tokenResponse.json()
  const sessionToken = tokenData.data?.token || ''

  return { sessionToken }
}
```

### 3. API Endpoint Returns Token

**File: `app/api/mock/[id]/init-session/route.ts`**

```typescript
const { sessionToken } = await createLiveAvatarSession({
  avatarId: profile?.mock_avatar_id !== 'default' ? profile?.mock_avatar_id : undefined,
  voiceId: profile?.mock_voice_id !== 'default' ? profile?.mock_voice_id : undefined,
})

return successResponse({
  session_token: sessionToken,
})
```

### 4. Frontend Component

**File: `components/mock/AvatarStage.tsx`**

```typescript
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
} from '@heygen/streaming-avatar'

export function AvatarStage({ sessionToken, onAvatarReady, onError }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const avatarRef = useRef<StreamingAvatar | null>(null)

  useEffect(() => {
    if (!sessionToken || initialized.current) return
    initialized.current = true

    const initializeAvatar = async () => {
      // Create avatar instance
      const avatar = new StreamingAvatar({ token: sessionToken })
      avatarRef.current = avatar

      // Listen for stream ready
      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        if (videoRef.current && event.detail) {
          videoRef.current.srcObject = event.detail
        }
        onAvatarReady?.()
      })

      // Listen for speaking events
      avatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
        console.log('Avatar started talking')
      })

      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        console.log('Avatar stopped talking')
      })

      // Start avatar session
      await avatar.createStartAvatar({
        quality: AvatarQuality.Medium,
        avatarName: avatarId, // Optional
        voice: voiceId ? { voiceId } : undefined, // Optional
      })
    }

    initializeAvatar()

    return () => {
      avatarRef.current?.stopAvatar()
    }
  }, [sessionToken])

  return <video ref={videoRef} autoPlay playsInline />
}
```

### 5. Speaking

```typescript
// Make avatar speak
await avatar.speak({
  text: "Hello! Welcome to your mock interview.",
  taskType: TaskType.TALK,
})

// Or use REPEAT for immediate playback
await avatar.speak({
  text: "This is important information.",
  taskType: TaskType.REPEAT,
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
| `USER_STOP` | User stops interaction | Handle user input end |

## API Methods

### StreamingAvatar Constructor

```typescript
new StreamingAvatar({ token: string })
```

### Main Methods

#### `createStartAvatar(config): Promise<void>`
Starts the avatar session with configuration.

**Config options:**
- `quality: AvatarQuality` - Low, Medium, or High
- `avatarName?: string` - Avatar ID (optional, uses default if not specified)
- `voice?: { voiceId: string }` - Voice configuration (optional)
- `language?: string` - Language code (optional)

#### `speak(options): Promise<void>`
Makes the avatar speak text.

**Options:**
- `text: string` - The text to speak
- `taskType: TaskType` - TALK (natural) or REPEAT (immediate)

#### `stopAvatar(): Promise<void>`
Stops the avatar session and cleans up resources.

#### `interrupt(): void`
Interrupts the current avatar speech.

### Event Listeners

```typescript
avatar.on(StreamingEvents.STREAM_READY, (event) => {
  // event.detail contains MediaStream
})
```

## React Strict Mode Handling

To prevent double-initialization in development:

```typescript
const initialized = useRef(false)

useEffect(() => {
  if (initialized.current) {
    return
  }
  initialized.current = true

  // Initialize avatar...
}, [sessionToken])
```

## Token Format

HeyGen Streaming API returns base64-encoded JSON:
```
eyJ0b2tlbiI6IjRhNzNjZjE5NzY5MjQxNzZhMjllNjk5ZDMxNmVhYTE5IiwidG9rZW5fdHlwZSI6InNhX2Zyb21fcmVndWxhciIsImNyZWF0ZWRfYXQiOjE3NjY4MjEwNjZ9
```

Decoded:
```json
{
  "token": "4a73cf19769241...",
  "token_type": "sa_from_regular",
  "created_at": 1766821066
}
```

This is **NOT a JWT** (only 1 segment), which is why LiveAvatar SDK doesn't work.

## Error Handling

Common errors and solutions:

1. **"Invalid token: Not enough segments"**
   - Cause: Using LiveAvatar SDK with Streaming API token
   - Solution: Use Streaming Avatar SDK

2. **"Stream disconnected"**
   - Cause: Network issues or token expiration
   - Solution: Listen to STREAM_DISCONNECTED event and handle reconnection

3. **Video not appearing**
   - Cause: Stream not attached to video element
   - Solution: Ensure STREAM_READY event handler attaches stream

## Testing Checklist

1. ✅ Token created successfully (base64, 1 segment)
2. ✅ Avatar instance created
3. ✅ STREAM_READY event fires
4. ✅ Video element shows avatar
5. ✅ Avatar speaks when `speak()` is called
6. ✅ No errors in React Strict Mode
7. ✅ Cleanup on component unmount

## Files Modified

1. `package.json` - Changed to `@heygen/streaming-avatar`
2. `lib/clients/heygenClient.ts` - Uses HeyGen Streaming API
3. `app/api/mock/[id]/init-session/route.ts` - Returns session token
4. `components/mock/AvatarStage.tsx` - Uses StreamingAvatar SDK
5. `app/dashboard/mock/[id]/page.tsx` - Passes sessionToken

## References

- **Streaming Avatar SDK Docs**: https://docs.heygen.com/docs/streaming-avatar-sdk
- **SDK API Reference**: https://docs.heygen.com/docs/streaming-avatar-sdk-reference
- **NPM Package**: https://www.npmjs.com/package/@heygen/streaming-avatar
- **GitHub Demo**: https://github.com/HeyGen-Official/StreamingAvatarSDK

## Why Not LiveAvatar SDK?

| Aspect | Streaming Avatar SDK | LiveAvatar SDK |
|--------|---------------------|----------------|
| API Endpoint | `api.heygen.com` | `api.liveavatar.com` |
| Token Format | Base64 JSON | JWT (3 segments) |
| API Key | HeyGen API Key | Separate LiveAvatar Key |
| Status | Maintained, works | Enterprise/separate platform |
| Use Case | HeyGen customers | LiveAvatar customers |

If you have a **HeyGen API key**, use **Streaming Avatar SDK**.
If you have a **LiveAvatar API key** (from app.liveavatar.com), use **LiveAvatar SDK**.
