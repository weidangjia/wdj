// pages/index/newewm.js
var config = require("../../config.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (q) {    
    var that=this;
    if (wx.getStorageSync('uid')) {
      that.getinfo(q);
    } else {
      app.onauthorsuccess = function () {        
        config.post("/wxApi/c/theme", {}, function (ret) {
          wx.setStorageSync('color', ret.data.color)
          wx.setStorageSync( 'menuStyle',ret.data.menuStyle);
          if (!wx.getStorageSync('color')) {
            wx.setStorageSync('color', 'blue');
          }
          config.navBarColor(wx.getStorageSync('color'));  
          that.getinfo(q);
        })
      }
    }
  },
getinfo:function(q){
  if (q.q) {
    var q = q.q.split('_')[1];
    config.post("/wxApi/d/getXcxDesk", { id: q }, function (ret) {
      if (ret.code == 0) {
        wx.setStorage({
          "key":"sid",
          "data": ret.data.storeId
        })
        wx.redirectTo({
          url: '../shop/shop?storeId=' + ret.data.storeId + '&deskId=' + ret.data.id + '&deskCode=' + ret.data.code
        })
      } else {
        config.tost(ret.msg);
        setTimeout(function(){
          wx.switchTab({
            url: '../index/index',
          })
        },3000)        
      }
    }, true);
  }else{
    wx.switchTab({
      url: '../index/index',
    })
  }
},

})