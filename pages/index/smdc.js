// pages/index/diancan.js
import config from '../../config.js';
var app = getApp();
Page({
  data: {
    api: config.ossPath,
    isback:false,
  },
  onShow:function(){
    this.setData({
      logo:my.getStorageSync({key:'logo'}).data
    })
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({key:'color',data:'blue'});
    }
    if (my.getStorageSync({key:'aliasQr'}).data) {
      this.setData({ aliasQr: my.getStorageSync({key:'aliasQr'}).data });
    } else {
      this.setData({ aliasQr: '请扫描餐桌二维码' })
    }
    config.navBarColor(my.getStorageSync({key:'color'}).data);
    // if(this.data.isback){
    //   console.log(this.data.isback);
    //   my.switchTab({
    //     url: '../index/index',
    //   })
    // }
    this.setData({
      color: my.getStorageSync({key:'color'}).data,
      isback:false,
    })
  },
  saom: function () { 
    var id;
    var that=this;   
      my.scanCode({
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
              my.switchTab({
                url: '../index/index',
              })
            }, 200) 
            setTimeout(function () {
            config.post("/myApi/d/getXcxDesk", { id: id }, function (ret) {
              if (ret.code == 0) {
                my.setStorage({
                  key: 'sid',
                  data: ret.data.storeId,
                });
                my.setStorage({
                  key: 'deskCode',
                  data: ret.data.code,
                });
                my.navigateTo({
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