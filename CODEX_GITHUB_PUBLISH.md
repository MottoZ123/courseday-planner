# Codex: prepare / publish THIS timetable repo (V2.1.7 only)

## Goal
Use this folder as the sole input. Publish a **separate public GitHub repo** for
this mini-program. Recommended repository name: `courseday-planner`.
This is V2.1.7. Do NOT use any newer V2.1.8 branch and do NOT deploy any cloud service.

## Mandatory local review
1. Confirm you are in this folder and inspect `AGENTS.md`, `PRIVACY_AND_DATA.md`.
2. `python tools/validate_schedule.py`
3. `node tools/smoke_test.js`
4. `node tools/privacy_test.js`
5. `python tools/prepublish_check.py`
6. Verify AppID is `touristappid`, `cloudfunctions/` is absent, no `wx.cloud` calls,
   and the ZIP contains only anonymous timetable sample data (no personal records).
7. `git status --short`, `git ls-files` after initialization. Confirm `.gitignore`.

## Publishing with GitHub CLI
Authenticate interactively as the USER: `gh auth login` (never expose tokens).
Choose a name from the user or use `courseday-planner` if free.
Create a **fresh** repository, not based on the original private git history:

```bash
git init -b main
git add .
git diff --cached --name-only
git commit -m "chore: publish sanitized V2.1.7 local-only source"
gh repo create courseday-planner --public --source . --remote origin --push
```

If the repo exists, inspect its history first; NEVER force-push or publish previous
private commits. Ask for confirmation before overwriting any existing remote.

## After publish
- Return actual repository URL, commit hash, CI results and any blocked/manual steps.
- GitHub is source hosting only. DO NOT configure CloudBase, WeChat release, CI upload
  secrets, or GitHub Actions cloud deployment.
- Tell users to replace `touristappid` in their local working copy for personal
  WeChat deployment, but keep placeholder in the public repo.
