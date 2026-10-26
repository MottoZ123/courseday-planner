module.exports = {
  "version": "2026.08.30-v2.1.7",
  "academicYear": "2026-27",
  "title": "M Plan · 课时记 V2.1.7",
  "selectedCourses": [
    "PMAA7001",
    "PMAA7002",
    "PMAA7003",
    "PMAA7004",
    "PMAA7005",
    "PMAA7007",
    "PMAA7008",
    "PMAA7013",
    "PMAA7018",
    "PMAA7019"
  ],
  "source": "V2.1.7 匿名化示例课表（2026-08-30）+ 已整理课程元数据",
  "updatedAt": "2026-08-30",
  "changeLog": [
    {
      "date": "2026-08-30",
      "text": "V2.1.7：按V2.1.7 示例 Weekly Schedule 全面刷新正式课程时间。PMAA7013 大课改为周二/周五 18:30–21:30（9次）；PMAA7001/PMAA7003 Final 调整为 10/17 14:00–17:00 与 10/21 18:30–21:30；PMAA7019 Final 调整为 11/30 14:00–17:00；移除新课表未列出的 PMAA7019 Mid-Term 与 PMAA7008 5/4 TBC。新课表只给出部分 Tutorial 的候选时间块而未标具体组别/子时段，PMAA7005/7013/7019/7004 以非硬占用候选时段展示；PMAA7001/7003 继续保留可分组的精确 Tutorial 候选。"
    },
    {
      "date": "2026-08-27",
      "text": "V2.1.6：新增本机自定义考试与临时调课。考试可在考试中心或个人事件入口添加，并自动进入Today、周课表、日历、考试倒计时和Free Window；临时调课可对单节官方课程改日期、时间、地点或标记停课，运行时覆盖官方场次，删除调整即可恢复，公共课表源文件不被修改。"
    },
    {
      "date": "2026-08-27",
      "text": "V2.1.5：最终选课去掉PMAA7025，增加PMAA7013 Corporate Finance；同步课程总览、全年日程、考试、Tutorial、Module负担与设置。PMAA7013 Tutorial支持C1/C2/C3分组。官方Teaching Plan显示2027-01-13三个Tutorial候选均与PMAA7005 09:30–12:30大课重叠，应用保留该冲突，不自动改时段。"
    },
    {
      "date": "2026-08-26",
      "text": "V2.1.4：启用微信原生右上角分享功能。所有页面可通过右上角“···”菜单转发给朋友或分享到朋友圈；不增加页面内自定义分享按钮，分享内容仅包含小程序入口，不会携带本机任务、个人事件或Tutorial设置。"
    },
    {
      "date": "2026-08-18",
      "text": "V2.1.3：按2026-08-18版Teaching Plan刷新公共日程；PMAA7003 Final改为2026-10-17 14:00–17:00（CP-LT104 & CP-J）。Teaching Plan标注Career & Enrichment Week为2027-01-21至01-27，而Academic Calendar仍标注2027-03-11至03-17；代码中显式保留两者差异并标注待确认。"
    },
    {
      "date": "2026-08-18",
      "text": "新版Teaching Plan同时新增PMAA7010 Tutorial A1与PMAA7024 Final Presentation；两门课不在当前最终10门选课中，因此仅写入更新说明，未加入运行时课表。"
    },
    {
      "date": "2026-08-16",
      "text": "V2.1.2：仅优化个人事件录入，新增单次 / 连续多日 / 离散日期三种方式；连续事件按自然日自动展开，离散事件支持月历多选。"
    },
    {
      "date": "2026-08-14",
      "text": "V2.1.1：在 app.json 顶层启用 lazyCodeLoading=requiredComponents，修复微信开发者工具“组件按需注入”代码质量检查。"
    },
    {
      "date": "2026-08-14",
      "text": "V2.1：优化手机小屏UI；任务支持完整编辑；新增个人事件并接入月历与空闲窗口。"
    },
    {
      "date": "2026-08-14",
      "text": "V2 初始版本：导入最终10门选课、Boot Camp、考试、Tutorial候选、Module与校历。"
    }
  ]
};
