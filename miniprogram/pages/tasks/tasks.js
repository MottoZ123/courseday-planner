var storage=require('../../utils/storage.js');
var schedule=require('../../utils/schedule.js');
var date=require('../../utils/date.js');

function emptyForm(){ return {title:'',dueDate:'',dueTime:'23:59',note:''}; }

var share=require('../../utils/share.js');
Page({
  data:{
    tasks:[],filter:'open',showForm:false,editingId:'',courses:[],courseIndex:0,
    typeOptions:['assignment','project','presentation','study','personal'],typeIndex:0,
    priorityOptions:['low','medium','high'],priorityIndex:1,
    progressOptions:[0,25,50,75,100],progressIndex:0,
    form:emptyForm()
  },
  onLoad:function(q){
    var cs=schedule.courses.filter(function(c){return c.isFormal;});
    var all=[{code:'',nameZh:'不关联课程'}].concat(cs);
    this.setData({courses:all});
    if(q&&q.course){
      var idx=all.findIndex(function(c){return c.code===q.course;});
      if(idx>=0)this.setData({courseIndex:idx,showForm:true});
    }
  },
  onShow:function(){this.load();},
  load:function(){
    var f=this.data.filter;
    var a=storage.getTasks().sort(function(a,b){return (a.dueDate+(a.dueTime||'')).localeCompare(b.dueDate+(b.dueTime||''));});
    if(f==='open')a=a.filter(function(x){return x.status!=='done';});
    if(f==='done')a=a.filter(function(x){return x.status==='done';});
    this.setData({tasks:a});
  },
  setFilter:function(e){this.setData({filter:e.currentTarget.dataset.filter});this.load();},
  openNew:function(){
    this.setData({showForm:true,editingId:'',courseIndex:0,typeIndex:0,priorityIndex:1,progressIndex:0,form:emptyForm()});
  },
  editTask:function(e){
    var id=e.currentTarget.dataset.id;
    var t=storage.getTasks().find(function(x){return x.id===id;});
    if(!t)return;
    var ci=this.data.courses.findIndex(function(c){return c.code===(t.courseCode||'');});
    var ti=this.data.typeOptions.indexOf(t.type); if(ti<0)ti=0;
    var pi=this.data.priorityOptions.indexOf(t.priority); if(pi<0)pi=1;
    var progress=t.progress||0;
    var gi=this.data.progressOptions.indexOf(progress); if(gi<0)gi=0;
    this.setData({
      showForm:true,editingId:id,courseIndex:Math.max(0,ci),typeIndex:ti,priorityIndex:pi,progressIndex:gi,
      form:{title:t.title||'',dueDate:t.dueDate||'',dueTime:t.dueTime||'23:59',note:t.note||''}
    });
  },
  cancelForm:function(){this.setData({showForm:false,editingId:'',form:emptyForm()});},
  bindTitle:function(e){this.setData({'form.title':e.detail.value});},
  bindDate:function(e){this.setData({'form.dueDate':e.detail.value});},
  bindTime:function(e){this.setData({'form.dueTime':e.detail.value});},
  bindNote:function(e){this.setData({'form.note':e.detail.value});},
  coursePick:function(e){this.setData({courseIndex:Number(e.detail.value)});},
  typePick:function(e){this.setData({typeIndex:Number(e.detail.value)});},
  priorityPick:function(e){this.setData({priorityIndex:Number(e.detail.value)});},
  progressPick:function(e){this.setData({progressIndex:Number(e.detail.value)});},
  saveTask:function(){
    var f=this.data.form;
    if(!f.title||!f.dueDate){wx.showToast({title:'请填写标题和日期',icon:'none'});return;}
    var c=this.data.courses[this.data.courseIndex];
    var progress=this.data.progressOptions[this.data.progressIndex];
    var status=progress>=100?'done':(progress>0?'doing':'todo');
    storage.upsertTask({
      id:this.data.editingId||('task-'+Date.now()),
      title:f.title,
      courseCode:c.code||'',
      type:this.data.typeOptions[this.data.typeIndex],
      dueDate:f.dueDate,
      dueTime:f.dueTime,
      priority:this.data.priorityOptions[this.data.priorityIndex],
      status:status,
      progress:progress,
      note:f.note||''
    });
    this.setData({showForm:false,editingId:'',form:emptyForm()});
    this.load();
    wx.showToast({title:'已保存',icon:'success'});
  },
  advance:function(e){
    var id=e.currentTarget.dataset.id;
    var t=storage.getTasks().find(function(x){return x.id===id;});
    if(t){
      t.progress=Math.min(100,(t.progress||0)+25);
      t.status=t.progress>=100?'done':'doing';
      storage.upsertTask(t);this.load();
    }
  },
  remove:function(e){
    var self=this,id=e.currentTarget.dataset.id;
    wx.showModal({title:'删除任务？',content:'删除后无法恢复。',success:function(r){if(r.confirm){storage.removeTask(id);self.load();}}});
  }
,onReady:function(){share.enable();},onShareAppMessage:function(){return share.appMessage();},onShareTimeline:function(){return share.timeline();}});
