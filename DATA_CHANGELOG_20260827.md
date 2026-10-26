# 数据更新说明｜2026-08-27

## 用户确认的选课变更

- 移除：PMAA7025 AI for Financial Valuation and Investment。
- 增加：PMAA7013 Corporate Finance。

新的 10 门正式课程：

`7001 / 7002 / 7003 / 7004 / 7005 / 7007 / 7008 / 7013 / 7018 / 7019`

## PMAA7013 写入内容

- Module 3。
- Instructor：Prof. Yan Xiong。
- Class C。
- Lecture：Wed & Sat 18:10–21:30。
- Dates：2026-12-02, 12-05, 12-09, 12-16, 12-19；2027-01-02, 01-06, 01-09, 01-13。
- Venue：CP-A205-1&2。
- Tutorial C1：Dec 21 14:00–15:00；Jan 13 09:30–10:30。
- Tutorial C2：Dec 21 15:00–16:00；Jan 13 10:30–11:30。
- Tutorial C3：Dec 21 16:00–17:00；Jan 13 11:30–12:30。
- Tutorial venue：CP-D。
- Final：2027-01-20 14:00–17:00；CP-ABC, CP-D, CP-H, CP-J, CP-A205-1&2。

## 已知官方冲突

PMAA7005 在 2027-01-13 09:30–12:30 有 Lecture。PMAA7013 当日三个 Tutorial 候选完整覆盖该时间段，因此 C1/C2/C3 任一组都发生重叠。

本版本只标记冲突，不修改官方时段。

## 同步更新

- source Excel 的全年每日课表、日期速查、课程总览、考试与 Tutorial、Module 模板、负担概览。
- `courses.js`：移除 7025，增加 7013。
- `events.js`：移除 7025 全部事件，增加 7013 Lecture / Tutorial / Final。
- `meta.js`：选课与版本更新为 V2.1.5。
- Settings：新增 PMAA7013 C1/C2/C3。
- Tutorial 过滤逻辑：新增 PMAA7013。
- `build_schedule.py`：Tutorial Group 解析支持 C1/C2/C3。
- `validate_schedule.py`：区分 known official clash 与 unexpected overlaps。
- 微信右上角原生分享保持不变。

## 预期校验

- Timed schedule rows：147。
- Known official clash candidates：3。
- Unexpected overlaps：0。
- Runtime event objects：158。
