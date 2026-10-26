const assert=require('assert');
const store={
  maa_v2_tasks:[{id:'t1',title:'Mock DDL',dueDate:'2027-03-14',dueTime:'23:59',status:'todo'}],
  maa_v2_personal_events:[
    {id:'legacy',title:'Legacy Single',date:'2027-03-10',allDay:true,category:'personal',blockFreeWindow:true},
    {id:'cont',title:'Tokyo Trip',scheduleType:'continuous',startDate:'2027-03-11',durationDays:5,allDay:true,category:'travel',blockFreeWindow:true},
    {id:'disc',title:'Training',scheduleType:'discrete',dates:['2027-04-02','2027-04-06','2027-04-09'],allDay:false,startTime:'18:30',endTime:'20:30',category:'personal',blockFreeWindow:true}
  ],
  maa_v2_custom_exams:[],
  maa_v2_reschedules:[]
};
global.wx={getStorageSync:function(k){return store[k]||null;},setStorageSync:function(k,v){store[k]=v;},removeStorageSync:function(k){delete store[k];}};
const s=require('../miniprogram/utils/schedule.js');

const base=s.visibleEvents();
assert.strictEqual(base.length,163,'V2.1.7 base runtime events should be 163');
assert.strictEqual(base.filter(e=>e.type==='lecture').length,99,'Preserve all 99 lectures');
assert.strictEqual(base.filter(e=>e.type==='exam'&&/Final$/.test(e.title)).length,8,'Preserve all 8 finals');
assert.strictEqual(base.filter(e=>e.type==='exam').length,9,'Preserve the Boot Camp exam as well');
assert.strictEqual(base.filter(e=>e.type==='tutorial'&&e.tutorialGroup).length,12,'Preserve 12 grouped tutorials');
const c7013=base.filter(e=>e.courseCode==='PMAA7013'&&e.type==='lecture');
assert.strictEqual(c7013.length,9,'PMAA7013 should have 9 lectures');
assert.deepStrictEqual([c7013[0].date,c7013[0].startTime,c7013[0].endTime],['2026-12-01','18:30','21:30']);
assert.deepStrictEqual([c7013[c7013.length-1].date,c7013[c7013.length-1].startTime],['2027-01-15','18:30']);
assert.strictEqual(base.filter(e=>e.type==='tutorial'&&e.nonBlocking).length,21,'candidate-only Tutorial windows should be 21');
base.filter(e=>e.nonBlocking).forEach(e=>assert.strictEqual(s.hardEvent(e),false,'nonBlocking event must not occupy Free Window'));
assert.strictEqual(s.personalEvents().filter(e=>e.sourceEventId==='cont').length,5);

function assertExam(code,date,start,end){
  const e=base.find(x=>x.courseCode===code&&x.type==='exam'&&x.date===date);
  assert(e,`${code} exam missing on ${date}`);
  assert.deepStrictEqual([e.startTime,e.endTime],[start,end]);
}
assertExam('PMAA7002','2026-10-16','09:30','12:30');
assertExam('PMAA7001','2026-10-17','14:00','17:00');
assertExam('PMAA7003','2026-10-21','18:30','21:30');
assertExam('PMAA7019','2026-11-30','14:00','17:00');
assertExam('PMAA7005','2027-01-18','09:30','12:30');
assertExam('PMAA7013','2027-01-20','14:00','17:00');
assertExam('PMAA7018','2027-03-08','09:30','12:30');
assertExam('PMAA7004','2027-03-09','14:00','17:00');
assert(!base.some(e=>e.courseCode==='PMAA7019'&&e.type==='exam'&&e.date==='2026-11-07'),'old PMAA7019 mid-term must be removed');
assert(!base.some(e=>e.courseCode==='PMAA7008'&&e.date==='2027-05-04'),'old PMAA7008 5/4 TBC must be removed');

// Custom exam: must join runtime schedule, exam center source and Free Window calculations.
store.maa_v2_custom_exams=[{
  id:'custom-exam-test',source:'custom',courseCode:'PMAA7018',code:'PMAA7018',title:'Mock Quiz',examType:'Quiz / Test',
  date:'2027-02-10',startTime:'10:00',endTime:'11:00',venue:'CP-D',note:'test',module:'Module 4',color:'#B76573'
}];
let custom=s.eventsOn('2027-02-10').find(e=>e.id==='custom-exam-test');
assert(custom&&custom.type==='exam'&&custom.source==='custom','custom exam should be visible as exam');
assert(s.upcomingExams().some(e=>e.id==='custom-exam-test'),'custom exam should be in upcoming exams');

// Reschedule: move one concrete official occurrence; old slot disappears, new slot appears.
const original=s.baseVisibleEvents().find(e=>e.courseCode==='PMAA7018'&&e.date==='2027-02-18'&&e.type==='lecture');
assert(original,'test lecture occurrence missing');
store.maa_v2_reschedules=[{
  id:'reschedule-test',targetEventId:original.id,courseCode:original.courseCode,title:original.displayName,changeType:'reschedule',
  originalDate:original.date,originalStartTime:original.startTime,originalEndTime:original.endTime,originalVenue:original.venue,
  newDate:'2027-02-19',newStartTime:'16:00',newEndTime:'19:00',newVenue:'CP-D',note:'Mock teacher notice'
}];
assert(!s.eventsOn('2027-02-18').some(e=>e.id===original.id),'original occurrence should disappear after move');
const moved=s.eventsOn('2027-02-19').find(e=>e.id===original.id);
assert(moved&&moved.rescheduled&&moved.startTime==='16:00'&&moved.venue==='CP-D','moved occurrence should use override');

// Cancel: target disappears without mutating official source; removing override restores it.
store.maa_v2_reschedules=[{
  id:'cancel-test',targetEventId:original.id,courseCode:original.courseCode,title:original.displayName,changeType:'cancel',
  originalDate:original.date,originalStartTime:original.startTime,originalEndTime:original.endTime,originalVenue:original.venue
}];
assert(!s.visibleEvents().some(e=>e.id===original.id),'cancelled occurrence should be hidden from runtime');
assert(s.officialEventById(original.id),'official source event must remain available');
store.maa_v2_reschedules=[];
assert(s.eventsOn('2027-02-18').some(e=>e.id===original.id),'deleting adjustment should restore official occurrence');

console.log('Runtime base events:',base.length);
console.log('PMAA7013 lectures:',c7013.length,'Tue/Fri 18:30–21:30');
console.log('Non-blocking tutorial windows:',base.filter(e=>e.type==='tutorial'&&e.nonBlocking).length);
console.log('Uploaded timetable finals: PASS');
console.log('Custom exam integration: PASS');
console.log('Temporary reschedule integration: PASS');
console.log('Cancellation restore integration: PASS');
console.log('Known personal event expansion:',s.personalEvents().filter(e=>e.sourceEventId==='cont').map(e=>e.date).join(', '));
