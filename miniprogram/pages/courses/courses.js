var schedule=require('../../utils/schedule.js');
var share=require('../../utils/share.js');
Page({data:{courses:[]},onLoad:function(){this.setData({courses:schedule.courses.filter(function(c){return c.isFormal;})});},open:function(e){wx.navigateTo({url:'/pages/course-detail/course-detail?code='+e.currentTarget.dataset.code});},onReady:function(){share.enable();},onShareAppMessage:function(){return share.appMessage();},onShareTimeline:function(){return share.timeline();}});
