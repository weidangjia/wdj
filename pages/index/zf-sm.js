// pages/index/zf-sm.js
var config = require("../../config.js");
Page({
  data:{
    api: config.ossPath,
  },
  onLoad:function(){
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({key:'color',data:'blue'}).data;
    }
    config.navBarColor(my.getStorageSync({key:'color'}).data);
    this.setData({
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