// pages/mypage/yhj_lq.js
var config = require("../../config.js");
var app = getApp();
Page({
  data:{
    Path: config.resPath,
    api: config.apiPath,
    coupon:{},
    obj:{},
    id:'',
    isShow:true
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this;    
  },
  onLoad: function (options){
    var that=this;
    that.data.id = options.id;
    
    config.post("/wxApi/c/theme", {}, function (ret) {
      wx.setStorageSync('color', ret.color);
    })
    if(wx.getStorageSync('uid')){
      that.getinfo();
    }else{
      app.onauthorsuccess = function () {
         that.getinfo();
      }
    }
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    that.setData({
      id: that.data.id,
      color: wx.getStorageSync('color')
    })
  },
  getinfo:function(){
    var that = this;
        // 页面初始化 options为页面跳转所带来的参数
        config.post("/wxApi/u/yhqGetDetail", {
          id: that.data.id
        }, function (ret) {
          
          if(ret.code==0){
            that.data.coupon.data = ret.data.coupon;
            var nickName = wx.getStorageSync('userInfo').nickName;
            if (ret.data.coupon.userName == nickName) {
              that.setData({
                isShow: false
              })
            }
            that.setData({
              obj: ret.data,
              coupon: that.data.coupon
            })
          }          
          if (ret.code != 0) {
            wx.showModal({
              content: ret.msg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index',
                  })
                }
              }
            });
          }
        }); 
  },
  receive:function(e){
    var that=this;
    config.post("/wxApi/u/yhqGet", { id: that.data.id }, function (ret) {
      if (ret.code == 0) {
        config.tost('领取成功');
        that.setData({
          isShow:false
        })
      } else {
        config.tost(ret.msg);
      }
    },true);
  },
  godc:function(){
    wx.redirectTo({
      url: '../stores/stores',
    })
  },
  gopd:function(){
    wx.redirectTo({
      url: '../index/mdxz',
    })
  }
})