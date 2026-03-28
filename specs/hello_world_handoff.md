# Claude Code Handoff: hello_world.ipynb (REVISION)

Paste this prompt into Claude Code from C:\Users\Scott\Documents\Projects\ME493b

---

Read SKILL_me493b_course_structure.md and specs/SPEC_hello_world.md
before doing anything else.

**Context:** An initial version of hello_world.ipynb has already been
built and tested. This is a targeted revision — not a rebuild from
scratch. The goal is to update the notebook's framing around how
students use Copilot to complete code cells, reflecting a platform
agility philosophy: students should explore and choose their own
interaction mode rather than follow prescribed steps.

## What to change

### Code cells
- Code cells should contain ONLY a # TODO comment — no solution code
- Verify this is already the case; correct any cells that have code

### Markdown cell before each code cell
Replace any prescriptive Copilot instructions (e.g., "press Enter,
wait for ghost text, press Tab") with an open invitation. Use this
pattern:
  "Use GitHub Copilot to complete this cell. You can use inline
   completion (press Enter after the comment and wait for ghost text),
   Copilot Chat (the panel on the right), or any other mode you
   discover. There's no wrong approach — notice what feels effective."

### Copilot exploration section (Cell 7 per spec)
Must describe ALL THREE interaction modes without prescribing one:
- Inline completion (ghost text)
- Copilot Chat (right panel)
- Copilot CLI (terminal)
Frame this as: "You direct. Copilot drafts. You evaluate and refine."

### Reflection cell (Cell 9 per spec)
Must ask:
- Which Copilot interaction mode(s) did you use?
- Did you try more than one? What felt most effective and why?
- Did the suggestion work as-is, or did you modify it?
- One question or uncertainty entering the course

## What NOT to change
- Cell structure and order — do not add or remove cells
- The student_name variable and its use in the plot title
- The ⚠️ save/push warning in the submission section
- The spec reference and Goal & Direction framing in Cell 1 and Cell 11
- The commit/push instructions in Cell 10

## Verify before committing
Show me:
1. The full text of the revised Copilot exploration markdown cell
2. The full text of the revised reflection cell
3. Confirm all code cells contain only # TODO comments
4. Confirm student_name appears in Cell 4 comment and Cell 6 title

Do not commit until I review and say "looks good, push it."

## After I approve — commit message
"revise hello_world: platform agility framing for Copilot interaction"