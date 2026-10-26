var meta=require('../../data/meta.js');
var share=require('../../utils/share.js');
Page({
  data:{meta:meta},
  onLoad:function(){share.enable();},
  go:function(e){wx.navigateTo({url:e.currentTarget.dataset.url});},
  onReady:function(){share.enable();},
 onShareAppMessage:function(){return share.appMessage();},
  onShareTimeline:function(){return share.timeline();}
});
