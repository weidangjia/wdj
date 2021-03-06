// pages/index/diancan.js
var config = require("../../config.js");
var app=getApp();
Page({
  data:{
    path: config.resPath,
    api: config.apiPath,
  },
  onLoad: function (options){
    if (options.change){
      this.setData({
        change: options.change
      })
    } else if (options.from){
      this.setData({
        from: options.from
      })
    }
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    if (wx.getStorageSync('aliasQr')){
      this.setData({ aliasQr: wx.getStorageSync('aliasQr')});
    }else{
      this.setData({ aliasQr:'请扫描餐桌二维码'})
    }
    config.navBarColor(wx.getStorageSync('color'));
    this.setData({
      color: wx.getStorageSync('color')
    })
  },
  saom:function(){
    var that=this;
    var id;
    wx.scanCode({
      success: (res) => {
        if (res.path) {
          //扫码参数获取
          id = res.path.split('=')[1];
        } else if (res.result) {

          id = res.result.split('_')[1];
        } else {
          config.tost("二维码不存在");
        }  
        if (id) {
          //订单进入扫描
          if(that.data.from){
            config.post("/wxApi/d/getXcxDesk", { id: id }, function (ret) {
              if (ret.code == 0) {
                if (wx.getStorageSync('sid') != ret.data.storeId) {
                  that.storeId(ret.data);
                  return;
                }
                wx.setStorage({
                  key: 'deskCode',
                  data: ret.data.code,
                });
                wx.navigateTo({
                  url: "../shop/shop?deskId=" + ret.data.id + '&deskCode=' + ret.data.code,
                })
              } else {
                config.tost(ret.msg);
              }
            },true);
          }else if (that.data.change==1){
            config.post("/wxApi/d/getXcxDesk", { id: id }, function (ret) {
              if (ret.code == 0) {
                if (wx.getStorageSync('sid') != ret.data.storeId) {
                  config.tost('餐桌号不合法');
                  return;
                };
                wx.setStorage({
                  key: 'storeId',
                  data: ret.data.storeId,
                });
                wx.setStorage({
                  key: 'deskCode',
                  data: ret.data.code,
                });
                wx.navigateBack({
                  delta: 1
                });
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2]; //上一个页面
                //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
                prevPage.setData({
                  deskId: ret.data.id,
                  deskCode: ret.data.code
                });
              } else {
                config.tost(ret.msg);
              }
            },true);
          }else{
          config.post("/wxApi/d/getXcxDesk", { id:id }, function (ret) {
            if (ret.code == 0) {
              console.log(ret);
              if (wx.getStorageSync('sid') != ret.data.storeId){
                 that.storeId(ret.data); 
                 return;               
              }
              wx.setStorage({
                key: 'deskCode',
                data: ret.data.code,
              });
              wx.navigateBack({
                delta:1
              });
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2]; //上一个页面
              //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
              prevPage.setData({
                deskId: ret.data.id,
                deskCode: ret.data.code
              });
              prevPage.confirm();
            } else {
              config.tost(ret.msg);
            }
          },true);
          }
        }  
      }
    })
  },
  storeId:function(data){
    wx.setStorage({
      key: 'sid',
      data: data.storeId,
    })
    config.tost('餐桌二维码不属于当前餐厅');
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      });
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        deskId: data.id,
        deskCode: data.code
      });
      prevPage.loadata();
    }, 1500)
    return;
  }
})