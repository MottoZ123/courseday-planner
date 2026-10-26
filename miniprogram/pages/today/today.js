var schedule=require('../../utils/schedule.js');
var date=require('../../utils/date.js');
var storage=require('../../utils/storage.js');
var share=require('../../utils/share.js');
Page({
 data:{today:'',weekday:'',module:null,moduleStats:null,todayEvents:[],next:null,countdown:'',tasks:[],nextExam:null,weekLoad:0},
 onLoad:function(){share.enable();},
 onShow:function(){this.refresh();var self=this;this.timer=setInterval(function(){self.refreshCountdown();},60000);},
 onHide:function(){clearInterval(this.timer);},onUnload:function(){clearInterval(this.timer);},
 refresh:function(){
   var today=date.todayKeyHK(),es=schedule.eventsOn(today),next=schedule.nextEvent();
   var tasks=storage.getTasks().filter(function(t){return t.status!=='done'&&t.dueDate>=today;}).sort(function(a,b){return (a.dueDate+(a.dueTime||'')).localeCompare(b.dueDate+(b.dueTime||''));});
   var exams=schedule.upcomingExams(),m=schedule.currentModule(today);
   this.setData({today:date.formatMD(today),weekday:date.weekdayZh(today),module:m,moduleStats:m?schedule.moduleStats(m):null,todayEvents:es,next:next,countdown:next?date.countdown(next.date,next.startTime):'',tasks:tasks.slice(0,3),nextExam:exams[0]||null,weekLoad:schedule.weeklyLoad(today)});
 },
 refreshCountdown:function(){if(this.data.next)this.setData({countdown:date.countdown(this.data.next.date,this.data.next.startTime)});},
 openCourse:function(e){var c=e.currentTarget.dataset.code;if(c)wx.navigateTo({url:'/pages/course-detail/course-detail?code='+c});},
 openTasks:function(){wx.switchTab({url:'/pages/tasks/tasks'});},
 openExams:function(){wx.navigateTo({url:'/pages/exams/exams'});},
 onReady:function(){share.enable();},
 onShareAppMessage:function(){return share.appMessage();},
 onShareTimeline:function(){return share.timeline();}
});
