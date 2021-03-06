// pages/mypage/yhj-zz.js
var config = require("../../config.js");
Page({
  data: {
    api:config.apiPath,
    obj:[],
    id:'',
    loading:true
  },
  onLoad: function (options) {
    var that=this;
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    that.setData({
      id: options.id,
      color: wx.getStorageSync('color')
    })
    //优惠券转赠
    config.post("/wxApi/u/yhqSendDetail", { id: options.id }, function (ret) {
      if (ret.code == 0) {
        that.data.obj.push(ret.data);        
        that.setData({
          obj: that.data.obj
        })
      }
      setTimeout(function () {
        that.setData({
          loading: false
        })
      }, 500)
    },true);
  },
  onShareAppMessage: function () {
    var that=this;
    return {
      title: that.data.obj[0].userName + "赠送您一张" + that.data.obj[0].storeName + "的优惠券，手快有，手慢无！",
      path: 'pages/mypage/yhj-lq?id=' + that.data.id,
      success: function (res) {
        config.post("/wxApi/u/yhqSendSuccess", { id: that.data.id }, function (ret) {
        });    
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})