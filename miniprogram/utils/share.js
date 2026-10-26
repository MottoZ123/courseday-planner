var SHARE_TITLE='CourseDay Planner｜2026–27 课程与日程工具';
var SHARE_PATH='/pages/today/today?from=share';

function appMessage(){
  return {
    title:SHARE_TITLE,
    path:SHARE_PATH
  };
}

function timeline(){
  return {
    title:SHARE_TITLE,
    query:'from=timeline'
  };
}

function enable(){
  if(wx.showShareMenu){
    wx.showShareMenu({
      menus:['shareAppMessage','shareTimeline'],
      fail:function(){}
    });
  }
}

module.exports={
  appMessage:appMessage,
  timeline:timeline,
  enable:enable
};
