# Timetable sample and provenance

The application is intended as a general timetable tool, independent of a specific institution, degree program or cohort. The bundled dataset demonstrates one course selection, not an institution-wide timetable. The maintainer approved publishing this example during release preparation; no additional institutional data was collected or inferred. Code licensing does not replace rights held by third parties.

The included `sample-timetable-2026-27.xlsx` is a de-identified,
project-generated **example timetable** for reproducing V2.1.7 static events.
It has no student identity, contacts, user-entered assignments, or local storage exports.
Course dates and academic information may be outdated; verify independently before relying on them.

The original uploaded Weekly Schedule file and university-distributed official PDFs have
been intentionally excluded from this public-source archive (privacy/redistribution reasons).
**Do not restore or commit the omitted originals automatically.**

To rebuild the same static `events.js` (requires Python + openpyxl):
`python tools/build_schedule.py` followed by `python tools/validate_schedule.py`.
This is a local build step and uses no cloud service.
