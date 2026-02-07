# Omi AI App Store – College Study & Exam Prep App

## What it does
Voice-first Omi skill that works only with the student’s stored courses and materials. It ingests PDFs/notes/voice transcripts, generates grounded quizzes, and produces short study plans aligned to upcoming exams and deadlines.

## What it doesn’t do
- No general-purpose chat or topics outside enrolled courses
- No custom UI or mobile app surfaces (Omi conversation/tooling only)
- No calendar/task manager replacement; relies on user-provided deadlines
- No grading or plagiarism assistance

## How it behaves
- Prefers tool calls over freeform answers; one tool per turn
- Asks at most one clarification when course/material context is missing
- Cites course/material scope and refuses to fabricate content
- Keeps responses short and voice-friendly; immediate execution for quiz/plan
- Clarifies intent when utterances are ambiguous
- One-time onboarding line: "I'll only use the courses and materials you add."

## Design principles
- Deterministic behavior over cleverness
- Tool-first, no hallucination
- Single clarification max
- User-provided data only

## Known limitations
- Requires user to ingest materials; cannot answer without stored data
- No grade predictions or guarantees
- Simple JSON persistence (local, non-production)
- Basic course-name matching; relies on course context or name mention

## Voice command intents (examples)
- “Add Calculus II with Dr. Lee this term.”
- “Upload my Week 3 Physics 201 lecture PDF.”
- “Set Psych 101 midterm to March 12.”
- “Quiz me on protein synthesis for Bio 110.”
- “What should I study today for CS?”
- “Give me a 20-minute study plan for Econ readings.”
- “Review the key proofs from last week’s Linear Algebra notes.”
- “What should I focus on for Friday’s CS midterm?”
- “Drill likely short answers for History 210.”
- “Summarize my most-missed flashcards from Chemistry.”
