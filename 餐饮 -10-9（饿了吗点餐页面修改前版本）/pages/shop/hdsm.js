//获取应用实例
var config = require("../../config.js");
Page({
  data: {
    path: config.resPath,
    api: config.apiPath,
    store: {},
  },
  onLoad: function () {
    var that = this;
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    that.setData({
      color: wx.getStorageSync('color')
    })
    config.post('/wxApi/s/yh',{},function(ret){
      that.setData({
        store:ret.data
      })
    })
  }
})
