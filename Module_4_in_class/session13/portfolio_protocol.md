# Personal Context Portfolio — Protocol

*ME 493B Session 13 · Tuesday May 12, 2026 · keep-and-use handout*

---

## What this is

A personal context portfolio is a small set of markdown files — about you, written for an AI — that any AI system can read to know who you are and how you work. Drop them into a Claude Project, paste them into a system prompt, or expose them through an MCP server: same files, different surfaces. The idea is borrowed from Nathaniel Whittemore's open-source project at [github.com/nlwhittemore/personal-context-portfolio](https://github.com/nlwhittemore/personal-context-portfolio) and the AI Daily Brief episode that introduced it. You're early adopters of someone's good idea.

The goal is not a polished résumé. The goal is honest, specific, useful context that gives any AI a real sense of who you are — so when you ask it to help with a cover letter, an interview prep doc, a project pitch, or your first 90 days on a job, the output sounds like you instead of like a generic engineer.

---

## The ten files

```
my_portfolio/
├── identity.md
├── background.md
├── skills.md
├── tools-and-systems.md
├── work-style.md
├── values.md
├── goals.md
├── communication.md
├── interests.md
└── meta.md
```

### `identity.md` — who you are, in your own words

Two or three paragraphs in your own voice. What you do, why you do it, what you'd want a stranger to know in the first 30 seconds. Avoid the LinkedIn-headline temptation — this should sound like you talking, not your résumé.

DO NOT include: a list of every skill or every job. Those live elsewhere. Identity is the lens, not the data.

### `background.md` — education, work history, projects

The factual record. Education, internships, jobs, significant projects with one or two sentences per item describing what you actually did (not the job description on the posting). Include hobby projects that mattered to you, even if they don't fit on a résumé.

DO NOT include: dates of every assignment or class — that's noise. Keep it to the level of detail you'd give a senior engineer asking about you in five minutes.

### `skills.md` — technical, domain, interpersonal

A real assessment, not a wish list. Group by category (technical / domain / interpersonal) and rate honestly: what can you actually do without help, what can you do with documentation, what would you need to learn from scratch. Specificity matters — "Python: comfortable for data analysis with pandas; have not written async code" is useful; "Python: intermediate" is not.

DO NOT include: skills you wish you had. Those go in `goals.md`. Honesty here is what makes downstream AI output useful.

### `tools-and-systems.md` — what you actually use, day to day

Your actual stack. The CAD tool you use most, the IDE you live in, the AI host you use, the project management tool, the note-taking system, the calendar. For each, one line on how you use it and one line on what you don't use it for.

DO NOT include: tools you've touched once. This file is for the AI to know what's actually around you — so it can suggest things that fit your workflow instead of generic recommendations.

### `work-style.md` — how you work best (and worst)

The honest one. When are you sharp; when are you fried. Do you focus alone or in a team room. Are you a fast first-drafter or a careful editor. Do you need a deadline to start or do you start as soon as the problem is named. What kills your productivity.

DO NOT include: aspirational descriptions ("I love collaborative environments" — does everyone). Specific moments and antipatterns are far more useful here than positive generalities.

### `values.md` — what you care about, what you won't compromise

What you'd quit a job over. What you'd defer a deadline over. What you would not put your name on. Two to four short paragraphs. This is the file that makes a cover letter sound like you and not like a template.

DO NOT include: corporate values language ("integrity, innovation, excellence"). Specifics, not virtues. "I won't ship a device that hasn't had a full failure-mode review" is a value. "I value quality" is not.

### `goals.md` — 1-year, 5-year, longer

Where you want to be in the short, medium, and long term. Roles, kinds of problems, kinds of teams. Skills you want to build. Industries you want to learn. Geographies you'd consider or rule out.

DO NOT include: anything you don't actually believe. If you don't have a five-year plan, write that — "I don't have a five-year plan; here's how I'm choosing in the meantime" is honest and far more useful to an AI than a fabricated one.

### `communication.md` — how you write, talk, present

Your voice. Sentence length, hedging or directness, technical depth in different audiences, slide style. Include a paragraph or two of your actual writing as a sample so the AI can match tone when it drafts on your behalf.

DO NOT include: generic statements about communication. Show, don't tell — paste an email or memo excerpt you're proud of and explain why it works for you.

### `interests.md` — outside of work

Hobbies, sports, music, books, what you do when you're not on a screen. This is the file that prevents the AI from making you sound like a robot when you're writing something personal — a thank-you note, a side-project pitch, a personal essay.

DO NOT include: things you think you should be interested in. The point is texture, not impression management.

### `meta.md` — how to use this portfolio with an AI

The instructions for the next AI session you start. How to introduce yourself. Which files are most important for which kinds of tasks ("for cover letters, lead with `values.md` and `communication.md`"). Any preferences for how the AI should refer to you. Any explicit "do not assume" rules.

DO NOT include: redundancies with other files. `meta.md` is the user manual, not another data file.

---

## The interview protocol

The fastest way to build the files is with an AI agent doing the work of interviewing you. The system prompt for this agent lives in `portfolio_interview_system_prompt.md` — paste it into Claude.ai, ChatGPT, Copilot Chat, Claude Desktop, or your host of choice.

### What the agent does

For each file you name, the agent will:

1. Ask 3–5 open-ended questions designed to surface specifics
2. Push back when you give it generalities ("can you give me a moment where that happened?")
3. Draft the markdown when you've given it enough material
4. Show you the draft, take your edits, iterate
5. Move on to the next file when you're satisfied

### What you do

Be honest. Be specific. Push back when the AI pattern-matches you to "generic engineer." The first draft will sound generic — that's not a failure of the AI, it's a starting point. Iterate.

### Example: good vs. weak answers for `identity.md`

**The agent asks:** *"In one or two sentences, what would you want a senior engineer who's never met you to know about how you approach problems?"*

**Weak answer:** "I'm a hard worker who loves solving problems."

**Good answer:** "When I get stuck, I tend to take the problem apart on paper before I open a tool. I'd rather spend twenty minutes drawing the system than two hours debugging a wrong assumption — but it took me a year of internship to learn that the hard way."

The good answer has a moment, a sequence, and a self-aware learning. The weak answer is a description anyone could give. The agent should push you toward the good answer kind of every time.

---

## Three deployment paths

### Path 1 — Paste into a system prompt (start here)

Lowest-friction. Open Claude.ai or your host of choice, start a new conversation, and paste the most relevant 2–3 portfolio files into a system message or initial prompt before your actual request:

```
You are helping me with [task]. Here is context about who I am and how I work.

--- identity.md ---
[paste contents]

--- work-style.md ---
[paste contents]

--- communication.md ---
[paste contents]

Now: [your actual request]
```

Works in any host. No persistence — you redo it each time. Best for one-off tasks: a cover letter, an application essay, a kickoff doc for a new project.

### Path 2 — Claude Project knowledge base

Persistent within one host (Claude). Create a new Claude Project, upload all ten files into the project's knowledge base, and every chat in that project automatically has access to them.

Trade-offs: it's tied to Claude specifically, but the persistence is real — you don't paste anything, the project just knows you. Best deployment if you do most of your AI work in Claude.

Same pattern works in ChatGPT's "Custom GPTs" with uploaded files, though the surface is different.

### Path 3 — MCP resource server

The engineered path. Wire your portfolio as MCP **resources** (not tools) — same pattern as your MP3 RAG-as-tool work. Any host that speaks MCP can then access your portfolio.

A minimal Python MCP server that exposes the portfolio:

```python
from mcp.server.fastmcp import FastMCP
from pathlib import Path

mcp = FastMCP("personal-portfolio")

PORTFOLIO_DIR = Path("~/portfolio").expanduser()

@mcp.resource("portfolio://{filename}")
def get_portfolio_file(filename: str) -> str:
    """Read a personal portfolio file by name."""
    path = PORTFOLIO_DIR / filename
    if not path.exists():
        return f"No portfolio file named {filename}"
    return path.read_text(encoding="utf-8")

@mcp.resource("portfolio://index")
def list_portfolio_files() -> str:
    """List all portfolio files."""
    files = sorted(p.name for p in PORTFOLIO_DIR.glob("*.md"))
    return "\n".join(files)

if __name__ == "__main__":
    mcp.run()
```

Configure in Claude Desktop (`claude_desktop_config.json`) or Copilot agent mode and the host can read your portfolio on demand. Most engineered, most reusable across hosts — but only worth doing once you've used path 1 enough times to know what you want.

---

## Maintenance

Update when something material changes — new role, new project, a value crystallized by a hard quarter, a goal shifted. Don't try to keep this perfect; aim for accurate.

A practical cadence: read the files end-to-end every three months. Flag anything that no longer sounds like you. Edit the parts that have drifted.

Triggers that warrant an update beyond the cadence: starting a new job, finishing a major project, ending a relationship (yes — `values.md` and `goals.md` often shift), or any time you notice the AI output starts to sound off.

---

## Privacy and authenticity

**Privacy.** These files contain personal context. Keep them in personal Google Drive, a private GitHub repo, an encrypted local folder — whichever you trust. Do not commit them to the course repo or any public repo. Do not paste them into AI hosts you don't trust to handle private data (most major hosts are fine; if you don't know, default to caution).

**Authenticity.** The value of the portfolio comes from honesty, not polish. An honest "I don't have a five-year plan" is far more useful to a future AI than a fabricated one. An honest "I struggle with cold outreach" is far more useful than an aspirational "I love networking." If the AI writes something about you that sounds good but isn't quite right — cut it. The lesson of this session is that catching the not-quite-right is the work; the value of the portfolio depends on it.
