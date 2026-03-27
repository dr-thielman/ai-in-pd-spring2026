---
name: me493b-course-structure
description: >
  Reference for all structural, naming, and repository conventions for 
  ME 493B "AI in Product Development" at UW Bothell (Spring 2026). 
  Consult this file before creating any course file, notebook, folder, 
  or spec document. Covers repo layout, file naming, notebook structure, 
  spec document format, GitHub Classroom workflow, and Canvas integration.
---

# ME 493B Course Structure Reference

## Course identity
- **Course:** ME 493B — AI in Product Development
- **Institution:** University of Washington Bothell
- **Term:** Spring 2026
- **Instructor:** Scott Thielman, PhD (thielman@uw.edu)
- **Schedule:** Tuesdays and Thursdays, 3:30–5:30 PM, UW1 041
- **Enrollment:** 24 students max

---

## GitHub repository

- **Account:** dr-thielman
- **Repo name:** ai-in-pd-spring2026
- **URL:** https://github.com/dr-thielman/ai-in-pd-spring2026
- **Visibility:** Public (required for Codespaces access by students)
- **Template:** Marked as a GitHub Template Repository (for GitHub Classroom)

---

## Repository folder structure

```
ai-in-pd-spring2026/
├── hello_world.ipynb          # Entry point for all students — setup lesson
├── README.md                  # Student-facing: how to open in Codespaces,
│                              # how to run locally, course overview
├── requirements.txt           # Shared Python deps for all notebooks
├── .devcontainer/
│   └── devcontainer.json      # Codespaces config (see spec below)
│
├── specs/                     # Specification documents — intentionally visible
│   ├── SPEC_hello_world.md    # to students as examples of Goal & Direction
│   ├── SPEC_mp1_part_a.md
│   └── SPEC_mp2.md            # (and so on for each assignment)
│
├── mp1/                       # Mini-Project 1
│   └── mp1_part_a.ipynb
├── mp2/                       # Mini-Project 2
│   └── mp2_rag_pipeline.ipynb
├── mp3/                       # Mini-Project 3
├── mp4/                       # Mini-Project 4
├── mp5/                       # Mini-Project 5 (open-ended)
│
└── sessions/                  # Optional in-class demo notebooks
    ├── session01_intro.ipynb
    └── .gitkeep               # keeps folder tracked when empty
```

---

## File naming conventions

### Notebooks
| File | Convention | Example |
|------|-----------|---------|
| Setup lesson | `hello_world.ipynb` | `hello_world.ipynb` |
| Mini-project | `mp{N}_descriptive_name.ipynb` | `mp1_part_a.ipynb` |
| Session demo | `session{NN}_topic.ipynb` | `session03_embeddings.ipynb` |

- Use lowercase and underscores — no spaces, no hyphens in notebook names
- Session numbers are zero-padded to two digits (session01, session02...)
- MP part suffixes: `_part_a`, `_part_b` if a project has multiple notebooks

### Spec documents
| File | Convention | Example |
|------|-----------|---------|
| Notebook spec | `SPEC_{notebook_name}.md` | `SPEC_hello_world.md` |

- All caps `SPEC_` prefix makes specs visually distinct from other markdown
- Filename after prefix matches the notebook it generates exactly

### Other files
- `README.md` — always uppercase, repo root only
- `requirements.txt` — lowercase, repo root
- `devcontainer.json` — always in `.devcontainer/` subfolder

---

## Spec document format

Every notebook must have a corresponding spec in `specs/`. Specs serve
two purposes: (1) they are the source document handed to Claude Code to 
generate the notebook, and (2) they are intentionally visible to students 
as examples of the Goal & Direction pillar — showing that intent must be 
specified before implementation begins.

### Required spec sections

```markdown
# SPEC: {notebook_filename}.ipynb
## Course: ME 493B — AI in Product Development, Spring 2026
## Author: Scott Thielman
## Location of generated file: ai-in-pd-spring2026/{path}/{filename}.ipynb
## Location of this spec: ai-in-pd-spring2026/specs/SPEC_{filename}.md

---

## Purpose
[What this notebook teaches or accomplishes. 1–3 sentences.]

## Primary pillar emphasis
[Which of the five pillars this notebook primarily exercises:]
[Goal & Direction / Context Management / Tools & Integration /]
[Centaur Engineering / Evaluation & Trust]

## Student prerequisites
[What students must have done or know before opening this notebook]

## Tone
[Brief tone guidance: e.g., "friendly, low-stakes" vs "technical, rigorous"]

---

## Notebook structure
[Cell-by-cell description. For each cell specify:]
[- Cell type: Markdown or Code]
[- Content: full text for markdown cells; # TODO comment only for code cells]
[- Expected Copilot output: what a correct completion looks like]
[- Any variables that must carry over from previous cells]

---

## Technical requirements
[Kernel version, dependencies, data files, run order constraints]

## Devcontainer requirements
[Any extensions or postCreateCommand additions needed]

## What the instructor sees on GitHub
[What a complete submission looks like — used for grading reference]

## Canvas assignment setup
[Assignment type, points, instructions that must appear on Canvas page]
```

---

## Notebook authoring rules

These rules apply to every `.ipynb` file created for this course.

### Code cells
- **Contain only a `# TODO:` comment** — never solution code
- Comment must be specific enough for Copilot to generate correct code
- Any variable names that must be used (e.g., `student_name`) must appear
  in the comment so Copilot uses them consistently
- Variables defined in earlier cells that carry forward must be noted
  in the spec and referenced in the TODO comment

### Markdown cells
- Cells students must edit are prefixed with **✏️ EDIT THIS CELL**
- Section headers use `###` (H3) — H1 and H2 reserved for notebook title
  and major section dividers only
- Tone: friendly and direct; assume smart students, not ML experts
- Never use jargon without a brief inline definition on first use

### Cell ordering
- All notebooks must run top-to-bottom without errors in a fresh Codespace
- No hidden state dependencies — if Cell 6 needs a variable from Cell 4,
  Cell 4 must define it and the dependency must be noted in the spec
- Final cell is always a markdown "You're done" / next steps cell

### Pillar references
- Each notebook should reference the relevant pillar(s) explicitly,
  either in an early markdown cell or in the closing cell
- hello_world.ipynb directs students to read its own spec as an example
  of Goal & Direction — this pattern may be reused in later notebooks

---

## Devcontainer standard configuration

All course Codespaces use this base configuration. Modify only when a
specific notebook requires additional dependencies.

```json
{
  "name": "ME 493B — AI in Product Development",
  "image": "mcr.microsoft.com/devcontainers/python:3.11",
  "customizations": {
    "vscode": {
      "extensions": [
        "GitHub.copilot",
        "GitHub.copilot-chat",
        "ms-python.python",
        "ms-toolsai.jupyter"
      ],
      "settings": {
        "python.defaultInterpreterPath": "/usr/local/bin/python",
        "editor.inlineSuggest.enabled": true
      }
    }
  },
  "postCreateCommand": "pip install -r requirements.txt"
}
```

---

## Standard requirements.txt

Keep this minimal. Add packages only when a specific project requires them.

```
numpy
pandas
matplotlib
scikit-learn
torch
jupyter
```

---

## Student submission workflow (GitHub Classroom + Canvas)

This is the loop used for every assignment. It is taught explicitly in
`hello_world.ipynb` and assumed for all subsequent submissions.

```
1. Canvas: student clicks GitHub Classroom assignment acceptance link
2. GitHub: auto-creates private repo from course template
3. Codespaces: student opens repo in Codespaces (one click from GitHub)
4. Student: completes notebook, commits and pushes via VS Code Source Control GUI
5. Canvas: student pastes their GitHub repo URL as Website URL submission
6. Instructor: reviews notebooks on GitHub, enters grade in Canvas SpeedGrader
```

### VS Code Source Control GUI steps (as taught in hello_world)
1. Click branch icon in left sidebar
2. Click `+` next to changed file to stage it
3. Type commit message: `{assignment} complete — [Student Name]`
4. Click ✓ Commit, then Sync Changes
5. Get repo URL: `git remote get-url origin` in terminal

### Commit message convention
```
{assignment_name} complete — {Student Full Name}
```
Examples:
- `hello_world complete — Jane Smith`
- `mp1_part_a complete — Carlos Reyes`

This convention lets the instructor scan commit history and confirm
submission identity without opening the notebook.

---

## Assessment structure

| Assignment | Type | Points | Pillar emphasis |
|-----------|------|--------|----------------|
| hello_world | Setup (pass/fail) | 10 | Goal & Direction (intro) |
| MP1 Part A | Individual, 1 week | 80 | Goal & Direction |
| MP2 | Individual, 1 week | 80 | Context Management |
| MP3 | Paired, 2 weeks | 80 | Tools & Integration |
| MP4 | Paired, 2 weeks | 80 | Centaur Engineering |
| MP5 | Paired, 2 weeks | 80 | All pillars equally |
| Quiz 1 | In-class | 100 | Foundation + Pillars 1–2 |
| Quiz 2 | In-class | 100 | Pillars 3–5 |
| News Discussion | Rotating | 100 | All pillars |
| Final Presentation | Live, graded | 300 | All pillars |

---

## The five pillars (course vocabulary)

Every notebook, spec, and assignment should be framed using this vocabulary.
Pillar names should appear exactly as written below — consistent casing matters
because students use these as rubric dimensions.

| Pillar | Short definition |
|--------|----------------|
| **Goal & Direction** | Specifying intent, writing requirements, directing AI toward outcomes |
| **Context Management** | RAG, memory, information architecture — what the model knows |
| **Tools & Integration** | MCP, APIs, function calling, connections to engineering systems |
| **Centaur Engineering** | Human-AI collaboration where the combination exceeds either alone |
| **Evaluation & Trust** | Verifying AI outputs at every scale, from response to full workflow |

---

## What NOT to do

- Do not put solution code in student-facing notebooks
- Do not commit executed notebooks with outputs to the template repo —
  students should see clean unexecuted cells when they first open a notebook
- Do not use Google Colab — the course uses GitHub Codespaces exclusively
- Do not reference Claude Code in student-facing materials — students use
  GitHub Copilot; Claude Code is the instructor's authoring tool
- Do not create separate instructor solution files unless needed for grading;
  the instructor's own executed copy serves as the solution reference
- Do not use hyphens in notebook filenames (use underscores)
- Do not put specs outside the `specs/` folder