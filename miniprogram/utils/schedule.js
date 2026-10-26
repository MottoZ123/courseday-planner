var events=require('../data/events.js');
var courses=require('../data/courses.js');
var modules=require('../data/modules.js');
var holidays=require('../data/holidays.js');
var date=require('./date.js');
var storage=require('./storage.js');

function courseMap(){ var o={}; courses.forEach(function(c){o[c.code]=c;}); return o; }
var cmap=courseMap();

function decorate(e){
  var c=e.courseCode?cmap[e.courseCode]:null;
  return Object.assign({},e,{
    course:c,
    displayName:(e.source==='custom'||e.keepTitle)?(e.title||'自定义考试'):(c?c.nameZh:e.title),
    timeText:e.startTime?(e.startTime+'–'+e.endTime):'时间待确认'
  });
}

function sortEvent(a,b){ return (a.startTime||'99:99').localeCompare(b.startTime||'99:99'); }
function sortEventDate(a,b){ return ((a.date||'9999-99-99')+(a.startTime||'99:99')).localeCompare((b.date||'9999-99-99')+(b.startTime||'99:99')); }

function tutorialVisible(e,s){
  var selectable=['PMAA7001','PMAA7003'];
  if(e.type!=='tutorial') return true;
  // Latest uploaded weekly timetable contains several Tutorial windows without
  // a concrete group. They are informational candidate blocks and must stay
  // visible regardless of the user's A1/A2/A3 setting.
  if(!e.tutorialGroup) return true;
  if(selectable.indexOf(e.courseCode)<0) return true;
  var selected=(s.tutorialGroups||{})[e.courseCode]||'';
  if(selected) return e.tutorialGroup===selected;
  return !!s.showUnknownTutorials;
}

/*
 * Public official schedule after Tutorial-group filtering, before any local
 * temporary adjustment. This is useful for selecting the exact occurrence
 * that a reschedule should override and for the Module template view.
 */
function baseVisibleEvents(){
  var s=storage.getSettings();
  return events.filter(function(e){return tutorialVisible(e,s);}).map(decorate).sort(sortEventDate);
}

function officialEventById(id){
  var e=events.find(function(x){return x.id===id;});
  return e?decorate(e):null;
}

function rescheduleNote(original,r){
  var originalText=(original.date||'')+' '+(original.startTime||'')+(original.endTime?('–'+original.endTime):'')+(original.venue?(' · '+original.venue):'');
  var prefix='临时调课：原安排 '+originalText;
  return r.note?(prefix+'；'+r.note):prefix;
}

function applyReschedules(list){
  var rs=storage.getReschedules();
  if(!rs.length)return list.slice();
  var byTarget={};
  rs.forEach(function(r){ if(r&&r.targetEventId)byTarget[r.targetEventId]=r; });
  var out=[];
  list.forEach(function(e){
    var r=byTarget[e.id];
    if(!r){out.push(e);return;}
    if(r.changeType==='cancel')return;
    var changed=Object.assign({},e,{
      date:r.newDate||e.date,
      weekday:date.weekdayZh(r.newDate||e.date),
      startTime:r.newStartTime||e.startTime,
      endTime:r.newEndTime||e.endTime,
      venue:(r.newVenue!==undefined&&r.newVenue!=='')?r.newVenue:e.venue,
      rescheduled:true,
      adjustmentId:r.id,
      originalDate:e.date,
      originalStartTime:e.startTime,
      originalEndTime:e.endTime,
      originalVenue:e.venue,
      status:'adjusted',
      note:rescheduleNote(e,r)
    });
    changed.timeText=changed.startTime?(changed.startTime+'–'+changed.endTime):'时间待确认';
    out.push(changed);
  });
  return out.sort(sortEventDate);
}

function customExamEvents(){
  return storage.getCustomExams().map(function(x){
    var c=x.courseCode?cmap[x.courseCode]:null;
    return decorate(Object.assign({},x,{
      type:'exam',
      source:'custom',
      code:x.courseCode||'EXAM',
      module:x.module||(c?c.module:'Personal'),
      status:'personal',
      color:x.color||(c?c.color:'#E11D48'),
      blockFreeWindow:true,
      keepTitle:true
    }));
  }).sort(sortEventDate);
}

/* Runtime hard schedule = public official events with local reschedule overrides
 * + locally created custom exams. Official data files are never mutated.
 */
function visibleEvents(){
  return applyReschedules(baseVisibleEvents()).concat(customExamEvents()).sort(sortEventDate);
}

function eventsOn(d){ return visibleEvents().filter(function(e){return e.date===d;}).sort(sortEvent); }

/*
 * Personal Events remain stored as one source record in wx Storage.
 * This function expands single / continuous / discrete records into
 * date-specific occurrences for Calendar and Free Window calculations.
 * Legacy V2.1 records without scheduleType are treated as single events.
 */
function expandPersonalEvent(e){
  var t=e.scheduleType||'single';
  var out=[];
  function pushOccurrence(d,extra){
    var x=Object.assign({},e,extra||{}, {
      id:e.id+'@'+d,
      sourceEventId:e.id,
      date:d,
      type:'personal',
      code:'PERSONAL',
      displayName:e.title,
      color:e.color||'#7C3AED'
    });
    if(x.allDay)x.timeText='全天';
    else if(x._timeLabel)x.timeText=x._timeLabel;
    else x.timeText=x.startTime?(x.startTime+'–'+x.endTime):'时间待确认';
    delete x._timeLabel;
    out.push(x);
  }

  if(t==='continuous'){
    var start=e.startDate||e.date;
    if(!start)return out;
    var n=Math.max(1,Number(e.durationDays)||1);
    for(var i=0;i<n;i++){
      var d=date.addDays(start,i);
      if(e.allDay){
        pushOccurrence(d,{allDay:true,startTime:'',endTime:'',occurrenceIndex:i,occurrenceCount:n});
      }else if(n===1){
        pushOccurrence(d,{allDay:false,startTime:e.startTime,endTime:e.endTime,occurrenceIndex:i,occurrenceCount:n});
      }else if(i===0){
        pushOccurrence(d,{allDay:false,startTime:e.startTime,endTime:'23:59',_timeLabel:(e.startTime||'')+' 起',occurrenceIndex:i,occurrenceCount:n});
      }else if(i===n-1){
        pushOccurrence(d,{allDay:false,startTime:'00:00',endTime:e.endTime,_timeLabel:'至 '+(e.endTime||''),occurrenceIndex:i,occurrenceCount:n});
      }else{
        pushOccurrence(d,{allDay:true,startTime:'',endTime:'',occurrenceIndex:i,occurrenceCount:n});
      }
    }
    return out;
  }

  if(t==='discrete'){
    (e.dates||[]).slice().sort().forEach(function(d,idx){
      pushOccurrence(d,{allDay:!!e.allDay,startTime:e.allDay?'':e.startTime,endTime:e.allDay?'':e.endTime,occurrenceIndex:idx,occurrenceCount:(e.dates||[]).length});
    });
    return out;
  }

  var d=e.date||e.startDate;
  if(d)pushOccurrence(d,{allDay:!!e.allDay,startTime:e.allDay?'':e.startTime,endTime:e.allDay?'':e.endTime,occurrenceIndex:0,occurrenceCount:1});
  return out;
}

function personalEvents(){
  var out=[];
  storage.getPersonalEvents().forEach(function(e){out=out.concat(expandPersonalEvent(e));});
  return out;
}
function personalEventsOn(d){ return personalEvents().filter(function(e){return e.date===d;}).sort(sortEvent); }

function calendarItemsOn(d){
  return eventsOn(d).concat(personalEventsOn(d)).sort(sortEvent);
}

function hardEvent(e){
  if(e&&e.nonBlocking) return false;
  return ['lecture','tutorial','exam','bootcamp','presentation','orientation','tbc'].indexOf(e.type)>=0;
}

function nextEvent(){
  var now=new Date();
  var candidates=visibleEvents().filter(function(e){
    return e.startTime && date.parseHK(e.date,e.startTime)>now && hardEvent(e);
  }).sort(function(a,b){return date.parseHK(a.date,a.startTime)-date.parseHK(b.date,b.startTime);});
  return candidates[0]||null;
}

function currentModule(d){
  d=d||date.todayKeyHK();
  for(var i=0;i<modules.length;i++){
    if(d>=modules[i].start&&d<=modules[i].end) return modules[i];
  }
  return null;
}

function weekDays(anchor){
  var start=date.startOfWeek(anchor),a=[];
  for(var i=0;i<7;i++){
    var d=date.addDays(start,i);
    a.push({date:d,weekday:date.weekdayZh(d),short:date.formatShort(d),events:eventsOn(d)});
  }
  return a;
}

function weeklyLoad(anchor){
  var hrs=0;
  weekDays(anchor).forEach(function(day){
    day.events.forEach(function(e){ if(hardEvent(e)) hrs+=date.durationHours(e.startTime,e.endTime); });
  });
  return Math.round(hrs*10)/10;
}

function upcomingExams(){
  var today=date.todayKeyHK();
  return visibleEvents().filter(function(e){return e.type==='exam'&&e.date>=today;})
    .sort(function(a,b){return (a.date+(a.startTime||'')).localeCompare(b.date+(b.startTime||''));});
}

function moduleEvents(moduleId){ return visibleEvents().filter(function(e){return e.module===moduleId&&hardEvent(e);}); }

/* Module template intentionally reflects the official recurring structure.
 * One-off local reschedules only alter actual-week/calendar/free-time views.
 */
function modulePattern(moduleId){
  var bucket={};
  baseVisibleEvents().filter(function(e){return e.module===moduleId&&hardEvent(e);}).forEach(function(e){
    if(!e.startTime||e.type==='exam'||e.type==='tutorial') return;
    var key=date.weekdayZh(e.date)+'|'+e.startTime+'|'+e.endTime+'|'+(e.courseCode||e.code);
    if(!bucket[key]) bucket[key]={weekday:date.weekdayZh(e.date),startTime:e.startTime,endTime:e.endTime,courseCode:e.courseCode||e.code,title:e.displayName,count:0,color:e.color};
    bucket[key].count++;
  });
  return Object.keys(bucket).map(function(k){return bucket[k];}).sort(function(a,b){return a.weekday.localeCompare(b.weekday)||a.startTime.localeCompare(b.startTime);});
}

function freeBlocksForDay(d){
  var start=9*60,end=22*60;
  var personalDay=personalEventsOn(d).filter(function(e){return e.blockFreeWindow!==false;});
  if(personalDay.some(function(e){return e.allDay;})) return [];
  var busy=eventsOn(d).filter(hardEvent).filter(function(e){return e.startTime&&e.endTime;})
    .concat(personalDay.filter(function(e){return !e.allDay&&e.startTime&&e.endTime;}))
    .map(function(e){
      var s=e.startTime.split(':').map(Number),t=e.endTime.split(':').map(Number);
      return [s[0]*60+s[1],t[0]*60+t[1]];
    }).sort(function(a,b){return a[0]-b[0];});
  var out=[],cursor=start;
  busy.forEach(function(b){ if(b[0]>cursor) out.push([cursor,b[0]]); cursor=Math.max(cursor,b[1]); });
  if(cursor<end)out.push([cursor,end]);
  return out.filter(function(x){return x[1]-x[0]>=60;}).map(function(x){
    function tm(m){return ('0'+Math.floor(m/60)).slice(-2)+':'+('0'+m%60).slice(-2);}
    return tm(x[0])+'–'+tm(x[1]);
  });
}

function freeWindows(){
  var start='2026-08-27', end='2027-06-18', busy={};
  visibleEvents().filter(hardEvent).forEach(function(e){busy[e.date]=true;});
  personalEvents().filter(function(e){return e.blockFreeWindow!==false;}).forEach(function(e){busy[e.date]=true;});
  var tasks=storage.getTasks();
  var personal=personalEvents();
  var result=[],cur=null,d=start;
  while(d<=end){
    if(!busy[d]){
      if(!cur)cur={start:d,end:d,days:1};
      else{cur.end=d;cur.days++;}
    }else if(cur){
      if(cur.days>=2) result.push(cur);
      cur=null;
    }
    d=date.addDays(d,1);
  }
  if(cur&&cur.days>=2)result.push(cur);
  result.forEach(function(w){
    var due=tasks.filter(function(t){return t.status!=='done'&&t.dueDate>=w.start&&t.dueDate<=w.end;});
    var p=personal.filter(function(e){return e.date>=w.start&&e.date<=w.end;});
    w.deadlines=due.length;
    w.personalCount=p.length;
    w.score=Math.max(1,Math.min(5,(w.days>=5?5:w.days)-Math.min(2,due.length)));
    w.label='★'.repeat(w.score)+'☆'.repeat(5-w.score);
  });
  return result.sort(function(a,b){return a.start.localeCompare(b.start);});
}

function moduleStats(m){
  var es=moduleEvents(m.id),hours=0,exams=0,lectures=0;
  es.forEach(function(e){
    hours+=date.durationHours(e.startTime,e.endTime);
    if(e.type==='exam')exams++;
    if(e.type==='lecture'||e.type==='bootcamp')lectures++;
  });
  var today=date.todayKeyHK();
  var progress=today<m.start?0:(today>m.end?100:Math.round(date.diffDays(m.start,today)/Math.max(1,date.diffDays(m.start,m.end))*100));
  return Object.assign({},m,{hours:Math.round(hours*10)/10,exams:exams,lectures:lectures,progress:Math.max(0,Math.min(100,progress))});
}

function holidayOn(d){ return holidays.find(function(h){return h.date===d;})||null; }

function adjustableEvents(courseCode){
  var allowed=['lecture','tutorial','bootcamp','presentation','orientation'];
  return baseVisibleEvents().filter(function(e){
    return allowed.indexOf(e.type)>=0 && !e.nonBlocking && (!courseCode||e.courseCode===courseCode);
  }).sort(sortEventDate);
}

module.exports={
  events:events,
  courses:courses,
  modules:modules,
  holidays:holidays,
  visibleEvents:visibleEvents,
  baseVisibleEvents:baseVisibleEvents,
  officialEventById:officialEventById,
  customExamEvents:customExamEvents,
  applyReschedules:applyReschedules,
  adjustableEvents:adjustableEvents,
  eventsOn:eventsOn,
  expandPersonalEvent:expandPersonalEvent,
  personalEvents:personalEvents,
  personalEventsOn:personalEventsOn,
  calendarItemsOn:calendarItemsOn,
  nextEvent:nextEvent,
  currentModule:currentModule,
  weekDays:weekDays,
  weeklyLoad:weeklyLoad,
  upcomingExams:upcomingExams,
  moduleEvents:moduleEvents,
  modulePattern:modulePattern,
  freeBlocksForDay:freeBlocksForDay,
  freeWindows:freeWindows,
  moduleStats:moduleStats,
  holidayOn:holidayOn,
  hardEvent:hardEvent,
  cmap:cmap
};
