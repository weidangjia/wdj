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
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({
          key:'color',
          data:'blue'
      });
    }
    config.navBarColor(my.getStorageSync({ key: 'color' }).data);
    that.setData({
      id: options.id,
      color: my.getStorageSync({key:'color'}).data
    })
    //优惠券转赠
    config.post("/wxApi/u/yhqSendDetail", { id: options.id }, function (ret) {
      if (ret.code == 0) {
        that.data.obj  = [ret.data];        
        that.setData({
          obj: that.data.obj
        })
        console.log(that.data)
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