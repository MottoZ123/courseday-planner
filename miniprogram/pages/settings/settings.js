var storage=require('../../utils/storage.js');
var meta=require('../../data/meta.js');
var share=require('../../utils/share.js');
Page({
  data:{settings:null,meta:meta,groupsA:['未确定','A1','A2','A3'],groupsC:['未确定','C1','C2','C3']},
  onShow:function(){this.setData({settings:storage.getSettings()});},
  pick:function(e){
    var code=e.currentTarget.dataset.code,idx=Number(e.detail.value),family=e.currentTarget.dataset.family||'A',s=this.data.settings;
    var groups=family==='C'?this.data.groupsC:this.data.groupsA;
    s.tutorialGroups[code]=idx===0?'':groups[idx];storage.saveSettings(s);this.setData({settings:s});wx.showToast({title:'已保存',icon:'success'});
  },
  toggleUnknown:function(e){var s=this.data.settings;s.showUnknownTutorials=e.detail.value;storage.saveSettings(s);this.setData({settings:s});},
  clearTasks:function(){wx.showModal({title:'清空个人任务？',content:'此操作只清空本机任务，不影响公共课表。',success:function(r){if(r.confirm){wx.removeStorageSync('maa_v2_tasks');wx.showToast({title:'已清空'});}}});},
  clearPersonal:function(){wx.showModal({title:'清空个人事件？',content:'旅行、面试等本机个人事件将全部删除。',success:function(r){if(r.confirm){wx.removeStorageSync('maa_v2_personal_events');wx.showToast({title:'已清空'});}}});},
  clearAllLocal:function(){
    var self=this;
    wx.showModal({
      title:'清空全部本机个人数据？',
      content:'将清除本机任务、个人事件、自定义考试、临时调课和 Tutorial 设置；不可撤销，公共示例课程表不会改变。',
      confirmText:'全部清空',
      confirmColor:'#B91C1C',
      success:function(r){
        if(!r.confirm)return;
        ['maa_v2_tasks','maa_v2_personal_events','maa_v2_custom_exams','maa_v2_reschedules','maa_v2_settings']
          .forEach(function(key){wx.removeStorageSync(key);});
        self.setData({settings:storage.getSettings()});
        wx.showToast({title:'本机数据已清空',icon:'none'});
      }
    });
  }
,onReady:function(){share.enable();},onShareAppMessage:function(){return share.appMessage();},onShareTimeline:function(){return share.timeline();}});
