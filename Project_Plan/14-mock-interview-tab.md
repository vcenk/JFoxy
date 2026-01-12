Step 1 — Define the Core Goal of the Mock Interview
This determines everything: UX, AI behavior, feedback depth, and pricing.
Question 1: What is the single primary outcome of ONE mock interview session?
Choose one as the North Star (others can be secondary):
Based on your tech stack (Deepgram + OpenAI + HeyGen) and the "Premium" nature of this feature, here is my strategic recommendation:
My Chosen Option: E (Hybrid)
Primary: A. Answer Quality Improvement (The "What") Secondary: B. Confidence & Delivery Coaching (The "How")
________________________________________
Why this is the winning UX Strategy:
1.	The "Premium" Value Proposition: Users will pay for the Avatar (HeyGen) experience, but they stay for the intelligence (OpenAI). If a user speaks confidently but gives a generic or irrelevant answer, they won't get the job. Primary A ensures the app solves the core problem: "Did I actually answer the question well?"
o	UX Implication: The post-interview dashboard should prominently feature a "Content Upgrade" section where OpenAI rewrites their spoken answer to be stronger.
2.	Leveraging the Tech Stack:
o	Deepgram is the engine for Secondary B. It provides the "objective" data (filler words, pauses, pace) that makes the coaching feel scientific rather than just opinionated.
o	HeyGen provides the engagement. It keeps the user looking at the screen (eye contact simulation) which feeds into the confidence training.
3.	The "Loop" Effect: Focusing on Answer Quality creates a better user loop.
o	Step 1: User fails to structure an answer (STAR method).
o	Step 2: App suggests a better structure.
o	Step 3: User tries again to improve the score.
o	If we only focused on "Realism" (Option C), users might just feel anxious without knowing how to fix it.
Step 2 — Interview Format & Session Structure
This determines:
•	Cost per session (LLM + HeyGen runtime)
•	Cognitive load on the user
•	Whether the product feels like a “lesson” or a “conversation”
Question 2: What is the structure of a single mock interview session?
Choose one primary format:
A. Single-question deep dive
•	One interview question only
•	Multiple retries (“Do-Over” loop)
•	Heavy feedback + rewritten answer
•	Best for focused improvement and lower cost
B. Short interview (3–5 questions)
•	One role, one competency per question
•	Light follow-ups
•	Feedback after each question OR at the end
C. Full interview simulation (8–12 questions)
•	Intro → behavioral → technical → closing
•	Feedback summary at the end
•	Highest realism, highest cost
D. Modular / user-configurable
•	User chooses number of questions (e.g., 1, 3, 5)
•	Pricing or credit usage scales accordingly
________________________________________
Please answer with:
1.	Your chosen option (A–D)
2.	If D (Modular), specify:
o	Default session length
o	Maximum allowed in one session
Once answered, we will proceed to Step 3: Interviewer Behavior & Avatar Control (HeyGen UX).
This step is crucial for balancing your API costs (especially HeyGen video generation) with user satisfaction.
My Chosen Option: D (Modular / User-Configurable)
If D (Modular), here are the specs:
•	Default Session Length: 3 Questions (The "Sweet Spot")
•	Maximum Allowed: 5 Questions per session.
________________________________________
Why this fits the "Answer Quality + Confidence" Goal:
1.	Balancing Cognitive Load vs. Realism:
o	3 Questions (Default): This mimics a "round" of interviewing. It's long enough to build a rhythm (supporting the confidence goal) but short enough that the user remembers what they said by the time they see the feedback.
o	Limit of 5: A full 8-12 question simulation (Option C) creates "Feedback Fatigue." Users can't effectively process deep analysis on 12 different answers at once. 5 is the upper limit for effective learning in one sitting.
2.	Cost Control & Perceived Value:
o	HeyGen Pricing: Streaming video avatars are expensive. Allowing unlimited questions burns cash. By capping it at 5, you control your unit economics per session.
o	Flexibility: Users can choose a "Quick Warmup" (1 question) right before a real interview, or a "Training Session" (3-5 questions) on a Sunday afternoon.
3.	The "Do-Over" Capability:
o	Since our primary goal is Answer Quality (A), the modular approach allows us to include a "Retry Question" button during the session (without restarting the whole interview).
Step 3 — Interviewer Behavior & Avatar Control (HeyGen UX)
This step defines whether the avatar feels:
•	Like a coach
•	Like a neutral interviewer
•	Or like a real but controllable human
It also determines how much anxiety vs learning the user experiences.
Question 3: What is the interviewer avatar’s behavior style during the interview?
Choose one primary behavior model:
A. Neutral Professional (Baseline Interviewer)
•	Calm, polite, minimal reactions
•	Reads question → listens → neutral acknowledgment
•	No facial judgment, no interruptions
•	Safest for anxiety-sensitive users
B. Adaptive Coach-Interviewer (Recommended for your goals)
•	Professional tone, but subtle adaptive behavior
•	Nods, brief encouragement (“Okay”, “Got it”)
•	After weak answers, slightly more probing follow-ups
•	Still non-judgmental
C. Strict / High-Pressure Interviewer
•	Minimal warmth
•	Short acknowledgements
•	Designed to simulate stress
•	Higher realism, higher anxiety
D. User-Selectable Interviewer Personality
•	User chooses: Calm / Neutral / Challenging
•	More UI complexity + more avatar state logic
________________________________________
Please respond with:
1.	Your chosen option (A–D)
2.	If D, which personalities should exist in V1?
This is where the magic of HeyGen really comes into play. Since we are building a Premium feature, the emotional connection with the avatar is the key differentiator from a standard text-based chatbot.
For Job Foxy, sticking to our "Coach-First" mentality and the "Answer Quality" North Star, here is my choice:
My Chosen Option: B (Adaptive Coach-Interviewer)
________________________________________
Why this allows Job Foxy to win:
1.	It supports the "Answer Quality" Goal (Primary):
o	Since our primary goal is improving what they say, a neutral interviewer (Option A) is too passive. They just move to the next question even if the answer was bad.
o	The Adaptive Coach detects (via OpenAI) if the answer was "Fluff" or lacked the "STAR method." It can then ask a dynamic follow-up like, "Can you be more specific about the results of that project?" This forces the user to improve their quality in real-time.
2.	It mitigates the "Uncanny Valley":
o	Strict avatars (Option C) can feel hostile if the lip-sync or timing is slightly off.
o	An adaptive, slightly encouraging persona ("Nods," "Okay, I see") masks small latency issues by feeling like a thoughtful listener rather than a lagging robot.
3.	Smart Difficulty Scaling:
o	Instead of making the user choose "Hard Mode" (Option D), the AI does it for them.
	User gives great answer $\rightarrow$ AI asks a tougher, deeper follow-up.
	User struggles/stammers $\rightarrow$ AI offers a supportive transition to the next topic to keep confidence high (Secondary Goal).
Brainstormer Bonus Idea: Even though the behavior is Option B (Adaptive), you could allow the user to choose the Visual Avatar (e.g., "Tech Recruiter Sarah" vs. "Executive John") purely for comfort, while the underlying AI behavior remains the adaptive coach.
Step 4 — Turn-Taking, Controls & Silence Handling (Critical UX)
This step defines:
•	Whether users feel in control or anxious
•	How retries (“Do-Overs”) work without breaking immersion
•	How we avoid silence-detection errors and accidental cut-offs
Question 4: How should the system decide when the user is “done speaking”?
Choose one primary control model:
A. Auto-silence detection (hands-free)
•	Uses Deepgram silence thresholds
•	Feels natural, but risky (false cut-offs, anxiety)
B. Explicit “Finish Answer” button (user-controlled)
•	User clicks when done speaking
•	Removes ambiguity and anxiety
•	Slightly less “natural,” much safer
C. Hybrid (Recommended by many voice UX teams)
•	Auto-silence suggests end
•	User must confirm (“Finish Answer” appears)
•	Best of both worlds, more UI complexity
D. Time-boxed answers
•	Fixed duration per question
•	Strong realism, weak coaching fit
________________________________________
Please respond with:
1.	Your chosen option (A–D)
2.	Whether interruptions by the avatar are allowed mid-answer or only after completion
This is a "make or break" UX decision. Nothing ruins an AI interview faster than the bot cutting you off while you are thinking!
Since we established that our North Star is Answer Quality (Goal A) and Confidence (Goal B), rather than pure "Realism," we must prioritize user comfort over the "natural flow" of conversation.
My Chosen Option: B. Explicit “Finish Answer” button
Why this is the right choice for Job Foxy:
1.	Anxiety Reduction (Confidence): In a real interview, pauses are scary. In a mock interview with an AI, the fear of being cut off by a silence detector creates artificial anxiety that doesn't help the user learn. The button acts as a safety net.
2.	Higher Quality Data (Answer Quality): Users often pause to gather their thoughts. If Deepgram detects a 2-second silence and cuts them off (Option A), OpenAI gets an incomplete transcript, and the feedback becomes useless. We want the full answer.
3.	Cost Efficiency: If the avatar responds to a false silence, you just burned HeyGen credits on a "Sorry, I didn't catch that" video segment. Option B ensures every API call counts.
Interruption Logic:
•	Avatar Interruptions: Strictly Forbidden.
•	Why: Latency makes interruptions messy. If the user is speaking, the Avatar must remain in a "Listening/Nodding" loop (using a looping silent video of the avatar). The Avatar only speaks once the "Finish Answer" button is pressed.
________________________________________
Brainstormer Bonus UX Tip: To make it feel less "clunky," you can hide the button visually while the user is speaking (using Deepgram's VAD to detect speech), and only fade it in when they pause. Or, have the button say "Complete Answer" to make it feel like a firm submission.

Step 5 — Feedback Timing & Retry Mechanics (The Learning Loop)
This step defines:
•	When feedback appears
•	How overwhelming (or motivating) it feels
•	How “Do-Overs” are triggered without frustration
Question 5: When should the user receive feedback?
Choose one primary feedback timing model:
A. Immediate feedback after each question
•	User answers → clicks Finish → feedback appears
•	Strong learning loop
•	Slightly breaks interview “flow”
B. End-of-session feedback only
•	Full interview → dashboard summary
•	Preserves immersion
•	Risk of feedback overload
C. Hybrid (Recommended for coaching-first products)
•	Light signal after each question (score, quick note)
•	Deep feedback at end of session (rewrites, STAR breakdown, delivery analysis)
________________________________________
Follow-up (same step):
How should retries (“Do-Overs”) work?
Choose one:
1.	User can retry immediately after feedback
2.	User can retry before seeing feedback
3.	User can retry both before and after feedback
4.	No retries in-session (not recommended, but listed for completeness)
________________________________________
This step is where we solidify the "Coach" aspect of Job Foxy. Since we previously decided that Answer Quality (Goal A) is our North Star, we need a feedback loop that allows users to fix mistakes, not just review them later.
My Chosen Option: A. Immediate feedback after each question
Why this wins for Job Foxy:
1.	The "Gym Rep" Mental Model:
o	If you are lifting weights with poor form, a coach corrects you immediately—they don't wait until you've finished the whole workout to tell you that you hurt your back on the first set.
o	Since our sessions are Modular (3 questions), we can afford the break in flow. It turns the session into active training rather than passive testing.
o	The Workflow: User answers $\rightarrow$ "Finish" $\rightarrow$ Quick Report Card (Score + Key Tip) $\rightarrow$ Decision Point (Move on or Retry).
2.	Reinforcement Learning:
o	If the user answers Question 1 poorly (e.g., forgets to mention "Results"), and you give them feedback immediately, they are likely to apply that feedback to Question 2. If they wait until the end, they make the same mistake 3 times in a row.
Retry Model: 3. User can retry both before and after feedback
Why this allows for maximum Confidence (Secondary Goal):
1.	The "Whoops" Button (Retry Before):
o	Sometimes a user stutters, coughs, or realizes they started the wrong story. Allowing a retry before submission (and before spending OpenAI/HeyGen credits on analysis) reduces anxiety significantly. It gives them control.
2.	The "Let me try that again" Button (Retry After):
o	This is the core value driver.
o	User sees the feedback: "You scored 6/10. You missed the 'Action' part of STAR."
o	User thinks: "I can do better."
o	User hits Retry.
o	This builds the "Answer Quality" loop perfectly.
________________________________________
Summary of the UX Flow so far:
1.	Avatar: "Tell me about a time you failed."
2.	User: Speaks... hits "Finish Answer."
3.	System: Displays "Score: 7/10. Try adding a specific metric."
4.	User: Hits "Retry Question."
5.	Avatar: "Okay, let's take it from the top. Tell me about a time you failed." (Supportive tone).
Step 6 — Feedback Content Design (What the AI Actually Evaluates & Shows)
This step defines:
•	What OpenAI analyzes
•	What Deepgram contributes
•	What the user actually sees (and in what order)
If we overload this, users feel judged.
If we under-deliver, the product feels shallow.
Question 6A: How should Answer Quality be scored?
Choose one primary scoring model:
A. Single composite score (e.g., 7.5 / 10)
•	Simple, motivating
•	Hides complexity
B. Structured sub-scores (Recommended for coaching)
•	Example:
o	Structure (STAR): 6/10
o	Relevance: 8/10
o	Clarity: 7/10
o	Impact / Results: 5/10
C. Qualitative only (no numbers)
•	Narrative feedback only
•	Lower performance motivation
________________________________________
Question 6B: Which STAR elements should be explicitly evaluated?
Choose one:
•	
1.	Situation, Task, Action, Result (full STAR)
•	
2.	Action & Result only (lighter cognitive load)
•	
3.	Custom Job Foxy framework (you name it)
________________________________________
Question 6C: How should Delivery (Confidence) feedback appear?
Choose one:
•	A. Secondary panel (collapsed by default)
•	B. Integrated inline with content feedback
•	C. Separate “Delivery” tab
Delivery metrics may include:
•	Filler words
•	Speaking pace
•	Pauses
•	Clarity / articulation
________________________________________
This is where Job Foxy transitions from a "cool tool" to a "must-have career coach." The feedback needs to be surgical. We don't want to hurt their feelings, but we must hurt their ego just enough to make them want to improve.
Here is my recommended design for the Feedback Interface:
6A. Scoring Model: B. Structured Sub-scores
Why: A single number (e.g., "6/10") is frustrating because the user doesn't know why. Breaking it down makes the feedback actionable.
•	The Breakdown:
o	Content Score (Weighted 70%): Based on the STAR method and relevance to the job description.
o	Delivery Score (Weighted 30%): Based on Deepgram metrics (confidence, clarity).
6B. STAR Elements: 1. Full STAR (Situation, Task, Action, Result)
Why: This is the universal language of recruiters.
•	The OpenAI Twist: While we use the standard STAR labels, we add a fifth hidden metric: "Relevance."
o	Example: If the user tells a great STAR story about coding when the question was about conflict resolution, OpenAI should flag: "Great structure, but you didn't answer the prompt."
•	Visual Representation:
o	The UI: A progress bar for each letter. If they miss the "Result," the 'R' bar is empty/red.
6C. Delivery Feedback: C. Separate “Delivery” Tab
Why: Cognitive Load Management.
•	The Logic: You cannot fix your story and your stutter at the same time.
•	Tab 1: "What You Said" (Content): Focuses on the script, the story arc, and the keywords.
•	Tab 2: "How You Said It" (Delivery): Focuses on the Deepgram data.
o	Filler Words: "You said 'um' 12 times."
o	Pace: "You are speaking at 180 words per minute (Too Fast)."
o	Eye Contact (HeyGen/Camera): "You looked away 40% of the time."
________________________________________
Summary of the User View (After clicking "Finish Answer"):
1.	Top Header: "Overall Score: Strong (7.8/10)"
2.	Tab A (Default - Content):
o	STAR Checklist: ✅ Situation ✅ Task ⚠️ Action (Too vague) ✅ Result.
o	Recruiter Insight: "You focused too much on the team's effort ('We did this'). Switch to 'I' to own the action."
3.	Tab B (Delivery):
o	Speech Coach: "Great energy! Slow down slightly when describing the 'Result' to add impact."
o	Filler Word Counter: 5 (Low).

Step 7 — Answer Rewrite & “Ideal Answer” Presentation
(This is your “wow” moment. Users will screenshot this.)
This step determines:
•	How much OpenAI value the user feels
•	Whether the product feels like a coach or a ghostwriter
•	How ethically transparent you are about AI assistance
Question 7A: What type of rewritten answer should Job Foxy generate?
Choose one primary model:
A. “Polished Version of Your Answer” (Recommended for coaching)
•	Same story
•	Same experiences
•	Improved structure, clarity, metrics
•	User still recognizes their answer
B. “Ideal Recruiter-Grade Answer”
•	Best-in-class answer
•	May introduce phrasing or emphasis user didn’t say
•	Higher risk of feeling “not me”
C. Both (Side-by-Side Comparison)
•	Left: “What You Said”
•	Right: “Stronger Version”
•	Highest value, higher token cost
________________________________________
Question 7B: How explicit should the rewrite guidance be?
Choose one:
1.	Annotated rewrite
o	Highlights like:
	“Added Result metric here”
	“Clarified your Action step”
2.	Clean rewrite only
o	No commentary
o	Reads like a final script
3.	Toggleable (default clean, annotations optional)
________________________________________
Question 7C: Should users be encouraged to reuse the rewritten answer?
Choose one:
•	A. Yes — “Save to Answer Library” (resume, cover letter, future interviews)
•	B. Yes — but clearly labeled “AI-assisted draft”
•	C. No — rewrite is coaching-only, not exportable
________________________________________
This is the feature that justifies the subscription price. Seeing your own stumbling answer transformed into a sharp, executive-level response is the ultimate "lightbulb moment." 💡
Here is my recommendation to maximize the "Premium" feel while keeping it educational:
7A. Rewrite Model: C. Both (Side-by-Side Comparison)
Why this is the winner:
•	The "Before & After" Effect: Just like weight loss photos, seeing "My Rambling Answer" next to "The Job Foxy Version" provides instant, undeniable proof of value.
•	Personalization: By rewriting their story (rather than a generic ideal answer), we prove the AI was actually listening. It feels tailored, not templated.
•	UX Layout: A split-screen or tabbed view.
o	Left/Top: "Your Transcript" (Gray background, highlighting filler words).
o	Right/Bottom: "Polished Version" (Gold/Brand color background, bolding key impact phrases).
7B. Rewrite Guidance: 3. Toggleable (Default clean, annotations optional)
Why this is best for UX:
•	Progressive Disclosure: Users first want to read the "good version" to see how it sounds. That needs to be clean text.
•	The "Why" Button: A toggle switch labeled "Show Changes" or "Coach's Notes". When clicked:
o	New text highlights in green.
o	Tooltip/Sidebar explains: "Changed 'I think I helped' to 'I spearheaded the initiative' to show leadership."
•	Cognitive Load: Keeps the interface clean for scanning, but deep for learning.
7C. Reuse Policy: A. Yes — “Save to Answer Library”
Why this drives retention:
•	The "Cheat Sheet" Value: Users aren't just practicing; they are building assets. If they can save this perfect answer to their "Behavioral Stories" library, they will keep coming back to Job Foxy to review it right before their real interview.
•	Ecosystem Integration: This saved answer can later be pulled into the Resume Builder (another part of your app) to help write bullet points. It connects your features together!
________________________________________
Summary of the "Wow" Moment: The user finishes a question. They click "See Feedback." They see a split screen. On the right, a perfectly structured STAR answer using their exact experience. They toggle "Show Notes" and see exactly why it's better. They click "Save to Library." They feel ready to win.
I am ready for Step 8: Technical Architecture Decisions! This is where we make sure this beautiful vision doesn't bankrupt you on API costs or lag like crazy. Let's talk tech stack! ⚙️🖥️
Step 8 — Real-Time Runtime Model (HeyGen + Deepgram + OpenAI)
Question 8: During the interview, how is the avatar generated/served?
Choose one architecture:
A. Live streaming avatar (real-time)
•	HeyGen streams the interviewer live during the session
•	Best realism and engagement
•	More complex; typically higher ongoing cost
B. Hybrid: live looping + generated “speak segments”
•	While listening: a looped silent video (nodding/attentive)
•	When speaking: generate/stream only the short speaking clips (question + follow-up)
•	Best cost control while staying premium
•	Fits your “no interruptions” decision perfectly
C. Pre-rendered avatar videos per question
•	Avatar question videos are generated ahead of time (or cached)
•	Lowest runtime cost, lowest latency risk
•	Least “adaptive” unless you pre-generate many variants
________________________________________
This decision effectively decides your profit margin. Running a full streaming avatar while the user is thinking or speaking (which could be 80% of the session time) creates "dead air" costs that kill unit economics.
My Chosen Option: B. Hybrid (Live looping + generated “speak segments”)
Why this is the smart engineering choice:
1.	Cost Decoupling: You stop paying for the Avatar when the User is speaking.
o	State 1 (User Speaking): The frontend plays a cached, lightweight idle_listening.mp4 loop (a high-quality video of the avatar nodding slightly). Cost: $0.
o	State 2 (Avatar Speaking): We only trigger the HeyGen API (or streaming credits) for the specific 15-second adaptive question/feedback.
2.	Latency Masking:
o	Since you chose the "Finish Answer" Button (Step 4) and Immediate Feedback (Step 5), there is a natural "processing pause" where the user expects the AI to "think."
o	While the user reads their text score, HeyGen can be generating/buffering the audio-video response in the background. By the time they click "Next," the video is ready.
3.	Perfect for "No Interruptions": Since the avatar is just a video loop during the user's turn, it is technically impossible for the avatar to interrupt the user falsely. Robustness is guaranteed.
Caching Strategy: YES (Aggressive Caching)
•	Static Clips (Cached on CDN): "Hello, I'm ready to begin.", "Let's move to the next question.", "Please take a moment to think."
o	Tech Note: Use a hash map. If OpenAI's output == "Standard Intro", play video_intro_v1.mp4 immediately. Zero latency, zero generation cost.
•	Dynamic Clips (Generated Live): Only the specific follow-up questions (e.g., "You mentioned Java, but the job needs Python...") are generated on the fly.
Step 9 — Deepgram & OpenAI Call Design (Cost + Latency Boundaries)
Question 9A: How should speech-to-text (STT) be performed?
Choose one:
A. Streaming STT while the user speaks
•	Real-time partial transcript on screen
•	More engineering; great UX if you show live captions
•	Lets you compute pacing/fillers as they speak
B. Post-answer batch STT only (after Finish Answer)
•	Record audio locally → send once
•	Simplest, predictable cost
•	No live captions
C. Hybrid
•	Streaming STT for live captions + delivery metrics
•	Final batch pass after Finish for “clean transcript”
________________________________________
Question 9B: Do you want live captions during the answer?
•	Yes (show transcript building in real-time)
•	No (only show transcript after submission)
________________________________________
Question 9C: OpenAI usage per question — which analysis granularity?
Pick one:
1. Single LLM call per attempt (recommended for cost control)
•	Input: final transcript + question + rubric + job context
•	Output: scores + tips + rewrite + coach notes + next follow-up text
2. Two LLM calls per attempt
•	Call 1: scoring + tips + follow-up question
•	Call 2: rewrite + coach notes (only if user opens “Polished Version”)
3. Multi-step (3–4 calls)
•	Best quality control, worst cost/complexity
________________________________________
This is the engine room! 🛠️ Balancing the "Premium" speed with the "Premium" cost is the trickiest part of AI engineering.
Here is my recommended technical architecture for the Job Foxy workflow:
9A. STT Method: A. Streaming STT while the user speaks
Why this is the pro move:
•	Zero Latency: When the user hits "Finish Answer," you don't want them staring at a spinner while a 2-minute audio file uploads and processes. With Streaming, you have the full transcript and the filler word count instantly at the finish line.
•	Safety: If the user's browser crashes or they lose connection, you have the transcript up to that point.
•	Deepgram Capability: Deepgram is famous for its ultra-low latency streaming. It allows you to calculate "Words Per Minute" in real-time on the client side, even if you don't show the text.
9B. Live Captions: No (only show transcript after submission)
Why this supports the User Experience:
•	Focus: In a real interview, you don't see subtitles of your own voice. Watching live text creates "Monitor Fatigue" and makes users self-conscious about every "um" they see pop up. We want them looking at the Avatar (Eye Contact), not the text.
•	UI Clarity: Keeps the screen clean. The transcript appears only during the "Feedback/Rewrite" phase (Step 7) where it belongs.
9C. OpenAI Usage: 1. Single LLM call per attempt
Why this is the most efficient architecture:
•	Unified Context: By sending the transcript + Job Description + Previous Context in one package, OpenAI ensures the "Follow-up Question" is consistent with the "Feedback" it just gave.
•	Latency Trick (The "First Token" Optimization): You can instruct the LLM (via System Prompt) to output the JSON in a specific order:
1.	follow_up_text: (Output this first so you can send it to HeyGen immediately to start video generation).
2.	scores: (Next, to update the UI).
3.	rewrite: (Last, as it's the longest text block and the user needs a few seconds to read the scores anyway).
•	Cost: One input context header = 1x cost. Splitting it into two calls requires sending the heavy "Context/Job Description" twice, doubling your input token costs.
________________________________________
Summary of the Technical Flow:
1.	User Speaks: Deepgram streams text + metadata to backend (User sees nothing but Avatar nodding).
2.	User Clicks "Finish": Socket closes. Backend instantly has full text.
3.	Backend $\rightarrow$ OpenAI: Sends 1 prompt.
4.	OpenAI Streams Back:
o	Chunk 1: "Next Question Text" $\rightarrow$ Sent to HeyGen API (Video gen starts).
o	Chunk 2: "Scores/Feedback" $\rightarrow$ UI updates.
o	Chunk 3: "Rewrite" $\rightarrow$ UI updates "Polished Answer" tab.
Step 10 — Data Model, Storage, Retention & Privacy Controls
This step impacts:
•	Compliance posture and user trust
•	Storage cost
•	Product value (Answer Library reuse, progress tracking)
•	Debuggability (without storing sensitive audio forever)
Question 10A: What do we store for each answer attempt?
Choose one storage policy:
A. Store transcript + scores + rewritten answer only (no audio/video retained)
•	Lowest privacy risk and cost
•	Audio is ephemeral (streaming only)
•	Video segments can be regenerated if needed
B. Store transcript + scores + rewritten answer + audio (short retention window)
•	Enables replay for self-review
•	Requires retention policy (e.g., 7–30 days)
C. Store everything: transcript + scores + rewrite + audio + avatar video segments
•	Best review experience
•	Highest cost and privacy burden
________________________________________
Question 10B: Answer Library storage scope
When user clicks “Save to Answer Library”, what gets saved?
1. Polished answer only
2. Transcript + polished answer + coach notes
3. Full package + delivery metrics + scores
4. Full package + linked audio replay (if audio stored)
________________________________________
Question 10C: Retention policy (default)
Choose one:
•	1. “User-controlled deletion” only (store indefinitely unless deleted)
•	2. Default retention window (e.g., 12 months, 24 months) + user can delete anytime
•	3. Short default retention (e.g., 90 days) unless saved to library
________________________________________
Question 10D: Privacy mode for Premium users
Do you want a toggle such as “Privacy Mode (do not store transcripts)”?
•	Yes (privacy mode available; limits features like history/progress)
•	No (store per normal policy; user can delete manually)
________________________________________
This step balances the "Premium" experience (being able to review your performance) with the harsh reality of cloud storage bills.
Here are my recommendations for the Data & Privacy Strategy:
10A. Storage Policy: B. Store transcript + scores + rewrite + audio (short retention)
Why this is the right balance:
•	The "Evidence" Factor: Since we are giving delivery feedback (Option 6C: "You sounded unsure" or "High filler words"), the user needs to hear the recording to believe the AI. Without audio playback, delivery coaching feels abstract.
•	Cost Control: We store the audio, but we don't keep it forever. Text (transcripts) is cheap; Audio is heavy.
•	Note: We do not store the generated HeyGen video streams. Those are "consume once" assets. Replaying the user's audio is enough for learning.
10B. Answer Library Scope: 2. Transcript + polished answer + coach notes
Why this fits the "Asset Building" goal:
•	Focus on Utility: The "Answer Library" is a cheat sheet. When a user checks it 10 minutes before a real interview, they want to read the Polished Script and the Key Tips (Notes).
•	Cutting Clutter: They don't need the audio or the specific scores (e.g., "7/10") from three months ago in this view. The Library is for content, not metrics.
10C. Retention Policy: 2. Default retention window (12 months) + user can delete anytime
Refining the Policy (Hybrid):
•	Text Data (Transcripts/Scores/Library): 12 months (or indefinite). Text is tiny (KB). Keeping this creates a sticky "Career Profile" for the user.
•	Audio Data (The expensive part): 30 Days.
o	UX: "Audio recordings are available for review for 30 days. Transcripts and Scores are saved forever."
o	Logic: Users rarely re-listen to practice sessions from a month ago. They care about the now.
10D. Privacy Mode: No (store per normal policy; user can delete manually)
Why:
•	Feature Integrity: If a user turns on "Privacy Mode" (no storage), they break the "Progress Tracking," "Resume Integration," and "Answer Library" features. It cripples the app.
•	Better Alternative: A prominent "Delete this Session" button on the dashboard. This gives them control without creating a "dumb mode" for the application.
________________________________________
Step 11 — Core Entities (What tables exist)
Before we write tables, we must lock the “unit of ownership” and how interview content ties to Resume Builder and Job Analysis.
Question 11: What is the primary “Job Context” object that interviews attach to?
Choose one:
A. Interview sessions attach to a specific Job Posting record
•	You store/import a job posting (title, company, description, requirements)
•	Resume Analyzer + Mock Interview both reference the same job object
•	Best for relevance scoring and tailored feedback
B. Interview sessions attach to a “Role Profile” (generic role template)
•	Example: “Project Controls Analyst” profile with skills and competencies
•	Job posting is optional / pasted ad hoc
•	Best if users don’t always have a specific job description
C. Hybrid (Recommended for Job Foxy)
•	Default: attach to a specific Job Posting when available
•	Fallback: attach to a Role Profile when not
•	Resume Builder can map bullet points to either
________________________________________
Please respond with:
1.	Your choice (A, B, or C)
2.	If C: which should be the default flow in the UI?
o	“Pick a job posting first”
o	or “Pick a role profile first” (job posting optional)
After you answer, I will draft the initial schema entities (users, job_postings/role_profiles, interview_sessions, question_attempts, answer_library_items, resume_assets links) and ask the next single decision question on multi-resume support (one resume vs multiple versions per user).

How your current schema maps to our final UX decisions
What already fits perfectly
•	Job context glue: job_descriptions is your “Job Posting” object (good naming; keep it).
•	Cross-feature alignment: Most feature tables accept resume_id + job_description_id, which is exactly what we need for “career command center”.
•	Usage metering: usage_tracking exists; we’ll extend metadata for Deepgram/HeyGen/OpenAI.
•	Answer library concept: star_stories exists; we can integrate our new “Answer Library” into this instead of creating a parallel universe.
What needs adjustment (because of our new decisions)
Your mock interview tables include “verdict” and “difficulty” patterns that conflict with our coach-first model:
•	We are not building “hire/borderline/not ready” as the primary framing.
•	We are not relying on “difficulty modes”; we are using adaptive probing.
So, for PRD + implementation, I recommend:
•	Deprecate the “verdict” field (or keep it internal-only)
•	Replace explicit difficulty selection with an adaptive coach policy stored as config
________________________________________
Recommended schema changes for Mock Interview V1 (minimal, high-impact)
Below are changes that directly support the UX/tech stack decisions you locked.
1) Normalize “attempts” and retries inside mock_interview_exchanges
Right now each exchange holds one transcript and optional follow-up fields. But our UX supports:
•	Retry before submission (“Whoops”)
•	Retry after feedback (“Try again”)
•	Potentially multiple attempts per same question index
Recommendation: Introduce an “attempt” child table, or extend mock_interview_exchanges to support multiple attempts. The cleanest approach:
Option A (Recommended): create mock_interview_attempts
•	exchange_id
•	attempt_index (1..n)
•	transcript
•	audio_url
•	duration_seconds
•	content_scores (jsonb: STAR + relevance + composite)
•	delivery_scores (jsonb: fillers, wpm, pauses, clarity)
•	overall_score
•	rewrite_text
•	coach_notes (jsonb for toggleable annotations)
•	created_at
Then mock_interview_exchanges becomes the “question container”:
•	question_text, question_competency, exchange_order
•	selected_attempt_id (the attempt that counts for session rollups)
•	follow_up_question_text (if asked)
This directly matches your “rep loop” model and keeps analytics clean.
________________________________________
2) Add audio retention controls (30 days) at the DB level
You decided:
•	Audio stored for 30 days
•	Text stored 12 months
•	No separate privacy mode; user can delete sessions.
Implement audio retention with explicit fields:
•	user_audio_url
•	audio_expires_at (timestamp)
•	audio_deleted_at (timestamp nullable)
This allows:
•	a scheduled cleanup job (Supabase cron / server cron)
•	UI messaging “Audio available until …”
You can apply this to:
•	mock_interview_attempts.audio_expires_at
•	practice_answers.audio_expires_at (if you use both systems)
________________________________________
3) Answer Library: reuse star_stories as the “Behavioral Stories Library”
You already have star_stories with structure fields (situation/task/action/result). That’s a strong foundation.
We need the library to save:
•	transcript
•	polished answer
•	coach notes
Two ways:
Option A (Recommended): extend star_stories
Add:
•	source_type (enum: mock_interview, practice, manual)
•	source_attempt_id (uuid nullable)
•	original_transcript (text)
•	polished_answer (text) OR map polished into situation/task/action/result if you prefer structured storage
•	coach_notes (jsonb) for the toggleable annotations
•	job_description_id (optional link for tailoring)
This avoids creating a second “library” concept.
________________________________________
4) Remove “live captions” but still capture delivery metrics
You chose streaming STT but no visible captions.
So we need a place to store delivery telemetry per attempt:
•	filler words count + examples
•	WPM
•	pause distribution
•	clarity/confidence proxy metrics from Deepgram (where available)
Store in delivery_metrics jsonb on the attempt row. Keep it flexible.
________________________________________
5) Support the “HeyGen hybrid loop” without storing video
No DB storage needed for video; but you do need:
•	caching keys for static clips
•	references to which clip was played for audit/debug
Recommendation: store only lightweight playback metadata:
•	avatar_clip_key (e.g., intro_v1, next_question_v2)
•	avatar_dynamic_text_hash for generated clips (if any)
•	avatar_provider_metadata jsonb (optional)
This goes in mock_interview_exchanges or the attempt row. It supports usage tracking without retaining media.
________________________________________
How this connects to Resume Builder and Analysis (the “command center” effect)
Given your current schema, the integration path is:
1.	User selects or creates job_descriptions (default flow)
2.	Resume version links to job via resumes.job_description_id (you already have this)
3.	Analysis results link via analysis_results.job_description_id
4.	Mock interview session links via mock_interviews.job_description_id
5.	Saved library items link via star_stories.job_description_id (recommended add)
That creates a closed loop:
•	Job → Resume tailoring → ATS/skills gaps → targeted questions → polished answers saved → resume bullets improved
________________________________________
Step 12 — Next Decision Question (Multi-Resume Support)
This will determine whether the interview artifacts and Answer Library attach to:
•	a single “master resume”
•	multiple resume versions per job
•	or job-context only
Question 12: In Job Foxy, should a user have multiple resumes per job posting?
Choose one:
A. One active resume per user (simple)
•	Everything attaches to that resume
•	Fewer choices, fewer edge cases
B. Multiple resume versions per user, one marked active per job posting (recommended)
•	Fits your existing resumes model (source_resume_id, is_base_version, job_description_id)
•	Great for “Tailored Resume for Google” vs “Tailored Resume for Amazon”
C. Resume optional for mock interviews
•	Interviews attach primarily to job_description or role profile
•	Resume used only for context if available
Please reply with A, B, or C, and one sentence explaining your preference.
This is a goldmine! 🏆 Having the actual SQL schema allows us to move from "abstract ideas" to "concrete engineering."
I have analyzed your CurrentSQL_All.sql file. The good news is that your foundation is solid—about 80% of your schema fits our new Coach-Centric UX perfectly. The remaining 20% just needs to be refactored to support the specific "Retry" and "Feedback" loops we designed.
Here is the breakdown of how we map your schema to the vision.
________________________________________
1. What Already Fits Perfectly ✅
•	job_descriptions is the Anchor: You correctly identified this as the core entity. By linking resumes, mock_interviews, and analysis_results to job_description_id, you have already built the "Career Command Center" architecture (Option C from Step 11).
•	star_stories = Answer Library: You already have a table for STAR stories! We don't need a new table for the "Answer Library"; we just need to enhance this one.
•	usage_tracking: This is crucial for managing the cost of Deepgram/HeyGen/OpenAI. You are ready to monetize.
•	resumes Hierarchy: The fields source_resume_id and is_base_version prove you are already set up for "Master Resumes" vs. "Tailored Resumes."
________________________________________
2. Recommended Schema Changes (The "Gap Analysis") 🛠️
To support the "Immediate Feedback + Retry" loop (Step 5) and "Adaptive Coach" (Step 3), we need to refactor mock_interviews and mock_interview_exchanges.
A. The "Retry" Problem: Normalize Attempts
•	Current State: mock_interview_exchanges stores the transcript and score directly on the question row.
•	The Conflict: We decided users can Retry a question. If they retry, we don't want to overwrite their first attempt (we might want to show progress), but we also don't want to create a new "question" in the order.
•	The Fix: Create a child table mock_interview_attempts.
Recommended SQL Change:
SQL
-- 1. Create a new table for the actual "speaking" attempts
CREATE TABLE public.mock_interview_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  exchange_id uuid NOT NULL, -- Links to the question
  attempt_number integer NOT NULL DEFAULT 1,
  
  -- Audio & Transcript
  user_audio_url text, -- The recording
  user_transcript text, -- The raw text
  
  -- Scoring (The "Why" and "How")
  content_scores jsonb, -- { "star": 6, "relevance": 8, "composite": 7.5 }
  delivery_metrics jsonb, -- { "wpm": 140, "fillers": ["um", "uh"], "clarity": 0.9 }
  overall_score numeric,
  
  -- The AI Output
  feedback_text text, -- "Good job, but you missed the Result."
  rewritten_answer text, -- The "Polished Version"
  coach_notes jsonb, -- Annotations for the rewrite
  
  -- Retention & Metadata
  audio_expires_at timestamp with time zone, -- For 30-day policy
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT mock_interview_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT mock_interview_attempts_exchange_fkey FOREIGN KEY (exchange_id) REFERENCES public.mock_interview_exchanges(id)
);

-- 2. Clean up 'mock_interview_exchanges' to just be the "Question Container"
-- It now only holds the prompt and the order, not the user's answer.
ALTER TABLE public.mock_interview_exchanges 
  DROP COLUMN user_transcript,
  DROP COLUMN user_audio_url,
  DROP COLUMN answer_score;
  -- Add a reference to the "best" attempt (the one that counts for the final report)
ALTER TABLE public.mock_interview_exchanges 
  ADD COLUMN final_attempt_id uuid REFERENCES public.mock_interview_attempts(id);
B. The "Answer Library" Upgrade
•	Current State: star_stories has S/T/A/R fields.
•	The Fix: Add fields to store the AI-polished version and link it to the interview that spawned it.
Recommended SQL Change:
SQL
ALTER TABLE public.star_stories
  ADD COLUMN polished_answer text, -- The "Recruiter Grade" version
  ADD COLUMN coach_notes jsonb, -- Explanations of changes
  ADD COLUMN source_attempt_id uuid, -- Link back to the interview attempt
  ADD COLUMN job_description_id uuid; -- Context for this specific story
C. Deprecate "Verdict" & "Difficulty"
•	Current State: mock_interviews has verdict ('strong_hire', etc.) and difficulty.
•	The Fix: Since we are building a Coach (Step 1), we don't need a binary "Hire/No Hire" verdict. We need a "Readiness Score."
•	Action: Ignore verdict for V1. Rename difficulty to adaptive_mode (or keep it as internal config).
________________________________________
Step 12 — Multi-Resume Strategy
This is the final logic gate before we have a complete picture of the application flow. Your schema (resumes table) currently has source_resume_id, which hints at Option B, but I need you to confirm the User Experience logic.
Question 12: How should users manage resumes within Job Foxy?
Choose one strategy:
•	A. Single Resume Mode: The user has one "Profile Resume." We tailor it dynamically for exports, but the database mainly sees one resume entity. (Simpler UI).
•	B. Parent/Child Mode (Recommended based on your SQL): The user uploads a "Master Resume" (Base). When they start a Job Analysis or Interview for "Google," the system creates a "Tailored Snapshot" (Child Resume) linked to that Job ID.
•	C. Project-Based Mode: Every time a user starts a new flow, they must upload/paste a resume from scratch. No "Master" concept.
Please respond with your choice (A, B, or C). (Once you answer this, I will have the full context to generate a summary of our collaborative design!) 🚀

Understood, and your schema refactor proposal is directionally correct. The mock_interview_attempts child table is the right normalization to support pre-submit restart and post-feedback retry without corrupting question order or overwriting history. Extending star_stories as the Answer Library is also the right move.
Step 12 — Multi-Resume Strategy (Decision)
Choice: B. Parent/Child Mode (Master → Tailored Snapshot per job).
Why B is the best fit (and consistent with your existing schema)
•	Your resumes table already anticipates this with source_resume_id, is_base_version, and job_description_id.
•	It creates a coherent UX:
o	One “Base Resume” (stable, reusable)
o	One “Tailored Resume” per job posting (Google, Amazon, etc.)
•	It strengthens the platform loop:
o	Mock Interview “Polished Answers” → Saved to Library → Converted into resume bullets → Stored into the tailored resume tied to that job.
________________________________________
Step 13 — Session Lifecycle, Scoring Rollups, and “Final Attempt” Logic
Now we must define how the system computes session outcomes and how retries affect reporting.
Question 13A: When a user retries a question, which attempt is used for the session’s rollup score?
Choose one:
A. Latest attempt wins
•	Simplest mental model (“my final answer counts”)
B. Best attempt wins
•	Motivational (“keep trying until you beat your score”)
C. User-selected attempt wins (explicit “Set as Final”)
•	Most control, more UI steps
Question 13B: Should the user see progress across retries?
1. Yes — show attempt history (Attempt 1 vs Attempt 2 improvements)
2. No — only show the latest attempt (clean UI)
Question 13C: Session status transitions
Confirm if this is acceptable for V1:
•	planned → in_progress when user starts
•	in_progress → completed when last question is finalized
•	in_progress → abandoned after X hours inactivity (server-side)
•	User can manually “End Session” at any time
Yes / No (and if no, what change)
Please answer 13A (A/B/C), 13B (1/2), and 13C (Yes/No + edits).
This is excellent. Locking in Option B (Parent/Child Resume Mode) is the strategic anchor we needed. It turns Job Foxy from a "tool" into a "platform." It validates the source_resume_id column and ensures that every piece of advice the AI gives is context-aware.
Here are my decisions for the Session Lifecycle logic to keep the "Coach" persona consistent.
13A. Rollup Score Logic: B. Best attempt wins
Why this fits the "Coach" persona:
•	Psychological Safety: If the user gets a 7/10, retries, and accidentally stumbles (getting a 5/10), using the "Latest" score (Option A) feels like a punishment. It discourages experimentation.
•	The "Gym" Metaphor: If you hit a personal best on the bench press, that’s your record. Missing the next lift doesn't erase the record.
•	Data Integrity: We simply query MAX(overall_score) from the mock_interview_attempts table for that question ID. It’s a cheap query with high emotional value.
13B. Progress Visibility: 1. Yes — show attempt history
Why this drives retention:
•	The "Glow Up" Visualization: Users need to see their growth. A simple mini-chart or list saying:
o	Attempt 1: 🔴 4.5/10 (Rambling)
o	Attempt 2: 🟡 6.0/10 (Better structure)
o	Attempt 3: 🟢 8.5/10 (Great result!)
•	Trust in AI: Showing the progression proves that the AI is sensitive to their changes, validating the "Adaptive Coach" model.
13C. Session Status Transitions: Yes (Confirmed)
With one minor refinement for the "Abandoned" state:
•	Refinement: "Abandoned" should be a soft state. If a user leaves and comes back 3 days later, the session should be resumable (or at least viewable).
•	Logic:
o	Planned: Created but no audio recorded.
o	In Progress: At least one attempt recorded.
o	Completed: User clicked "Finish Interview" (triggering the final summary report).
o	Abandoned: (System status only) No activity for 24h, but user can "Resume" which flips it back to "In Progress."
________________________________________
We have now successfully navigated the entire maze! 🏁
1.	Core Goal: Answer Quality + Confidence (Hybrid).
2.	Format: Modular (3-5 questions).
3.	Avatar: Adaptive Coach (HeyGen Loop + Gen).
4.	Controls: "Finish Answer" Button (No interruptions).
5.	Feedback: Immediate + Retry Loop.
6.	Scoring: Structured (STAR + Delivery).
7.	Rewrite: Side-by-Side + Save to Library.
8.	Architecture: Streaming STT (Deepgram) + 1 LLM Call (OpenAI).
9.	Data: Audio (30 days) / Text (Forever).
10.	Schema: Attempts child table + Library integration.
11.	Context: Parent/Child Resumes linked to Job IDs.
Step 14 — Question Planning, Competency Coverage, and Follow-Up Rules
This step determines whether the session feels random or intelligently structured, and it directly controls OpenAI/HeyGen usage.
Question 14A: How are the 3–5 questions selected for a session by default?
Choose one:
A. Competency-balanced plan (Recommended)
•	The system selects questions to cover different competencies, e.g.
o	Leadership / Ownership
o	Conflict / Communication
o	Execution / Problem Solving
o	Role-specific technical depth (if applicable)
•	Job Description parsing (skills + competencies) drives selection
B. Weakness-targeted plan
•	Uses analysis_results / swot_analyses to focus questions on gaps only
•	Great for improvement, but can feel punishing
C. User-selected categories only
•	User manually picks categories every time (less “magic,” more control)
Question 14B: How many follow-up questions are allowed per primary question?
Choose one:
•	1. Zero follow-ups (simplest; least adaptive)
•	2. Max 1 follow-up (recommended for cost control)
•	3. Max 2 follow-ups (more depth, higher cost)
Question 14C: What triggers a follow-up?
Choose one:
A. Only when STAR is incomplete or relevance is weak
•	Example triggers: missing Result, vague Action, off-topic story
B. Always ask a follow-up (depth-first)
•	More “interview-like,” higher cost
C. Adaptive threshold
•	Ask follow-up only when score is in a certain band (e.g., 5–8), skip if very strong or very weak
________________________________________
This is the "Brain" of the operation. 🧠 Since we are paying for HeyGen video generation, every question needs to add value. We shouldn't waste credits asking random questions that don't help the user get hired.
Here is the strategy to keep the session intelligent and cost-effective:
14A. Question Selection: A. Competency-balanced plan (Recommended)
Why this wins:
•	The "Mock Loop" Effect: Real interviews aren't random; they are designed to cover specific signals (e.g., "Can they lead?" + "Can they code?" + "Do they fit the culture?"). By parsing the Job Description (which we decided to link in Step 11), we can generate a "balanced diet" of questions.
•	Leveraging the Tech: We already parsed the JD skills in your job_descriptions table (parsed_skills, competencies). Option A puts that data to work.
•	Example Plan (3 Questions):
1.	Behavioral (Culture): "Tell me about a conflict..." (Based on 'Communication' competency).
2.	Technical (Skill): "How do you handle API latency?" (Based on 'REST API' skill in JD).
3.	Leadership (Growth): "Tell me about a time you failed." (Standard hiring signal).
14B. Follow-up Limit: 2. Max 1 follow-up
Why this is the "Sweet Spot":
•	Cost Control: Limits your "Worst Case Scenario" cost. If a session is 3 questions, the max videos generated is 6 (3 Main + 3 Follow-ups).
•	User Fatigue: If the AI asks a second follow-up (a "follow-up to the follow-up"), users often get frustrated or confused. One probe is enough to say, "Dig deeper here," and then let them retry the whole answer if they still miss the mark.
14C. Follow-up Trigger: A. Only when STAR is incomplete or relevance is weak
Why this supports the "Coach" Goal:
•	Strategic Saving: If the user gives a perfect 10/10 answer, don't ask a follow-up. Just have the avatar smile/nod and move to the next question. This saves a HeyGen generation credit!
•	Educational Value: The follow-up acts as a "correctional nudge."
o	User: "...and so we fixed the bug." (Missing Result).
o	AI (Follow-up): "That sounds like a tough bug. What was the measurable impact of that fix on the system's uptime?"
o	This forces the user to provide the 'R' in STAR immediately.


Job Foxy
Mock Interview (Premium) — Product Requirements Document (PRD)
________________________________________
1. Product Overview
Product Name: Job Foxy – Mock Interview Coach
Tier: Premium Feature
Positioning: AI-powered interview coaching focused on Answer Quality and Delivery Confidence, not pass/fail simulation.
Core Value Proposition:
“Turn your real interview answers into recruiter-grade responses through guided practice, immediate feedback, and adaptive coaching — tailored to the exact job you want.”
________________________________________
2. North Star Goals
Primary Goal (70%)
Answer Quality Improvement
•	Clear structure (STAR)
•	High relevance to job description
•	Ownership (“I” vs “we”)
•	Measurable impact
Secondary Goal (30%)
Confidence & Delivery Coaching
•	Speaking pace
•	Filler words
•	Clarity
•	Eye contact (proxy via camera/attention)
Explicitly NOT the goal
•	Stress testing
•	Binary hire/no-hire judgments
•	Long, anxiety-inducing simulations
________________________________________
3. Session Structure
Format
•	Modular, user-configurable
•	Default: 3 questions
•	Maximum: 5 questions
•	Follow-ups: max 1 per question (adaptive)
Rationale
•	Controls HeyGen and LLM cost
•	Enables focused learning
•	Matches human cognitive load limits
________________________________________
4. Interviewer Behavior (HeyGen Avatar)
Behavior Model
Adaptive Coach-Interviewer
•	Supportive, professional, calm
•	Nods / listens while user speaks
•	Asks probing follow-ups only when needed
•	Difficulty adapts automatically
Avatar Customization
•	Visual only (appearance choices)
•	Behavior remains constant
________________________________________
5. Turn-Taking & Controls
Answer Completion
•	Explicit “Finish Answer” button
•	No auto cutoffs
•	No avatar interruptions
UX Enhancements
•	Button fades in after pause (VAD-assisted)
•	Avatar loops silent listening animation while user speaks
________________________________________
6. Feedback & Retry Loop (Core Learning Mechanism)
Feedback Timing
•	Immediate feedback after each question
Retry Options
•	Retry before submission (“Whoops / Restart”)
•	Retry after feedback (“Try that again”)
Scoring Rollup
•	Best attempt wins
•	Attempt history always visible
________________________________________
7. Scoring Model
Weighted Scores
•	Content (70%)
o	STAR completeness
o	Relevance to job
•	Delivery (30%)
o	Pace (WPM)
o	Filler words
o	Clarity
STAR Evaluation
•	Situation
•	Task
•	Action
•	Result
•	
o	hidden Relevance metric
UI
•	STAR progress bars (S/T/A/R)
•	Missing elements highlighted visually
________________________________________
8. Feedback Presentation
Tabs
1.	What You Said (Content) — default
2.	How You Said It (Delivery) — separate tab
Tone
•	Surgical
•	Recruiter-informed
•	Ego-safe but corrective
________________________________________
9. Answer Rewrite (“Wow Moment”)
Rewrite Model
Side-by-side comparison
•	Left: User transcript
•	Right: Polished recruiter-grade version
Coach Notes
•	Toggleable annotations
•	Explains why changes were made
Reuse
•	Save to Answer Library
•	Reusable in Resume Builder and future interviews
________________________________________
10. Question Planning & Follow-Ups
Question Selection
Competency-balanced plan
•	Driven by parsed job description skills & competencies
•	Mix of:
o	Behavioral
o	Technical
o	Leadership
Follow-Ups
•	Max 1 follow-up
•	Triggered only if STAR incomplete or relevance weak
•	No follow-up for strong answers (cost control)
________________________________________
11. Technical Architecture
Speech-to-Text
•	Deepgram streaming STT
•	No live captions (focus + realism)
•	Delivery metrics computed in real time
LLM Usage
•	Single OpenAI call per attempt
•	Structured JSON output
•	Ordered streaming:
1.	Follow-up text (sent to HeyGen immediately)
2.	Scores & feedback
3.	Rewrite + coach notes
Avatar Runtime (HeyGen)
Hybrid Model
•	Cached silent listening loop (CDN, $0)
•	Generated speaking segments only
•	Aggressive caching for static phrases
________________________________________
12. Data Storage & Retention
Stored Per Attempt
•	Transcript
•	Scores
•	Rewrite
•	Audio recording
Retention
•	Audio: 30 days
•	Text: 12 months (or user deletion)
Not Stored
•	HeyGen video streams
________________________________________
13. Resume Strategy
Model
Parent / Child Resume Mode
•	One Master Resume
•	One tailored resume per Job Description
Integration
•	Interview insights feed into:
o	STAR stories
o	Resume bullets
o	Gap defenses
________________________________________
14. Schema Adjustments (High-Level)
New Table
mock_interview_attempts
•	Supports retries
•	Stores transcript, audio, scores, rewrite, notes
Refactor
mock_interview_exchanges
•	Question container only
•	Links to best attempt
Answer Library
•	Extend star_stories
o	polished_answer
o	coach_notes
o	source_attempt_id
o	job_description_id
________________________________________
15. Session Lifecycle
States
•	planned
•	in_progress
•	completed
•	abandoned (soft; resumable)
Completion
•	Explicit “Finish Interview” action triggers summary
________________________________________
16. End-of-Session Summary (Next Step)
Each completed session produces:
•	Strengths
•	Gaps
•	Top STAR stories to save
•	Suggested next practice plan
•	Resume improvement prompts
________________________________________
17. Why This Wins
•	Coach-first, not judge-first
•	Clear economic controls
•	Tight learning loop
•	Deep integration across Resume + Analysis + Interview
•	Scales cleanly from MVP to advanced coaching tiers
________________________________________
Status
PRD COMPLETE — READY FOR IMPLEMENTATION
Next logical steps (when you’re ready):
1.	Final prompt schema (OpenAI system + JSON contract)
2.	API sequence diagram
3.	Frontend screen-by-screen UX spec
4.	Stripe plan mapping (minutes / sessions / credits)
You’ve designed a real product here — not a demo.
Option 1: The Brain (OpenAI System Prompt & JSON Contract).
Reason: everything else (sequence diagram, UI states, caching keys, even database fields) becomes deterministic once the LLM output is a strict, parseable contract with bounded length and ordered streaming. If we get this wrong, the rest of the system becomes brittle.
Below is the deliverable: (1) JSON contract, (2) system prompt, (3) backend parsing/validation rules, and (4) recommended model-call parameters and cost guards.
________________________________________
1) JSON Contract (Strict, Parseable, Stream-Friendly)
1.1 Contract principles
•	Single JSON object only. No markdown, no prose outside JSON.
•	Output must include keys in this exact order to support “first token optimization”:
1.	follow_up
2.	scoring
3.	content_feedback
4.	delivery_feedback
5.	rewrite
6.	coach_notes
7.	library_suggestion
8.	metadata
•	All numeric scores are 0–10, with overall computed deterministically (backend can recompute).
•	Text is bounded to avoid token explosion; long content goes into rewrite.polished_answer.
1.2 JSON Schema (Draft 2020-12)
Use this schema to validate server-side. (You can enforce with Ajv / Zod / JSON schema validator.)
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://jobfoxy.com/schemas/mock_interview_attempt_response.json",
  "title": "MockInterviewAttemptResponse",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "follow_up",
    "scoring",
    "content_feedback",
    "delivery_feedback",
    "rewrite",
    "coach_notes",
    "library_suggestion",
    "metadata"
  ],
  "properties": {
    "follow_up": {
      "type": "object",
      "additionalProperties": false,
      "required": ["should_ask", "question_text", "reason"],
      "properties": {
        "should_ask": { "type": "boolean" },
        "question_text": {
          "type": "string",
          "maxLength": 260,
          "description": "If should_ask=false, must be empty string."
        },
        "reason": {
          "type": "string",
          "maxLength": 220,
          "description": "Short internal rationale for logs/UI (not harsh)."
        }
      }
    },
    "scoring": {
      "type": "object",
      "additionalProperties": false,
      "required": ["overall", "content", "delivery", "content_breakdown", "delivery_breakdown"],
      "properties": {
        "overall": { "type": "number", "minimum": 0, "maximum": 10 },
        "content": { "type": "number", "minimum": 0, "maximum": 10 },
        "delivery": { "type": "number", "minimum": 0, "maximum": 10 },
        "content_breakdown": {
          "type": "object",
          "additionalProperties": false,
          "required": ["star", "relevance", "clarity", "impact"],
          "properties": {
            "star": { "type": "number", "minimum": 0, "maximum": 10 },
            "relevance": { "type": "number", "minimum": 0, "maximum": 10 },
            "clarity": { "type": "number", "minimum": 0, "maximum": 10 },
            "impact": { "type": "number", "minimum": 0, "maximum": 10 }
          }
        },
        "delivery_breakdown": {
          "type": "object",
          "additionalProperties": false,
          "required": ["pace", "fillers", "pauses", "confidence", "eye_contact_proxy"],
          "properties": {
            "pace": { "type": "number", "minimum": 0, "maximum": 10 },
            "fillers": { "type": "number", "minimum": 0, "maximum": 10 },
            "pauses": { "type": "number", "minimum": 0, "maximum": 10 },
            "confidence": { "type": "number", "minimum": 0, "maximum": 10 },
            "eye_contact_proxy": {
              "type": "number",
              "minimum": 0,
              "maximum": 10,
              "description": "If not available, set to 0 and mark metadata.eye_contact_available=false"
            }
          }
        }
      }
    },
    "content_feedback": {
      "type": "object",
      "additionalProperties": false,
      "required": ["headline", "top_strengths", "top_improvements", "star_checklist", "relevance_note", "one_action_tip"],
      "properties": {
        "headline": { "type": "string", "maxLength": 90 },
        "top_strengths": {
          "type": "array",
          "maxItems": 3,
          "items": { "type": "string", "maxLength": 140 }
        },
        "top_improvements": {
          "type": "array",
          "maxItems": 3,
          "items": { "type": "string", "maxLength": 140 }
        },
        "star_checklist": {
          "type": "object",
          "additionalProperties": false,
          "required": ["situation", "task", "action", "result"],
          "properties": {
            "situation": { "$ref": "#/$defs/starItem" },
            "task": { "$ref": "#/$defs/starItem" },
            "action": { "$ref": "#/$defs/starItem" },
            "result": { "$ref": "#/$defs/starItem" }
          }
        },
        "relevance_note": {
          "type": "string",
          "maxLength": 220,
          "description": "Mention alignment/misalignment with question + job."
        },
        "one_action_tip": {
          "type": "string",
          "maxLength": 160,
          "description": "The single best next correction."
        }
      }
    },
    "delivery_feedback": {
      "type": "object",
      "additionalProperties": false,
      "required": ["headline", "metrics", "one_action_tip"],
      "properties": {
        "headline": { "type": "string", "maxLength": 90 },
        "metrics": {
          "type": "object",
          "additionalProperties": false,
          "required": ["wpm", "filler_count", "long_pause_count", "clarity_note"],
          "properties": {
            "wpm": { "type": "integer", "minimum": 0, "maximum": 400 },
            "filler_count": { "type": "integer", "minimum": 0, "maximum": 999 },
            "long_pause_count": { "type": "integer", "minimum": 0, "maximum": 999 },
            "clarity_note": { "type": "string", "maxLength": 160 }
          }
        },
        "one_action_tip": { "type": "string", "maxLength": 160 }
      }
    },
    "rewrite": {
      "type": "object",
      "additionalProperties": false,
      "required": ["polished_answer", "star_version", "keywords_to_include"],
      "properties": {
        "polished_answer": {
          "type": "string",
          "maxLength": 2200,
          "description": "Recruiter-grade rewrite based only on user's experience."
        },
        "star_version": {
          "type": "object",
          "additionalProperties": false,
          "required": ["situation", "task", "action", "result"],
          "properties": {
            "situation": { "type": "string", "maxLength": 500 },
            "task": { "type": "string", "maxLength": 500 },
            "action": { "type": "string", "maxLength": 800 },
            "result": { "type": "string", "maxLength": 500 }
          }
        },
        "keywords_to_include": {
          "type": "array",
          "maxItems": 12,
          "items": { "type": "string", "maxLength": 40 }
        }
      }
    },
    "coach_notes": {
      "type": "array",
      "maxItems": 12,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["change_type", "original_snippet", "revised_snippet", "reason"],
        "properties": {
          "change_type": {
            "type": "string",
            "enum": ["clarity", "ownership", "metrics", "structure", "relevance", "conciseness", "impact_language"]
          },
          "original_snippet": { "type": "string", "maxLength": 120 },
          "revised_snippet": { "type": "string", "maxLength": 120 },
          "reason": { "type": "string", "maxLength": 170 }
        }
      }
    },
    "library_suggestion": {
      "type": "object",
      "additionalProperties": false,
      "required": ["should_save", "suggested_title", "category", "why_save"],
      "properties": {
        "should_save": { "type": "boolean" },
        "suggested_title": { "type": "string", "maxLength": 80 },
        "category": { "type": "string", "maxLength": 40 },
        "why_save": { "type": "string", "maxLength": 160 }
      }
    },
    "metadata": {
      "type": "object",
      "additionalProperties": false,
      "required": ["model_version", "policy_version", "eye_contact_available", "follow_up_type"],
      "properties": {
        "model_version": { "type": "string", "maxLength": 40 },
        "policy_version": { "type": "string", "maxLength": 20 },
        "eye_contact_available": { "type": "boolean" },
        "follow_up_type": {
          "type": "string",
          "enum": ["none", "missing_star", "low_relevance"]
        }
      }
    }
  },
  "$defs": {
    "starItem": {
      "type": "object",
      "additionalProperties": false,
      "required": ["status", "note"],
      "properties": {
        "status": {
          "type": "string",
          "enum": ["present", "weak", "missing"]
        },
        "note": { "type": "string", "maxLength": 140 }
      }
    }
  }
}
________________________________________
2) System Prompt (Single Call, Ordered Output)
This prompt assumes your backend passes a structured “inputs object” containing:
•	question
•	transcript
•	job description summary + skills/competencies
•	deepgram delivery metrics
•	whether this is a follow-up question
•	attempt history summary (optional, minimal)
2.1 System Prompt (drop-in)
You are Job Foxy, a premium interview coach. Your primary goal is to improve the user's answer quality, and secondarily improve delivery confidence. You must be supportive, precise, and recruiter-calibrated.

CRITICAL OUTPUT RULES:
1) Output MUST be a single valid JSON object and NOTHING else.
2) Do NOT use Markdown. Do NOT include commentary outside JSON.
3) Use the exact key order specified: follow_up, scoring, content_feedback, delivery_feedback, rewrite, coach_notes, library_suggestion, metadata.
4) Do not invent facts. Only rewrite using the user's stated experience. If a metric is missing, you may suggest a placeholder like “[X%]” but you must not fabricate numbers.
5) Follow-up questions are allowed ONLY if STAR is incomplete OR relevance is weak. Maximum 1 follow-up.
6) If follow_up.should_ask=false then follow_up.question_text must be an empty string.
7) Keep feedback “ego-safe”: direct but not insulting.

SCORING RULES:
- All scores are 0–10.
- Content score reflects STAR completeness + relevance + clarity + impact.
- Delivery score reflects pace, fillers, pauses, confidence, eye contact proxy (if available).
- Overall score is computed as: overall = round((content*0.7 + delivery*0.3) * 10) / 10.
- STAR checklist must label each of Situation/Task/Action/Result as present/weak/missing with a short note.

REWRITE RULES:
- Provide a recruiter-grade “polished_answer” that uses the user’s same story, improved STAR, stronger ownership language (“I”), and includes job-relevant keywords when appropriate.
- Also output a structured STAR version (situation/task/action/result).
- Keep polished_answer concise (typically 120–220 words unless the transcript is very short).

COACH NOTES RULES:
- Provide up to 12 notes showing specific “before → after” snippets with reasons.
- Notes should map to change_type: clarity, ownership, metrics, structure, relevance, conciseness, impact_language.

DELIVERY FEEDBACK RULES:
- Use Deepgram metrics provided. Do not guess WPM/filler counts.
- If eye-contact is not available, set metadata.eye_contact_available=false and scoring.delivery_breakdown.eye_contact_proxy=0.

LIBRARY SUGGESTION:
- should_save=true if the story can be reused as a behavioral asset (good theme like conflict, failure, leadership, initiative).
- Provide a short suggested_title and category.

You will receive an INPUT JSON from the system. Use it to produce the OUTPUT JSON.
________________________________________
3) Input Payload (Backend → OpenAI)
Standardize your input to reduce prompt churn. Example structure:
{
  "policy_version": "mi_v1.0",
  "question": {
    "text": "Tell me about a time you failed.",
    "type": "behavioral",
    "competency": "Ownership / Growth",
    "is_follow_up": false
  },
  "job_context": {
    "job_title": "Senior Product Manager",
    "company": "ExampleCo",
    "key_skills": ["Kubernetes", "APIs", "latency", "stakeholder management"],
    "competencies": ["communication", "leadership", "execution"],
    "summary": "Role emphasizes cross-functional leadership, platform reliability, and measurable outcomes."
  },
  "user_answer": {
    "transcript": "So yeah basically I worked on a project and it kind of failed...",
    "duration_seconds": 86
  },
  "delivery_metrics": {
    "wpm": 180,
    "filler_count": 12,
    "long_pause_count": 3,
    "clarity_note": "Clear articulation overall; occasional trailing sentences.",
    "eye_contact_proxy_score_0_to_10": null
  }
}
Backend transforms eye_contact_proxy_score_0_to_10:
•	if null → set eye_contact_available=false in output constraints.
________________________________________
4) Backend Validation & Fallback Rules (Non-Negotiable)
To make this production-safe, implement these hard rules:
1.	JSON parse must succeed
o	If parsing fails: auto-retry once with a “FORMAT CORRECTION” system message:
	“Your last output was invalid JSON. Output ONLY valid JSON matching the schema.”
2.	Schema validate (Ajv/Zod)
o	If schema fails: retry once, then fallback to safe minimal response:
	follow_up.should_ask=false
	scoring computed with conservative defaults
	rewrite = short cleaned transcript
3.	Score recompute server-side
o	Always recompute overall to enforce 70/30 weighting.
4.	Follow-up gating server-side
o	If follow_up.should_ask=true but trigger is not missing STAR/relevance weak → override to false.
5.	Length guards
o	If rewrite.polished_answer exceeds max length → truncate and add note in metadata (optional internal).
________________________________________
5) Model Call Settings (Recommended Defaults)
•	Temperature: 0.2 (format reliability)
•	Top_p: 1
•	Max output tokens: set to a safe bound (e.g., 900–1200) based on rewrite max length
•	Response format: if available, use strict JSON response mode; otherwise schema validation on backend
________________________________________
6) How this ties to your Step 8 “First Token Optimization”
Your backend should stream the model response and as soon as:
•	follow_up.question_text is complete, you can trigger:
o	HeyGen “speaking segment” generation (dynamic) OR cached clip lookup
Then render scoring and rewrite progressively.
________________________________________
Next Step (Choose one, but I will default to the Skeleton next)
Now that the Brain is defined, the natural follow-on is Option 2: API Sequence Diagram because it will specify:
•	websocket lifecycle
•	Deepgram stream closure at Finish Answer
•	concurrency (OpenAI stream + HeyGen generation)
•	state transitions for UI
If you prefer, I can instead do Option 3 (frontend UX spec) next, but from an engineering standpoint the sequence diagram usually de-risks the build fastest.
State your preference: Skeleton next or Face next.
Option 2: The Skeleton (API Sequence Diagram)
This is the most critical engineering artifact. It defines the exact timing to mask latency. If we get the "Finish Answer" handoff wrong, the user will stare at a frozen screen for 6+ seconds, breaking the "Premium" illusion.
Architectural Strategy: "The Asynchronous Race"
To make this feel instant, we run two parallel races as soon as the user clicks "Finish":
1.	The Visual Race: Fetch and render the Text Scores (fastest).
2.	The Audio/Video Race: Generate the Avatar Video (slowest).
By the time the user finishes reading their "Content Score: 7/10," the Avatar video buffer should be ready to play.
________________________________________
Actors
•	Client: React/Mobile App (Handles media streams & UI states).
•	Backend: Node/Python (Orchestrator, holds keys).
•	Deepgram: WebSocket (Real-time Speech-to-Text).
•	OpenAI: LLM (Intelligence).
•	HeyGen: Avatar Video Generator (Streaming API).
________________________________________
Phase 1: Session Warm-up (On Page Load)
Goal: Pay the "cold start" tax before the user even starts the interview.
Code snippet
sequenceDiagram
    participant User
    participant Client
    participant Backend
    participant HeyGen
    participant Deepgram

    Note over Client, HeyGen: 1. Initialization (Hidden from User)
    Client->>Backend: POST /session/init (job_id, resume_id)
    Backend->>HeyGen: POST /v2/avatar/session/start (quality: medium)
    HeyGen-->>Backend: session_id, sdp_offer, ice_candidates
    Backend-->>Client: session_token, video_stream_config
    
    Client->>HeyGen: Connect WebRTC (Handshake)
    HeyGen-->>Client: Connection Established (Stream Active)
    
    Note right of Client: Client plays "idle_listening.mp4" (Local Loop)<br/>OR streams "Silent/Nodding" state from HeyGen
    
    Backend->>Deepgram: Open WebSocket (Keep-Alive)
    Deepgram-->>Backend: Socket Ready
________________________________________
Phase 2: The "Listening" Loop (User Speaking)
Goal: Capture audio with zero latency overhead.
Code snippet
sequenceDiagram
    Note over User, Deepgram: 2. User Answers Question
    User->>Client: Speaks ("I handled the conflict by...")
    Client->>Deepgram: Stream Audio Chunks (Binary via Socket)
    
    Note right of Client: UI shows "Listening..." visualizer.<br/>Avatar continues silent nodding loop.
    
    Deepgram-->>Backend: Stream Transcript Partials (stored in temp buffer)
    
    User->>Client: Clicks "Finish Answer" Button
    Client->>Deepgram: Send "Finalize" Signal
    Deepgram-->>Backend: Final Transcript Event ("...result.")
________________________________________
Phase 3: The "Finish" Trigger (The Critical Path)
Goal: Parallelize Intelligence (OpenAI) and Video Gen (HeyGen).
Code snippet
sequenceDiagram
    Note over Client, OpenAI: 3. The Processing Handoff
    Client->>Backend: POST /interview/submit_attempt (timestamp)
    
    par Parallel Logic 1: Intelligence
        Backend->>OpenAI: POST /chat/completions (Stream=True)
        Note right of Backend: Input: Final Transcript + Job Context + Schema
    and Parallel Logic 2: UI State
        Backend-->>Client: 200 OK (Acknowledged)
        Client->>Client: Show "Analyzing..." Skeleton Loader
    end

    Note over Backend, OpenAI: 4. The Streaming Response (First Token Optimization)
    
    loop Stream Chunks from OpenAI
        OpenAI-->>Backend: Chunk 1: { "follow_up": { "should_ask": true, "question_text": "But how did..." } }
        
        CRITICAL STEP: Immediate Handoff
        Backend->>Backend: Detect "follow_up" object is complete?
        
        opt If Follow-Up Exists
            Backend->>HeyGen: POST /v2/avatar/speak (text: "But how did...")
            Note right of HeyGen: HeyGen starts rendering video
        end
        
        OpenAI-->>Backend: Chunk 2: { "scoring": { "overall": 7.5 ... } }
        Backend-->>Client: WebSocket Push: UPDATE_SCORES (7.5)
        Note right of Client: UI updates "Score" tab immediately (User starts reading)
        
        OpenAI-->>Backend: Chunk 3: { "rewrite": "..." }
        Backend-->>Client: WebSocket Push: UPDATE_REWRITE
    end
________________________________________
Phase 4: The Playback (Latency Masking)
Goal: The user is reading scores while video buffers.
Code snippet
sequenceDiagram
    Note over Client, HeyGen: 5. Video Playback
    
    Client->>Client: User is reading "Content Score: 7.5"
    
    opt Video Buffer Ready (approx 2-4s later)
        HeyGen-->>Client: WebRTC Stream: Avatar starts speaking
        Client->>Client: Auto-switch UI focus to Avatar (optional) OR keep Avatar in PiP
    end
    
    Note right of Client: User listens to Follow-Up Question
    
    HeyGen-->>Client: "Speech Ended" Event
    Client->>Client: Show "Start Recording" Button (for next turn)
________________________________________
Engineer’s Cheatsheet: Where to Optimize
1.	The "First Token" Trick:
o	Rule: Your OpenAI System Prompt must output the follow_up object first.
o	Why: If OpenAI outputs the rewrite (500 tokens) before the follow_up (20 tokens), HeyGen sits idle for 3 seconds waiting for text.
o	Fix: Enforce JSON key order in the System Prompt: "Output order: follow_up, scoring, rewrite...".
2.	HeyGen "Task Type":
o	Use HeyGen's Streaming API (Real-time), not the "Generate Video" (Batch) API.
o	Send the text to HeyGen the millisecond the follow_up.question_text string is closed in the OpenAI stream. Do not wait for the full JSON to validate.
3.	Deepgram Keep-Alive:
o	Don't close the Deepgram socket between questions. Keep it open ("Listening: False" state) to avoid the 300ms connection handshake overhead on every new answer.
________________________________________
Next Step
We have the Brain (Schema) and the Skeleton (Sequence). Now we need to put the Face on it.
Option 3: The Face (Frontend UX Spec)
We will define the screen-by-screen states: Listening (Visualizer) $\rightarrow$ Processing (Skeleton Screens) $\rightarrow$ Results (Split Tabs).
Shall we proceed to the UX Spec? 🎨
Agreed. Your “Asynchronous Race” framing is exactly the right mental model, and your phases are correct. What we need now is to tighten the skeleton into an implementation-grade sequence with unambiguous ownership of:
1.	Where Deepgram streaming terminates (Client → Deepgram direct vs Client → Backend proxy → Deepgram)
2.	Where the authoritative transcript buffer lives (Backend, not Client)
3.	How we start HeyGen generation as soon as follow_up completes without waiting for full JSON validation
Below is the final API sequence diagram set (warm-up, per-question attempt, retry flows, session completion), with a recommended topology that is production-safe.
________________________________________
Skeleton v1.0 — API Sequence Diagram
Architectural choice (recommended)
Deepgram streaming via Backend proxy (authoritative transcript)
Client → Backend WebSocket → Deepgram WebSocket
Why:
•	Keeps API keys server-side
•	Backend maintains the authoritative “attempt transcript buffer”
•	Simplifies compliance/logging and removes client-side transcript tampering risks
•	Lets you compute delivery analytics centrally and persist consistently
If you strongly prefer Client → Deepgram direct for latency, you can still do it, but then you must:
•	mint ephemeral Deepgram tokens (server-signed)
•	send final transcript + timings back to backend
•	accept more client trust surface
Given Job Foxy is premium and you already have a backend orchestrator, proxy is the cleanest skeleton.
________________________________________
Phase 0 — Session Warm-up (Pre-pay cold start)
Goal: hide session start latency, pre-attach HeyGen session, pre-warm websockets.
sequenceDiagram
  autonumber
  participant U as User
  participant C as Client (Web/Mobile)
  participant B as Backend (Orchestrator)
  participant H as HeyGen
  participant D as Deepgram

  Note over C,B: Page load / user enters Mock Interview
  C->>B: POST /mock-interviews/init {job_description_id, resume_id, persona_id, q_count}
  B->>B: Load job context + resume snapshot (tailored resume if exists)
  B->>H: POST /avatar/session/start {persona, quality, voice}
  H-->>B: {heygen_session_id, webrtc_offer, ice_servers}
  B-->>C: {mock_interview_id, heygen_session_id, webrtc_offer, ice_servers, ws_url, auth_token}

  C->>H: WebRTC handshake (answer + ICE candidates)
  H-->>C: WebRTC established (audio/video ready)

  Note over C: UI shows idle_listening.mp4 loop (CDN) until speaking segment is ready
  C->>B: WS CONNECT /ws/mock-interview?mock_interview_id=...
  B->>D: Open Deepgram WS (keep-alive)
  D-->>B: DG WS ready

  Note over B: Backend now “armed”: HeyGen session ready + Deepgram ready
Optimization: cache & preload common HeyGen clips (intro, “try again”, “next question”) on CDN and let client fetch them during warm-up.
________________________________________
Phase 1 — Ask Question (Avatar Speaking Segment)
Goal: show question instantly via cached clip if possible, otherwise generate.
sequenceDiagram
  autonumber
  participant C as Client
  participant B as Backend
  participant H as HeyGen

  Note over C,B: Start Question N
  C->>B: POST /mock-interviews/{id}/next-question
  B->>B: Select planned question (competency-balanced) + decide cached/dynamic
  alt Cached clip exists
    B-->>C: {question_text, clip_url, mode:"cached"}
    C->>C: Play cached clip_url
  else Dynamic generation required
    B->>H: POST /avatar/speak {heygen_session_id, text:question_text}
    H-->>B: {speak_task_id}
    B-->>C: {question_text, mode:"stream"}
    Note over C,H: Client remains connected via WebRTC; HeyGen speech arrives when ready
  end
________________________________________
Phase 2 — Listening Loop (User Speaking + Streaming STT)
Goal: user speaks while avatar is in silent loop; STT streamed; no captions.
sequenceDiagram
  autonumber
  participant U as User
  participant C as Client
  participant B as Backend
  participant D as Deepgram

  Note over C: UI state = LISTENING (idle_listening loop + mic visualizer)
  U->>C: Speaks answer
  C->>B: WS STREAM audio chunks (Opus/PCM frames)
  B->>D: Forward audio frames (DG streaming)

  D-->>B: Partial transcripts + timings + VAD events
  B->>B: Append to attempt_buffer (authoritative transcript)
  Note over C: No captions shown; user focused on avatar

  U->>C: Click "Finish Answer"
  C->>B: WS EVENT finish_answer {attempt_id, timestamp}
  B->>D: DG finalize / close utterance
  D-->>B: Final transcript event
  B->>B: Seal attempt_buffer as final_transcript + compute delivery metrics
________________________________________
Phase 3 — The Asynchronous Race (OpenAI + HeyGen in parallel)
Goal: client sees scores quickly; HeyGen buffers speaking segment while user reads.
sequenceDiagram
  autonumber
  participant C as Client
  participant B as Backend
  participant O as OpenAI
  participant H as HeyGen

  Note over C: UI state = PROCESSING (skeleton loaders)
  C->>B: POST /attempts/{attempt_id}/submit (idempotent)

  par Race 1: Intelligence (OpenAI stream)
    B->>O: STREAM /responses {input: transcript+job_context+metrics, schema}
    O-->>B: Stream chunk(s): follow_up object first
    B->>B: Detect follow_up.question_text complete (no full JSON wait)
    alt follow_up.should_ask = true
      B->>H: POST /avatar/speak {heygen_session_id, text: follow_up.question_text}
      H-->>B: {speak_task_id}
      B-->>C: WS EVENT follow_up_queued {question_text}
    else no follow-up
      B-->>C: WS EVENT no_follow_up
    end

    O-->>B: Stream chunk(s): scoring + content_feedback
    B-->>C: WS EVENT update_scores {overall, content, delivery, star_checklist, tips}

    O-->>B: Stream chunk(s): rewrite + coach_notes + library_suggestion
    B-->>C: WS EVENT update_rewrite {transcript, polished_answer, coach_notes, library_suggestion}
  and Race 2: UI responsiveness
    B-->>C: 202 Accepted (submit acknowledged)
    C->>C: Render Score card immediately as WS events arrive
  end

  Note over C: User reads scores while HeyGen buffers the speaking segment
Critical rule implemented: Trigger HeyGen speak as soon as the follow-up string is complete, not after full JSON validation.
________________________________________
Phase 4 — Playback + Next Turn
Goal: once user finishes reading, avatar speaks with no dead air.
sequenceDiagram
  autonumber
  participant C as Client
  participant H as HeyGen
  participant B as Backend

  Note over C: UI state = FEEDBACK (Content tab default; Delivery tab available)
  opt Speaking segment ready
    H-->>C: WebRTC audio/video frames (avatar asks follow-up OR next question)
    C->>C: Optional: auto-focus avatar PiP / keep tabs visible
  end

  H-->>C: Event: speech_end
  C->>B: WS EVENT ready_for_next_turn

  alt Follow-up was asked
    Note over C: UI shows "Start Answer" / mic ready for follow-up response
  else No follow-up
    Note over C: UI shows "Next Question" CTA
  end
________________________________________
Retry Flows (Pre-submit + Post-feedback)
A) Retry Before Submission (“Whoops / Restart Answer”)
No OpenAI or HeyGen cost.
sequenceDiagram
  autonumber
  participant C as Client
  participant B as Backend
  participant D as Deepgram

  Note over C: User is in LISTENING mode mid-answer
  C->>B: WS EVENT restart_answer {attempt_id}
  B->>B: Discard current attempt_buffer (or keep as "discarded" for internal)
  B->>D: Reset stream segment (new utterance)
  B-->>C: WS EVENT listening_reset
B) Retry After Feedback (“Try That Again”)
Creates a new attempt under same exchange. Best-attempt-wins rollup.
sequenceDiagram
  autonumber
  participant C as Client
  participant B as Backend

  C->>B: POST /exchanges/{exchange_id}/retry
  B->>B: Create mock_interview_attempts row attempt_number+1
  B-->>C: {new_attempt_id}
  Note over C: Return to LISTENING state; same question prompt played (cached if possible)
________________________________________
Completion Flow (Finish Interview + Summary)
Goal: compute session summary (strengths/gaps/plan), update status, persist rollups.
sequenceDiagram
  autonumber
  participant C as Client
  participant B as Backend
  participant O as OpenAI

  C->>B: POST /mock-interviews/{id}/finish
  B->>B: Select best attempt per exchange (MAX overall_score)
  B->>B: Compute session rollups + store in mock_interviews (overall_score, strengths, gaps)
  B->>O: (Optional) Single summary call: improvement_plan + next practice plan
  O-->>B: summary + plan JSON
  B-->>C: {status:"completed", summary, plan}
________________________________________
Engineer’s Cheatsheet — Where the Premium Feel Is Won/Lost
Latency masking
•	OpenAI streaming → parse partial JSON: start HeyGen generation on follow_up completion.
•	UI must render useful content in <300ms after finish:
o	“Analyzing…” skeleton immediately
o	score placeholders immediately
•	Keep Deepgram WS warm across questions; do not reconnect each time.
Correctness & robustness
•	Every submit_attempt must be idempotent (same attempt_id cannot double-bill).
•	Always persist:
o	transcript (final)
o	delivery metrics (from Deepgram)
o	OpenAI result (validated JSON)
•	If HeyGen speak fails:
o	fall back to TTS-only (Deepgram TTS or other) while showing avatar idle loop.
Cost control
Worst-case per 3-question session:
•	Up to 3 follow-ups → up to 6 HeyGen speaking segments
•	OpenAI: 1 call per attempt; retries increase cost (acceptable, users self-select)
________________________________________
API Endpoints (Minimal Set)
Warm-up
•	POST /mock-interviews/init
•	WS /ws/mock-interview
Question
•	POST /mock-interviews/{id}/next-question
Attempts
•	POST /attempts/{attempt_id}/submit (idempotent)
•	POST /exchanges/{exchange_id}/retry
•	WS EVENT restart_answer
Finish
•	POST /mock-interviews/{id}/finish
________________________________________
Proceed to Option 3 (Frontend UX Spec)
Yes — that is the correct next step.
If you agree, I will define:
•	the 3 core screen states (Listening → Processing → Feedback)
•	the exact component layout (Finish Answer button behavior, tabs, side-by-side rewrite, attempt history mini-chart)
•	the state machine (events + transitions) so engineering can implement without ambiguity.
This completes the "Skeleton" phase. We now have a deterministic backend flow that masks latency and enforces data integrity.
Now, let's put the Face on it.
This UX Spec translates the "Coach" persona into pixel-perfect logic. It solves the tension between "Immersive Realism" (looking at the avatar) and "Deep Learning" (analyzing data).
________________________________________
Option 3: The Face (Frontend UX Specification)
1. UX Philosophy: "Focus vs. Analysis"
•	Mode A (Listening): Minimalism. When the user speaks, the screen must be empty to reduce cognitive load and anxiety. The user should look at the Avatar (Eye Contact), not a transcript.
•	Mode B (Feedback): Density. When feedback arrives, the screen transforms into a data-rich dashboard. We use "Progressive Disclosure" (Tabs) to prevent overwhelming the user.
________________________________________
2. The View State Machine
Engineers should implement this exact state chart.
State	Avatar Behavior	UI Components Visible	Trigger to Next State
1. INTRO / LOADING	Speaking (Intro Clip)	Session Info, "Start" Button	onVideoEnd or User Click
2. ASKING	Speaking (Question)	Question Text (Subtitle style)	onVideoEnd $\rightarrow$ 3
3. LISTENING	Silent Loop (Nodding)	Mic Visualizer, "Finish Answer" Button	User Click "Finish" $\rightarrow$ 4
4. PROCESSING	Silent Loop (Thinking)	Skeleton Loaders, "Analyzing..." Toast	Socket Event UPDATE_SCORES $\rightarrow$ 5
5. FEEDBACK	Silent Loop OR Speaking (Follow-up)	The Dashboard (Scores, Tabs, Rewrite)	User Click "Retry" $\rightarrow$ 3 OR "Next" $\rightarrow$ 2
________________________________________
3. Screen-by-Screen Specification
State 3: LISTENING (The "Realism" Mode)
Goal: Mimic a Zoom call. Remove distractions.
•	Layout:
o	Avatar: Full height / Dominant (Center).
o	Question Text: Overlay at top (semi-transparent background), large font (24px+).
o	Mic Visualizer: Subtle waveform at bottom center. Indicates "We are hearing you."
o	"Finish Answer" Button:
	Position: Bottom Center (floating).
	Behavior (The "VAD Fade"):
	While Speaking: Opacity 50%, Label "Listening...".
	Silence > 1.5s: Opacity 100%, Pulse Animation, Label changes to "Complete Answer".
o	"Restart" Button: Small, secondary ghost button (Top Right). "Start Over."
State 4: PROCESSING (The "Handshake")
Goal: Validate that the AI is working, not frozen.
•	Transition: "Finish Answer" button morphs into a spinner or "Analyzing..." badge.
•	Layout:
o	Avatar: Shrinks or slides to the Top Left (Picture-in-Picture) or Side Panel depending on device.
o	Main Stage: Replaced by Skeleton Screens (Shimmer effect).
	Top Block: Score Placeholder.
	Left Tab: Content Feedback Skeleton.
	Right Tab: Delivery Metrics Skeleton.
•	Micro-Copy: Cycle random tips: "Checking STAR structure...", "Analyzing pacing...", "Comparing to Job Description..."
State 5: FEEDBACK (The "Coach" Dashboard)
Goal: The "Wow" Moment. High density, clear hierarchy.
Header Area:
•	Overall Score: Large Badge (e.g., "7.5/10"). Color-coded (Red/Yellow/Green).
•	Attempt History: Mini-dots. (1) 🔴 -> (2) 🟡. Current is highlighted.
•	Avatar: Lives in a persistent container (Top Right or Sidebar). If a follow-up is asked, this video plays immediately.
Main Content Area (Tabs):
Tab A: "What You Said" (Content - Default)
•	Left Column: The Report Card
o	STAR Checklist: Vertical list. Icons (✅/⚠️/❌) next to S-T-A-R.
o	Key Insight: One-sentence summary. "Strong action, but the result lacked metrics."
o	Coach Notes: Accordion list. Click to expand.
•	Right Column: The Rewrite (The "Money" Feature)
o	Toggle Switch: [ Show My Transcript ] <-> [ Show Polished Version ].
o	Diff View:
	Polished Version: The AI-rewritten text.
	Annotations: Highlighted phrases in Green. Clicking a highlight opens a tooltip: "Changed 'I think I helped' to 'I spearheaded' (Ownership)."
o	Action Bar: [ Save to Library ] [ Copy Text ].
Tab B: "How You Said It" (Delivery)
•	Metrics Grid: 2x2 Grid.
o	Pace: Gauge chart. Target: 130-160 WPM.
o	Fillers: Count + List ("um", "like").
o	Pauses: Count of "Dead Air" > 3s.
o	Confidence: (If available) Sentiment score.
•	Action Tip: "You speak fast when excited. Try to pause before the 'Action' section."
Footer Area (Persistent):
•	Primary Action:
o	If Follow-up asked: Button says "Answer Follow-up" (Icon: Mic).
o	If No Follow-up: Button says "Next Question" (Icon: Arrow).
•	Secondary Action:
o	Button says "Retry Question" (Icon: Loop). Resets state to LISTENING, keeps current attempt in history.
________________________________________
4. Mobile vs. Desktop Responsiveness
•	Desktop:
o	Split Screen: Avatar on Left (fixed), Dashboard on Right (scrollable).
o	Rewrite: Side-by-Side view (Transcript vs. Rewrite).
•	Mobile:
o	Stacked: Avatar at top (sticky). Dashboard scrolls underneath.
o	Rewrite: Toggle view only (Tap to flip between Transcript/Rewrite).
________________________________________
5. Final "Go-Live" Checklist
•	[ ] VAD Tuning: Ensure the "Finish Answer" button doesn't flash annoyingly during short pauses.
•	[ ] Skeleton Timing: Ensure skeletons appear for at least 800ms even if the API is faster, to prevent UI jitter.
•	[ ] HeyGen Error State: If the video fails to load, fallback to a static image of the avatar + Audio only.
________________________________________
Congratulations! 🎉
You now have the Brain (Schema), the Skeleton (Sequence), and the Face (UX).
Brainstormer's Final Question:
Do you need help with the Stripe Monetization Strategy (e.g., how to map "HeyGen Minutes" to "Credits/Dollars"), or are you ready to start building?
Your UX spec is coherent, implementable, and aligned with every coach-first decision we locked. The only remaining risk is ambiguity for engineering around state ownership, event timing, and UI jitter control. Below is a tightened, engineering-ready Frontend UX Specification v1.0 that:
•	converts your narrative into a deterministic state machine
•	defines components, props, and event contracts
•	specifies desktop/mobile layouts
•	includes error/fallback states
•	includes the minimum viable visual rules for “premium feel” (timing, transitions, skeleton minimums)
No additional questions required.
________________________________________
Job Foxy Mock Interview — Frontend UX Spec v1.0
0) UX Philosophy
Mode A: Listening (Focus)
Goal: reduce anxiety and cognitive load.
Principles:
•	No live transcript/captions.
•	One primary focus target: Avatar.
•	Only essential controls: mic visualizer + finish button + restart.
Mode B: Feedback (Analysis)
Goal: maximize learning and perceived value.
Principles:
•	Data-rich dashboard with clear hierarchy.
•	Progressive disclosure via tabs, accordions, and toggles.
•	“Before/After” rewrite is the premium centerpiece.
________________________________________
1) Global Layout System
Desktop layout (recommended default)
Two-column layout
•	Left rail (fixed): Avatar container (video + fallback), question subtitle, minimal session info.
•	Right panel (scrollable): Listening/Processing/Feedback content.
Mobile layout
Stacked layout
•	Top sticky section: Avatar container (fixed height), question subtitle overlay.
•	Scrollable section: Listening/Processing/Feedback content.
________________________________________
2) Component Inventory (Implementation Skeleton)
2.1 AvatarStage
Purpose: renders HeyGen WebRTC stream OR cached loop video.
States:
•	LISTEN_LOOP (idle_listening.mp4 on CDN)
•	SPEAK_SEGMENT (HeyGen stream)
•	FALLBACK_STATIC (avatar image + audio-only)
Props:
•	mode: "loop" | "stream" | "fallback"
•	subtitleText?: string
•	isSpeaking?: boolean (for subtle UI cues)
•	onSpeechEnd?: () => void
•	error?: AvatarError
2.2 ListeningControls
•	Mic waveform visualizer
•	FinishAnswerButton with VAD fade logic (client-side only)
•	RestartAnswerButton (ghost, top right)
Props:
•	vadState: "speaking" | "paused" | "silent"
•	onFinish: () => void
•	onRestart: () => void
•	disabled?: boolean
2.3 ProcessingPanel
•	Skeleton cards (score + tabs placeholders)
•	“Analyzing…” toast and rotating micro-copy
•	Optional progress bar (fake, deterministic timing)
Props:
•	tipIndex?: number (rotate every 900ms)
•	minDurationMs: 800 (enforced)
2.4 FeedbackDashboard
Header:
•	OverallScoreBadge
•	Attempt history mini-dots
•	Primary CTA (Next / Answer Follow-up)
•	Secondary CTA (Retry)
Tabs:
•	ContentTab
•	DeliveryTab
Props:
•	feedback: AttemptFeedbackViewModel
•	attemptHistory: AttemptSummary[]
•	followUp: FollowUpViewModel
•	onRetry: () => void
•	onNext: () => void
•	onSaveToLibrary: () => void
•	onCopy: () => void
2.5 RewritePanel
Desktop: side-by-side (Transcript | Polished)
Mobile: toggle view
Props:
•	transcript: string
•	polishedAnswer: string
•	coachNotes: CoachNote[]
•	showMode: "transcript" | "polished"
•	showAnnotations: boolean
•	onToggleMode: () => void
•	onToggleAnnotations: () => void
________________________________________
3) Deterministic View State Machine
3.1 Top-level states
type ViewState =
  | "INTRO_LOADING"
  | "ASKING"
  | "LISTENING"
  | "PROCESSING"
  | "FEEDBACK"
  | "ERROR_RECOVERABLE"
  | "ERROR_BLOCKING";
3.2 State transitions (authoritative)
State	Avatar Behavior	Visible UI	Transition Trigger
INTRO_LOADING	Intro clip (cached preferred)	Session info, Start CTA	Start clicked OR intro end → ASKING
ASKING	Speaking question (cached or HeyGen)	Question subtitle only	speech_end → LISTENING
LISTENING	Silent nod loop	Mic visualizer + Finish + Restart	Finish clicked → PROCESSING; Restart → LISTENING(reset)
PROCESSING	Silent loop “thinking”	Skeleton + analyzing toast	UPDATE_SCORES event OR minProcessingElapsed → FEEDBACK
FEEDBACK	Loop OR speak follow-up	Dashboard tabs + rewrite	Retry → LISTENING; Next → ASKING (next question) OR LISTENING (follow-up answer)
3.3 Processing gating rule (anti-jitter)
Processing UI must remain visible for at least 800ms, even if scores arrive earlier.
Implementation rule:
•	Start processingStartTs on Finish.
•	If UPDATE_SCORES arrives before 800ms: queue it, render at 800ms.
•	If arrives after: render immediately.
________________________________________
4) Screen-by-Screen Spec
State: INTRO_LOADING
Goal: warm up HeyGen + Deepgram sockets invisibly.
UI:
•	AvatarStage shows cached intro clip if available.
•	Start button becomes active as soon as:
o	WebRTC handshake OK OR fallback video OK
o	WS connected to backend OK
CTA:
•	“Start Interview” button (primary)
•	Under it: small status line
o	“Preparing your coach…” (no technical jargon)
Failure:
•	If HeyGen fails: allow start with fallback (static avatar + audio)
________________________________________
State: ASKING
Goal: deliver question with minimal distraction.
UI:
•	AvatarStage in speaking mode
•	Subtitle overlay top (semi-transparent)
•	No controls visible besides an unobtrusive “Skip” (optional, admin-only)
On speech end:
•	Transition to LISTENING
•	Auto-arm mic capture
________________________________________
State: LISTENING (Minimalism Mode)
Goal: “Zoom-call realism” + user control.
Layout:
•	Avatar dominant.
•	Question subtitle remains visible at top.
•	Bottom center: waveform + Finish button.
Finish button (VAD Fade logic):
•	While speaking: 50% opacity, label “Listening…”
•	Pause > 1.5s: 100% opacity, subtle pulse, label “Complete Answer”
•	Hard rule: button always clickable (no lockout)
Restart (pre-submit):
•	Top right ghost button “Start Over”
•	Tap triggers restart event; transcript buffer resets
________________________________________
State: PROCESSING (Handshake)
Goal: prevent “frozen screen perception,” and start the asynchronous race.
Transition:
•	Finish button morphs into small “Analyzing…” badge for 250ms then disappears.
Layout:
•	Avatar shrinks to PiP (desktop top-left / mobile sticky top)
•	Main area shows skeleton:
o	Score card skeleton
o	Tab header skeleton
o	Rewrite panel skeleton
Micro-copy:
Rotate every 900ms:
•	“Checking STAR structure…”
•	“Comparing to the job requirements…”
•	“Analyzing pacing and filler words…”
Minimum display:
•	800ms enforced
________________________________________
State: FEEDBACK (Coach Dashboard)
Goal: “Wow moment” with clear hierarchy.
Header
•	Overall Score badge (e.g., 7.5/10)
•	Subscores visible as smaller chips (Content, Delivery)
•	Attempt history dots:
o	Attempt 1 red, Attempt 2 yellow, Attempt 3 green
o	Highlight best attempt (since best attempt wins)
•	Avatar in persistent container (top right desktop / top sticky mobile)
Primary CTA (context-sensitive)
•	If follow-up exists: “Answer Follow-up” (mic icon)
o	Clicking transitions to ASKING (follow-up spoken) then LISTENING
•	If no follow-up: “Next Question” (arrow)
Secondary CTA
•	“Retry Question” (loop icon) → creates new attempt and transitions to LISTENING
________________________________________
Tab A: What You Said (Content) — default
Left column (desktop) / top stack (mobile):
•	STAR checklist with status:
o	✅ present, ⚠️ weak, ❌ missing
•	Key insight: one sentence
•	Improvements: up to 3 bullets
•	Coach notes: accordion list
Right column (desktop) / below (mobile):
•	RewritePanel:
o	Toggle: Transcript vs Polished
o	Toggle: Coach Notes (annotations)
o	Action bar: Save to Library / Copy Text
Important:
•	Transcript view highlights filler words lightly (gray underline), but does not shame the user.
•	Polished view highlights key impact phrases (green) when coach notes enabled.
________________________________________
Tab B: How You Said It (Delivery)
Metrics grid 2x2:
•	Pace (WPM gauge target 130–160)
•	Fillers count + top 3 fillers
•	Long pauses count (>3s)
•	Clarity note (from Deepgram)
One action tip at bottom:
•	“Slow down slightly when stating the Result to add impact.”
If eye contact unavailable:
•	Hide metric entirely OR show “Not available” (do not show 0/10 to user)
________________________________________
5) Error & Fallback UX (Premium-safe)
HeyGen video failure
Fallback:
•	AvatarStage switches to static avatar image
•	Audio plays via TTS (or silent + text subtitle)
•	Display toast: “Coach video temporarily unavailable—continuing in audio mode.”
Deepgram failure mid-answer
Fallback:
•	Continue recording locally (if supported)
•	Prompt user: “Connection issue—tap Finish to submit what we captured.”
•	Backend can run a batch STT as emergency recovery (internal)
OpenAI failure or invalid JSON
Fallback:
•	Show minimal feedback card:
o	“We captured your answer. Feedback is temporarily delayed.”
•	Provide Retry button and allow moving on (don’t block session)
________________________________________
6) Responsiveness Rules
Desktop
•	Avatar left rail fixed width (e.g., 380–460px)
•	Feedback right panel scroll
•	Rewrite side-by-side (transcript vs polished) optional split
Mobile
•	Avatar sticky header
•	Tabs become segmented control
•	Rewrite becomes toggle (no side-by-side)
________________________________________
7) Go-Live Checklist (Engineering Acceptance Criteria)
1.	VAD Fade stability
•	Finish button must not flicker during normal speech patterns.
2.	Processing jitter control
•	800ms minimum processing state enforced.
•	No layout “jumping” when scores arrive.
3.	HeyGen race
•	On follow-up present, HeyGen speak must start within ~50ms of follow_up text completion on backend.
4.	Best attempt wins
•	UI clearly indicates best attempt, and session rollups reflect it.
5.	Retry cost safety
•	Pre-submit restart triggers no OpenAI/HeyGen calls.
•	Post-feedback retry creates a new attempt record and increments usage.
6.	Fallback paths tested
•	HeyGen down
•	Deepgram down
•	OpenAI down
•	WS disconnect mid-answer
________________________________________
What to do next
You asked whether to move to Stripe monetization or start building.
From an engineering standpoint, the next highest-leverage artifact is:
Build-Ready Deliverable
A shared “Event Contract” document (WS message types + payloads) so frontend and backend can implement independently with no mismatch:
•	UPDATE_SCORES
•	UPDATE_REWRITE
•	FOLLOW_UP_QUEUED
•	SPEECH_END
•	LISTENING_RESET
•	ERROR_*
If you want, I will produce that next (it is usually a 1–2 page spec, extremely practical), then we can go straight into implementation tickets.
On monetization: I can also provide a Stripe mapping after the event contract, but I recommend not blocking development on pricing. Usage tracking is already in your schema; we can wire metering first and tune pricing after you have real telemetry.
This is the final engineering artifact needed to unblock development. With this contract, your frontend team can mock the server responses immediately, and your backend team knows exactly what payloads to emit.
Job Foxy — WebSocket Event Contract v1.0
Protocol: WSS
Endpoint: /ws/mock-interview
Auth: Query param ?token={session_token} (issued by /init endpoint)
Encoding: JSON for events; Binary for audio streams.
________________________________________
1. Client $\rightarrow$ Backend (Upstream Actions)
1.1 Audio Streaming (Real-Time)
•	Trigger: User is speaking in LISTENING state.
•	Format: Binary (ArrayBuffer)
•	Payload: Raw audio frames (Int16 PCM or Opus encoded).
•	Frequency: ~20-50ms chunks.
•	Note: Backend proxies these directly to Deepgram.
1.2 Finish Answer
•	Trigger: User clicks "Finish Answer" button (or VAD auto-triggers).
•	Purpose: Closes the audio processing window for the current attempt.
•	Type: CLIENT_EVENT
JSON
{
  "type": "FINISH_ANSWER",
  "payload": {
    "question_id": "uuid",
    "attempt_id": "uuid",
    "timestamp_ms": 1715000000000
  }
}
1.3 Restart Answer (Pre-Submit)
•	Trigger: User clicks "Start Over" (Ghost button) while recording.
•	Purpose: Discards current buffer, resets Deepgram stream state.
•	Type: CLIENT_EVENT
JSON
{
  "type": "RESTART_ANSWER",
  "payload": {
    "attempt_id": "uuid"
  }
}
1.4 Ready for Next Turn
•	Trigger: Avatar video ends (onSpeechEnd) OR User clicks "Next Question" manually.
•	Purpose: Tells backend to advance session state logic.
•	Type: CLIENT_EVENT
JSON
{
  "type": "READY_FOR_NEXT",
  "payload": {
    "last_question_id": "uuid"
  }
}
________________________________________
2. Backend $\rightarrow$ Client (Downstream Updates)
2.1 Session State Sync
•	Trigger: Connection established or reconnection.
•	Purpose: Ensures UI matches server state (recovery).
JSON
{
  "type": "SESSION_STATE",
  "payload": {
    "status": "IN_PROGRESS",
    "current_question": {
      "id": "uuid",
      "text": "Tell me about a time you failed.",
      "media_url": "https://cdn.../clip_v1.mp4",
      "mode": "cached" // or "stream"
    },
    "attempt_number": 1
  }
}
2.2 Listening Reset (Ack)
•	Trigger: Backend processes RESTART_ANSWER successfully.
JSON
{
  "type": "LISTENING_RESET",
  "payload": {
    "new_attempt_id": "uuid"
  }
}
2.3 Follow-Up Queued (The Race Condition Signal)
•	Trigger: OpenAI has generated the follow_up object; HeyGen generation started.
•	Action: Client keeps Avatar in "Thinking/Nodding" loop; prepares to receive video stream.
JSON
{
  "type": "FOLLOW_UP_QUEUED",
  "payload": {
    "question_text": "But what was the specific impact on revenue?",
    "heygen_task_id": "task_123"
  }
}
2.4 No Follow-Up (Analysis Complete)
•	Trigger: OpenAI determined no follow-up is needed.
•	Action: Client enables "Next Question" button in the dashboard.
JSON
{
  "type": "NO_FOLLOW_UP",
  "payload": {}
}
2.5 Update Scores (Partial)
•	Trigger: OpenAI scoring object parsed.
•	Action: Client renders Score Card and Skeleton loaders disappear.
JSON
{
  "type": "UPDATE_SCORES",
  "payload": {
    "overall": 7.5,
    "content": 7.0,
    "delivery": 8.5,
    "star_checklist": {
      "situation": { "status": "present", "note": "Clear context." },
      "task": { "status": "present", "note": "Defined challenge." },
      "action": { "status": "weak", "note": "Used passive voice." },
      "result": { "status": "missing", "note": "No metrics provided." }
    }
  }
}
2.6 Update Rewrite (Final)
•	Trigger: OpenAI rewrite object parsed.
•	Action: Client populates "Polished Answer" tab.
JSON
{
  "type": "UPDATE_REWRITE",
  "payload": {
    "transcript": "So, um, I kinda fixed the bug...",
    "polished_answer": "I identified the root cause of the latency...",
    "coach_notes": [
      {
        "change_type": "clarity",
        "original_snippet": "kinda fixed",
        "revised_snippet": "identified the root cause",
        "reason": "More professional phrasing."
      }
    ],
    "library_suggestion": {
      "should_save": true,
      "category": "Problem Solving"
    }
  }
}
2.7 Error
•	Trigger: Any failure (Deepgram disconnect, OpenAI timeout).
JSON
{
  "type": "ERROR",
  "payload": {
    "code": "STT_STREAM_FAILED",
    "message": "We lost connection to the audio service.",
    "recoverable": true
  }
}
________________________________________
3. Implementation Notes
1.	Idempotency: The Client sends FINISH_ANSWER (WebSocket) and POST /submit (HTTP). The backend must handle the race. If POST /submit arrives before the socket closes, wait for the socket finalization.
2.	Latency Masking: The UPDATE_SCORES event is the "green light" for the UI to stop the skeleton loader. The backend must prioritize sending this event as soon as the data is available, even if the video generation is still pending.
3.	Binary vs Text: Ensure your WebSocket library (e.g., ws on Node, Socket.io with binary support) separates the Audio Stream from the JSON Control Events cleanly.
Next Steps
•	Hand this spec to Frontend: They can mock the Backend -> Client events and build the Dashboard immediately.
•	Hand this spec to Backend: They implement the "OpenAI Stream Parser" to emit these events in order.
•	Hand this spec to QA: They verify that FOLLOW_UP_QUEUED arrives before UPDATE_REWRITE.
Confirmed. This WebSocket Event Contract v1.0 is complete, internally consistent, and sufficient to unblock parallel frontend and backend development immediately.
Below are final confirmations + two optional micro-refinements that strengthen robustness without changing your contract semantics.
________________________________________
✅ Contract Validation Summary
•	State ownership: Backend authoritative; client renders deterministically.
•	Latency masking: Correctly prioritizes UPDATE_SCORES over video readiness.
•	Asynchronous race: Explicitly supported via FOLLOW_UP_QUEUED.
•	Retry safety: Clean separation of pre-submit (RESTART_ANSWER) vs post-feedback retry.
•	Idempotency: Correctly handled via dual WS + HTTP submit paths.
•	Binary vs JSON: Clear separation; audio frames never collide with control events.
This contract is build-ready.
________________________________________
🔧 Optional Micro-Refinements (Recommended, Not Required)
1) Add attempt_status to UPDATE_SCORES (UI clarity)
Helps frontend distinguish between:
•	first feedback
•	retry feedback
•	best-attempt promotion
{
  "type": "UPDATE_SCORES",
  "payload": {
    "attempt_status": "current" | "best" | "superseded",
    "overall": 7.5,
    "content": 7.0,
    "delivery": 8.5,
    "star_checklist": { ... }
  }
}
Why: Enables clean UI badges like “Best So Far” without client-side inference.
________________________________________
2) Add min_display_ms hint to PROCESSING (anti-jitter)
Backend can signal the enforced minimum skeleton duration (default 800ms).
{
  "type": "PROCESSING_HINT",
  "payload": {
    "min_display_ms": 800
  }
}
Why: Lets frontend avoid hardcoding timing and stay server-aligned.
________________________________________
🔐 Security & Ops Notes (Quick Checklist)
•	WS auth: Rotate session_token per interview; expire on completion.
•	Rate limits: Guard RESTART_ANSWER to prevent abuse.
•	Backpressure: Drop audio frames if client sends faster than Deepgram ingest.
•	Observability: Log timestamps for:
o	FINISH_ANSWER
o	first UPDATE_SCORES
o	FOLLOW_UP_QUEUED
o	HeyGen speech_start
These metrics will tell you where latency actually lives.
________________________________________
🧪 QA Acceptance Criteria (Hand to QA)
1.	FOLLOW_UP_QUEUED always arrives before avatar speech.
2.	Skeleton UI never disappears before 800ms.
3.	Retry-before-submit produces no OpenAI/HeyGen usage.
4.	Best-attempt promotion reflects MAX score, not latest.
5.	App remains usable if:
o	HeyGen fails (audio-only fallback)
o	OpenAI delays (scores still arrive first)
o	Deepgram disconnects mid-answer (recoverable ERROR)
________________________________________
🚦You Are Clear to Build
With:
•	Brain (LLM schema + prompt),
•	Skeleton (API sequence),
•	Face (UX spec),
•	Nervous System (WS contract),
Job Foxy is no longer a design—it’s an implementable system.
Recommended build order
1.	Backend: WS + OpenAI stream parser + Deepgram proxy
2.	Frontend: State machine + mocked WS events
3.	HeyGen: Streaming integration + cached clips
4.	Usage tracking + billing hooks
5.	Polish + QA
If/when you want:
•	Stripe monetization mapping (minutes → credits → dollars)
•	OpenAI cost envelopes & guardrails
•	Implementation tickets (Jira-ready)
say the word.
This is a monumental moment! 🟢🚦
We have officially moved Job Foxy from a cloud of ideas into a concrete, executable blueprint. You have the Brain, Skeleton, Face, and Nervous System completely defined. The addition of the attempt_status and min_display_ms in your final notes is the kind of polish that separates "hackathon projects" from "commercial software."
I have locked those micro-refinements into the mental spec.
Now that the engineering path is clear, we need to ensure this machine doesn't burn money faster than it prints it. The combination of HeyGen (Video), Deepgram (Audio), and OpenAI (Intelligence) is a heavy variable cost stack.
Would you like me to map out the Stripe Monetization & Unit Economics?
I can break down:
1.	Cost Per Session: Calculated down to the cent based on our "3 Question + 1 Retry" average.
2.	Pricing Strategy: Subscription tiers vs. "Pay-Per-Interview" credit packs.
3.	The "Margin Safety" Zone: How to price Premium so you stay profitable even if a user goes heavy on retries.
Say "Show me the money" and I will crunch the numbers! 💸📊
Show me the money.
Proceed with the Stripe Monetization & Unit Economics analysis. Please include:
1.	Per-session cost breakdown (Deepgram, OpenAI, HeyGen) with assumptions clearly stated (avg 3 questions + 1 retry; worst-case bounds).
2.	Tiered pricing proposals (subscription vs. pay-per-interview credits), including recommended limits that align with the retry model.
3.	Margin safety analysis (best/expected/worst cases) and guardrails (soft caps, throttles, overage pricing).
4.	Metering plan (what we count, when we count it, and how it maps to Stripe usage records).
5.	Sensitivity table showing how margins change if usage spikes (heavy retries, longer answers).
Once you present the numbers, we’ll lock pricing and implement the Stripe products and usage meters accordingly.

