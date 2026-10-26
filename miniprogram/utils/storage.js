var TASKS='maa_v2_tasks';
var SETTINGS='maa_v2_settings';
var PERSONAL_EVENTS='maa_v2_personal_events';
var CUSTOM_EXAMS='maa_v2_custom_exams';
var RESCHEDULES='maa_v2_reschedules';

function defaults(){
  return {
    tutorialGroups:{PMAA7001:'',PMAA7003:''},
    showUnknownTutorials:true
  };
}

function getSettings(){
  var v=wx.getStorageSync(SETTINGS);
  if(!v) return defaults();
  var d=defaults();
  return Object.assign(d,v,{tutorialGroups:Object.assign(d.tutorialGroups,v.tutorialGroups||{})});
}
function saveSettings(v){ wx.setStorageSync(SETTINGS,v); return v; }

function getTasks(){ return wx.getStorageSync(TASKS)||[]; }
function saveTasks(v){ wx.setStorageSync(TASKS,v); return v; }
function upsertTask(task){
  var a=getTasks();
  var i=a.findIndex(function(x){return x.id===task.id;});
  if(i>=0)a[i]=task;else a.push(task);
  saveTasks(a); return a;
}
function removeTask(id){
  var a=getTasks().filter(function(x){return x.id!==id;});
  saveTasks(a); return a;
}

function getPersonalEvents(){ return wx.getStorageSync(PERSONAL_EVENTS)||[]; }
function savePersonalEvents(v){ wx.setStorageSync(PERSONAL_EVENTS,v); return v; }
function upsertPersonalEvent(event){
  var a=getPersonalEvents();
  var i=a.findIndex(function(x){return x.id===event.id;});
  if(i>=0)a[i]=event;else a.push(event);
  savePersonalEvents(a); return a;
}
function removePersonalEvent(id){
  var a=getPersonalEvents().filter(function(x){return x.id!==id;});
  savePersonalEvents(a); return a;
}

function getCustomExams(){ return wx.getStorageSync(CUSTOM_EXAMS)||[]; }
function saveCustomExams(v){ wx.setStorageSync(CUSTOM_EXAMS,v); return v; }
function upsertCustomExam(exam){
  var a=getCustomExams();
  var i=a.findIndex(function(x){return x.id===exam.id;});
  if(i>=0)a[i]=exam;else a.push(exam);
  saveCustomExams(a); return a;
}
function removeCustomExam(id){
  var a=getCustomExams().filter(function(x){return x.id!==id;});
  saveCustomExams(a); return a;
}

function getReschedules(){ return wx.getStorageSync(RESCHEDULES)||[]; }
function saveReschedules(v){ wx.setStorageSync(RESCHEDULES,v); return v; }
function upsertReschedule(item){
  var a=getReschedules();
  var i=a.findIndex(function(x){return x.id===item.id;});
  if(i>=0)a[i]=item;else a.push(item);
  saveReschedules(a); return a;
}
function removeReschedule(id){
  var a=getReschedules().filter(function(x){return x.id!==id;});
  saveReschedules(a); return a;
}

module.exports={
  getSettings:getSettings,
  saveSettings:saveSettings,
  getTasks:getTasks,
  saveTasks:saveTasks,
  upsertTask:upsertTask,
  removeTask:removeTask,
  getPersonalEvents:getPersonalEvents,
  savePersonalEvents:savePersonalEvents,
  upsertPersonalEvent:upsertPersonalEvent,
  removePersonalEvent:removePersonalEvent,
  getCustomExams:getCustomExams,
  saveCustomExams:saveCustomExams,
  upsertCustomExam:upsertCustomExam,
  removeCustomExam:removeCustomExam,
  getReschedules:getReschedules,
  saveReschedules:saveReschedules,
  upsertReschedule:upsertReschedule,
  removeReschedule:removeReschedule
};
