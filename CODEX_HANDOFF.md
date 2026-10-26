# Codex Handoff — CourseDay Planner V2.1.7

你接手的是已经可运行的微信原生小程序。不要重写架构，继续在现有实现上迭代。

## 当前最终选课

`PMAA7001, PMAA7002, PMAA7003, PMAA7004, PMAA7005, PMAA7007, PMAA7008, PMAA7013, PMAA7018, PMAA7019`

公共数据版本：`2026.08.30-v2.1.7`。

## 最新时间源

V2.1.7 把原版本整理的 `source/sample-timetable-2026-27.xlsx` 作为**时间优先来源**。不要再用 2026-08-18 Teaching Plan 的日期/星期覆盖它。

必须保留的关键更新：

- PMAA7013 lectures：2026-12-01, 12-04, 12-08, 12-15, 12-18, 2027-01-05, 01-08, 01-12, 01-15；18:30–21:30。
- PMAA7001 Final：2026-10-17 14:00–17:00。
- PMAA7003 Final：2026-10-21 18:30–21:30。
- PMAA7019 Final：2026-11-30 14:00–17:00。
- 不再把旧 PMAA7019 11/7 Mid-Term 与 PMAA7008 5/4 TBC 作为 V2.1.7 runtime 事件。

## Tutorial 语义

1. PMAA7001 / PMAA7003：继续保留精确 A1/A2/A3 `tutorialGroup` 事件，Settings 可过滤。
2. PMAA7005 / PMAA7013 / PMAA7019 / PMAA7004：最新周课表只提供 Tutorial 候选时间块；这些事件：
   - `type='tutorial'`
   - `tutorialGroup=null`
   - `nonBlocking=true`
   - `keepTitle=true`
3. `tutorialVisible()` 对 `tutorialGroup=null` 的事件始终显示。
4. `hardEvent()` 必须优先检查 `nonBlocking` 并返回 false。
5. `adjustableEvents()` 必须排除 `nonBlocking`，避免把候选窗口当成确定场次调课。

## 不得破坏的原则

1. Event-first：所有确定正式日程按具体日期存储。
2. 公共 / 私人分离：课程数据公共；Tasks / Personal Events / Custom Exams / Reschedules / Tutorial Settings 本机私有。
3. 临时调课必须 override 官方硬场次，不能写回 `events.js`。
4. 自定义考试必须继续并入 Today / Week / Calendar / Exams / Free Window / Course Detail。
5. PMAA7008 2027-04-22 18:30–21:30 特殊晚间时段必须保留。
6. 微信右上角原生分享必须保留；不要增加页面内分享按钮。
7. 上传周课表没有给出的地点不要凭空编造；当前代码对已知课程沿用上一版地点，对新 Tutorial 窗口允许地点为空。
8. Teaching Plan / Academic Calendar 来源冲突继续显式保留。

## Runtime 日程管线

```text
static events.js
  → precise Tutorial group filter (7001/7003)
  → baseVisibleEvents()
  → applyReschedules()       # 只针对 hard / adjustable official sessions
  → + customExamEvents()
  → visibleEvents()
```

`nonBlocking` Tutorial windows 会出现在日历/实际周，但不会进入 hard load / Free Window / next class。

## 测试基线

```bash
python tools/validate_schedule.py
node tools/smoke_test.js
find miniprogram -name '*.js' -print0 | xargs -0 -n1 node --check
```

预期：

- Static event objects: 163
- Formal lectures: 99
- Uploaded-timetable finals: 8
- Precise grouped tutorials: 12
- Non-blocking tutorial windows: 21
- Unexpected hard overlaps: 0
- Custom exam / reschedule / cancel restore: PASS
