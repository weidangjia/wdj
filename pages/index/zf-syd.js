// pages/index/zf-syd.js
var config = require("../../config.js");
Page({
  data:{
    api: config.ossPath,
    deskCode:'',
  },
  onLoad:function(options){
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({key:'color',data:'blue'});
    }
    config.navBarColor(my.getStorageSync({key:'color'}).data);
    this.setData({
      deskCode: options.deskCode,
      color: my.getStorageSync({key:'color'}).data
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