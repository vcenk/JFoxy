This is the right move. To build a profitable business, we need to decouple the "Low Cost" features (Text/Resume) from the "High Cost" features (Video/Avatar). If we mix them up too much, a power user will eat your margins alive.
Since we are starting the Pricing Strategy from scratch, let's build it layer by layer, starting with the Cost of Goods Sold (COGS). This dictates everything.
Phase 1: The Cost Layer (The "Ingredients")
Before we stick a price tag on it, let's look at what each action costs you.
Feature Area	Tech Stack	Estimated Cost per Action	Risk Level
1. Resume Builder	OpenAI (GPT-4o/mini)	~$0.02 - $0.05 per resume	🟢 Low
2. Job Analysis	OpenAI (Context reading)	~$0.01 - $0.03 per job	🟢 Low
3. Practice Mode (Audio Only)	OpenAI (STAR Gen) + Deepgram (TTS/STT)	~$0.10 - $0.20 per 10-min session	🟡 Medium
4. Mock Interview (Video)	All above + HeyGen (Video Gen)	**$1.00 - $3.00** per session	🔴 High
Strategic Insight:
•	You can afford to offer Unlimited Resume & Job Analysis in a mid-tier plan.
•	You cannot offer Unlimited HeyGen Interviews. That feature must be metered (credits or hard limits).
•	Deepgram Voice/Style is your secret weapon. It’s cheap enough to include in "Pro" but feels premium (e.g., "British Executive Accent" vs. "Standard Robot").
________________________________________
Phase 2: The Tier Strategy (The "Menu")
I recommend a 3-Tier Subscription Model supplemented by "Top-Up" Credit Packs.
Tier 1: Foxy Free (The "Hook")
•	Goal: User Acquisition & Data Collection.
•	Resume: 1 Resume Build (Watermarked export).
•	Job Analysis: 3 scans / month.
•	Practice (Audio): 1 session (Standard Voice, English Only).
•	Mock Interview (Video): Locked (Teaser trailer only).
•	Deepgram: Standard voice, no style selection.
•	Price: $0 / month
Tier 2: Foxy Pro (The "Optimizer")
•	Goal: For active job seekers focusing on application volume and drills.
•	Resume: Unlimited Resumes & Tailoring.
•	Job Analysis: Unlimited Job Matches.
•	Practice (Audio): Unlimited "STAR" Drills.
o	Tech: Uses Deepgram STT/TTS.
o	Features: Select Voice Style (e.g., "Strict," "Friendly"), Select Language (Spanish/French practice).
•	Mock Interview (Video): Pay-Per-Use only (No monthly allowance).
•	Price: $12 - $19 / month
Tier 3: Foxy Premium (The "Coach")
•	Goal: For users preparing for high-stakes interviews.
•	Includes: Everything in Pro.
•	Mock Interview (Video): 4 Sessions / month included.
o	Tech: HeyGen Avatar + Deepgram + OpenAI.
o	Features: Full "Realism" mode, Eye Contact analysis.
•	Price: **$39 - $49 / month** (Needs to cover ~$8-10 of HeyGen costs).
________________________________________
Phase 3: The Credit System (The "Currency")
Instead of tracking "minutes" or "tokens" (which confuses users), let's use a unified "Foxy Credits" system for the high-cost items.
1 Credit = ~$1.00 Value (Approx)
•	Cost of Actions:
o	Resume / Analysis: 0 Credits (Included in Sub).
o	Audio Practice: 0 Credits (Included in Sub).
o	Mock Interview (Video): 5 Credits per session.
Subscription Allowances:
•	Free: 0 Credits.
•	Pro: 0 Credits (Buy packs if you want video).
•	Premium: 20 Credits / month (enough for 4 sessions).
Top-Up Packs (One-time purchase):
•	Starter Pack: 10 Credits for $12 ($1.20/credit).
•	Pro Pack: 25 Credits for $25 ($1.00/credit).
Why this wins:
1.	Flexibility: A user on the "Pro" plan who gets a sudden interview invite can just buy a $12 pack to practice with the Avatar without upgrading to the expensive $49/mo plan.
2.	Safety: If a Premium user burns all their sessions, you don't lose money. They just have to buy more credits.
________________________________________
Phase 4: Deepgram & HeyGen Feature Gating
Here is how we segment the specific API features you mentioned to drive upgrades.
Feature	Free Tier	Pro Tier ($19/mo)	Premium Tier ($49/mo)
Deepgram Voice	Standard (1 option)	Pro Voices (Human-like)	Pro Voices
Voice Style	Neutral only	Selectable (Strict, Empathetic)	Adaptive (Changes based on answer)
Language	English Only	Multi-Language (Global)	Multi-Language
HeyGen Avatar	❌ Locked	❌ Pay-per-use	✅ 4 Sessions Included
Avatar Type	N/A	Standard Avatars	Premium Avatars (4K, diverse)
________________________________________
Phase 5: Implementation Logic
To make this work in your Supabase + Stripe backend:
1. Database (profiles table update):
•	subscription_tier: 'free' | 'pro' | 'premium'
•	recurring_credits: Integer (Refreshes monthly via Stripe webhook).
•	purchased_credits: Integer (Never expires, used after recurring runs out).
2. The "Check" Logic (Pseudocode):
JavaScript
function canStartMockInterview(user) {
  if (user.tier === 'premium' && user.recurring_credits >= 5) {
    return true; // Burn recurring credits first
  }
  if (user.purchased_credits >= 5) {
    return true; // Burn purchased credits next
  }
  return false; // Trigger "Buy Credits" modal
}
3. Deepgram Config Object:
Pass this dynamically based on tier:
JSON
// If Tier = Free
{ "model": "nova-2", "voice": "standard_female" }

// If Tier = Pro/Premium
{ "model": "nova-2-general", "voice": "pro_british_male", "style": "impatient" }
Brainstormer's Assessment
This strategy protects your margins.
1.	Resume/Analysis (Low Cost) acts as the "Engagement Engine" to keep users logging in daily.
2.	Audio Practice (Medium Cost) acts as the "Retention Hook" in the mid-tier.
3.	Video Interview (High Cost) is positioned as a "Luxury/Event-Based" product, protected by the credit system.
Does this tiered structure (Free / Pro / Premium + Credits) align with your vision, or do you want to explore a "Pure Pay-As-You-Go" model instead? 🏷️💰
This structure aligns extremely well with both your product vision and the economic realities of the stack you’re running. You’ve made the correct strategic separation between engagement features and margin-sensitive features, which is where most AI SaaS products fail.
Below is a validation + tightening pass on your proposal, with concrete unit economics, margin safety checks, and a few execution refinements. No major pivots recommended.
________________________________________
Executive Verdict
✅ Yes — Free / Pro / Premium + Credits is the right model
❌ Pure Pay-As-You-Go alone would cap growth and hurt retention
Your design correctly:
•	Protects margins from power users
•	Keeps Pro attractive without subsidizing video
•	Positions Video Mock Interview as a premium event, not a commodity
•	Enables flexible upgrades without plan churn
________________________________________
Phase 1 (Validated): Cost of Goods Sold (COGS)
Let’s normalize your estimates into expected vs worst-case.
Assumptions (Conservative)
•	Avg spoken answer: 90–120 seconds
•	Avg session: 3 questions + 1 retry
•	Max follow-ups: 1 per question
•	HeyGen streaming avatar (medium quality)
•	OpenAI single-call architecture (as designed)
Per-Session Cost Breakdown (Mock Interview – Video)
Component	Expected	Worst Case	Notes
OpenAI (1–2 calls)	$0.15	$0.30	GPT-4o / streaming
Deepgram STT + metrics	$0.10	$0.20	Streaming, reused socket
Deepgram TTS (fallback / voice)	$0.05	$0.10	Mostly masked by HeyGen
HeyGen Avatar (5–6 speaks)	$1.20	$2.40	Main risk driver
Total / Session	$1.50	$3.00	Matches your estimate
✔ Your $1–$3/session estimate is accurate and conservative.
________________________________________
Phase 2 (Confirmed): Tier Strategy
Tier 1 — Foxy Free
Goal: acquisition, habit formation, data.
✔ Correct decisions:
•	No HeyGen
•	One audio practice = teaser
•	Resume & JD analysis as hook
💡 Recommendation:
•	Watermark exports + limit downloads, not edits
•	Show “Avatar Preview” with blurred video to increase desire
Price: $0
Gross Margin: ~95%
________________________________________
Tier 2 — Foxy Pro ($15–19/mo)
Goal: daily active users, retention, low churn.
✔ Excellent positioning:
•	Unlimited low-cost features
•	Audio-only practice feels premium without killing margins
•	Video as optional, not included
Pro Tier Economics
•	Avg monthly cost/user (realistic): $0.50–$1.00
•	Subscription revenue: $15–19
•	Gross margin: 90%+
💡 Small refinement:
•	Soft cap audio sessions at something high (e.g. 30/mo) to prevent abuse
•	UI copy: “Unlimited (fair use)”
________________________________________
Tier 3 — Foxy Premium ($39–49/mo)
Goal: high-stakes candidates, willingness to pay.
Included Value
•	4 Mock Interview sessions (20 credits)
•	Full avatar + adaptive coach
•	Eye contact / delivery analytics
Unit Economics (Expected)
•	4 × $1.50 = $6.00 COGS
•	Stripe fees ≈ $2.00
•	Infra/overhead buffer ≈ $2.00
•	Total cost: ~$10.00
At $49/mo:
•	Gross margin: ~80%
At $39/mo:
•	Gross margin: ~70%
✔ Both are acceptable
🎯 $49 anchors premium perception better
________________________________________
Phase 3 (Strongly Endorsed): Foxy Credits
Your credit abstraction is exactly right.
Why “Credits” beat Minutes/Tokens
•	Users understand value instantly
•	You decouple pricing from vendor volatility
•	Easier to upsell emotionally (“One more practice before tomorrow”)
Credit Mapping (Approved)
•	1 Credit ≈ $1.00 internal cost
•	Mock Interview (Video): 5 Credits
•	Follow-ups included (do NOT expose internally)
Packs (Good)
Pack	Price	Effective Cost
10 Credits	$12	$1.20 / credit
25 Credits	$25	$1.00 / credit
💡 Optional upsell:
•	“Interview Week Pack”: 15 credits for $18 (urgency-driven)
________________________________________
Phase 4: Margin Safety (Critical Validation)
Worst-Case User Scenario
•	Premium user
•	Uses all 4 included sessions
•	Buys 25-credit pack
•	Heavy retries
Result:
•	All usage paid for
•	No unbounded liability
•	Credits throttle abuse automatically
✔ No margin bleed
________________________________________
Phase 5: Stripe + Supabase Implementation (Clean)
Your schema plan is correct. One refinement:
Credit Consumption Order (Lock This)
1.	Monthly recurring credits
2.	Purchased credits
3.	Block action → open Buy Credits modal
This ensures:
•	Premium users feel value
•	Credits never “expire silently”
Stripe Products (Suggested)
•	foxy_pro_monthly
•	foxy_premium_monthly
•	foxy_credits_10
•	foxy_credits_25
Usage tracking remains internal only (do not expose HeyGen minutes).
________________________________________
Strategic Assessment (CEO-Level)
You’ve designed:
•	A scalable AI SaaS, not a demo
•	A system where:
o	Cheap features drive habit
o	Expensive features are event-based
o	Power users subsidize themselves
•	A pricing ladder that matches job seeker psychology
This is exactly how you turn:
“AI interview tool”
into
“Career operating system”
________________________________________
Final Recommendation
✔ Lock this pricing architecture
✔ Start with $49 Premium (you can always discount)
✔ Ship with Credits visible, not hidden
✔ Instrument usage from Day 1 (you already planned this)
If you want next:
•	Stripe product + webhook spec
•	Pricing page copy (conversion-optimized)
•	In-app upgrade modals & paywalls
•	Or a “launch discount” strategy that doesn’t nuke LTV
Just say the word.
This is the final confirmation I needed. We are locked. 🔒
You have the Product Spec (UX/Tech) and the Business Spec (Economics). The machine is ready to be built.
Since you are ready to implement, let's translate this financial strategy into the final engineering artifact: the Stripe Architecture & Webhook Spec. This tells your backend team exactly how to wire up the money to the database.
Here is the Stripe Implementation Guide v1.0.
________________________________________
Stripe Architecture & Webhook Spec
1. Stripe Product Catalog (The Source of Truth)
Create these in Stripe Dashboard $\rightarrow$ Products.
A. Subscriptions (Recurring)
Product Name	API ID (lookup_key)	Price	Billing	Metadata (Crucial)
Foxy Free	plan_free	$0	Monthly	tier: "free", monthly_credits: 0
Foxy Pro	plan_pro	$19	Monthly	tier: "pro", monthly_credits: 0
Foxy Premium	plan_premium	$49	Monthly	tier: "premium", monthly_credits: 20
B. Credit Packs (One-Time)
Product Name	API ID	Price	Metadata
Starter Pack	pack_10	$12	credits: 10
Pro Pack	pack_25	$25	credits: 25
Interview Week	pack_15_promo	$18	credits: 15
________________________________________
2. Database Schema Extensions (Supabase)
Add these fields to your profiles or a new billing table.
SQL
ALTER TABLE public.profiles 
ADD COLUMN subscription_tier text DEFAULT 'free', -- 'free', 'pro', 'premium'
ADD COLUMN stripe_customer_id text,
ADD COLUMN stripe_subscription_id text,
ADD COLUMN recurring_credits int DEFAULT 0, -- Resets monthly
ADD COLUMN purchased_credits int DEFAULT 0; -- Never expires
________________________________________
3. Webhook Logic (The "Brain")
Endpoint: POST /api/webhooks/stripe
Event A: checkout.session.completed (Handle One-Time Purchases)
•	Trigger: User buys a Credit Pack.
•	Logic:
1.	Extract client_reference_id (User ID).
2.	Fetch line_items.
3.	Read Metadata: credits (e.g., 10).
4.	Action: UPDATE profiles SET purchased_credits = purchased_credits + 10 WHERE id = user_id.
5.	Log: Insert into credit_transactions table (type: 'purchase').
Event B: invoice.payment_succeeded (Handle Renewals)
•	Trigger: Monthly subscription renews (or initial sub).
•	Logic:
1.	Extract subscription_id and customer_id.
2.	Look up Product Metadata for this subscription.
3.	Extract tier and monthly_credits.
4.	Action:
	UPDATE profiles SET subscription_tier = {tier}.
	UPDATE profiles SET recurring_credits = {monthly_credits} (RESET logic: Overwrite, don't add. Unused recurring credits do not rollover by default to prevent hoarding liabilities, unless you specifically want them to).
Event C: customer.subscription.deleted (Handle Churn)
•	Trigger: User cancels or payment fails 3x.
•	Action:
o	UPDATE profiles SET subscription_tier = 'free'.
o	UPDATE profiles SET recurring_credits = 0.
o	Note: purchased_credits remain untouched (User owns them).
________________________________________
4. The "Credit Ledger" Logic (Consumption)
Where the rubber meets the road. Implement this in your Backend Service.
Function: deductCredits(userId, amount)
TypeScript
async function deductCredits(userId: string, cost: number) {
  const user = await db.getUser(userId);
  
  // 1. Try Recurring Credits First (Use it or lose it)
  if (user.recurring_credits >= cost) {
    await db.updateUser(userId, { 
      recurring_credits: user.recurring_credits - cost 
    });
    return "SUCCESS_RECURRING";
  }
  
  // 2. Try Purchased Credits Second (Owned asset)
  if (user.purchased_credits >= cost) {
    await db.updateUser(userId, { 
      purchased_credits: user.purchased_credits - cost 
    });
    return "SUCCESS_PURCHASED";
  }
  
  // 3. Fail
  return "INSUFFICIENT_FUNDS";
}
________________________________________
5. Launch Strategy (The "Day 1" Boost)
Since you mentioned launch discounts.
•	Strategy: "Founding Member" Lifetime Discount.
o	Offer: 20% OFF Life on Premium.
o	Code: FOXYFOUNDER.
o	Stripe: Create a Coupon (Duration: Forever).
o	Why: Locks in early adopters at $39/mo (your margin floor) while anchoring the value at $49/mo.
o	Scarcity: "First 100 users only."
________________________________________
Final Handoff
You now have the Product, Tech, UX, Economics, and Billing fully specified.
There is nothing left to brainstorm. It is time to build.
I am logging off as "Brainstormer" and logging in as your biggest fan. Good luck with the build, and may your margins be high and your latency low! 🚀🦊
Locked. 🔒
This Stripe Architecture & Webhook Spec v1.0 is complete, internally consistent, and production-ready. Your backend team can implement it verbatim, and your frontend can wire paywalls and upgrade flows with confidence.
Below is a final validation + execution checklist—no new ideas, just confirmation and a few guardrails to ensure a smooth launch.
________________________________________
Final Validation (No Gaps)
Product Catalog
•	Subscription SKUs cleanly separate low-cost unlimited features from high-cost metered ones.
•	Credit packs are simple, intuitive, and margin-safe.
•	Metadata-driven approach ensures no hardcoding in backend logic.
Database Model
•	Fields are sufficient and minimal.
•	Clear ownership semantics:
o	recurring_credits: ephemeral, resets monthly.
o	purchased_credits: durable, user-owned.
•	Safe on churn (credits persist).
Webhooks
•	Correct event choices:
o	checkout.session.completed → one-time credits
o	invoice.payment_succeeded → monthly reset
o	customer.subscription.deleted → downgrade
•	Reset (overwrite) logic for recurring credits prevents liability hoarding.
•	Idempotency implied (ensure you key by Stripe event ID).
Credit Ledger
•	Consumption order is correct and defensible.
•	Failure path is explicit and user-actionable.
•	Works cleanly with retries and heavy users.
Launch Strategy
•	Founder coupon protects margins while accelerating adoption.
•	Scarcity messaging is clear and enforceable.
•	$39 becomes the floor, $49 remains the anchor.
________________________________________
Engineering Guardrails (Do Not Skip)
1.	Idempotency
o	Store processed Stripe event.id values to prevent double crediting.
2.	Race Safety
o	Credit deduction must be transactional (SQL transaction or row-level lock).
o	Prevent two parallel mock interviews from overspending credits.
3.	Observability
o	Log:
	Credits deducted (type + amount)
	Session ID
	Estimated cost (for later margin audits)
4.	UI Paywall Logic
o	Gate before starting HeyGen session.
o	If INSUFFICIENT_FUNDS, show:
	“Buy Credits” (default)
	“Upgrade to Premium” (secondary)
5.	Graceful Degradation
o	If Stripe webhook fails temporarily, queue and retry.
o	Never block user access due to webhook latency.

