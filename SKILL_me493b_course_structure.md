---
name: me493b-course-structure
description: >
  Reference for all structural, naming, and repository conventions for 
  ME 493B "AI in Product Development" at UW Bothell (Spring 2026). 
  Consult this file before creating any course file, notebook, folder, 
  or spec document. Covers repo layout, file naming, notebook structure, 
  spec document format, GitHub Classroom workflow, Canvas integration,
  and Copilot interaction patterns.
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

## GitHub infrastructure

### Accounts and repos
- **Instructor GitHub:** dr-thielman
- **Classroom org:** me493b-spring2026
- **Template repo:** dr-thielman/ai-in-pd-spring2026
- **Template URL:** https://github.com/dr-thielman/ai-in-pd-spring2026
- **Template visibility:** Public (required for GitHub Classroom)
- **Template setting:** Marked as GitHub Template Repository
- **Student repos:** Private, auto-created in me493b-spring2026 org by Classroom

### GitHub Classroom
- **Classroom name:** ME 493B Spring 2026
- **Classroom org:** me493b-spring2026
- **Classroom URL:** classroom.github.com
- **Student repo naming:** `{assignment-slug}-{githubusername}`
  - Example: `hello-world-setup-jansmith`

### Critical GitHub Classroom lessons learned
- The template repo must live under **dr-thielman** (personal account),
  NOT under the classroom org — Classroom cannot use its own org's repo
  as a starter template (circular reference error)
- Do NOT set a "Supported editor" when creating assignments — this causes
  a save error even when the repo is valid. Leave editor blank; the
  devcontainer.json handles the VS Code/Codespaces configuration
- Starter code can only be set **during initial assignment creation** —
  it cannot be added or changed after the assignment exists. Delete and
  recreate if this needs to change
- Students do NOT need to be pre-added to the org — the invitation link
  grants access automatically when clicked
- The "This action will pull and push from origin/main" Codespaces warning
  is safe — "origin" refers to the student's own private repo only.
  Instruct students to click "OK, Don't Show Again"

---

## Repository folder structure

```
ai-in-pd-spring2026/                 ← lives under dr-thielman
├── hello_world.ipynb                ← entry point, setup lesson, repo root
├── README.md                        ← student-facing setup instructions
├── requirements.txt                 ← shared Python deps
├── .devcontainer/
│   └── devcontainer.json            ← Codespaces config
│
├── specs/                           ← intentionally visible to students
│   ├── SPEC_hello_world.md          ← Goal & Direction pillar example
│   ├── SPEC_mp1_part_a.md
│   └── SPEC_mp2.md
│
├── mp1/
│   └── mp1_part_a.ipynb
├── mp2/
│   └── mp2_rag_pipeline.ipynb
├── mp3/
├── mp4/
├── mp5/
│
└── sessions/
    └── .gitkeep
```

---

## File naming conventions

### Notebooks
| File | Convention | Example |
|------|-----------|---------|
| Setup lesson | `hello_world.ipynb` | `hello_world.ipynb` |
| Mini-project | `mp{N}_descriptive_name.ipynb` | `mp1_part_a.ipynb` |
| Session demo | `session{NN}_topic.ipynb` | `session03_embeddings.ipynb` |

- Lowercase and underscores only — no spaces, no hyphens
- Session numbers zero-padded to two digits
- MP part suffixes: `_part_a`, `_part_b` as needed

### Spec documents
| File | Convention | Example |
|------|-----------|---------|
| Notebook spec | `SPEC_{notebook_name}.md` | `SPEC_hello_world.md` |

- All caps `SPEC_` prefix makes specs visually distinct
- Filename after prefix matches the notebook it generates exactly
- Always lives in `specs/` folder

### Other files
- `README.md` — uppercase, repo root only
- `requirements.txt` — lowercase, repo root
- `devcontainer.json` — always in `.devcontainer/` subfolder

---

## Spec document format

Every notebook must have a corresponding spec in `specs/`. Specs serve
two purposes: (1) source document handed to Claude Code to generate the
notebook, and (2) intentionally visible to students as Goal & Direction
pillar examples — showing that intent must be specified before
implementation begins.

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
[Goal & Direction / Context Management / Tools & Integration /
Centaur Engineering / Evaluation & Trust]

## Student prerequisites
[What students must have done or know before opening this notebook]

## Tone
[e.g., "friendly, low-stakes" or "technical, rigorous"]

---

## Notebook structure
[Cell-by-cell. For each cell specify:]
[- Cell type: Markdown or Code]
[- Content: full text for markdown; # TODO comment only for code cells]
[- Expected Copilot output: what a correct completion looks like]
[- Variables that must carry over from previous cells]

---

## Technical requirements
[Kernel version, dependencies, data files, run order constraints]

## Devcontainer requirements
[Extensions or postCreateCommand additions beyond standard config]

## What the instructor sees on GitHub
[What a complete submission looks like — grading reference]

## Canvas assignment setup
[Assignment type, points, instructions for Canvas page]
```

---

## Notebook authoring rules

### Code cells
- **Contain only a `# TODO:` comment** — never solution code
- Comment must be specific enough for Copilot to generate correct code
- Variable names that must be used (e.g., `student_name`) must appear
  in the comment so Copilot uses them consistently
- Variables from earlier cells that carry forward must be noted in the
  spec and referenced in the TODO comment
- Do not commit executed notebooks to the template repo — students
  must see clean unexecuted cells on first open

### Markdown cells
- Cells students must edit: prefix with **✏️ EDIT THIS CELL**
- Section headers use `###` (H3) — H1/H2 reserved for title and
  major section dividers only
- Tone: friendly and direct; assume smart students, not ML experts
- Never use jargon without a brief inline definition on first use
- Include this warning prominently in the submission section of
  every notebook:
  "⚠️ Codespaces does not save to GitHub automatically. Your work
  only exists on GitHub after you commit and push. If your Codespace
  expires before you push, your work is gone."

### Copilot interaction — platform agility framing
Students are encouraged to explore and use any Copilot interaction
mode that works for them. Do NOT prescribe a single mode. The course
values platform agility — the ability to find effective ways to work
with AI tools is itself a learning objective.

The three main modes available in Codespaces:
- **Inline completion (ghost text):** Press Enter after the # TODO
  comment, wait 2–3 seconds, press Tab to accept. Most direct.
- **Copilot Chat (right panel):** Describe what you want in natural
  language. More conversational, good for complex cells.
- **Copilot CLI:** Available in the terminal for command-line tasks.

Markdown cell before each code cell should invite exploration,
not prescribe a mode. Use this pattern:
  "Use GitHub Copilot to complete this cell. Try inline completion
  (press Enter after the comment and wait for ghost text), Copilot
  Chat (the panel on the right), or any other mode you discover.
  Notice what feels effective — you'll reflect on this below."

Reflection cells should ask students to evaluate their tool choices:
  "Which Copilot interaction mode did you use and why? Did you try
  more than one? What felt most natural or effective?"

This turns every code cell into a micro Evaluation & Trust exercise
on their own tool choices — pillar 5 in practice from day one.

The devcontainer includes `"jupyter": true` under
`github.copilot.enable` to ensure inline ghost text is available
as one of the options, but students are not required to use it.

### Cell ordering
- All notebooks must run top-to-bottom without errors in a fresh Codespace
- No hidden state dependencies
- Final cell is always a markdown "You're done" / next steps cell

### Pillar references
- Each notebook must reference its primary pillar explicitly
- hello_world.ipynb directs students to read its own spec as a
  Goal & Direction example — reuse this pattern in later notebooks

---

## Devcontainer standard configuration

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
        "editor.inlineSuggest.enabled": true,
        "github.copilot.enable": {
          "*": true,
          "jupyter": true
        }
      }
    }
  },
  "postCreateCommand": "pip install -r requirements.txt"
}
```

---

## Standard requirements.txt

```
numpy
pandas
matplotlib
scikit-learn
torch
jupyter
```

Keep minimal. Add packages only when a specific project requires them.

---

## Student submission workflow (GitHub Classroom + Canvas)

Canvas is the student's home base. GitHub is where work lives.
This loop is taught in hello_world.ipynb and assumed for all MPs.

```
1. Canvas: student reads assignment instructions
2. Canvas: student clicks GitHub Classroom invitation link
3. GitHub: auto-creates private repo in me493b-spring2026 org
4. GitHub: student opens repo → Code → Codespaces → New codespace
5. Codespaces: student completes notebook
6. Codespaces: student commits and pushes via Source Control GUI
7. Canvas: student pastes GitHub repo URL as Website URL submission
8. Instructor: reviews notebook on GitHub, enters grade in Canvas
```

### VS Code Source Control GUI steps
1. Click branch icon (⎇) in left sidebar
2. Click `+` next to changed file to stage it
3. Type commit message: `{assignment} complete — [Student Full Name]`
4. Click ✓ Commit
5. Click Sync Changes → click "OK, Don't Show Again" on the warning
6. Get repo URL in terminal: `git remote get-url origin`
7. Paste URL into Canvas Website URL submission field

### Commit message convention
```
{assignment_name} complete — {Student Full Name}
```
Examples:
- `hello_world complete — Jane Smith`
- `mp1_part_a complete — Carlos Reyes`

### Codespaces persistence rules
- Changes auto-save locally within an active Codespace
- Changes persist if browser closed and same Codespace reopened
  (within ~30 days of inactivity)
- Changes are LOST if Codespace expires before pushing
- Changes are NEVER on GitHub until committed and pushed
- Students reopen Codespaces at: github.com/codespaces

---

## GitHub Classroom assignment creation checklist

For every new assignment:
- [ ] Notebook and spec committed to template repo (clean, unexecuted)
- [ ] Template repo is public under dr-thielman
- [ ] Go to classroom.github.com → ME 493B Spring 2026 → New assignment
- [ ] Set assignment title and deadline
- [ ] Set individual or group (cannot change after creation)
- [ ] Starter code: select dr-thielman/ai-in-pd-spring2026
- [ ] Repository visibility: Private
- [ ] Supported editor: leave blank
- [ ] Click Create assignment
- [ ] Copy invitation link → post to Canvas assignment page
- [ ] Test invitation link yourself before students see it

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

Use exact casing below — students use these as rubric dimensions.

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
- Do not commit executed notebooks with outputs to the template repo
- Do not use Google Colab — course uses GitHub Codespaces exclusively
- Do not reference Claude Code in student-facing materials — students
  use GitHub Copilot; Claude Code is the instructor's authoring tool
- Do not create separate solution files unless needed for grading
- Do not use hyphens in notebook filenames (use underscores)
- Do not put specs outside the `specs/` folder
- Do not set a Supported editor when creating Classroom assignments
- Do not try to add starter code to an existing assignment — delete
  and recreate instead
- Do not host the template repo in the me493b-spring2026 org —
  it must live under dr-thielman