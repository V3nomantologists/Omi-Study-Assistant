# Architecture (Conceptual)

## Goals
- Operate as an Omi app store skill: voice-first, tool-driven, no custom UI.
- Stay course-scoped: every action tied to an enrolled course and uploaded materials.
- Ground responses in stored materials with provenance; allow "I don't have that yet" when missing.

## High-level components
- **Omi convo layer**: handles voice input/output; routes intents to tools.
- **Intent handler**: classifies turn (setup, ingest, quiz, study plan, exam Q&A, review) and validates course binding.
- **Ingestion pipeline**: normalizes PDFs/text/voice to text; chunks, embeds, tags to course/week/module; detects near-duplicates.
- **Knowledge store (conceptual)**: stores chunks with embeddings, concepts, quiz artifacts, mastery signals; per-course partitioning.
- **Quiz/plan generator**: builds grounded flashcards/short-answer items and time-boxed study plans using deadlines and mastery.
- **Exam intelligence**: prioritizes topics by time-to-exam and weakness; picks formats (recall-heavy near exam).
- **Tier gatekeeper**: enforces free/paid limits (courses, uploads, quiz counts, plan counts, horizon for guidance).

## Core flows
- **Course setup**: capture course metadata (name/code, instructor, term); create course slot; enforce tier limits.
- **Material ingest**: user uploads/points to PDF/text/voice; pipeline normalizes, chunks, embeds, tags to course/week; deduplicate; store provenance.
- **Quiz request**: require course/topic; fetch relevant chunks/concepts; generate items with source links; update mastery from user answers.
- **Study plan**: take time budget and upcoming exam/assignment; select topics by urgency and weakness; emit a timed sequence of drills/recaps.
- **Exam guidance**: weigh topics by time-to-exam, instructor emphasis, and user weakness; propose focused drills and brief summaries.
- **Review scheduling**: spaced review based on mastery; surface missed/weak items first; shorten intervals near exam.

## Guardrails
- Refuse general chat or out-of-course topics.
- Decline assignment solving or plagiarism aid.
- Minimize PII; only store user-provided course/deadline info.
- Always cite sources; admit when data is missing.
