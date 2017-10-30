// pages/mypage/yhj_lq.js
var config = require("../../config.js");
var app = getApp();
Page({
  data:{
    Path: config.resPath,
    api: config.ossPath,
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
      my.setStorageSync({key:'color', data:ret.color});
    })
    if(my.getStorageSync({key:'uid'}).data){
      that.getinfo();
    }else{
      app.onauthorsuccess = function () {
         that.getinfo();
      }
    }
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({key:'color', data:'blue'});
    }
    config.navBarColor(my.getStorageSync({key:'color'}).data);
    that.setData({
      id: that.data.id,
      color: my.getStorageSync({key:'color'}).data
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
            var nickName = my.getStorageSync({key:'userInfo'}).data.nickName;
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
            my.showModal({
              content: ret.msg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  my.switchTab({
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
    my.redirectTo({
      url: '../stores/stores',
    })
  },
  gopd:function(){
    my.redirectTo({
      url: '../index/mdxz',
    })
  }
})