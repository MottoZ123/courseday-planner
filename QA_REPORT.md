# Open-source release QA

Release preparation date: 2026-10-26. Mode: RELEASE.

## Automated scope

Run `python tools/workflow.py all` before publishing. Any failed subprocess stops packaging. Node.js is required; missing Node is a failure.

The gate runs the existing project regression suite, privacy tests, runtime JavaScript syntax checks, registered-page quartet checks, and the pre-publication scan. The scanner includes GitHub Actions and workbook XML; it rejects real AppIDs, recognized credential literals, phone/email-like personal identifiers, personal export filenames, private configuration, private image metadata and cloud calls.

Baseline: 13 pages, 163 static events, 99 lectures, 8 final exams, 12 grouped tutorials and 21 nonBlocking windows. Original event IDs and timings remain unchanged. Custom exams, moving/cancelling/restoring classes, multi-day events, local data clearing and generic sharing are covered.

## Manual checks still required

- WeChat Developer Tools compilation and rendering on all pages.
- Real-device storage persistence, native share behavior, small screens and safe areas.
- Tutorial filters, custom exams, temporary reschedules and local-data reset in the actual UI.
- Real AppID stays local; no WeChat upload, review or publication was performed.

## Evidence

Local command logs and remote commit/Actions status are recorded in the enclosing project release report. GitHub Actions is the reproducible per-commit test record; this document does not claim any unobserved device test or remote CI run passed.
