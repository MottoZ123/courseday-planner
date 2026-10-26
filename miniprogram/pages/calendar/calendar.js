var schedule=require('../../utils/schedule.js');
var date=require('../../utils/date.js');
var storage=require('../../utils/storage.js');

var share=require('../../utils/share.js');
Page({
  data:{year:0,month:0,title:'',cells:[],selected:'',selectedEvents:[],selectedPersonal:[],selectedTasks:[],holiday:null,weeknames:['一','二','三','四','五','六','日']},
  onLoad:function(){var n=date.nowHK();this.build(n.getFullYear(),n.getMonth()+1,date.todayKeyHK());},
  onShow:function(){if(this.data.year)this.build(this.data.year,this.data.month,this.data.selected||date.todayKeyHK());},
  build:function(y,m,sel){
    var first=new Date(Date.UTC(y,m-1,1,12));
    var days=new Date(Date.UTC(y,m,0,12)).getUTCDate();
    var lead=(first.getUTCDay()+6)%7;
    var cells=[],today=date.todayKeyHK();
    for(var i=0;i<lead;i++)cells.push({blank:true,key:'b'+i});
    var tasks=storage.getTasks();
    for(var d=1;d<=days;d++){
      var key=y+'-'+date.pad2(m)+'-'+date.pad2(d);
      var es=schedule.eventsOn(key);
      var ts=tasks.filter(function(t){return t.dueDate===key&&t.status!=='done';});
      var ps=schedule.personalEventsOn(key);
      cells.push({blank:false,key:key,day:d,hasExam:es.some(function(e){return e.type==='exam';}),eventCount:es.filter(schedule.hardEvent).length,taskCount:ts.length,personalCount:ps.length,holiday:!!schedule.holidayOn(key),selected:key===sel,isToday:key===today});
    }
    this.setData({year:y,month:m,title:y+'年'+m+'月',cells:cells});
    this.select(sel);
  },
  prev:function(){var y=this.data.year,m=this.data.month-1;if(m<1){m=12;y--;}this.build(y,m,y+'-'+date.pad2(m)+'-01');},
  next:function(){var y=this.data.year,m=this.data.month+1;if(m>12){m=1;y++;}this.build(y,m,y+'-'+date.pad2(m)+'-01');},
  selectTap:function(e){var d=e.currentTarget.dataset.date;if(d)this.select(d);},
  select:function(k){
    if(!k)return;
    var tasks=storage.getTasks().filter(function(t){return t.dueDate===k;});
    this.setData({selected:k,selectedEvents:schedule.eventsOn(k),selectedPersonal:schedule.personalEventsOn(k),selectedTasks:tasks,holiday:schedule.holidayOn(k)});
    var cells=this.data.cells.map(function(c){return c.blank?c:Object.assign({},c,{selected:c.key===k});});
    this.setData({cells:cells});
  },
  openCourse:function(e){var c=e.currentTarget.dataset.code;if(c)wx.navigateTo({url:'/pages/course-detail/course-detail?code='+c});},
  addPersonal:function(){wx.navigateTo({url:'/pages/personal/personal?new=1&date='+this.data.selected});},
  editPersonal:function(){wx.navigateTo({url:'/pages/personal/personal'});}
,onReady:function(){share.enable();},onShareAppMessage:function(){return share.appMessage();},onShareTimeline:function(){return share.timeline();}});
