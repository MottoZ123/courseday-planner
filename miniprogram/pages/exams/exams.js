var schedule=require('../../utils/schedule.js');
var storage=require('../../utils/storage.js');
var date=require('../../utils/date.js');
var share=require('../../utils/share.js');

var EXAM_TYPES=['Final','Mid-Term','Quiz / Test','Presentation','Other'];
var formalCourses=schedule.courses.filter(function(c){return c.isFormal;});
var COURSE_CODES=[''].concat(formalCourses.map(function(c){return c.code;}));
var COURSE_OPTIONS=['不关联课程'].concat(formalCourses.map(function(c){return c.code+' · '+c.nameZh;}));

function emptyForm(d){
  return {courseCode:'',title:'',examType:'Final',date:d||date.todayKeyHK(),startTime:'09:30',endTime:'12:30',venue:'',note:''};
}

function countdownText(today,target){
  var d=date.diffDays(today,target);
  if(d>0)return 'D-'+d;
  if(d===0)return '今天';
  return '已结束';
}

Page({
  data:{
    exams:[],showForm:false,editingId:'',form:emptyForm(),
    courseOptions:COURSE_OPTIONS,courseIndex:0,
    examTypeOptions:EXAM_TYPES,typeIndex:0
  },
  onLoad:function(q){
    this.initialDate=(q&&q.date)||'';
    this.pendingNew=!!(q&&q.new==='1');
  },
  onShow:function(){
    this.load();
    if(this.pendingNew){this.pendingNew=false;this.openNew();}
  },
  load:function(){
    var today=date.todayKeyHK();
    var es=schedule.visibleEvents().filter(function(e){return e.type==='exam';}).map(function(e){
      return Object.assign({},e,{
        countdownText:countdownText(today,e.date),
        sourceLabel:e.source==='custom'?'个人添加':'官方课表',
        isCustom:e.source==='custom'
      });
    }).sort(function(a,b){return (a.date+(a.startTime||'')).localeCompare(b.date+(b.startTime||''));});
    this.setData({exams:es});
  },
  openNew:function(){
    this.setData({showForm:true,editingId:'',courseIndex:0,typeIndex:0,form:emptyForm(this.initialDate||date.todayKeyHK())});
  },
  cancelForm:function(){this.setData({showForm:false,editingId:'',form:emptyForm(this.initialDate||date.todayKeyHK())});},
  editExam:function(e){
    var id=e.currentTarget.dataset.id;
    var item=storage.getCustomExams().find(function(x){return x.id===id;});
    if(!item)return;
    var ci=COURSE_CODES.indexOf(item.courseCode||'');if(ci<0)ci=0;
    var ti=EXAM_TYPES.indexOf(item.examType||'Other');if(ti<0)ti=EXAM_TYPES.length-1;
    this.setData({showForm:true,editingId:id,courseIndex:ci,typeIndex:ti,form:Object.assign(emptyForm(item.date),item)});
  },
  coursePick:function(e){
    var i=Number(e.detail.value),code=COURSE_CODES[i]||'';
    this.setData({courseIndex:i,'form.courseCode':code});
  },
  typePick:function(e){var i=Number(e.detail.value);this.setData({typeIndex:i,'form.examType':EXAM_TYPES[i]||'Other'});},
  bindTitle:function(e){this.setData({'form.title':e.detail.value});},
  bindDate:function(e){this.setData({'form.date':e.detail.value});},
  bindStart:function(e){this.setData({'form.startTime':e.detail.value});},
  bindEnd:function(e){this.setData({'form.endTime':e.detail.value});},
  bindVenue:function(e){this.setData({'form.venue':e.detail.value});},
  bindNote:function(e){this.setData({'form.note':e.detail.value});},
  saveExam:function(){
    var f=this.data.form;
    if(!f.title){wx.showToast({title:'请填写考试名称',icon:'none'});return;}
    if(!f.date){wx.showToast({title:'请选择考试日期',icon:'none'});return;}
    if(!f.startTime||!f.endTime||f.startTime>=f.endTime){wx.showToast({title:'请检查考试时间',icon:'none'});return;}
    var c=f.courseCode?schedule.cmap[f.courseCode]:null;
    var payload={
      id:this.data.editingId||('custom-exam-'+Date.now()),
      source:'custom',
      courseCode:f.courseCode||'',
      code:f.courseCode||'EXAM',
      title:f.title,
      examType:f.examType||EXAM_TYPES[this.data.typeIndex]||'Other',
      date:f.date,
      startTime:f.startTime,
      endTime:f.endTime,
      venue:f.venue||'',
      note:f.note||'',
      module:c?c.module:'Personal',
      color:c?c.color:'#E11D48',
      createdAt:Date.now()
    };
    storage.upsertCustomExam(payload);
    this.setData({showForm:false,editingId:'',form:emptyForm(this.initialDate||date.todayKeyHK())});
    this.load();
    wx.showToast({title:'考试已保存',icon:'success'});
  },
  removeExam:function(e){
    var self=this,id=e.currentTarget.dataset.id;
    wx.showModal({title:'删除自定义考试？',content:'只会删除你自己添加的考试，不会影响官方课表。',success:function(r){if(r.confirm){storage.removeCustomExam(id);self.load();}}});
  },
  openPersonal:function(){wx.navigateTo({url:'/pages/personal/personal'});},
  onReady:function(){share.enable();},
  onShareAppMessage:function(){return share.appMessage();},
  onShareTimeline:function(){return share.timeline();}
});
