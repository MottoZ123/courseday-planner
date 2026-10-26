
function pad2(n){ return n < 10 ? '0' + n : '' + n; }
function parseHK(date, time){ return new Date(date + 'T' + (time || '00:00') + ':00+08:00'); }
function nowHK(){ var n=new Date(); return new Date(n.getTime() + (n.getTimezoneOffset()+480)*60000); }
function dateKey(d){ return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); }
function todayKeyHK(){ return dateKey(nowHK()); }
function addDays(dateStr, days){ var d=parseHK(dateStr,'12:00'); d.setUTCDate(d.getUTCDate()+days); return dateKey(new Date(d.getTime())); }
function diffDays(a,b){ return Math.round((parseHK(b,'12:00')-parseHK(a,'12:00'))/86400000); }
function weekdayZh(dateStr){ return ['周日','周一','周二','周三','周四','周五','周六'][parseHK(dateStr,'12:00').getUTCDay()]; }
function startOfWeek(dateStr){ var d=parseHK(dateStr,'12:00'); var wd=d.getUTCDay(); var offset=wd===0?-6:1-wd; d.setUTCDate(d.getUTCDate()+offset); return dateKey(new Date(d.getTime())); }
function formatMD(dateStr){ var p=dateStr.split('-'); return Number(p[1])+'月'+Number(p[2])+'日'; }
function formatShort(dateStr){ var p=dateStr.split('-'); return p[1]+'/'+p[2]; }
function durationHours(start,end){ if(!start||!end) return 0; var s=start.split(':').map(Number), e=end.split(':').map(Number); return ((e[0]*60+e[1])-(s[0]*60+s[1]))/60; }
function countdown(targetDate,targetTime){ var ms=parseHK(targetDate,targetTime||'00:00')-new Date(); if(ms<=0) return '已开始/已结束'; var min=Math.floor(ms/60000); var d=Math.floor(min/1440); var h=Math.floor((min%1440)/60); var m=min%60; if(d>0) return d+'天 '+h+'小时'; if(h>0) return h+'小时 '+m+'分钟'; return m+'分钟'; }
module.exports={pad2:pad2,parseHK:parseHK,nowHK:nowHK,dateKey:dateKey,todayKeyHK:todayKeyHK,addDays:addDays,diffDays:diffDays,weekdayZh:weekdayZh,startOfWeek:startOfWeek,formatMD:formatMD,formatShort:formatShort,durationHours:durationHours,countdown:countdown};
