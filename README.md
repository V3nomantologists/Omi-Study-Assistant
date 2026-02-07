# Omi AI App Store – College Study & Exam Prep App

## Purpose
Voice-first Omi skill that ingests a student’s course materials and deadlines to deliver course-aware quizzes, study plans, and exam-focused help.

## Core responsibilities
- Intake courses with metadata (name, instructor, term) and track multiple concurrent courses.
- Ingest and normalize PDFs, text notes, and voice transcripts into referenced knowledge chunks per course.
- Generate targeted quizzes (flashcards, short-answer) tied to course materials and user performance.
- Build study plans based on user-provided time and deadlines for exams/assignments.
- Provide course-aware Q&A and exam guidance grounded in stored materials and timelines.

## Explicit non-goals
- General-purpose chat or topics outside enrolled courses.
- Custom UI, mobile app, or frontend surfaces (Omi conversation/tooling only).
- Calendar/task manager replacement; only user-provided deadlines unless integrated later.
- Grading assignments or providing plagiarism assistance.

## MVP (must-have)
- Voice-first course intake with one active course limit (free tier baseline).
- Reliable ingestion for PDF/text/voice into chunked, referenced knowledge.
- Quiz generation (flashcards/short-answer) grounded in ingested material with daily caps.
- Study plan generator that fits user-stated time and nearest exam/assignment date.
- Course-aware Q&A with source grounding and minimal memory (course roster, materials, quiz history, weak/strong signals).

## Nice-to-have (excluded from MVP)
- Multi-course concurrency beyond the free tier limit.
- Adaptive spaced repetition with fine-grained mastery curves and latency tracking.
- High-yield topic mining from syllabi/review sheets with weightings.
- Advanced exam strategies (section-specific pacing, mixed-format drills).
- Calendar integrations; automated deadline ingestion.
- Collaborative/shared courses or instructor dashboards.

## Monetization logic
- Free: 1 course; 3 uploads/week; 20 quiz questions/day; 1 study plan/day; exam guidance for next 7 days; basic spaced review without personalization.
- Paid: Up to 5 courses; unlimited uploads with priority; unlimited quizzes/study plans with adaptive difficulty; full exam prep with multi-exam scheduling, personalized spaced repetition, high-yield topic surfacing, and remediation sequences.
- Upgrade reason: Cover all courses with unlimited, personalized exam prep and spaced reviews targeting weak spots.

## Voice command intents (examples)
### Setup
- “Add Calculus II with Dr. Lee this term.”
- “Upload my Week 3 Physics 201 lecture PDF.”
- “Set Psych 101 midterm to March 12.”

### Studying
- “Quiz me on protein synthesis for Bio 110.”
- “Give me a 20-minute study plan for today’s Econ readings.”
- “Review the key proofs from last week’s Linear Algebra notes.”

### Exams
- “What should I focus on for Friday’s CS midterm?”
- “Drill likely short answers for History 210.”

### Review
- “Summarize my most-missed flashcards from Chemistry.”
- “Schedule a spaced review of stats formulas before the exam.”
