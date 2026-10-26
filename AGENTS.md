# Codex rules — CourseDay Planner V2.1.7 public-source

- BASELINE IS V2.1.7 (not V2.1.8). Do not merge or add shared meet countdown, CloudBase,
  cloudfunctions, server, API endpoints, account systems, or admin OpenID logic.
- This is a *local-only* mini-program: timetable static in `miniprogram/data/`,
  personal tasks, exams, reschedules and events only in wx Storage.
- Preserve 163 original static events and all V2.1.7 features, tutorial `nonBlocking` semantics,
  7013 updated Tue/Fri classes and native top-right WeChat sharing.
- Do not commit personal records, original uploaded school PDFs, original Weekly Schedule
  file, private screenshots, or real AppID; current `touristappid` is intentional.
- You may improve documentation and CI, but do not silently rewrite timetable facts.
- Run `python tools/validate_schedule.py`, `node tools/smoke_test.js`,
  `node tools/privacy_test.js`, `python tools/prepublish_check.py`.
- For publishing, follow `CODEX_GITHUB_PUBLISH.md` and never push credentials.
