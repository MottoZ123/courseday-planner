var schedule=require('../../utils/schedule.js');
var storage=require('../../utils/storage.js');
var date=require('../../utils/date.js');
var share=require('../../utils/share.js');

var CHANGE_TYPES=['调整时间 / 日期 / 地点','停课 / 取消本次'];
var CHANGE_VALUES=['reschedule','cancel'];

function typeLabel(type){
  var map={lecture:'大课',tutorial:'Tutorial',bootcamp:'Boot Camp',presentation:'Presentation',orientation:'Orientation'};
  return map[type]||type;
}

function eventLabel(e){
  return e.date+' · '+(e.startTime||'TBC')+(e.endTime?('–'+e.endTime):'')+' · '+typeLabel(e.type)+(e.venue?(' · '+e.venue):'');
}

function emptyForm(e){
  e=e||{};
  return {
    targetEventId:e.id||'',
    changeType:'reschedule',
    newDate:e.date||date.todayKeyHK(),
    newStartTime:e.startTime||'09:30',
    newEndTime:e.endTime||'12:30',
    newVenue:e.venue||'',
    note:''
  };
}

Page({
  data:{
    adjustments:[],showForm:false,editingId:'',
    courseOptions:[],courseCodes:[],courseIndex:0,
    sessionOptions:[],sessionIds:[],sessionIndex:0,selectedOfficial:null,
    changeTypeOptions:CHANGE_TYPES,changeTypeIndex:0,
    form:emptyForm()
  },
  onLoad:function(q){this.initialCourse=(q&&q.code)||'';},
  onShow:function(){this.load();},
  load:function(){
    var self=this;
    var rows=storage.getReschedules().slice().sort(function(a,b){
      return ((a.newDate||a.originalDate||'')+(a.newStartTime||a.originalStartTime||'')).localeCompare((b.newDate||b.originalDate||'')+(b.newStartTime||b.originalStartTime||''));
    }).map(function(r){
      var official=schedule.officialEventById(r.targetEventId)||{};
      return Object.assign({},r,{
        courseCode:r.courseCode||official.courseCode||'',
        title:(official.displayName||r.title||''),
        originalText:(r.originalDate||official.date||'')+' '+(r.originalStartTime||official.startTime||'')+(r.originalEndTime||official.endTime?('–'+(r.originalEndTime||official.endTime||'')):'')+(r.originalVenue||official.venue?(' · '+(r.originalVenue||official.venue||'')):'') ,
        newText:r.changeType==='cancel'?'本次停课 / 取消':((r.newDate||official.date||'')+' '+(r.newStartTime||official.startTime||'')+(r.newEndTime||official.endTime?('–'+(r.newEndTime||official.endTime||'')):'')+(r.newVenue||official.venue?(' · '+(r.newVenue||official.venue||'')):'') ),
        changeLabel:r.changeType==='cancel'?'停课':'已调课'
      });
    });
    var candidates=schedule.adjustableEvents();
    var seen={};
    var codes=[];
    candidates.forEach(function(e){if(e.courseCode&&!seen[e.courseCode]){seen[e.courseCode]=true;codes.push(e.courseCode);}});
    var options=codes.map(function(code){var c=schedule.cmap[code];return code+(c?(' · '+c.nameZh):'');});
    var idx=this.initialCourse?codes.indexOf(this.initialCourse):0;if(idx<0)idx=0;
    this.setData({adjustments:rows,courseCodes:codes,courseOptions:options,courseIndex:idx},function(){self.refreshSessions(false);});
  },
  refreshSessions:function(resetForm){
    var code=this.data.courseCodes[this.data.courseIndex]||'';
    var es=schedule.adjustableEvents(code);
    var labels=es.map(eventLabel),ids=es.map(function(e){return e.id;});
    var si=0;
    if(!resetForm&&this.data.form.targetEventId){var found=ids.indexOf(this.data.form.targetEventId);if(found>=0)si=found;}
    var selected=es[si]||null;
    var updates={sessionOptions:labels,sessionIds:ids,sessionIndex:si,selectedOfficial:selected};
    if(resetForm||!this.data.form.targetEventId)updates.form=emptyForm(selected);
    this.setData(updates);
  },
  openNew:function(){
    var self=this;
    this.setData({showForm:true,editingId:'',changeTypeIndex:0},function(){self.refreshSessions(true);});
  },
  cancelForm:function(){this.setData({showForm:false,editingId:'',changeTypeIndex:0,form:emptyForm(this.data.selectedOfficial)});},
  coursePick:function(e){var i=Number(e.detail.value),self=this;this.setData({courseIndex:i,sessionIndex:0},function(){self.refreshSessions(true);});},
  sessionPick:function(e){
    var i=Number(e.detail.value),id=this.data.sessionIds[i],official=schedule.officialEventById(id);
    this.setData({sessionIndex:i,selectedOfficial:official,form:emptyForm(official)});
  },
  changeTypePick:function(e){var i=Number(e.detail.value);this.setData({changeTypeIndex:i,'form.changeType':CHANGE_VALUES[i]||'reschedule'});},
  bindNewDate:function(e){this.setData({'form.newDate':e.detail.value});},
  bindNewStart:function(e){this.setData({'form.newStartTime':e.detail.value});},
  bindNewEnd:function(e){this.setData({'form.newEndTime':e.detail.value});},
  bindNewVenue:function(e){this.setData({'form.newVenue':e.detail.value});},
  bindNote:function(e){this.setData({'form.note':e.detail.value});},
  editAdjustment:function(e){
    var id=e.currentTarget.dataset.id;
    var r=storage.getReschedules().find(function(x){return x.id===id;});
    if(!r)return;
    var official=schedule.officialEventById(r.targetEventId);
    if(!official){wx.showToast({title:'原始场次已不存在',icon:'none'});return;}
    var ci=this.data.courseCodes.indexOf(official.courseCode);if(ci<0)ci=0;
    var sessions=schedule.adjustableEvents(official.courseCode);
    var ids=sessions.map(function(x){return x.id;}),si=ids.indexOf(official.id);if(si<0)si=0;
    var ti=r.changeType==='cancel'?1:0;
    this.setData({
      showForm:true,editingId:id,courseIndex:ci,
      sessionOptions:sessions.map(eventLabel),sessionIds:ids,sessionIndex:si,selectedOfficial:official,
      changeTypeIndex:ti,
      form:{targetEventId:r.targetEventId,changeType:r.changeType||'reschedule',newDate:r.newDate||official.date,newStartTime:r.newStartTime||official.startTime,newEndTime:r.newEndTime||official.endTime,newVenue:r.newVenue!==undefined?r.newVenue:(official.venue||''),note:r.note||''}
    });
  },
  saveAdjustment:function(){
    var f=this.data.form,official=schedule.officialEventById(f.targetEventId||this.data.sessionIds[this.data.sessionIndex]);
    if(!official){wx.showToast({title:'请选择要调整的课程场次',icon:'none'});return;}
    var duplicate=storage.getReschedules().find(function(x){return x.targetEventId===official.id;});
    if(duplicate&&duplicate.id!==this.data.editingId){wx.showToast({title:'该场次已有调课记录，请编辑原记录',icon:'none'});return;}
    var type=f.changeType||CHANGE_VALUES[this.data.changeTypeIndex]||'reschedule';
    if(type!=='cancel'){
      if(!f.newDate){wx.showToast({title:'请选择调整后日期',icon:'none'});return;}
      if(!f.newStartTime||!f.newEndTime||f.newStartTime>=f.newEndTime){wx.showToast({title:'请检查调整后时间',icon:'none'});return;}
    }
    var payload={
      id:this.data.editingId||('reschedule-'+Date.now()),
      targetEventId:official.id,
      courseCode:official.courseCode||'',
      title:official.displayName||official.title||'',
      changeType:type,
      originalDate:official.date,
      originalStartTime:official.startTime||'',
      originalEndTime:official.endTime||'',
      originalVenue:official.venue||'',
      newDate:type==='cancel'?'':f.newDate,
      newStartTime:type==='cancel'?'':f.newStartTime,
      newEndTime:type==='cancel'?'':f.newEndTime,
      newVenue:type==='cancel'?'':(f.newVenue||''),
      note:f.note||'',
      updatedAt:Date.now()
    };
    storage.upsertReschedule(payload);
    this.setData({showForm:false,editingId:''});
    this.load();
    wx.showToast({title:type==='cancel'?'已标记停课':'调课已生效',icon:'success'});
  },
  removeAdjustment:function(e){
    var self=this,id=e.currentTarget.dataset.id;
    wx.showModal({title:'恢复官方原安排？',content:'删除这条临时调整后，该节课会恢复为官方课表中的日期、时间和地点。',success:function(r){if(r.confirm){storage.removeReschedule(id);self.load();}}});
  },
  onReady:function(){share.enable();},
  onShareAppMessage:function(){return share.appMessage();},
  onShareTimeline:function(){return share.timeline();}
});
