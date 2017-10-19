// pages/index/newewm.js
var config = require("../../config.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options) {
    var that = this;
    var q = decodeURIComponent(options.scene)
    if (wx.getStorageSync('uid')) {
      that.getinfo(q);
    } else {
      app.onauthorsuccess = function () {
        config.post("/wxApi/c/theme", {}, function (ret) {
          wx.setStorageSync('color', ret.data.color)
          wx.setStorageSync('menuStyle', ret.data.menuStyle);
          if (!wx.getStorageSync('color')) {
            wx.setStorageSync('color', 'blue');
          }
          config.navBarColor(wx.getStorageSync('color'));
          that.getinfo(q);
        })
      }
    }
  },
  getinfo: function (q) {
    if (q) {      
      config.post("/wxApi/d/getXcxDesk", { id: q }, function (ret) {
        if (ret.code == 0) {
          wx.setStorage({
            "key": "sid",
            "data": ret.data.storeId
          })
          wx.redirectTo({
            url: '../shop/shop?storeId=' + ret.data.storeId + '&deskId=' + ret.data.id + '&deskCode=' + ret.data.code
          })
        } else {
          config.tost(ret.msg);
          setTimeout(function () {
            wx.switchTab({
              url: '../index/index',
            })
          }, 3000)
        }
      }, true);
    } else {
      config.alert("餐位信息不存在");
      wx.switchTab({
        url: '../index/index',
      })
    }
  },

})