// pages/mypage/hyk.js
var config = require("../../config.js");
Page({
  data:{
    path: config.resPath,
    api: config.ossPath,
    obj:'',
  },
  onLoad:function(){
    var that=this;
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({
          key:'color',
          data:'blue'
      });
    }
    // config.navBarColor(my.getStorageSync('color'));
    that.setData({
      color: my.getStorageSync({key:'color'}).data
    })  
    config.post("/wxApi/u/info", {}, function (ret) {
      if (ret.code == 0) {
        console.log(ret);
        that.setData({
          obj: ret.data
        })
      } 
    },true);
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
  }
})