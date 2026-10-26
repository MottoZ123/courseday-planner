var schedule=require('../../utils/schedule.js');
var share=require('../../utils/share.js');
Page({data:{modules:[]},onShow:function(){this.setData({modules:schedule.modules.map(schedule.moduleStats)});},onReady:function(){share.enable();},onShareAppMessage:function(){return share.appMessage();},onShareTimeline:function(){return share.timeline();}});
