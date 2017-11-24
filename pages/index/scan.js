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
    var q = decodeURIComponent(options.scene);
    if (wx.getStorageSync({key:'uid'}).data) {
      that.getinfo(q);
    } else {
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        post("wxApi/ali/login",{authcode:res.authCode},function(ret) {
          if(ret.code==0){
            my.setStorageSync({key:'uid',data:ret.data.id});
            my.setStorage({
            key: 'userInfo', // 缓存数据的 key
            data: ret.data, // 要缓存的数据
          });
          that.getinfo(q);
          }          
        })
      },
      fail:(res)=>{
        that.authcode();
      }
    });
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