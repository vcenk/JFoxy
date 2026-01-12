# Mock Interview Fixes Applied

## Issue: Avatar Not Visible & No Voice Output

### Root Cause
HeyGen has **two different API versions** with different workflows:

**LiveKit-based API (v2 - Current):**
1. `POST /v1/streaming.new` - Create session (returns `livekit_url` and `access_token`)
2. Frontend connects to LiveKit room using the URL and token
3. Avatar stream starts **automatically** when client connects
4. `POST /v1/streaming.task` - Make avatar speak (can be called multiple times)
5. `POST /v1/streaming.stop` - Close session when done

**Legacy WebRTC API (v1 - Deprecated):**
1. `POST /v1/streaming.new` - Create session (returns `sdp_offer` and `ice_servers`)
2. `POST /v1/streaming.start` - Start the stream (explicit start required)
3. `POST /v1/streaming.task` - Make avatar speak
4. `POST /v1/streaming.stop` - Close session

**What We Were Doing Wrong:**
- We were calling `streaming.start` for LiveKit-based sessions
- LiveKit sessions don't need `streaming.start` - they start automatically on connection
- This caused a 400 "Invalid params" error and prevented initialization

### Files Changed

#### 1. `app/api/mock/[id]/init-session/route.ts`
**Change:** Only call `streaming.start` for legacy WebRTC sessions, not LiveKit sessions

```typescript
// 4. For LiveKit-based sessions, streaming.start is NOT needed
// The session starts automatically when the client connects to LiveKit
// Only legacy WebRTC sessions require streaming.start
if (heygenSession.sdp_offer && !heygenSession.livekit_url) {
  // Legacy WebRTC mode - needs explicit start
  const { startAvatarSpeaking } = await import('@/lib/clients/heygenClient')
  await startAvatarSpeaking(heygenSession.session_id)
  console.log('[Mock Init] WebRTC session started successfully')
} else {
  console.log('[Mock Init] LiveKit session ready - will start on client connection')
}
```

**Why:** LiveKit-based sessions (the new v2 API) start automatically when the frontend connects to the LiveKit room. Only legacy WebRTC sessions require an explicit `streaming.start` call. Calling it for LiveKit sessions causes a 400 "Invalid params" error.

#### 2. `app/api/mock/heygen/speak/route.ts`
**Change:** Removed the call to `startAvatarSpeaking` from the speak endpoint

```typescript
// Before:
const task = await speakText({...})
if (start_immediately) {
  await startAvatarSpeaking(session_id) // ❌ WRONG - causes errors
}

// After:
const task = await speakText({...})
// streaming.start should only be called ONCE during initialization
```

**Why:** `streaming.start` should only be called once during session initialization. Calling it multiple times causes API errors. The speak endpoint should only send `streaming.task` commands.

## Latest Fix (December 26, 2025): Connection State Monitoring

### Issue: "Session is not in correct state" Error
The speak API was being called before LiveKit finished connecting, causing errors.

#### Root Cause
Frontend was using arbitrary `setTimeout(2000)` delays instead of waiting for actual LiveKit connection completion.

#### Files Changed

**`app/dashboard/mock/[id]/page.tsx`**

**Changes:**
1. Added refs to track initialization state:
   - `welcomeSpokeRef` - prevents duplicate welcome messages
   - `sessionInitializedRef` - tracks if HeyGen session created

2. Simplified `initializeSession()` to only create the session (removed arbitrary setTimeout logic)

3. Added new `useEffect` hook that watches `avatarConnectionState`:
   - Waits for `avatarConnectionState === 'connected'`
   - Only then triggers welcome message via speak API
   - Prevents calling speak API before LiveKit is ready

```typescript
// Watch for LiveKit connection and trigger welcome message when connected
useEffect(() => {
  const triggerWelcome = async () => {
    if (!sessionInitializedRef.current ||
        avatarConnectionState !== 'connected' ||
        welcomeSpokeRef.current ||
        !heygenSession?.session_id) {
      return
    }

    console.log('[Mock Session] LiveKit connected, triggering welcome message...')
    welcomeSpokeRef.current = true

    try {
      await fetch('/api/mock/heygen/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: heygenSession.session_id,
          text: "Hello! Welcome to your mock interview...",
        }),
      })

      // Wait for welcome speech to complete, then start first question
      setTimeout(() => startNextQuestion(), 8000)
    } catch (err) {
      console.error('Failed to trigger welcome speech:', err)
      setTimeout(() => startNextQuestion(), 2000)
    }
  }

  triggerWelcome()
}, [avatarConnectionState, heygenSession])
```

**Why:** This ensures speak API is only called AFTER LiveKit establishes connection, preventing "Session is not in correct state" errors.

## Expected Behavior After Fix

1. ✅ When user enters mock interview session, `init-session` will:
   - Create HeyGen LiveKit session
   - **Skip `streaming.start` call (not needed for LiveKit)**
   - Return LiveKit URL and access token to frontend

2. ✅ Frontend (`AvatarStage` component) will:
   - Connect to LiveKit room using the URL and token
   - **Avatar stream starts automatically on connection**
   - Subscribe to video/audio tracks from HeyGen
   - **Avatar video should now appear on screen**
   - Update `avatarConnectionState` to 'connected'

3. ✅ Frontend (`page.tsx`) monitors connection state:
   - Waits for `avatarConnectionState === 'connected'`
   - **Only then calls speak API for welcome message**
   - Prevents premature API calls

4. ✅ When avatar needs to speak, the speak endpoint will:
   - Send text via `streaming.task` API
   - **Avatar should speak the text with voice and lip-sync animation**
   - No need to call `streaming.start` - session is already active

## Reference Documentation

- HeyGen Official Demo: https://github.com/HeyGen-Official/InteractiveAvatarNextJSDemo
- HeyGen Streaming API Docs: https://docs.heygen.com/docs/streaming-api-integration-with-livekit-v2

## Testing Instructions

1. **Restart your Next.js dev server** (important!)
2. Navigate to a mock interview session
3. Check **server terminal** for initialization logs:
   - `[Mock Init] HeyGen session created: <session_id>`
   - `[Mock Init] LiveKit session ready - will start on client connection`
   - No more `"Invalid params"` errors

4. Check **browser console** for proper initialization flow:
   - `[Mock Session] HeyGen session initialized, waiting for connection...`
   - `[LiveKit] Initializing connection...`
   - `[LiveKit] Connecting to room...`
   - `[LiveKit] Connected successfully`
   - `[LiveKit] Track subscribed: video`
   - `[LiveKit] Track subscribed: audio`
   - `[LiveKit] Video track attached`
   - `[LiveKit] Audio track attached`
   - `[Mock Session] LiveKit connected, triggering welcome message...`
   - `[Mock Session] Welcome message sent successfully`
   - `[Mock Session] Starting first question...`

5. **Expected visual behavior:**
   - Loading screen appears with "Connecting to your AI interviewer..."
   - Avatar video should appear on screen within 2-3 seconds
   - Avatar should speak the welcome message with voice
   - Avatar's lips should move in sync with speech
   - After ~8 seconds, first interview question appears
   - No more 500 errors from `/api/mock/heygen/speak`
   - No more "Session is not in correct state" errors

## Additional Improvements Made Previously

- Fixed voice configuration (don't send 'default' as voice_id)
- Fixed profile query (use `id` not `user_id` for profiles table)
- Added recruiter persona generation with realistic name and personality
- Implemented natural interview flow (warmup → explanation → resume review → questions)
