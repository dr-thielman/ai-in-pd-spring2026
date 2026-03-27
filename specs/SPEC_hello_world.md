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
submission loop used for all mini-projects.

This spec is intentionally visible to students. It illustrates the 
Goal & Direction pillar: the notebook was designed from a clear 
specification, exactly the kind of artifact students will produce 
when directing AI in their own projects.

---

## Student prerequisites before opening this notebook
- GitHub account created
- GitHub Classroom assignment accepted (link provided on Canvas)
- Repo opened in Codespaces (instructions on Canvas assignment page)
- GitHub Copilot active (verify: ghost text appears when typing)

---

## Tone
Friendly, encouraging, low-stakes. Senior engineering students who 
may have little or no git/Codespaces experience.

---

## Notebook structure

### Cell 1 — Markdown: Welcome
Title: "Hello ME 493B"
Content:
- Welcome to the course repo
- Purpose: confirm your environment works before the real work begins
- Explain the loop used all quarter:
  "Canvas tells you what to do → GitHub is where you do it → 
   Canvas is where you submit proof → Canvas is where you see 
   your grade"
- Note that this notebook was generated from a specification:
  "Take a look at specs/SPEC_hello_world.md after you finish. 
   One of the skills you'll develop in this course is writing 
   specifications like that one to direct AI tools toward 
   engineering outcomes. That's the Goal & Direction pillar — 
   and you'll be doing it yourself starting with MP1."
- Estimated time: 20–30 minutes

### Cell 2 — Markdown: How to use this notebook
Content:
- Run cells top to bottom (Shift+Enter or the ▶ button)
- Code cells marked # TODO: type the comment, wait for Copilot 
  to suggest code, press Tab to accept
- Markdown cells marked ✏️ EDIT THIS CELL: click to edit, 
  fill in your answer, run the cell to render it
- If Copilot isn't suggesting anything: confirm the Copilot 
  extension is enabled in the VS Code sidebar

---

### Cell 3 — Markdown: Section 1 — Confirm your environment

### Cell 4 — Code: Environment check
Comment only — Copilot completes:
# TODO: print a friendly message that includes: your name (hardcode 
# it as a variable called student_name), Python version from sys, 
# numpy version, and matplotlib version

Expected Copilot output: imports sys, numpy, matplotlib; 
prints formatted string with all four values.
Student must edit their name into the student_name variable.

---

### Cell 5 — Markdown: Section 2 — Your first plot

### Cell 6 — Code: Sine wave plot
Comment only — Copilot completes:
# TODO: plot one full cycle of a sine wave using numpy and matplotlib.
# x-axis label: "Angle (radians)", y-axis label: "Amplitude"
# Title: "Hello ME 493B — " + student_name

Expected output: clean sine wave plot with labeled axes and 
personalized title. student_name variable must carry over from Cell 4.

---

### Cell 7 — Markdown: Section 3 — Copilot exercise
Content:
- Explain what they're about to do: give Copilot a comment, 
  accept its suggestion, run it
- "This is the core interaction you'll use throughout the course. 
   You direct. Copilot drafts. You evaluate and refine."
- Remind them: type the comment below slowly, pause, 
  wait for the ghost text, press Tab to accept

### Cell 8 — Code: Copilot histogram
Comment only — no other content:
# TODO: generate 100 random numbers from a normal distribution 
# and plot a histogram with 15 bins. Add a title and axis labels.

---

### Cell 9 — Markdown: ✏️ Section 4 — Reflection
Instruct students to edit this markdown cell directly.
Fields:
- **Name:** 
- **What did Copilot suggest for the histogram cell?**
  (describe in one sentence — you don't need to copy the code)
- **Did the suggestion work as-is, or did you need to modify it?**
- **One question or uncertainty you have entering this course:**

---

### Cell 10 — Markdown: Section 5 — Save and submit your work
Content — step by step:

Step 1: Confirm all cells have run
"No [*] indicators should be visible. All outputs should be visible 
below each code cell."

Step 2: Open the Source Control panel
"Click the branch icon in the left sidebar (it looks like a forked 
path). You should see hello_world.ipynb listed under Changes."

Step 3: Stage your file
"Click the + icon next to hello_world.ipynb to stage it. 
It will move to Staged Changes."

Step 4: Write a commit message
"In the message box at the top, type exactly:
  hello_world complete — [Your Name]
Replace [Your Name] with your actual name."

Step 5: Commit and push
"Click the ✓ Commit button, then click Sync Changes 
(or the cloud/push icon that appears). 
Your work is now saved to GitHub."

Step 6: Get your repo URL
"In the Codespaces terminal (Terminal → New Terminal), type:
  git remote get-url origin
Copy the URL that appears."

Step 7: Submit to Canvas
"Go to the Canvas assignment page for Hello World Setup.
Paste your repo URL into the Website URL submission field.
Click Submit."

---

### Cell 11 — Markdown: You're ready
Content:
"If you made it here, your environment is set up and you know 
the submission workflow. Both will serve you all quarter.

Before you close this notebook, open specs/SPEC_hello_world.md 
and read through it. Notice how the specification describes 
intent and structure without writing a single line of code. 
That relationship between specification and implementation 
is what Goal & Direction means in this course.

See you in class."

---

## Technical requirements
- Kernel: Python 3.11
- Dependencies: numpy, matplotlib, sys (stdlib or in requirements.txt)
- No external data files
- All cells must run top-to-bottom without errors in a fresh Codespace
- student_name variable defined in Cell 4 must be reused in Cell 6 title
- Copilot must be listed as a required extension in devcontainer.json

## Devcontainer requirements
.devcontainer/devcontainer.json must include:
- Python 3.11
- Extensions: 
    GitHub.copilot
    GitHub.copilot-chat
    ms-python.python
    ms-toolsai.jupyter
- postCreateCommand: pip install -r requirements.txt

## What the instructor sees on GitHub
- hello_world.ipynb with all cells executed (outputs visible)
- Commit message contains student name
- Plot title contains student name
- Reflection cell filled in
Instructor confirms completion in ~30 seconds per student 
by previewing the notebook on GitHub.

## Canvas assignment setup
- Assignment type: Website URL submission
- Points: completion credit (10 pts or pass/fail)
- Instructions on Canvas page must include:
  1. Link to accept GitHub Classroom assignment
  2. Instructions to open in Codespaces
  3. Reminder: submission = paste your GitHub repo URL here
```

---

Now your Claude Code prompt to build from this is clean and simple:
```
Read specs/SPEC_hello_world.md and create hello_world.ipynb 
at the repo root and .devcontainer/devcontainer.json per 
the spec requirements.

Rules:
- Valid .ipynb JSON, Python 3.11 kernel
- Code cells contain ONLY the # TODO comment — no solution code
- student_name variable in Cell 4 must be reused in Cell 6 title
- Show me the cell structure (type + first line of each) 
  before any commit
- Do not commit until I say "looks good, push it"