// pages/waimai/dplb.js
var config = require("../../config.js");
var app=getApp();
Page({
  data: {
    path: config.resPath,
    api: config.apiPath,
    dplist: '',
    address:'',
    seadd:'',
    loading:true
  },
  onLoad:function(){
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    this.setData({
      color: wx.getStorageSync('color')
    });
  },
  onShow:function(){
    var that=this;
    if (wx.getStorageSync('wmaddr')) {
      that.setData({
        seadd: wx.getStorageSync('wmaddr')
      })
      that.listdata();
    } else {
      config.post('wxApi/addr/getDefault', {}, function (ret) {
        if (ret.code == 0) {
          that.setData({
            seadd: ret.data
          })
          wx.setStorage({
            key: 'wmaddr',
            data: ret.data,
          })
        } else {
          app.getaddress({
            successgeocoder:function(res){
              that.setData({
                address: wx.getStorageSync('address')
              })
              that.listdata();
            }
          });
          that.setData({
            seadd: wx.getStorageSync('wmaddr')
          })
          that.setData({
            address: wx.getStorageSync('address')
          })
        }
      },true)
      that.listdata();
    }
  },
  listdata:function(){
    var that=this;
    var lat;
    var lng;
    if (wx.getStorageSync('wmaddr').lat){
       lat = wx.getStorageSync('wmaddr').lat;
       lng = wx.getStorageSync('wmaddr').lng;
    }else{
      lat = wx.getStorageSync('lat');
      lng = wx.getStorageSync('lng');
    } 
    config.post('wxApi/wm/storeList', { lat: lat, lng:lng }, function (ret) {
      if (ret.code == 0) {
        that.setData({
          dplist: ret.data
        })
      }
      setTimeout(function () {
        that.setData({
          loading: false
        })
      }, 500)
    },true)
  },
  goshop:function(e){
    wx.setStorage({
      key: 'sid',
      data: e.currentTarget.dataset.id,
    })
    wx.navigateTo({
      url: '../shop/shop?isWm=1',
    })
  }
})