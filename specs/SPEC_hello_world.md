# SPEC: hello_world.ipynb
## Course: ME 493B — AI in Product Development, Spring 2026
## Author: Scott Thielman
## Location of generated file: ai-in-pd-spring2026/hello_world.ipynb
## Location of this spec: ai-in-pd-spring2026/specs/SPEC_hello_world.md

---

## Purpose
A standalone setup lesson. Not graded as a mini-project — completion
confirms the student's development environment is fully operational
before MP1 begins. Also teaches the Canvas → GitHub → Canvas
submission loop used for all mini-projects, and gives students their
first open-ended exploration of GitHub Copilot interaction modes.

This spec is intentionally visible to students. It illustrates the
Goal & Direction pillar: the notebook was designed from a clear
specification, exactly the kind of artifact students will produce
when directing AI in their own projects.

---

## Primary pillar emphasis
Goal & Direction (introduced, not assessed)

---

## Student prerequisites before opening this notebook
- GitHub account created with UW email
- GitHub username submitted to instructor via Canvas
- GitHub Education/Copilot application submitted and approved
- GitHub Classroom assignment accepted via Canvas invitation link
- Repo opened in Codespaces

---

## Tone
Friendly, encouraging, low-stakes. Senior engineering students who
may have little or no git/Codespaces experience. Avoid being
patronizing — they are capable engineers, just new to these tools.

---

## Notebook structure

### Cell 1 — Markdown: Welcome
Title: "Hello ME 493B"
Content:
- Welcome to the course repo
- Purpose: confirm your environment works before the real work begins
- Explain the submission loop used all quarter:
  "Canvas tells you what to do → GitHub is where you do it →
   Canvas is where you submit proof → Canvas is where you see your grade"
- Note that this notebook was generated from a specification:
  "After you finish, open specs/SPEC_hello_world.md and read it.
   Notice how the specification describes intent and structure without
   writing a single line of code. That relationship between
   specification and implementation is what the Goal & Direction pillar
   means in this course — and you'll be writing specs like this yourself
   starting with MP1."
- Estimated time: 20–30 minutes

---

### Cell 2 — Markdown: How to use this notebook
Content:
- Run cells top to bottom (Shift+Enter or the ▶ button)
- Code cells marked # TODO: use GitHub Copilot to complete them
- Markdown cells marked ✏️ EDIT THIS CELL: click to edit, fill in
  your answer, Shift+Enter to render
- There is no single right way to use Copilot — explore what works

---

### Cell 3 — Markdown: Section 1 — Confirm your environment

### Cell 4 — Code: Environment check
Comment only — Copilot completes:
# TODO: print a friendly message that includes: your name (store it
# in a variable called student_name), Python version from sys,
# numpy version, and matplotlib version

Expected output: imports sys, numpy, matplotlib; prints formatted
string with all four values. Student must edit their name into the
student_name variable before running.

---

### Cell 5 — Markdown: Section 2 — Your first plot

### Cell 6 — Code: Sine wave plot
Comment only — Copilot completes:
# TODO: plot one full cycle of a sine wave using numpy and matplotlib.
# x-axis label: "Angle (radians)", y-axis label: "Amplitude"
# Title: "Hello ME 493B — " + student_name

Note: student_name must carry over from Cell 4 and appear in the
plot title. This is the grading check — instructor confirms the
student's name appears in the rendered output on GitHub.

---

### Cell 7 — Markdown: Section 3 — Copilot exploration
Content:
- Explain that the next cell has a # TODO comment and their job is
  to use Copilot to complete it — in whatever way they find effective
- Describe the three available interaction modes without prescribing one:
  "Inline completion: press Enter after the comment, wait 2–3 seconds,
   press Tab to accept ghost text."
  "Copilot Chat: open the chat panel on the right and describe what
   you want in plain English."
  "Try both. Notice what feels natural. There's no wrong approach."
- Frame this as the core interaction they'll use all quarter:
  "You direct. Copilot drafts. You evaluate and refine."

### Cell 8 — Code: Copilot histogram
Comment only — no other content:
# TODO: generate 100 random numbers from a normal distribution
# and plot a histogram with 15 bins. Add a title and axis labels.

---

### Cell 9 — Markdown: ✏️ Section 4 — Reflection
Instruct students to edit this markdown cell directly.
Fields:
- **Name:**
- **Which Copilot interaction mode(s) did you use?**
  (inline completion, Copilot Chat, something else?)
- **Did you try more than one mode? What felt most effective and why?**
- **Did Copilot's suggestion work as-is, or did you need to modify it?**
- **One question or uncertainty you have entering this course:**

---

### Cell 10 — Markdown: Section 5 — Save and submit your work

⚠️ WARNING CELL — make this prominent:
"Codespaces does not save to GitHub automatically. Your work only
exists on GitHub after you commit and push. If your Codespace expires
before you push, your work is gone."

Step-by-step instructions:

Step 1: Confirm all cells have run
"No [*] indicators visible. All outputs present below each code cell."

Step 2: Open the Source Control panel
"Click the branch icon (⎇) in the left sidebar. You should see
hello_world.ipynb listed under Changes."

Step 3: Stage your file
"Click the + icon next to hello_world.ipynb. It moves to Staged Changes."

Step 4: Write a commit message
"In the message box, type exactly:
  hello_world complete — [Your Full Name]
Replace [Your Full Name] with your actual name."

Step 5: Commit and push
"Click ✓ Commit, then click Sync Changes.
If a warning appears about pulling and pushing from origin/main —
this is safe, it refers only to your personal repo. Click
'OK, Don't Show Again'."

Step 6: Get your repo URL
"In the terminal (Terminal → New Terminal), type:
  git remote get-url origin
Copy the URL."

Step 7: Submit to Canvas
"Go to the Canvas assignment page for Hello World Setup.
Paste your repo URL into the Website URL field. Click Submit."

---

### Cell 11 — Markdown: You're ready
Content:
"If you made it here, your environment is set up and you know the
submission workflow. Both will serve you all quarter.

Before you close this notebook, open specs/SPEC_hello_world.md and
read it. Notice how the specification describes intent and structure
without a single line of code. That's Goal & Direction — and you'll
be writing specs like this yourself starting with MP1.

See you in class."

---

## Technical requirements
- Kernel: Python 3.11
- Dependencies: numpy, matplotlib, sys (all in requirements.txt or stdlib)
- No external data files
- All cells must run top-to-bottom without errors in a fresh Codespace
- student_name variable defined in Cell 4 must be reused in Cell 6 title
- Do NOT commit with executed outputs — template must show clean cells

## Devcontainer requirements
Standard configuration from SKILL file. Confirm these settings are present:
- GitHub.copilot and GitHub.copilot-chat extensions
- `"editor.inlineSuggest.enabled": true`
- `"github.copilot.enable": { "*": true, "jupyter": true }`

## What the instructor sees on GitHub
- hello_world.ipynb with all cells executed (outputs visible)
- Commit message contains student full name
- Plot title (Cell 6) contains student name
- Reflection cell (Cell 9) filled in with all fields answered
- Instructor can confirm completion in ~30 seconds per student

## Canvas assignment setup
- Assignment title: Hello World Setup
- Submission type: Website URL
- Points: 10 (pass/fail completion credit)
- Deadline: before Session 3 (end of Week 1)
- Instructions on Canvas must include:
  1. GitHub Classroom invitation link
  2. Instructions to open in Codespaces
  3. Reminder: submission = paste your GitHub repo URL here