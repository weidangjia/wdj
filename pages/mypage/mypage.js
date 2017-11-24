//获取应用实例
var app = getApp();
var config = require("../../config.js");
Page({
  data: {
    path: config.resPath,
    api: config.ossPath,
    userInfo: '',
  },
  onLoad: function () {
    if (my.getStorageSync({ key: 'userInfo' }).data) {
      this.setData({
        userInfo: my.getStorageSync({ key: 'userInfo' }).data,
      })
    }
    console.log(this.data.userInfo);
  },
  onShow: function () {
    var that = this;
    if (!my.getStorageSync({ key: 'color' }).data) {
      my.setStorageSync({ key: 'color', data: 'blue' });
    }
    config.navBarColor(my.getStorageSync({ key: 'color' }).data);
    that.setData({
      userInfo: my.getStorageSync({ key: 'userInfo' }).data,
      logo: my.getStorageSync({ key: 'logo' }).data,
      color: my.getStorageSync({ key: 'color' }).data
    })
  },
  distr: function () {
    my.navigateTo({
      url: '../waimai/dzlb?from=my',
    })
  },
  goToMypage: function () {
    my.navigateTo({
      url: '../shop/shop'
    })
  },
  goToYhj: function () {
    my.navigateTo({
      url: '../mypage/yhj'
    })
  }
})
