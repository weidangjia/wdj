//获取应用实例
var app = getApp();

import { post } from '../../config.js';
import config from '../../config.js';
Page({
  data: {
    path: config.resPath,
    api: config.ossPath,
    userInfo:'',
  },

  onLoad: function(options){
    var that = this;
    post('wxApi/u/info',{},function(res){
      if(res.code == 0){
        that.setData({
          userInfo:res.data
        })
        that.data.userInfo.headImg = that.data.api + res.data.headImg

      }
    })
    
  },
  onShow: function () {
    var that = this;
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({
        key:'color',
        data:'blue'
    });
    }
    // config.navBarColor(my.getStorageSync('color'));
    that.setData({
      userInfo: my.getStorageSync({key:'userInfo'}).data,
      logo: my.getStorageSync({key:'logo'}).data,
      color:my.getStorageSync({key:'color'}).data
    })      
  },
  onReady: function(res){
  },
  goToYhj:function(){
    my.navigateTo({
      url: '../mypage/yhj'
    })
  },
  distr:function(){
    my.navigateTo({
      url: '../waimai/dzlb?from=my',
    })
  },
  goToMypage:function(){
    my.navigateTo({
      url: '../shop/shop'
    })
  }
  
})
