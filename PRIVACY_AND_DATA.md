# Privacy and data treatment (V2.1.7 public-source)

**Public repository contains:** static 2026–27 timetable EXAMPLE data for M Plan · 课时记
(dates/classes/tutorial windows/exams, 163 events), generic source code, and
an anonymous project-generated workbook to reproduce the sample.
**It does not contain:** student name/ID, account, personal tasks/events,
individually entered exams or changes, saved group settings, flights, cloud env
or API credentials, originally uploaded spreadsheet (with uploader metadata),
or university-supplied PDF originals.

The baseline illustrates one 10-course configuration without tying it to
any identified student. Users should edit or replace the example data for
other programs and verify dates with their institution.

On first run, `wx.getStorageSync` returns empty personal arrays and default
Tutorial settings. Personal data is stored only on that user's device.
To remove all local personal data: **设置 → 隐私与本机数据 → 全部清空**.
This operation requires explicit confirmation; it clears local keys only,
not the static example schedule. It is not triggered automatically on update.

No backend, login, cloud function, shared trip or cloud deployment is included.
