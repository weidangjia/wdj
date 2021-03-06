// pages/mypage/dnfw.js
var config = require("../../config.js");
Page({
  data:{
    path: config.resPath,
    api: config.apiPath,
    list:'',
    show:false,
  },
  onLoad:function(options){
    var that=this;
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    that.setData({
      deskId: options.deskId,
      deskCode: options.deskCode,
      id:options.id,
      color: wx.getStorageSync('color')
    })
    config.post('wxApi/c/services',{},function(ret){
      if(ret.code==0){
        that.setData({
          list:ret.data
        })
      }
    })
  },
  call:function(e){
    config.post('wxApi/s/addService', { deskId: this.data.deskId, type: e.currentTarget.dataset.type},function(ret){
      if(ret.code!=0){
        config.tost(ret.msg);
      }
    },true)
    this.setData({
      show:true
    })
  },
  goShop:function(e){
    wx.navigateTo({
      url: '../shop/shop?deskId=' + this.data.deskId + '&deskCode=' + this.data.deskCode
    })
  },
  goZf:function(e){
    wx.navigateTo({
      url: '../index/zf?id='+this.data.id,
    })
  }
})