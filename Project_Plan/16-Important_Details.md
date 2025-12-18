# 16 – Deepgram Integration (TTS + STT + Personas)

## 1. Purpose

Deepgram powers all **audio interactions** in the app:

- Text-to-Speech (TTS):  
  - Reading STAR questions in Interview Practice.  
  - Speaking questions and follow-ups in Mock Interview.

- Speech-to-Text (STT):  
  - Transcribing user answers for scoring (Practice).  
  - Transcribing user answers for evaluation (Mock Interview).

The integration must support:

- Low latency.
- Clear persona mapping (Recruiter, Manager, Tech Lead).
- Smooth fallback and masking of AI “thinking” time.

---

## 2. Environment & Config

### 2.1 Environment Variables

In `.env.local`:

- `DEEPGRAM_API_KEY=...`

Optional:

- `DEEPGRAM_TTS_MODEL=sonic` (or similar)  
- `DEEPGRAM_STT_MODEL=nova-2` (or similar)

### 2.2 Central Config Object

Create `config/deepgram.ts`:

```ts
export const DEEPGRAM_CONFIG = {
  tts: {
    model: process.env.DEEPGRAM_TTS_MODEL ?? "sonic",
    // Global defaults
    encoding: "linear16",
    sampleRate: 16000,
    // Optional: voice defaults if model supports it
  },
  stt: {
    model: process.env.DEEPGRAM_STT_MODEL ?? "nova-2",
    language: "en",
    punctuation: true,
    smartFormat: true,
  },
};
3. Persona Mapping (Voices + Style)
We map interviewer personas to Deepgram TTS voice presets and style options.

Create config/interviewPersonas.ts:

ts
Copy code
export type InterviewPersonaId = "emma-hr" | "james-manager" | "sato-tech";

export interface PersonaVoiceConfig {
  id: InterviewPersonaId;
  displayName: string;
  roleLabel: string;
  deepgramVoice: string; // e.g. "aura-emma"
  speakingRate: number;  // 0.8–1.2 range
  pitchShift: number;    // -3..+3
  fillerStyle: "warm" | "direct" | "analytical";
}

export const INTERVIEW_PERSONAS: PersonaVoiceConfig[] = [
  {
    id: "emma-hr",
    displayName: "Emma",
    roleLabel: "Senior Recruiter",
    deepgramVoice: "aura-emma", // example
    speakingRate: 1.0,
    pitchShift: 0,
    fillerStyle: "warm",
  },
  {
    id: "james-manager",
    displayName: "James",
    roleLabel: "Hiring Manager",
    deepgramVoice: "aura-james",
    speakingRate: 1.05,
    pitchShift: -1,
    fillerStyle: "direct",
  },
  {
    id: "sato-tech",
    displayName: "Sato",
    roleLabel: "Tech Lead",
    deepgramVoice: "aura-sato",
    speakingRate: 0.95,
    pitchShift: 0,
    fillerStyle: "analytical",
  },
];
Persona is selected in:

Mock Interview pre-configuration.

(Optionally) Practice mode if you allow persona selection.

4. Text-to-Speech (Server-side)
4.1 TTS API Route
Endpoint: POST /api/audio/tts

Request body:

ts
Copy code
type TtsRequestBody = {
  text: string;
  personaId?: InterviewPersonaId; // defaults to "emma-hr"
};
Response:

audio/wav or audio/mpeg stream (or application/json with a signed URL if you choose to store in Supabase).

Pseudo-code:

ts
Copy code
// app/api/audio/tts/route.ts
import { NextRequest } from "next/server";
import { DEEPGRAM_CONFIG } from "@/config/deepgram";
import { INTERVIEW_PERSONAS } from "@/config/interviewPersonas";

export async function POST(req: NextRequest) {
  const { text, personaId } = await req.json();
  const persona =
    INTERVIEW_PERSONAS.find(p => p.id === personaId) ??
    INTERVIEW_PERSONAS[0];

  // Call Deepgram TTS REST API
  const dgRes = await fetch("https://api.deepgram.com/v1/speak", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEEPGRAM_CONFIG.tts.model,
      text,
      // Voice/style extras depending on Deepgram API
      voice: persona.deepgramVoice,
      speaking_rate: persona.speakingRate,
      pitch: persona.pitchShift,
    }),
  });

  if (!dgRes.ok) {
    return new Response("TTS error", { status: 500 });
  }

  const audioBuffer = Buffer.from(await dgRes.arrayBuffer());

  return new Response(audioBuffer, {
    status: 200,
    headers: {
      "Content-Type": "audio/wav",
      "Content-Length": audioBuffer.length.toString(),
    },
  });
}
Usage in UI:

Interview Practice:

When question is ready, call /api/audio/tts and play audio.

Mock Interview:

For each AI question / follow-up, call TTS for the utterance.

5. Speech-to-Text (Streaming STT)
For realistic practice / mock interview, we use WebSocket or streaming STT.

5.1 Simplified Approach (MVP)
MVP can use non-streaming STT:

Record full answer in browser (MediaRecorder).

Send audio blob to POST /api/audio/stt.

Get transcript.

Endpoint: POST /api/audio/stt

Request:

multipart/form-data with file or base64 audio.

Response:

ts
Copy code
type SttResponseBody = {
  transcript: string;
  confidence?: number;
  words?: { word: string; start: number; end: number }[];
};
Pseudo-code:

ts
Copy code
// app/api/audio/stt/route.ts
import { NextRequest } from "next/server";
import { DEEPGRAM_CONFIG } from "@/config/deepgram";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as Blob | null;
  if (!file) {
    return new Response("Missing file", { status: 400 });
  }

  const audioBuffer = Buffer.from(await file.arrayBuffer());

  const dgRes = await fetch("https://api.deepgram.com/v1/listen", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      "Content-Type": "audio/wav", // adjust based on actual encoding
    },
    body: audioBuffer,
  });

  if (!dgRes.ok) {
    return new Response("STT error", { status: 500 });
  }

  const dgJson = await dgRes.json();

  // Map Deepgram response to simple format
  const transcript =
    dgJson.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";

  return Response.json({
    transcript,
    confidence:
      dgJson.results?.channels?.[0]?.alternatives?.[0]?.confidence ?? null,
  });
}
5.2 Streaming (Next Phase)
Later, implement:

WebSocket-based STT for:

Real-time text display (optional).

Silence detection to auto-stop answers.

Vue/React hook around WebSocket that:

Connects on start.

Sends audio chunks.

Emits partial transcripts and final transcript.

6. Latency Masking & Filler Sounds
To avoid awkward silence while OpenAI is thinking:

As soon as user finishes speaking and answer is sent:

Show a subtle “Thinking…” animation.

Optionally play a short, very soft “processing” noise (loop).

Stop noise when TTS of next question begins.

You can also:

Pre-generate common fillers (“mm-hmm”, “I see”, “go on”) and TTS them on client side when the persona is in “listening” state (optional V2).

7. Error Handling
TTS failure:

Show banner: “Audio error. Showing text instead.”

Always display question text on screen as fallback.

STT failure:

Ask user to retry: “We could not hear you clearly. Try again?”

Allow manual text input as last resort (for accessibility).

Rate limiting:

A simple usage counter on per-day basis per user for free tier.

Unlimited (or higher cap) for Pro.

yaml
Copy code

---

## `17-openai-integration.md`

```md
# 17 – OpenAI Integration (LLM Orchestration)

## 1. Purpose

OpenAI handles all **reasoning and content**:

- Resume parsing & rewriting.
- JD parsing & competency extraction.
- SWOT & STAR generation.
- Gap Defense scripts.
- Intro Pitch strategies & scripts.
- STAR answer scoring & feedback.
- Mock Interview question generation & follow-ups.
- Session & interview summary reports.

---

## 2. Environment & Config

### 2.1 Environment Variables

In `.env.local`:

- `OPENAI_API_KEY=...`
- `OPENAI_MODEL_MAIN=gpt-4.1-mini` (or equivalent)  
- `OPENAI_MODEL_HEAVY=gpt-4.1` (for complex tasks, if needed)

### 2.2 Central Client Wrapper

Create `lib/openaiClient.ts`:

```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Role = "system" | "user" | "assistant";

export async function callLLM({
  model,
  messages,
  temperature = 0.3,
  maxTokens = 1500,
}: {
  model?: string;
  messages: { role: Role; content: string }[];
  temperature?: number;
  maxTokens?: number;
}) {
  const usedModel = model ?? process.env.OPENAI_MODEL_MAIN ?? "gpt-4.1-mini";

  const response = await client.chat.completions.create({
    model: usedModel,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  return response.choices[0]?.message?.content ?? "";
}
3. Prompt Templates & “Engines”
We treat each feature as a named engine with a specific system prompt and expected JSON output.

Create lib/engines/* files, e.g.:

3.1 Resume Analysis Engine
File: lib/engines/resumeAnalysisEngine.ts

ts
Copy code
import { callLLM } from "../openaiClient";

export async function analyzeResumeAgainstJob({
  resumeText,
  jobText,
}: {
  resumeText: string;
  jobText: string;
}) {
  const system = `
You are an ATS-like resume analysis engine for a career coaching app.
Analyze the resume vs. job description and return strict JSON.
`;

  const user = `
RESUME:
"""${resumeText}"""

JOB DESCRIPTION:
"""${jobText}"""

Return JSON with:
- ats_score: 0-100
- jd_match_score: 0-100
- skill_matches: string[]
- missing_skills: string[]
- section_feedback: { section: string; feedback: string }[]
- bullet_suggestions: string[]
`;

  const content = await callLLM({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    maxTokens: 1400,
  });

  // Wrap in try/catch to safely parse
  try {
    return JSON.parse(content);
  } catch {
    // fallback: log & return skeleton
    return {
      ats_score: 0,
      jd_match_score: 0,
      skill_matches: [],
      missing_skills: [],
      section_feedback: [],
      bullet_suggestions: [],
      raw: content,
    };
  }
}
3.2 STAR Story Builder Engine
File: lib/engines/starBuilderEngine.ts

ts
Copy code
export async function generateStarStory({
  question,
  resumeSummary,
  experienceSnippet,
}: {
  question: string;
  resumeSummary: string;
  experienceSnippet: string;
}) {
  const system = `
You help candidates build STAR stories (Situation, Task, Action, Result)
for behavioral interview questions. Respond with strict JSON.
`;

  const user = `
QUESTION:
"${question}"

RESUME SUMMARY:
"""${resumeSummary}"""

RELEVANT EXPERIENCE:
"""${experienceSnippet}"""

Return JSON:
{
  "situation": "...",
  "task": "...",
  "action": "...",
  "result": "...",
  "metrics": ["..."]
}
`;

  const content = await callLLM({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  try {
    return JSON.parse(content);
  } catch {
    return {
      situation: "",
      task: "",
      action: "",
      result: "",
      metrics: [],
      raw: content,
    };
  }
}
3.3 Answer Scoring Engine (Practice)
File: lib/engines/answerScoringEngine.ts

ts
Copy code
export async function scoreAnswer({
  question,
  transcript,
  resumeSummary,
  jobSummary,
}: {
  question: string;
  transcript: string;
  resumeSummary: string;
  jobSummary: string;
}) {
  const system = `
You are an interview answer scoring engine.
Evaluate behavioral answers using STAR and alignment with a job description.
Return strict JSON only.
`;

  const user = `
QUESTION:
"${question}"

ANSWER (TRANSCRIPT):
"""${transcript}"""

RESUME SUMMARY:
"""${resumeSummary}"""

JOB SUMMARY:
"""${jobSummary}"""

Return JSON:
{
  "overall_score": 0-100,
  "star": {
    "has_situation": boolean,
    "has_task": boolean,
    "has_action": boolean,
    "has_result": boolean
  },
  "clarity_score": 0-100,
  "relevance_score": 0-100,
  "impact_score": 0-100,
  "strengths": [ "..." ],
  "areas_for_improvement": [ "..." ],
  "one_sentence_summary": "..."
}
`;

  const content = await callLLM({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  try {
    return JSON.parse(content);
  } catch {
    return {
      overall_score: 0,
      star: {
        has_situation: false,
        has_task: false,
        has_action: false,
        has_result: false,
      },
      clarity_score: 0,
      relevance_score: 0,
      impact_score: 0,
      strengths: [],
      areas_for_improvement: [],
      one_sentence_summary: "",
      raw: content,
    };
  }
}
4. Mock Interview Engine
4.1 Question Plan Generator
Generates the structured skeleton (Intro, Q1, Q2, Tech, Close):

ts
Copy code
export async function generateInterviewPlan({
  resumeSummary,
  jobSummary,
  personaId,
  durationMinutes,
}: {
  resumeSummary: string;
  jobSummary: string;
  personaId: string;
  durationMinutes: number;
}) {
  const system = `
You are a professional interviewer in a mock interview simulator.
You generate a structured question plan.
`;

  const user = `
RESUME SUMMARY:
"""${resumeSummary}"""

JOB SUMMARY:
"""${jobSummary}"""

Persona: ${personaId}
Duration: ${durationMinutes} minutes

Return JSON:
{
  "questions": [
    {
      "id": "q1",
      "type": "intro" | "behavioral" | "technical" | "closing",
      "text": "...",
      "target_competency": "leadership | conflict | tech-depth | culture-fit"
    },
    ...
  ]
}
`;
  // callLLM, parse JSON...
}
4.2 Follow-up Probe Generator
Given Q + answer + partial evaluation, produce 0 or 1 follow-up question:

ts
Copy code
export async function generateFollowUp({
  question,
  transcript,
  evaluation,
}: {
  question: string;
  transcript: string;
  evaluation: any;
}) {
  const system = `
You generate at most one follow-up probing question after hearing an answer.
If the answer is strong and specific, return an empty string.
Otherwise, ask for clarification or metrics.
`;

  const user = `
QUESTION:
"${question}"

ANSWER:
"""${transcript}"""

EVALUATION:
${JSON.stringify(evaluation)}

Return ONE short follow-up question or an empty string.
`;

  const content = await callLLM({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    maxTokens: 200,
  });

  return content.trim();
}
5. Session & Interview Summary Engines
Practice Session Summary:

Aggregate per-question scores.

Generate trend commentary + next steps.

Mock Interview Report:

Map overall performance to verdict: “Strong Hire / Hire / Borderline / Not Ready Yet”.

Produce 7-day plan.

Similar pattern:

lib/engines/practiceSummaryEngine.ts

lib/engines/mockReportEngine.ts

Both:

Take numerical metrics + transcripts.

Return structured JSON for UI.

6. Error Handling & Safeguards
Always wrap JSON.parse in try/catch.

Store raw LLM output in logs (debug mode) for troubleshooting.

Implement basic retry (1–2 attempts) on LLM errors.

Enforce max tokens to avoid over-spend.

7. Cost Control
Use a cheaper model (e.g. -mini) for:

Parsing.

Basic rewriting.

Simple classification.

Use a stronger model (OPENAI_MODEL_HEAVY) for:

Mock Interview follow-ups.

Practice scoring & detailed feedback.

Final interview reports.

Track usage per user:

ai_tokens_used_monthly in DB.

Set thresholds and degrade gracefully (shorter answers, fewer details) on Free plan.

yaml
Copy code

---

## `18-stripe-integration.md`

```md
# 18 – Stripe Integration (Subscriptions & Billing)

## 1. Purpose

Stripe manages:

- Plan subscriptions (Free vs Pro).
- Billing (monthly / yearly).
- Customer portal for payment methods & invoices.

The app uses **Stripe Checkout** + **Billing Portal** + **Webhooks**.

---

## 2. Plans & Mapping

Plans (at product level):

- `Free`
- `Pro Monthly`
- `Pro Annual`

Stripe:

- 1 Product: `Interview Studio Pro`
  - 2 Prices:
    - `price_pro_monthly`
    - `price_pro_annual`

Store in `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...
STRIPE_BILLING_PORTAL_RETURN_URL=https://yourdomain.com/account
3. Data Model
In Supabase profiles table, store:

stripe_customer_id TEXT

subscription_status TEXT ('free' | 'active' | 'past_due' | 'canceled')

subscription_price_id TEXT (current price)

subscription_current_period_end TIMESTAMPTZ

4. Stripe Client Setup
Create lib/stripeClient.ts:

ts
Copy code
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});
5. Checkout Session Creation
Endpoint: POST /api/billing/create-checkout-session

Input:

ts
Copy code
type CreateCheckoutBody = {
  priceId: string; // e.g. STRIPE_PRICE_PRO_MONTHLY
};
Requires authenticated user.

Behavior:

If user has stripe_customer_id, reuse it.

Else, create new Stripe customer with:

email (from Auth)

metadata: user_id (internal)

Pseudo-code:

ts
Copy code
// app/api/billing/create-checkout-session/route.ts
import { stripe } from "@/lib/stripeClient";
import { getCurrentUser } from "@/lib/auth"; // your auth helper
import { db } from "@/lib/db"; // Supabase or equivalent

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { priceId } = await req.json();

  // lookup or create customer
  const profile = await db.getProfile(user.id);
  let customerId = profile.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await db.updateProfile(user.id, { stripe_customer_id: customerId });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?upgrade=cancel`,
    subscription_data: {
      metadata: { user_id: user.id },
    },
  });

  return Response.json({ url: session.url });
}
Frontend:

“Upgrade to Pro” button calls this endpoint.

Redirect user to session.url.

6. Billing Portal
Endpoint: POST /api/billing/create-portal-session

Behavior:

Require authenticated user.

Use stripe_customer_id.

Create billing portal session, redirect.

ts
Copy code
// app/api/billing/create-portal-session/route.ts
import { stripe } from "@/lib/stripeClient";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const profile = await db.getProfile(user.id);
  if (!profile?.stripe_customer_id) {
    return new Response("No Stripe customer", { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url:
      process.env.STRIPE_BILLING_PORTAL_RETURN_URL ??
      `${process.env.NEXT_PUBLIC_APP_URL}/account`,
  });

  return Response.json({ url: session.url });
}
7. Webhook Handling
Endpoint: /api/billing/webhook (Stripe webhook)

Configure webhook endpoint in Stripe Dashboard using STRIPE_WEBHOOK_SECRET.

Listen for:

checkout.session.completed

customer.subscription.created

customer.subscription.updated

customer.subscription.deleted

Pseudo-code:

ts
Copy code
// app/api/billing/webhook/route.ts
import { stripe } from "@/lib/stripeClient";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const sig = headers().get("stripe-signature");
  const buf = Buffer.from(await req.arrayBuffer());

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response("Webhook signature verification failed", {
      status: 400,
    });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // subscription will fire separately, but you can track here if needed
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.user_id as string | undefined;
      if (userId) {
        await db.updateProfile(userId, {
          subscription_status: subscription.status,
          subscription_price_id: subscription.items.data[0]?.price.id ?? null,
          subscription_current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.user_id as string | undefined;
      if (userId) {
        await db.updateProfile(userId, {
          subscription_status: "canceled",
          subscription_price_id: null,
        });
      }
      break;
    }
    default:
      // ignore other events
      break;
  }

  return new Response("ok", { status: 200 });
}
8. Frontend Gating (Free vs Pro)
In useUserPlan hook:

ts
Copy code
export type SubscriptionStatus = "free" | "active" | "past_due" | "canceled";

export function useUserPlan() {
  const { data: profile } = useProfile(); // from Supabase

  const isPro =
    profile?.subscription_status === "active" ||
    profile?.subscription_status === "trialing";

  return {
    isPro,
    status: (profile?.subscription_status as SubscriptionStatus) ?? "free",
  };
}
Use in UI:

Show lock icons for:

Avatar mode in Mock Interview.

Negotiation Coach.

30–60–90 Plan.

If user clicks a locked feature:

Open upgrade modal.

Trigger /api/billing/create-checkout-session.

9. Error Handling
Failed Checkout Session:

Redirect to /account?upgrade=cancel.

Show friendly message.

Webhook failures:

Log errors.

Stripe will retry events; ensure idempotency (e.g., by upserting profile).

Always assume:

Frontend gating can be bypassed.

Backend must also check isPro for protected routes.

yaml
Copy code

---

If you like this structure, next we can:

- Add **API contract docs** (request/response JSON schemas) for each LLM/audio endpoint, or  
- Start a `19-api-endpoints.md` that ties Deepgram + OpenAI + Stripe into one “service map” for your Next.js backend.
::contentReference[oaicite:0]{index=0}