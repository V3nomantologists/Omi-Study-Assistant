# Conceptual Data Model

## Per course
- Identity: name/code, instructor, term, schedule cadence.
- Materials: normalized chunks with embeddings, source refs (page/slide/timestamp), module/week tags.
- Concepts: distilled ideas, definitions, formulas, theorems, timelines; concept graph with prereqs/relations.
- Assessments: midterm/final dates, assignments, weightings, expected topics.
- Quiz artifacts: Q/A pairs, distractors, flashcards; tags for concept, difficulty, recency, and user performance.
- Mastery: per-concept strengths/weaknesses with miss counts and latency signals.
- Plans: scheduled study tasks tied to deadlines with status.

## Per user
- Course roster and enrollment states.
- Preferences: session length, pacing, quiz style, reminder cadence.
- Performance history: accuracy, latency, confusion flags, seen counts across courses.
- Interaction trace pointers (not raw transcripts): what was asked, which materials cited, outcomes.
- Privacy: minimal PII; only user-provided course/deadline info.

## Per study session
- Intent and course/topic focus.
- Selected materials/knowledge slices referenced.
- Questions served and answers; correctness and confidence (if provided).
- Time-on-task, interruptions, completion status.
- Mastery deltas and next-review suggestions (spaced repetition scheduling).

## Retrieval principles
- Retrieve by meaning via embeddings on chunks, concepts, and quiz items.
- Keep provenance to ground responses and allow source citation.
- Continuously update mastery and scheduling based on interactions.
