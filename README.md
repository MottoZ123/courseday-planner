# 课序 · CourseDay Planner

微信原生课表与个人日程工具，功能基线 **V2.1.7**。用今日视图、周课表和月历安排课程、考试、任务与个人事件，并计算可用时间。

项目定位不绑定具体学校、专业或年级。随包课程只是一组可替换的演示排课，不代表任何学校的全校课表。其他课程组合需替换示例数据并运行构建与回归检查。

公共示例课表随源码静态保存；私人任务、日程、自定义考试、临时调课和设置仅保存于设备的微信 Storage。无服务器、账号、云开发或跨用户数据同步。

## 功能

- 今日课程、下一节课、Module 进度和每周负担。
- 实际周、Module 模板、月历、课程详情、考试中心和空闲窗口。
- 本地任务增删改查；个人事件支持单次、连续多日和离散日期。
- 自定义考试参与日历、周课表和空闲时间计算。
- 对单节确定课程临时改日期、时间、地点或停课；删除调整恢复原课表。
- Tutorial 分组筛选；未确认的候选窗口可见但不占用空闲时间。
- 微信右上角原生分享，仅分享通用入口。
- 设置页可在确认后清空本机个人数据。

## 快速开始

1. 克隆仓库，在微信开发者工具导入包含 `project.config.json` 的根目录。
2. `miniprogramRoot` 为 `miniprogram/`；公开配置始终保留 `touristappid`。
3. 真机调试需在本地配置合法 AppID，勿将其提交。提交前运行隐私检查。
4. 示例日期属于 2026–27 学年，使用前核实或替换为自己的课表。

## 回归与打包

需要 Python 3.10+、Node.js 22+。只有重建 Excel 数据时需要 `python -m pip install -r requirements-dev.txt`。

```sh
python tools/validate_schedule.py
node tools/smoke_test.js
node tools/privacy_test.js
python tools/prepublish_check.py
python tools/workflow.py all
```

全量工作流运行回归、页面结构、语法与隐私检查，生成 `release/` 下 ZIP、SHA-256 与包内清单。GitHub Actions 只运行离线测试，无部署或上传密钥。

## 版本基线

保留 13 个页面、163 条静态事件、99 次 Lecture、8 次 Final、12 个精确分组 Tutorial 和 21 个 `nonBlocking` Tutorial 候选窗口。保留原事件 ID、日期、时间及所有原版功能，不合入 V2.1.8。

`source/sample-timetable-2026-27.xlsx` 是去标识的项目整理示例，`tools/build_schedule.py` 可重建事件。原上传资料、官方 PDF、个人记录与私人截图不在公开包内。

## 数据与隐私

保留 `maa_v2_tasks`、`maa_v2_personal_events`、`maa_v2_custom_exams`、`maa_v2_reschedules`、`maa_v2_settings`，改名不清空旧数据。静态课表不会被个人修改覆盖。详见 `DESIGN.md` 与 `PRIVACY_AND_DATA.md`。

## 贡献与许可

原创代码采用 MIT，见 `LICENSE`。示例数据和第三方材料不因代码许可自动获得再分发权，见 `source/README.md`。贡献流程见 `CONTRIBUTING.md`。共同开发者邀请目标为 GitHub 用户 `Mary-Wym`，实际权限以接受邀请后的状态为准。

后续优先完善真机布局、课表导入格式和本地回归覆盖，保持本地架构。微信开发者工具、真机及原生分享需人工验收，见 `QA_REPORT.md`。
