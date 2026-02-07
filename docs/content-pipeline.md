# Study Content Pipeline (Conceptual)

## Inputs
- PDFs, text notes, voice notes (transcribed to text).

## Steps
- Normalize: convert to clean text; retain page/slide/timestamp refs.
- Chunk and embed: split on semantic boundaries; embed; store source refs and course/week/module tags.
- Tag to course: require course ID on upload; auto-suggest if ambiguous using similarity; capture module/week from filenames/headings/dates.
- Concept extraction: identify entities, definitions, formulas, theorems, timelines; build concept graph with prereqs and related ideas.
- Importance scoring: weigh headings/emphasis, repetition, instructor cues, proximity to deadlines, and user miss history; elevate declared exam topics.
- Redundancy control: detect near-duplicates via embeddings/fuzzy hashes; collapse duplicates while keeping source pointers; favor authoritative sources.

## Outputs
- Practice questions: flashcards, MCQ, short-answer anchored to chunks/concepts; difficulty tags.
- Short explanations: concise, source-linked clarifications per concept or query.
- Exam-focused summaries: brief, exam-weighted digests organized by topics and upcoming assessments.

## Feedback loop
- Use user performance and corrections to reweight importance, adjust difficulty, and prune low-signal or redundant items over time.
