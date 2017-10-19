// pages/index/zf-syd.js
var config = require("../../config.js");
Page({
  data:{
    Path: config.resPath,
    api: config.apiPath,
    deskCode:'',
  },
  onLoad:function(options){
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    this.setData({
      deskCode: options.deskCode,
      color: wx.getStorageSync('color')
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
})