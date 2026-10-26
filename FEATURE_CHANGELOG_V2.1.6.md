# Feature Changelog — V2.1.6

日期：2026-08-27

## 新增：自定义考试

- 考试中心新增 `＋新增考试`。
- 个人事件新增 `新增考试` 快捷入口。
- 支持关联课程 / 不关联课程、考试类型、名称、日期、时间、地点、备注。
- 支持编辑与删除个人考试。
- 官方考试保持只读。
- 自定义考试自动参与 Today、Week、Calendar、考试倒计时、Course Detail 和 Free Window。
- 新增 Storage key：`maa_v2_custom_exams`。

## 新增：临时调课

- 新增独立页面 `pages/adjustments/adjustments`。
- 入口：个人事件、更多、课程详情。
- 可针对某一节具体官方课程：改日期、改时间、换地点、同时调整，或停课/取消。
- 运行时使用本地 override；公共官方 `events.js` 不修改。
- 调课后的实际安排会进入 Today / Actual Week / Calendar / Course Detail / Free Window。
- Module 周模板仍使用官方原始结构。
- 删除调整可立即恢复官方原安排。
- 新增 Storage key：`maa_v2_reschedules`。

## 未改变

- 最终选课仍为 V2.1.5 的 10 门，其中 PMAA7013 已替换 PMAA7025。
- 官方 Teaching Plan / Academic Calendar 数据未改。
- 微信右上角原生分享未改。
- 个人事件的单次 / 连续多日 / 离散日期输入方式未改。
