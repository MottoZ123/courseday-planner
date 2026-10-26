var storage=require('../../utils/storage.js');
var date=require('../../utils/date.js');

var SCHEDULE_TYPES=['single','continuous','discrete'];
var SCHEDULE_LABELS=['单次','连续多日','离散日期'];

function emptyForm(d){
  var base=d||date.todayKeyHK();
  return {
    title:'',
    scheduleType:'single',
    date:base,
    startDate:base,
    durationDays:2,
    endDatePreview:date.addDays(base,1),
    dates:[],
    allDay:false,
    startTime:'09:00',
    endTime:'10:00',
    location:'',
    note:'',
    blockFreeWindow:true
  };
}

function normalizeRawEvent(item){
  var t=item.scheduleType||'single';
  var f=emptyForm(item.date||item.startDate||date.todayKeyHK());
  f.title=item.title||'';
  f.scheduleType=t;
  f.date=item.date||f.date;
  f.startDate=item.startDate||item.date||f.startDate;
  f.durationDays=Math.max(1,Number(item.durationDays)||1);
  f.endDatePreview=date.addDays(f.startDate,f.durationDays-1);
  f.dates=(item.dates||[]).slice().sort();
  f.allDay=!!item.allDay;
  f.startTime=item.startTime||'09:00';
  f.endTime=item.endTime||'10:00';
  f.location=item.location||'';
  f.note=item.note||'';
  f.blockFreeWindow=item.blockFreeWindow!==false;
  return f;
}

function firstDateOfEvent(e){
  var t=e.scheduleType||'single';
  if(t==='continuous')return e.startDate||e.date||'';
  if(t==='discrete')return (e.dates&&e.dates.length)?e.dates.slice().sort()[0]:'';
  return e.date||'';
}

function summaryForEvent(e){
  var t=e.scheduleType||'single';
  var first=firstDateOfEvent(e)||date.todayKeyHK();
  var p=first.split('-');
  var dateText='';
  var timeText='';
  if(t==='continuous'){
    var days=Math.max(1,Number(e.durationDays)||1);
    var end=date.addDays(e.startDate||first,days-1);
    dateText=(e.startDate||first)+' → '+end+' · '+days+'天';
    timeText=e.allDay?'全天':(days===1?((e.startTime||'')+'–'+(e.endTime||'')):('首日 '+(e.startTime||'')+' · 末日 '+(e.endTime||'')));
  }else if(t==='discrete'){
    var ds=(e.dates||[]).slice().sort();
    dateText='已选 '+ds.length+' 天'+(ds.length?' · '+ds[0]+(ds.length>1?' … '+ds[ds.length-1]:''):'');
    timeText=e.allDay?'全天':((e.startTime||'')+'–'+(e.endTime||''));
  }else{
    dateText=e.date||first;
    timeText=e.allDay?'全天':((e.startTime||'')+'–'+(e.endTime||''));
  }
  return Object.assign({},e,{
    month:Number(p[1]),day:Number(p[2]),dateText:dateText,timeText:timeText,
    scheduleLabel:SCHEDULE_LABELS[Math.max(0,SCHEDULE_TYPES.indexOf(t))]
  });
}

var share=require('../../utils/share.js');
Page({
  data:{
    events:[],customExamCount:0,adjustmentCount:0,showForm:false,editingId:'',
    categoryOptions:['travel','meeting','interview','social','health','personal'],categoryIndex:5,
    scheduleTypeOptions:SCHEDULE_LABELS,scheduleTypeIndex:0,
    form:emptyForm(),
    weeknames:['一','二','三','四','五','六','日'],
    discreteYear:0,discreteMonth:0,discreteTitle:'',discreteCells:[]
  },
  onLoad:function(q){
    this.initialDate=(q&&q.date)||'';
    if(q&&q.new==='1'){
      var f=emptyForm(this.initialDate||date.todayKeyHK());
      this.setData({showForm:true,form:f});
      this.buildDiscreteCalendar(f.date);
    }
  },
  onShow:function(){this.load();},
  load:function(){
    var a=storage.getPersonalEvents().slice().sort(function(a,b){
      return (firstDateOfEvent(a)+(a.startTime||'')).localeCompare(firstDateOfEvent(b)+(b.startTime||''));
    }).map(summaryForEvent);
    this.setData({events:a,customExamCount:storage.getCustomExams().length,adjustmentCount:storage.getReschedules().length});
  },
  openExam:function(){wx.navigateTo({url:'/pages/exams/exams?new=1&date='+(this.initialDate||date.todayKeyHK())});},
  openAdjustments:function(){wx.navigateTo({url:'/pages/adjustments/adjustments'});},
  openNew:function(){
    var f=emptyForm(this.initialDate||date.todayKeyHK());
    this.setData({showForm:true,editingId:'',categoryIndex:5,scheduleTypeIndex:0,form:f});
    this.buildDiscreteCalendar(f.date);
  },
  editEvent:function(e){
    var id=e.currentTarget.dataset.id;
    var item=storage.getPersonalEvents().find(function(x){return x.id===id;});
    if(!item)return;
    var ci=this.data.categoryOptions.indexOf(item.category);if(ci<0)ci=5;
    var f=normalizeRawEvent(item);
    var si=SCHEDULE_TYPES.indexOf(f.scheduleType);if(si<0)si=0;
    this.setData({showForm:true,editingId:id,categoryIndex:ci,scheduleTypeIndex:si,form:f});
    this.buildDiscreteCalendar((f.dates&&f.dates[0])||f.startDate||f.date);
  },
  cancelForm:function(){
    var f=emptyForm(this.initialDate||date.todayKeyHK());
    this.setData({showForm:false,editingId:'',scheduleTypeIndex:0,form:f});
  },
  bindTitle:function(e){this.setData({'form.title':e.detail.value});},
  bindDate:function(e){this.setData({'form.date':e.detail.value});},
  bindStartDate:function(e){
    var d=e.detail.value,days=Math.max(1,Number(this.data.form.durationDays)||1);
    this.setData({'form.startDate':d,'form.endDatePreview':date.addDays(d,days-1)});
  },
  bindDuration:function(e){this.setDuration(e.detail.value);},
  durationMinus:function(){this.setDuration(Math.max(1,(Number(this.data.form.durationDays)||1)-1));},
  durationPlus:function(){this.setDuration((Number(this.data.form.durationDays)||1)+1);},
  setDuration:function(v){
    var days=Math.max(1,Math.min(365,parseInt(v,10)||1));
    this.setData({'form.durationDays':days,'form.endDatePreview':date.addDays(this.data.form.startDate,days-1)});
  },
  bindStart:function(e){this.setData({'form.startTime':e.detail.value});},
  bindEnd:function(e){this.setData({'form.endTime':e.detail.value});},
  bindLocation:function(e){this.setData({'form.location':e.detail.value});},
  bindNote:function(e){this.setData({'form.note':e.detail.value});},
  categoryPick:function(e){this.setData({categoryIndex:Number(e.detail.value)});},
  scheduleTypePick:function(e){
    var idx=Number(e.detail.value),t=SCHEDULE_TYPES[idx]||'single';
    var updates={scheduleTypeIndex:idx,'form.scheduleType':t};
    if(t==='continuous'&&!this.data.form.startDate)updates['form.startDate']=this.data.form.date||date.todayKeyHK();
    if(t==='discrete'&&!(this.data.form.dates||[]).length){
      updates['form.dates']=[this.data.form.date||this.data.form.startDate||date.todayKeyHK()];
    }
    this.setData(updates);
    if(t==='discrete')this.buildDiscreteCalendar((updates['form.dates']||this.data.form.dates)[0]||date.todayKeyHK());
  },
  toggleAllDay:function(e){this.setData({'form.allDay':e.detail.value});},
  toggleBlock:function(e){this.setData({'form.blockFreeWindow':e.detail.value});},

  buildDiscreteCalendar:function(anchor){
    anchor=anchor||date.todayKeyHK();
    var parts=anchor.split('-'),y=Number(parts[0]),m=Number(parts[1]);
    this.buildDiscreteMonth(y,m);
  },
  buildDiscreteMonth:function(y,m){
    var first=new Date(Date.UTC(y,m-1,1,12));
    var days=new Date(Date.UTC(y,m,0,12)).getUTCDate();
    var lead=(first.getUTCDay()+6)%7;
    var selected=this.data.form.dates||[];
    var cells=[];
    for(var i=0;i<lead;i++)cells.push({blank:true,key:'b'+i});
    for(var d=1;d<=days;d++){
      var key=y+'-'+date.pad2(m)+'-'+date.pad2(d);
      cells.push({blank:false,key:key,day:d,selected:selected.indexOf(key)>=0,isToday:key===date.todayKeyHK()});
    }
    this.setData({discreteYear:y,discreteMonth:m,discreteTitle:y+'年'+m+'月',discreteCells:cells});
  },
  discretePrev:function(){var y=this.data.discreteYear,m=this.data.discreteMonth-1;if(m<1){m=12;y--;}this.buildDiscreteMonth(y,m);},
  discreteNext:function(){var y=this.data.discreteYear,m=this.data.discreteMonth+1;if(m>12){m=1;y++;}this.buildDiscreteMonth(y,m);},
  toggleDiscreteDate:function(e){
    var d=e.currentTarget.dataset.date;if(!d)return;
    var ds=(this.data.form.dates||[]).slice(),i=ds.indexOf(d);
    if(i>=0)ds.splice(i,1);else ds.push(d);
    ds.sort();
    var self=this;
    this.setData({'form.dates':ds},function(){self.buildDiscreteMonth(self.data.discreteYear,self.data.discreteMonth);});
  },
  removeDiscreteDate:function(e){
    var d=e.currentTarget.dataset.date;
    var ds=(this.data.form.dates||[]).filter(function(x){return x!==d;});
    var self=this;
    this.setData({'form.dates':ds},function(){self.buildDiscreteMonth(self.data.discreteYear,self.data.discreteMonth);});
  },
  clearDiscreteDates:function(){
    var self=this;
    this.setData({'form.dates':[]},function(){self.buildDiscreteMonth(self.data.discreteYear,self.data.discreteMonth);});
  },

  saveEvent:function(){
    var f=this.data.form,t=f.scheduleType||'single';
    if(!f.title){wx.showToast({title:'请填写事件名称',icon:'none'});return;}
    if(t==='single'&&!f.date){wx.showToast({title:'请选择日期',icon:'none'});return;}
    if(t==='continuous'&&!f.startDate){wx.showToast({title:'请选择开始日期',icon:'none'});return;}
    if(t==='continuous'&&(Number(f.durationDays)||0)<1){wx.showToast({title:'持续天数至少为1天',icon:'none'});return;}
    if(t==='discrete'&&!(f.dates||[]).length){wx.showToast({title:'请至少选择1个日期',icon:'none'});return;}
    if(!f.allDay&&Number(f.durationDays||1)===1&&f.startTime>=f.endTime){wx.showToast({title:'结束时间需晚于开始时间',icon:'none'});return;}
    if(!f.allDay&&t!=='continuous'&&f.startTime>=f.endTime){wx.showToast({title:'结束时间需晚于开始时间',icon:'none'});return;}

    var payload={
      id:this.data.editingId||('personal-'+Date.now()),
      title:f.title,
      scheduleType:t,
      allDay:!!f.allDay,
      startTime:f.allDay?'':f.startTime,
      endTime:f.allDay?'':f.endTime,
      category:this.data.categoryOptions[this.data.categoryIndex],
      location:f.location||'',note:f.note||'',blockFreeWindow:f.blockFreeWindow!==false
    };
    if(t==='single')payload.date=f.date;
    if(t==='continuous'){
      payload.startDate=f.startDate;
      payload.durationDays=Math.max(1,Number(f.durationDays)||1);
    }
    if(t==='discrete')payload.dates=(f.dates||[]).slice().sort();

    storage.upsertPersonalEvent(payload);
    var nf=emptyForm(this.initialDate||date.todayKeyHK());
    this.setData({showForm:false,editingId:'',scheduleTypeIndex:0,form:nf});
    this.load();
    wx.showToast({title:'已保存',icon:'success'});
  },
  remove:function(e){
    var self=this,id=e.currentTarget.dataset.id;
    wx.showModal({title:'删除个人事件？',content:'连续或离散事件会一次删除整组日期。',success:function(r){if(r.confirm){storage.removePersonalEvent(id);self.load();}}});
  }
,onReady:function(){share.enable();},onShareAppMessage:function(){return share.appMessage();},onShareTimeline:function(){return share.timeline();}});
