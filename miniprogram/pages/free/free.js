var schedule=require('../../utils/schedule.js');var date=require('../../utils/date.js');
var share=require('../../utils/share.js');
Page({data:{windows:[]},onShow:function(){var today=date.todayKeyHK();this.setData({windows:schedule.freeWindows().filter(function(w){return w.end>=today;})});},onReady:function(){share.enable();},onShareAppMessage:function(){return share.appMessage();},onShareTimeline:function(){return share.timeline();}});
