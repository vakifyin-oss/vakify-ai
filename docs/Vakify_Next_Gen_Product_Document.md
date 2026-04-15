# Vakify 2.0 - Next-Gen Product Document

## 1. Vision
Build Vakify as a unified AI learning platform where any authenticated user can:
- Ask anything in chat and get high-accuracy responses
- Learn with multi-modal outputs (text + diagram + image + audio + code)
- Practice labs in multiple languages (Python, Java, C, C++)
- Complete daily/weekly AI-generated tasks and quizzes
- Earn XP, badges, rewards, and leaderboard ranking
- Track progress in a personal dashboard

This should feel like: "ChatGPT + Coding Lab + Adaptive Learning + Gamified Progress Platform".

## 2. Product Direction (What Changes from Current System)
Current system strengths:
- Learning style detection
- Personalized content generation
- Chat + practice foundations

Target system changes:
- Remove strict role-based split for learners (single user platform)
- Keep one optional admin/super-admin backend for moderation only
- Upgrade chat accuracy with Hybrid AI architecture (LLM + RAG + Validation + Feedback loop)
- Add gamification and performance systems as first-class features

## 3. Core Product Principles
1. Accuracy first, then creativity
2. Personalization from behavior, not just questionnaire
3. Practice-first learning, not passive reading
4. Transparent progress and rewards
5. Low-latency and safe execution for coding labs

## 4. Must-Have Feature Set

### 4.1 Universal Auth (No role split for learner experience)
- Single sign-in/sign-up for all users
- Use external auth provider (Clerk/Auth0/Firebase Supabase Auth)
- Store identity in provider; app stores profile + learning metrics

### 4.2 AI Chat Engine (High-Accuracy)
- Multi-provider LLM layer (primary + fallback)
- Prompt templates per intent: explain, compare, code, quiz, revise
- Output mode selector: concise, detailed, ELI5, exam mode
- Rich response blocks: explanation, examples, diagram, checklist, next actions

### 4.3 Multi-Language Labs
- Language selector: Python, Java, C, C++, JS
- Secure remote code execution service
- Test case runner + output + error hints
- Save attempts and improvements per topic

### 4.4 Daily Task + Weekly Quiz
- Daily AI-generated task for each user
- Weekly quiz schedule and attempt window
- Difficulty adaptation based on performance
- Auto scoring + rewards + streak impact

### 4.5 Gamification + Reward Vault
- XP, levels, streaks, badges, missions
- Reward vault: earned points, badge history, redeemable rewards
- Global and weekly leaderboard

### 4.6 Performance Dashboard
- Learning time, solved tasks, accuracy, weak topics
- Language-wise coding progress
- Streak and XP growth graph
- Recommended next steps

## 5. Accuracy Architecture (Main Differentiator)

### 5.1 Hybrid Response Pipeline
User Query -> Intent Classifier -> Retrieval (RAG) -> LLM Generate -> Validation Layer -> Confidence Score -> Final Response

### 5.2 Retrieval-Augmented Generation (RAG)
- Create a knowledge store from trusted content:
  - Notes, docs, curated references, solved examples
- Embed and index chunks in vector DB
- Retrieve top relevant chunks and inject into prompt context

### 5.3 Validation Layer
- Rule checks:
  - Output completeness
  - Topic alignment
  - Code syntax sanity (where possible)
- Optional second-pass AI verifier:
  - "Check factual consistency and missing steps"

### 5.4 Confidence Scoring
Each answer includes:
- Retrieval confidence (context quality)
- Generation confidence (validator pass score)
- Final confidence band: High / Medium / Low

### 5.5 Feedback Loop (Adaptive)
Track explicit and implicit feedback:
- Explicit: Helpful / Not helpful
- Implicit: time spent, retries, follow-up frequency, drop-offs
Adjust profile:
- Style preference weights
- Content complexity
- Recommended mode

## 6. Personalization Engine
Use weighted profile, not single-label style only:
- Visual_weight
- Auditory_weight
- Kinesthetic_weight
- Difficulty_level
- Topic_mastery per concept

Behavior signals:
- Chat engagement depth
- Quiz performance
- Lab success rate
- Time to solve

## 7. Gamification System Design

### 7.1 XP Rules (example)
- Read lesson: +5
- Ask quality question: +3
- Daily task complete: +20
- Weekly quiz pass: +50
- Lab solved: +30

### 7.2 Streak Rules
- Daily active learning >= threshold minutes keeps streak
- Miss day resets streak or applies grace token

### 7.3 Badge Rules (example)
- 5-day streak -> "Consistency Starter"
- 20 labs solved -> "Code Builder"
- 80% weekly quiz score x3 -> "Quiz Master"

### 7.4 Leaderboard
- Weekly leaderboard (resets each week)
- All-time leaderboard
- Fairness controls:
  - anti-spam XP caps
  - weighted scoring by task difficulty

## 8. Task + Quiz Engine

### Daily Task Generator
Inputs:
- User level
- Weak topics
- Recent activity
- Preferred language
Output:
- 1 conceptual + 1 practical micro-task

### Weekly Quiz Generator
- Mix of MCQ + code/debug + scenario
- Adaptive difficulty bands
- Score breakdown by topic

## 9. Multi-Language Lab Architecture
- Execution gateway API
- Queue jobs by language/runtime
- Sandbox + time/memory limits
- Standardized response format:
  - compile status
  - runtime status
  - stdout/stderr
  - test case pass ratio

## 10. UI/UX Blueprint

### Chat Screen
- Left: chat history + quick actions
- Center: structured response cards
- Tabs inside response: Explain | Diagram | Code | Practice | Quiz
- Confidence badge shown near response

### Dashboard
- KPI cards: XP, level, streak, weekly score
- Progress graphs: topics, language skills
- "Today’s Task" + "This Week Quiz"
- Leaderboard preview

### Rewards Vault
- Badge grid
- XP history timeline
- Redeem/reward section

## 11. Data Model (High-Level)
Recommended core entities:
- users
- user_profile
- chat_sessions
- chat_messages
- user_feedback
- tasks
- task_attempts
- quizzes
- quiz_attempts
- lab_submissions
- rewards
- badges
- user_badges
- leaderboard_snapshots

## 12. Security + Governance
- External auth provider token verification
- Rate limiting for chat/lab endpoints
- Prompt injection guardrails
- Output moderation layer
- Audit logs for critical actions

## 13. Analytics & KPIs
Primary KPIs:
- Helpful response rate
- Quiz improvement over time
- Task completion rate
- Lab success rate
- D7 and D30 retention
- Average response confidence

## 14. Implementation Roadmap (Practical)

### Phase 1 (2-3 weeks): Foundation Upgrade
- Single auth flow
- Unified dashboard skeleton
- Multi-language lab selector
- Chat UI response tabs

### Phase 2 (3-4 weeks): Accuracy Core
- RAG pipeline setup
- Validation layer + confidence score
- Feedback loop storage and adaptation

### Phase 3 (2-3 weeks): Gamification
- XP, streak, badges, reward vault
- Daily tasks + weekly quiz scheduler
- Leaderboard

### Phase 4 (2 weeks): Quality + Demo Polish
- Performance optimization
- Better visualizations
- Monitoring, logs, error reporting
- Final presentation mode and demo scripts

## 15. Minimum Demo Story (Exam Ready)
1. User login
2. Ask a query in chat
3. Show confidence score + structured answer
4. Run a lab in selected language
5. Complete daily task
6. Attempt weekly quiz
7. Show XP increase + badge unlock + leaderboard move
8. Show dashboard insights and adaptive recommendations

## 16. Viva-Ready Summary
"Vakify is an intelligent adaptive learning platform built on a hybrid AI architecture. It combines LLM generation, retrieval-based context, validation, confidence scoring, and feedback-driven adaptation. It supports multi-language coding labs, daily tasks, weekly quizzes, and gamified progression through XP, badges, streaks, and leaderboards. The system is designed for both learning effectiveness and measurable performance improvement."

## 17. Immediate Action Checklist (Start Here)
1. Finalize auth provider and remove learner role split
2. Add `difficulty_level` and `topic_mastery` profile fields
3. Implement daily task table + cron scheduler
4. Implement weekly quiz generator + scoring storage
5. Add reward vault tables (`xp_events`, `badges`, `user_badges`, `reward_wallet`)
6. Add leaderboard snapshot job (weekly + all-time)
7. Add RAG index + retrieval API
8. Add response validator + confidence scoring
9. Add explicit feedback (`helpful` / `not helpful`) on chat messages
10. Add dashboard widgets for tasks, quiz, streak, leaderboard rank

---

## 18. New Phase Execution Update (April 2026)

### 18.1 What Is Already Completed
- Clerk auth integrated as the active login system
- Legacy custom login/signup flows removed from routing
- Clerk-first entry page active (native Clerk sign-in UI)
- Signed-in user redirect to dashboard flow enabled

### 18.2 Current Goal for This Phase
Deliver a usable "Phase-Next" release with:
- Higher answer accuracy (RAG + validation + confidence)
- Daily/weekly learning loop (task + quiz)
- Visible gamification (XP, streak, leaderboard)
- Cleaner analytics dashboard for demo and viva

### 18.3 Sprint Plan (Execution-Ready)

#### Sprint A - Data and Backend Foundation (Week 1)
- Add new DB schema:
  - `user_profile` extensions: `difficulty_level`, `topic_mastery_json`, `preferred_languages`
  - `daily_tasks`, `daily_task_attempts`
  - `weekly_quizzes`, `weekly_quiz_attempts`
  - `xp_events`, `streaks`, `leaderboard_snapshots`
- Add backend APIs:
  - `GET /tasks/today`
  - `POST /tasks/:id/submit`
  - `GET /quiz/weekly`
  - `POST /quiz/:id/submit`
  - `GET /rewards/summary`
  - `GET /leaderboard`

#### Sprint B - Accuracy Layer (Week 2)
- Add retrieval layer:
  - chunking + embeddings + vector store
  - `retrieve_context(query)` service
- Add generation validator:
  - structure checks
  - topic alignment checks
  - code sanity checks (when response includes code)
- Add confidence fields in chat response:
  - `retrieval_confidence`
  - `validation_confidence`
  - `final_confidence_band`

#### Sprint C - Frontend Product Layer (Week 3)
- Dashboard cards:
  - Today Task
  - Weekly Quiz
  - XP + Streak
  - Leaderboard Preview
- Chat UI upgrade:
  - Helpful / Not Helpful controls
  - confidence badge near each assistant answer
- Rewards page:
  - badge wall
  - XP timeline

#### Sprint D - Demo and Stability (Week 4)
- Add cron jobs for:
  - daily task generation
  - weekly quiz publishing
  - leaderboard weekly snapshot reset
- Add monitoring:
  - API error logs
  - latency metrics
  - failed lab run diagnostics
- Build final demo script and viva narrative

### 18.4 Technical Deliverables Checklist
- [x] Clerk-only auth UX and routing
- [ ] Task engine DB + API
- [ ] Weekly quiz DB + API
- [ ] XP/streak/leaderboard services
- [ ] RAG retrieval service
- [ ] Validation + confidence response layer
- [ ] Chat feedback loop storage
- [ ] Dashboard upgrade widgets
- [ ] Rewards vault UI
- [ ] Final QA + deployment verification

### 18.5 Definition of Done for This Phase
- User can sign in via Clerk and immediately continue learning
- User gets a daily AI-generated task and can submit attempt
- User gets weekly quiz with score and topic breakdown
- Chat response shows confidence band and supports feedback
- Dashboard reflects XP, streak, and leaderboard rank
- Demo flow runs end-to-end without manual DB edits
4. Implement weekly quiz table + scoring flow
5. Add XP and badge event system
6. Add leaderboard API + UI widget
7. Add RAG MVP for top 3 subjects
8. Add response confidence score in chat API
