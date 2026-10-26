# Open-source release decisions

The maintainer clarified that the product should serve different schools, programs and cohorts. Keep the existing versioned example rather than presenting it as a complete institutional timetable; users can supply their own course data. This positioning change does not alter the original 163-event regression baseline.

2026-10-26: Keep the supplied V2.1.7 functionality and local-only data ownership. Public branding becomes 课序 / CourseDay Planner; legacy storage identifiers remain stable so upgrades retain user data.

Do not copy existing private Git history. Create an independent public repository and grant Mary-Wym write access through a GitHub invitation.

Retain generic test fixtures: artificial salary numbers and mock schedules are necessary to verify calculations and migration, and are not user records. Preserve empty runtime defaults.

Package only after all required checks pass. Do not treat local static checks as evidence of WeChat device rendering or remote Actions success.
