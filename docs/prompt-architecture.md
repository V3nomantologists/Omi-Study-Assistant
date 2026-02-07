# Prompt Architecture (Structure)

## System prompt purpose
- Define the skill as course-aware and exam-focused; not a general assistant.
- Enforce safety/PII minimization and grounding in stored course materials.
- Require citations and allow "I don't have that yet" when data is missing.
- List disallowed behaviors (general chat, assignment solutions, plagiarism aid, calendar replacement) to prevent scope creep.

## Instruction prompt purpose
- Guide turn-level behavior: detect intent (setup, ingest, quiz, study plan, exam Q&A, review), confirm course/topic/deadline, and choose the right tool.
- Re-ask for course binding when absent to avoid over-generalization.
- Demand source references and decline when ungrounded to reduce hallucination.
- Enforce allowed actions to prevent scope creep.

## Tool/function prompt purpose
- Specify inputs/outputs for memory ops (store/fetch courses, materials, quiz history) and generators (quizzes, plans, summaries) with required course IDs and provenance.
- Enforce structured parameters to avoid ambiguity; reject calls lacking course/topic/deadline where required.
- Require tools to return source-linked data and confidence flags; assistant surfaces them to reduce hallucination.
- Expose only minimal tool surface and validate requests against course ownership and tier limits to prevent scope creep.
