var schedule=require('../../utils/schedule.js');
var date=require('../../utils/date.js');

var share=require('../../utils/share.js');
Page({
  data:{anchor:'',days:[],mode:'actual',weekLabel:'',module:null,pattern:[],patternByDay:[],selectedDate:'',selectedDay:{events:[]}},
  onLoad:function(){this.load(date.todayKeyHK());},
  onShow:function(){if(this.data.anchor)this.load(this.data.anchor);},
  load:function(a){
    var today=date.todayKeyHK();
    var days=schedule.weekDays(a);
    days.forEach(function(d){
      d.free=schedule.freeBlocksForDay(d.date);
      d.isToday=d.date===today;
      d.dayNumber=Number(d.date.slice(-2));
      d.weekdayShort=d.weekday.replace('周','');
    });
    var m=schedule.currentModule(a);
    var pattern=m?schedule.modulePattern(m.id):[];
    var groups=[];
    ['周一','周二','周三','周四','周五','周六','周日'].forEach(function(w){
      var items=pattern.filter(function(p){return p.weekday===w;});
      if(items.length)groups.push({weekday:w,items:items});
    });
    var selected=this.data.selectedDate;
    if(!selected||selected<days[0].date||selected>days[6].date)selected=(today>=days[0].date&&today<=days[6].date)?today:days[0].date;
    var selectedDay=days.find(function(d){return d.date===selected;})||days[0];
    this.setData({anchor:a,days:days,weekLabel:days[0].short+' — '+days[6].short,module:m,pattern:pattern,patternByDay:groups,selectedDate:selected,selectedDay:selectedDay});
  },
  prev:function(){this.setData({selectedDate:''});this.load(date.addDays(this.data.anchor,-7));},
  next:function(){this.setData({selectedDate:''});this.load(date.addDays(this.data.anchor,7));},
  today:function(){this.setData({selectedDate:date.todayKeyHK()});this.load(date.todayKeyHK());},
  setMode:function(e){this.setData({mode:e.currentTarget.dataset.mode});},
  selectDay:function(e){
    var d=e.currentTarget.dataset.date;
    var item=this.data.days.find(function(x){return x.date===d;});
    if(item)this.setData({selectedDate:d,selectedDay:item});
  },
  openCourse:function(e){var c=e.currentTarget.dataset.code;if(c)wx.navigateTo({url:'/pages/course-detail/course-detail?code='+c});}
,onReady:function(){share.enable();},onShareAppMessage:function(){return share.appMessage();},onShareTimeline:function(){return share.timeline();}});
