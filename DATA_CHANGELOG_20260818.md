# 数据更新说明｜2026-08-18（历史记录）

> 当前选课已在 2026-08-27 更新：PMAA7013 替换 PMAA7025。请以 `DATA_CHANGELOG_20260827.md` 与 V2.1.5 为准。

## 更新基线

- 上一代码包：M Plan · 课时记 V2.1.2
- 新教学计划：MAA Teaching Plan 2026-27，文件日期 2026-08-18
- 当前固定选课：
  - PMAA7001
  - PMAA7002
  - PMAA7003
  - PMAA7004
  - PMAA7005
  - PMAA7007
  - PMAA7008
  - PMAA7018
  - PMAA7019
  - PMAA7025

## 已写入运行时日程

| 项目 | 上一版本 | 2026-08-18 Teaching Plan | V2.1.3 处理 |
|---|---|---|---|
| PMAA7003 Final | 2026-10-17 18:30–21:30；CP-A205-1&2 & CP-H | 2026-10-17 14:00–17:00；CP-LT-104 & J | 更新 Excel、events.js、考试页和课程总览；代码地点统一写为 CP-LT104 & CP-J |
| Career & Enrichment Week | Academic Calendar：2027-03-11 至 03-17 | Teaching Plan：2027-01-21 至 01-27 | 1 月作为待确认的 `career` 提示；3 月改名为 `Inter-Module Break`，避免重复宣称 |
| 最终 10 门选课 | 固定 | 未要求更换 | 保持不变 |
| Personal Events | 单次 / 连续 / 离散 | 与教学计划无关 | 保持 V2.1.2 实现不变 |

## 新版出现但未导入运行时的课程变化

### PMAA7010 Data Mining and Text Analysis

新增 Tutorial Group A1：

- 2026-10-27 18:30–21:30，CP-LTB
- 2026-11-07 18:30–21:30，CP-LTB

该课程不在当前固定 10 门选课中，因此未写入 `events.js`。

### PMAA7024 Financial Statement Analysis: A Data Analytic Approach

新增 Final Presentation：

- 2027-06-18 14:00–19:00
- Room 501，Shenzhen Campus

该课程不在当前固定 10 门选课中，因此未写入 `events.js`。

## Career Week 来源冲突

两份官方材料对日期给出不同结果：

- Teaching Plan 2026-08-18：2027-01-21 至 01-27
- Appendix B - Academic Calendar：2027-03-11 至 03-17

本版本不擅自判断哪一份最终有效，也不静默删除任一来源：

1. 1 月日期显示为“Teaching Plan，日期待确认”的 Career 提示。
2. 3 月日期保留为 Inter-Module Break。
3. Career 提示不计入硬日程，不影响 Free Window。
4. 后续以 institution timetable system、课程教师或项目办公室最终通知为准。

## 文件变更

- `source/sample-timetable-2026-27.xlsx`
- `source/Appendix A - 2026-27 Teaching Plan.pdf`
- `miniprogram/data/events.js`
- `miniprogram/data/meta.js`
- `miniprogram/data/modules.js`
- `README.md`
- `CODEX_HANDOFF.md`
- `DESIGN.md`
- `project.config.json`


## 完成校验

- Timed schedule rows：142
- Hard overlaps：0
- Runtime event objects：153
- `node tools/smoke_test.js`：通过
- 所有 `miniprogram/**/*.js` 的 `node --check`：通过
- `tools/build_schedule.py`、`tools/validate_schedule.py` 语法编译：通过
