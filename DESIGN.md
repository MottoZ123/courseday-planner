# CourseDay Planner V2.1.7 设计说明

## 核心原则

1. **Event-first**：确定的课程 / 考试按具体日期事件存储。
2. **Source-priority aware**：V2.1.7 的日期与时段优先服从用户 2026-08-30 上传的 Weekly Schedule；Teaching Plan 只补充其未提供的课程元数据。
3. **Public / Private 分离**：静态课表在 `miniprogram/data/`；任务、个人事件、自定义考试、临时调课、设置在本机 Storage。
4. **Override-not-mutate**：临时调课仅通过本机 override 覆盖官方硬场次。
5. **Uncertain tutorial ≠ hard class**：只知道候选大时段、不知道具体组别的 Tutorial 用 `nonBlocking=true` 表示。
6. **Mobile-first**：优先适配 360–430px 手机宽度。
7. **Native Share**：只使用微信右上角原生分享。

## 当前最终课程

`PMAA7001, PMAA7002, PMAA7003, PMAA7004, PMAA7005, PMAA7007, PMAA7008, PMAA7013, PMAA7018, PMAA7019`

## Static Event 分类

### 硬日程

`lecture / exam / bootcamp / presentation / orientation / precise tutorial`

会参与：

- next class
- weekly load
- Free Window
- temporary reschedule candidate

### 非硬 Tutorial 候选窗口

```text
type: tutorial
tutorialGroup: null
nonBlocking: true
keepTitle: true
```

用于 PMAA7005 / PMAA7013 / PMAA7019 / PMAA7004 的最新上传课表候选块。

这些窗口：

- 在 Today / Actual Week / Calendar / Course Detail 显示；
- 不进入 next class / weekly load / Free Window；
- 不进入 `adjustableEvents()`；
- 等拿到具体组别后再升级成精确 hard tutorial 事件。

## Runtime 日程管线

```text
events.js
  → tutorialVisible()
  → baseVisibleEvents()
  → applyReschedules()
  → + customExamEvents()
  → visibleEvents()
```

## Temporary Reschedule

Storage key：`maa_v2_reschedules`。

只允许对 `adjustableEvents()` 返回的确定场次建立 override。候选 Tutorial window 被排除，避免把不确定信息误当成已确认课。

## Custom Exam

Storage key：`maa_v2_custom_exams`。继续装饰为 `type='exam'`，自动参与考试中心、Today、Week、Calendar 和 Free Window。

## Personal Event

继续支持：

```text
scheduleType: single | continuous | discrete
single: date
continuous: startDate + durationDays
discrete: dates[]
allDay / startTime / endTime / category / location / note / blockFreeWindow
```

## 数据更新流程

```text
新 Weekly Schedule
  → 同步 source/Weekly Schedule Update YYYYMMDD.xlsx
  → 更新 canonical 有课日期速查
  → build_schedule.py
  → validate_schedule.py
  → smoke_test.js
  → node --check
  → 微信开发者工具编译
```
