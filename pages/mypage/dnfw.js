// pages/mypage/dnfw.js
var config = require("../../config.js");
Page({
  data:{
    path: config.resPath,
    api: config.ossPath,
    list:'',
    show:false,
  },
  onLoad:function(options){
    var that=this;
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({key:'color', data:'blue'});
    }
    config.navBarColor(my.getStorageSync({key:'color'}).data);
    that.setData({
      deskId: options.deskId,
      deskCode: options.deskCode,
      id:options.id,
      color: my.getStorageSync({key:'color'}).data
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
    my.navigateTo({
      url: '../shop/shop?deskId=' + this.data.deskId + '&deskCode=' + this.data.deskCode
    })
  },
  goZf:function(e){
    my.navigateTo({
      url: '../index/zf?id='+this.data.id,
    })
  }
})