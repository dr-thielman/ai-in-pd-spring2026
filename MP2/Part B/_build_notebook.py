"""
Build script for MP2 Part B starter notebook.
Generates MP2_PartB_Context_Management.ipynb using nbformat.

Run from the repo root or from MP2/Part B/:
    python "MP2/Part B/_build_notebook.py"
"""

import sys
import os
import textwrap

import nbformat
from nbformat.v4 import new_notebook, new_code_cell, new_markdown_cell

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(OUT_DIR, "MP2_PartB_Context_Management.ipynb")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def md(source: str) -> nbformat.NotebookNode:
    """Create a markdown cell, auto-dedenting."""
    return new_markdown_cell(textwrap.dedent(source).strip())


def code(source: str) -> nbformat.NotebookNode:
    """Create a code cell, auto-dedenting."""
    return new_code_cell(textwrap.dedent(source).strip())


cells: list[nbformat.NotebookNode] = []

# ═══════════════════════════════════════════════════════════════════════════
# HEADER
# ═══════════════════════════════════════════════════════════════════════════

cells.append(md("""\
    # Context Management for the MiniClaw
    ## ME 493B — AI in Product Development | Mini-Project 2, Part B

    **Instructor:** Scott Thielman, PhD — University of Washington Bothell
    **Due:** Monday, April 27, 2026 at 11:59 PM
    **Points:** 50 (Part B). Part A is worth 50 points separately.

    ---

    ### What this notebook is

    This is the research phase of the MiniClaw project. Jordan Chen has reviewed
    your MP1 gear train designs and wants deeper research before the team moves
    to detailed design. Read the memo from Jordan (`MP2_PartB_Research_Directive.docx`)
    before starting.

    You have access to ACME's internal knowledge base — 15 documents covering
    manufacturing capabilities, material test data, previous product history,
    engineering standards, and vendor information. Your job is to demonstrate
    that **managing context** produces better AI-assisted engineering answers
    than working from general knowledge alone.

    ### How to use this notebook

    This notebook provides the structure and the data. **You fill in every
    section.** Use markdown cells for written deliverables and code cells for
    your RAG pipeline work. Use GitHub Copilot, Claude, ChatGPT, or any AI
    tool — the learning is in directing the AI with the right context and
    evaluating whether the output is trustworthy.

    The RAG pipeline you built in Part A is one approach for managing the ACME
    context. You may reuse that pipeline, adapt it, or use any approach you choose.

    ### Grading summary (50 pts)

    | Deliverable | Points |
    |-------------|--------|
    | 1. Project Intake Document | 10 |
    | 2. Information Strategy | 8 |
    | 3. Context Package + Before/After Demo | 15 |
    | 4. Research Synthesis | 7 |
    | 5. Working PRD | 10 |
    | **Total** | **50** |

    ### How to submit

    1. Complete all sections in this notebook
    2. Make sure all cells run top-to-bottom without errors
    3. **Commit and push** to your course repository via the Source Control panel
    4. Verify your push succeeded on GitHub (check that your latest changes appear)
    5. Submit your GitHub repo URL on Canvas (same URL as Part A)
"""))

# ═══════════════════════════════════════════════════════════════════════════
# SECTION 0: SETUP
# ═══════════════════════════════════════════════════════════════════════════

cells.append(md("""\
    ---
    ## Section 0: Setup

    Run this cell to load the ACME document corpus and any libraries you need.
    This is the one pre-written cell — everything after this is yours.
"""))

cells.append(code("""\
    # ── Setup: load the ACME corpus and standard libraries ──────────────────
    # Run this cell first. Do not modify.

    import sys, os, json

    # If running from the MP2/Part B folder, the corpus is right here.
    # If running from the repo root, adjust the path.
    _nb_dir = os.path.abspath("")
    if os.path.exists(os.path.join(_nb_dir, "corpus", "manifest.json")):
        _corpus_dir = _nb_dir
    elif os.path.exists(os.path.join(_nb_dir, "MP2", "Part B", "corpus", "manifest.json")):
        _corpus_dir = os.path.join(_nb_dir, "MP2", "Part B")
    else:
        raise FileNotFoundError(
            "Cannot find corpus/ folder. Make sure you are running this notebook "
            "from the MP2/Part B/ directory or the repository root."
        )

    sys.path.insert(0, _corpus_dir)
    from acme_miniclaw_corpus import acme_documents

    print(f"Loaded {len(acme_documents)} ACME documents")
    print(f"Total characters: {sum(len(d['text']) for d in acme_documents):,}")
    print()
    for doc in acme_documents:
        print(f"  {doc['id']:15s} {doc['title'][:60]:60s} ({len(doc['text']):,} chars)")
"""))

cells.append(code("""\
    # ── Add any additional imports or setup here ────────────────────────────
    # For example, if reusing your Part A RAG pipeline:
    #   import chromadb
    #   from sentence_transformers import SentenceTransformer
    #   model = SentenceTransformer("all-MiniLM-L6-v2")
    #
    # Or install/import anything else you need.
"""))

# ═══════════════════════════════════════════════════════════════════════════
# DELIVERABLE 1: PROJECT INTAKE DOCUMENT
# ═══════════════════════════════════════════════════════════════════════════

cells.append(md("""\
    ---
    ## Deliverable 1: Project Intake Document (10 pts)

    Apply the **PCS intake framework** (from Session 5) to the MiniClaw project.
    This is the document that would kick off the project in a real engineering firm.

    **Include:**
    - **Vision** — what does ACME want the MiniClaw to achieve? (Use the ACME corpus
      for business context, not just the original design brief.)
    - **Mission** — your specific engineering scope
    - **In scope / Out of scope** — what are you designing vs. what is someone else's
      problem?
    - **Key assumptions** — what are you taking as given?
    - **Responsibilities** — who owns what?
    - **Phase Zero recommendation** — should the project proceed directly to design,
      or does it need more exploration first? Justify your answer.

    **Note:** The MiniClaw design brief from MP1 is your starting point, but your
    intake should reflect the deeper context from the ACME corpus — company
    capabilities, manufacturing constraints, business goals for RobotExpo.

    *Write your intake document in the markdown cell below. Use headings to
    organize the sections.*
"""))

cells.append(md("""\
    ### Project Intake: MiniClaw

    *(Replace this cell with your intake document)*
"""))

# ═══════════════════════════════════════════════════════════════════════════
# DELIVERABLE 2: INFORMATION STRATEGY
# ═══════════════════════════════════════════════════════════════════════════

cells.append(md("""\
    ---
    ## Deliverable 2: Information Strategy (8 pts)

    Answer: **what information do you need to design the MiniClaw well?**

    Categorize into three buckets:

    | Bucket | Description | Examples needed |
    |--------|-------------|-----------------|
    | **AI knows well** | General engineering knowledge the AI can be trusted on | 2–3 MiniClaw-specific examples |
    | **AI knows partially** | Correct in general, may be wrong in specifics | 2–3 MiniClaw-specific examples |
    | **Requires ACME context** | Only available in the internal knowledge base | 2–3 MiniClaw-specific examples |

    This demonstrates you understand **WHY** context management matters,
    not just how to do it.

    *Write your information strategy in the markdown cell below.*
"""))

cells.append(md("""\
    ### Information Strategy

    *(Replace this cell with your information strategy)*
"""))

# ═══════════════════════════════════════════════════════════════════════════
# DELIVERABLE 3: CONTEXT PACKAGE + BEFORE/AFTER DEMO
# ═══════════════════════════════════════════════════════════════════════════

cells.append(md("""\
    ---
    ## Deliverable 3: Context Package + Before/After Demo (15 pts)

    This is the **core deliverable**. Two steps:

    ### Step 1: Build your context package

    Load the ACME document corpus into a RAG pipeline. You can reuse or adapt
    your Part A pipeline, or build something new. Show your work in the code
    cells below.

    ### Step 2: Before/After demonstration

    Choose **3 specific MiniClaw engineering questions** where ACME context
    would matter. For each question, show:

    1. The AI's answer **WITHOUT** the ACME context (general knowledge only)
    2. The AI's answer **WITH** the ACME context (RAG-augmented)
    3. **Your assessment:** What changed? Is the augmented answer better? What
       did it get right that the baseline missed?

    **Choose meaningful engineering questions, not trivia.**
    - ✅ Good: "What safety factor should I use for 3D-printed PLA gears?"
    - ✅ Good: "What PLA printing parameters should I use for the MiniClaw gears?"
    - ❌ Bad: "What is ACME's address?"
"""))

cells.append(md("""\
    ### Step 1: Build context package
"""))

cells.append(code("""\
    # ── Build your RAG pipeline / context package here ──────────────────────
    # Load the ACME corpus into your retrieval system.
    # You can reuse your Part A approach or try something different.

    # Your code here
"""))

cells.append(md("""\
    ### Step 2: Before/After Demo

    #### Question 1
"""))

cells.append(code("""\
    # ── Question 1: WITHOUT ACME context ────────────────────────────────────
    # Ask your question using general AI knowledge only (no RAG retrieval).

    # Your code here
"""))

cells.append(code("""\
    # ── Question 1: WITH ACME context ───────────────────────────────────────
    # Ask the same question using your RAG pipeline with ACME documents.

    # Your code here
"""))

cells.append(md("""\
    **Question 1 — Assessment:**

    *(What changed between the two answers? Is the context-augmented answer
    better? What did it get right that the baseline missed?)*
"""))

cells.append(md("""\
    #### Question 2
"""))

cells.append(code("""\
    # ── Question 2: WITHOUT ACME context ────────────────────────────────────

    # Your code here
"""))

cells.append(code("""\
    # ── Question 2: WITH ACME context ───────────────────────────────────────

    # Your code here
"""))

cells.append(md("""\
    **Question 2 — Assessment:**

    *(Your assessment here)*
"""))

cells.append(md("""\
    #### Question 3
"""))

cells.append(code("""\
    # ── Question 3: WITHOUT ACME context ────────────────────────────────────

    # Your code here
"""))

cells.append(code("""\
    # ── Question 3: WITH ACME context ───────────────────────────────────────

    # Your code here
"""))

cells.append(md("""\
    **Question 3 — Assessment:**

    *(Your assessment here)*
"""))

# ═══════════════════════════════════════════════════════════════════════════
# DELIVERABLE 4: RESEARCH SYNTHESIS
# ═══════════════════════════════════════════════════════════════════════════

cells.append(md("""\
    ---
    ## Deliverable 4: Research Synthesis (7 pts)

    Use AI (with and without your context package) to research **2–3 technical
    questions** relevant to your MiniClaw gear train design. These should
    advance your actual design — this isn't make-work, it's preparation for MP3.

    For each question, document:
    1. The question you asked
    2. The tool(s) you used and the context you provided
    3. The answer you received
    4. **Your engineering evaluation:** Do you trust this answer? What would
       you verify before using it in a design?
"""))

cells.append(code("""\
    # ── Research question 1 ─────────────────────────────────────────────────

    # Your code here
"""))

cells.append(md("""\
    **Research Question 1 — Evaluation:**

    *(What did you ask? What did the AI say? Do you trust it? What would you verify?)*
"""))

cells.append(code("""\
    # ── Research question 2 ─────────────────────────────────────────────────

    # Your code here
"""))

cells.append(md("""\
    **Research Question 2 — Evaluation:**

    *(Your evaluation here)*
"""))

cells.append(code("""\
    # ── Research question 3 (optional) ──────────────────────────────────────

    # Your code here (if doing a third question)
"""))

cells.append(md("""\
    **Research Question 3 — Evaluation (if applicable):**

    *(Your evaluation here)*
"""))

# ═══════════════════════════════════════════════════════════════════════════
# DELIVERABLE 5: WORKING PRD
# ═══════════════════════════════════════════════════════════════════════════

cells.append(md("""\
    ---
    ## Deliverable 5: Preliminary Design Concept / Working PRD (10 pts)

    Based on your research and context work, produce a **working PRD** for the
    MiniClaw. This is not a final design — it's a requirements document that will
    guide MP3's detailed design phase.

    **Include:**
    - **8–12 product requirements** — specific, measurable, testable (as practiced
      in Session 6). For each, note the source: design brief, your research, or
      the ACME context.
    - **2–3 design directions** you're considering, with brief rationale
    - **Key open questions** that MP3 will need to resolve

    **This document carries forward.** Your PRD will guide your detailed design
    work in MP3. Write it as if your future self is the audience.
"""))

cells.append(md("""\
    ### MiniClaw Working PRD

    *(Replace this cell with your PRD. Use the structure below or adapt it.)*

    #### Product Requirements

    | # | Requirement | Source | Testable? |
    |---|-------------|--------|-----------|
    | 1 | *(example: Grip force ≥ 5 N at 25 mm jaw opening)* | Design brief | Yes — force gauge at jaw tips |
    | 2 | | | |
    | ... | | | |

    #### Design Directions Under Consideration

    **Direction A:** *(describe and give rationale)*

    **Direction B:** *(describe and give rationale)*

    #### Open Questions for MP3

    - *(question 1)*
    - *(question 2)*
"""))

# ═══════════════════════════════════════════════════════════════════════════
# SUBMISSION
# ═══════════════════════════════════════════════════════════════════════════

cells.append(md("""\
    ---
    ## Submission

    Before submitting, verify:

    - [ ] All cells run top-to-bottom without errors
    - [ ] All five deliverables are complete (no placeholder text remaining)
    - [ ] Before/after demo shows three meaningful engineering questions
    - [ ] PRD has 8–12 specific, measurable requirements
    - [ ] Your assessments and evaluations reflect your own engineering judgment

    **To submit:**
    1. Save this notebook (Ctrl+S)
    2. Open the **Source Control** panel in VS Code (left sidebar, branch icon)
    3. Stage your changes, write a commit message, and **Commit & Push**
    4. Verify on GitHub that your notebook appears with all outputs visible
    5. Submit your repository URL on **Canvas** (same URL as Part A)

    > ⚠️ **Codespace warning:** Your Codespace may be deleted after a period of
    > inactivity. Always push your work to GitHub — don't rely on the Codespace
    > persisting.
"""))


# ═══════════════════════════════════════════════════════════════════════════
# WRITE NOTEBOOK
# ═══════════════════════════════════════════════════════════════════════════

nb = new_notebook()
nb.cells = cells
nb.metadata.kernelspec = {
    "display_name": "Python 3",
    "language": "python",
    "name": "python3",
}
nb.metadata.language_info = {
    "name": "python",
    "version": "3.11.0",
}

with open(OUT_PATH, "w", encoding="utf-8") as f:
    nbformat.write(nb, f)

print(f"Saved: {OUT_PATH}")
print(f"  {len(cells)} cells ({sum(1 for c in cells if c.cell_type == 'markdown')} markdown, "
      f"{sum(1 for c in cells if c.cell_type == 'code')} code)")
