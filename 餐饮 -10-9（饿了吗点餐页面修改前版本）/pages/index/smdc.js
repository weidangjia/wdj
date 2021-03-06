// pages/index/diancan.js
var config = require("../../config.js");
var app = getApp();
Page({
  data: {
    path: config.resPath,
    api: config.apiPath,
    isback:false,
  },
  onShow:function(){
    //技术支持图标
    var supportImg = wx.getStorageSync('supportImg');
    if (supportImg) {
      this.setData({
        supportImg: supportImg
      })
    }
    this.setData({
      logo:wx.getStorageSync('logo')
    })
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    if (wx.getStorageSync('aliasQr')) {
      this.setData({ aliasQr: wx.getStorageSync('aliasQr') });
    } else {
      this.setData({ aliasQr: '请扫描餐桌二维码' })
    }
    config.navBarColor(wx.getStorageSync('color'));
    // if(this.data.isback){
    //   console.log(this.data.isback);
    //   wx.switchTab({
    //     url: '../index/index',
    //   })
    // }
    this.setData({
      color: wx.getStorageSync('color'),
      isback:false,
    })
  },
  saom: function () { 
    var id;
    var that=this;   
      wx.scanCode({
        success: (res) => {
          console.log(res);
          if (res.path){ 
            id = res.path.split('=')[1];
          } else if (res.result){
            
            id = res.result.split('_')[1];
          }else{
            config.tost("二维码不存在");
          }          
          if (id) {
            setTimeout(function () {
              wx.switchTab({
                url: '../index/index',
              })
            }, 200) 
            setTimeout(function () {
            config.post("/wxApi/d/getXcxDesk", { id: id }, function (ret) {
              if (ret.code == 0) {
                wx.setStorage({
                  key: 'sid',
                  data: ret.data.storeId,
                });
                wx.setStorage({
                  key: 'deskCode',
                  data: ret.data.code,
                });
                wx.navigateTo({
                  url: '../shop/shop?storeId=' + ret.data.storeId + '&deskId=' + ret.data.id + '&deskCode=' + ret.data.code,
                })
                that.setData({
                  isback: true,
                })
              } else {
                config.tost(ret.msg);
              }
            },true);
            },800)  
          }else{
            config.tost('餐位不存在！')
          }
        },
      })
      
  }
})