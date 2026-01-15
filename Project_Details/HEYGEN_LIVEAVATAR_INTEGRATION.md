# HeyGen LiveAvatar Web SDK Integration - FINAL WORKING VERSION

## Overview

This document describes the **correct** implementation of HeyGen's LiveAvatar using the official `@heygen/liveavatar-web-sdk` package.

## Key Differences from Streaming Avatar SDK

The LiveAvatar Web SDK (`@heygen/liveavatar-web-sdk`) is different from the older Streaming Avatar SDK:

| Feature | Streaming Avatar SDK (OLD) | LiveAvatar Web SDK (NEW) |
|---------|---------------------------|--------------------------|
| Package | `@heygen/streaming-avatar` | `@heygen/liveavatar-web-sdk` |
| Constructor | `new StreamingAvatar({ token })` | `new LiveAvatarSession(token, config)` |
| Initialization | `createStartAvatar({ quality, avatarName })` | `start()` |
| Speaking | `speak({ text, task_type })` | `message(text)` or `repeat(text)` |
| Video Attachment | Automatic via events | Manual via `attach(videoElement)` |
| Credentials | Single SDK token | Session access token |

## Architecture

### Backend Flow

```
1. Client requests session initialization
2. Server calls HeyGen API: POST /v1/streaming.create_token
3. Server gets session token
4. Server calls HeyGen API: POST /v1/streaming.new (with avatar/voice settings)
5. Server gets session_id (for tracking)
6. Server returns session_token to client
```

### Frontend Flow

```
1. Client receives session_token
2. Create LiveAvatarSession with token
3. Call session.start()
4. Call session.attach(videoElement)
5. Use session.message(text) to make avatar speak
6. Call session.stop() on cleanup
```

## Implementation

### 1. Package Installation

```bash
npm install @heygen/liveavatar-web-sdk
```

### 2. Backend: Create Session Token and ID

**File: `lib/clients/heygenClient.ts`**

```typescript
export async function createLiveAvatarSession(config: {
  avatarId?: string
  voiceId?: string
}): Promise<{ sessionId: string; sessionToken: string }> {
  // First, create a session token
  const tokenResponse = await fetch(`${HEYGEN_API_URL}.create_token`, {
    method: 'POST',
    headers: {
      'X-Api-Key': env.heygen.apiKey,
      'Content-Type': 'application/json',
    },
  })

  const tokenData = await tokenResponse.json()
  const sessionToken = tokenData.data?.token || ''

  // Then, create a LiveAvatar session
  const sessionBody: any = {}
  if (config.avatarId) {
    sessionBody.avatar_id = config.avatarId
  }
  if (config.voiceId) {
    sessionBody.voice = { voice_id: config.voiceId }
  }

  const sessionResponse = await fetch(`${HEYGEN_API_URL}.new`, {
    method: 'POST',
    headers: {
      'X-Api-Key': env.heygen.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionBody),
  })

  const sessionData = await sessionResponse.json()
  const sessionId = sessionData.data?.session_id || ''

  return { sessionId, sessionToken }
}
```

### 3. API Endpoint Returns Session Token

**File: `app/api/mock/[id]/init-session/route.ts`**

```typescript
const { sessionId, sessionToken } = await createLiveAvatarSession({
  avatarId: profile?.mock_avatar_id !== 'default' ? profile?.mock_avatar_id : undefined,
  voiceId: profile?.mock_voice_id !== 'default' ? profile?.mock_voice_id : undefined,
})

return successResponse({
  mock_interview_id: mockInterviewId,
  session_id: sessionId,        // For backend tracking (optional)
  session_token: sessionToken,  // For frontend SDK
  quality: profile?.mock_avatar_quality || 'medium',
})
```

### 4. Frontend Component

**File: `components/mock/AvatarStage.tsx`**

```typescript
import { LiveAvatarSession } from '@heygen/liveavatar-web-sdk'

interface AvatarStageProps {
  sessionToken?: string
  onAvatarReady?: () => void
  onError?: (error: string) => void
}

export function AvatarStage({ sessionToken, onAvatarReady, onError }: AvatarStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sessionRef = useRef<LiveAvatarSession | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!sessionToken || initialized.current) return
    initialized.current = true

    const initializeAvatar = async () => {
      try {
        // Create session with just the access token
        const session = new LiveAvatarSession(sessionToken, {
          voiceChat: false
        })
        sessionRef.current = session

        // Start the session
        await session.start()

        // Attach video stream to video element
        if (videoRef.current) {
          session.attach(videoRef.current)
        }

        onAvatarReady?.()
      } catch (err: any) {
        onError?.(err.message || 'Failed to initialize LiveAvatar')
      }
    }

    initializeAvatar()

    return () => {
      sessionRef.current?.stop()
    }
  }, [sessionToken])

  // Expose speak method
  useEffect(() => {
    if (sessionRef.current) {
      (window as any).__avatarSpeak = (text: string) => {
        sessionRef.current?.message(text)
      }
    }
  }, [sessionRef.current])

  return (
    <video ref={videoRef} autoPlay playsInline />
  )
}

// Helper function
export async function speakViaAvatar(text: string) {
  if ((window as any).__avatarSpeak) {
    await (window as any).__avatarSpeak(text)
  }
}
```

### 5. Page Component

**File: `app/dashboard/mock/[id]/page.tsx`**

```typescript
const [heygenSessionToken, setHeygenSessionToken] = useState<string | null>(null)

const initializeSession = async () => {
  const res = await fetch(`/api/mock/${sessionId}/init-session`, { method: 'POST' })
  const data = await res.json()

  if (data.success) {
    setHeygenSessionToken(data.data.session_token)
  }
}

return (
  <AvatarStage
    sessionToken={heygenSessionToken || undefined}
    onAvatarReady={handleAvatarReady}
    onError={handleAvatarError}
  />
)
```

## Key API Methods

### LiveAvatarSession Constructor

```typescript
constructor(sessionAccessToken: string, config?: SessionConfig)
```

**Parameters:**
- `sessionAccessToken` (required) - The session token from HeyGen API
- `config` (optional) - Configuration object:
  - `voiceChat?: boolean | VoiceChatConfig` - Enable voice chat (default: false)
  - `apiUrl?: string` - Custom API URL (default: HeyGen's production API)

### Main Methods

#### `start(): Promise<void>`
Starts the LiveAvatar session and establishes connection.

#### `stop(): Promise<void>`
Stops the session and cleans up resources.

#### `attach(element: HTMLMediaElement): void`
Attaches the avatar video stream to a video or audio element.

#### `message(text: string): void`
Sends a text message to the avatar to speak. The avatar will speak naturally with appropriate pauses.

#### `repeat(text: string): void`
Similar to `message()` but with different behavior (immediate repeat).

#### `interrupt(): void`
Interrupts the current avatar speech.

#### `keepAlive(): Promise<void>`
Keeps the session alive (useful for long sessions).

### Properties

- `state: SessionState` - Current session state (INACTIVE, CONNECTING, CONNECTED, etc.)
- `connectionQuality: ConnectionQuality` - Current connection quality
- `voiceChat: VoiceChat` - Voice chat instance (if enabled)

## React Strict Mode Handling

To prevent double-initialization in React Strict Mode (development):

```typescript
const initialized = useRef(false)

useEffect(() => {
  if (initialized.current) {
    console.log('Already initialized, skipping...')
    return
  }
  initialized.current = true

  // Initialize avatar...
}, [sessionToken])
```

## Error Handling

Common errors and solutions:

1. **"Session is not in correct state"**
   - Cause: Trying to call methods before `start()` completes
   - Solution: Await `session.start()` before calling other methods

2. **401 Unauthorized during cleanup**
   - Cause: React Strict Mode double-mounting
   - Solution: Silently catch cleanup errors with 401 status

3. **Video not appearing**
   - Cause: Forgot to call `session.attach(videoElement)`
   - Solution: Call `attach()` after `start()` completes

4. **Constructor expects 1-2 arguments**
   - Cause: Passing sessionId and sessionToken separately
   - Solution: Only pass sessionToken (the session ID is embedded in the token)

## Testing Checklist

1. ✅ Check console logs for successful initialization
2. ✅ Verify video element shows avatar
3. ✅ Test avatar speaking with `message()` method
4. ✅ Confirm no errors in React Strict Mode
5. ✅ Verify cleanup on component unmount

## Files Modified

1. `package.json` - Added `@heygen/liveavatar-web-sdk` dependency
2. `lib/clients/heygenClient.ts` - Added `createLiveAvatarSession()` function
3. `app/api/mock/[id]/init-session/route.ts` - Returns session token
4. `components/mock/AvatarStage.tsx` - Complete rewrite using LiveAvatarSession
5. `app/dashboard/mock/[id]/page.tsx` - Updated to pass only sessionToken

## References

- **Official Documentation**: https://docs.liveavatar.com/docs/getting-started
- **NPM Package**: https://www.npmjs.com/package/@heygen/liveavatar-web-sdk
- **GitHub Demo**: https://github.com/heygen-com/liveavatar-web-sdk
- **API Reference**: https://docs.liveavatar.com/reference

## Migration from Streaming Avatar SDK

If migrating from `@heygen/streaming-avatar`:

1. ✅ Uninstall old package: `npm uninstall @heygen/streaming-avatar`
2. ✅ Install new package: `npm install @heygen/liveavatar-web-sdk`
3. ✅ Change constructor: `new LiveAvatarSession(token, config)` instead of `new StreamingAvatar({ token })`
4. ✅ Remove `createStartAvatar()` - use `start()` instead
5. ✅ Add `attach(videoElement)` after `start()`
6. ✅ Change `speak()` to `message()`
7. ✅ Only pass sessionToken, not sessionId
