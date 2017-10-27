// pages/index/diancan.js
import { post,ossPath,navBarColor,tost } from '../../config.js';
var app=getApp();
Page({
  data:{
    api: ossPath,
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
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({key:'color',data:'blue'});
    }
    if (my.getStorageSync({key:'aliasQr'}).data){
      this.setData({ aliasQr: my.getStorageSync({key:'aliasQr'}).data});
    }else{
      this.setData({ aliasQr:'请扫描餐桌二维码'})
    }
    navBarColor(my.getStorageSync({key:'color'}).data);
    
    this.setData({
      color: my.getStorageSync({key:'color'}).data
    })
  },
  saom:function(){
    var that=this;
    var id;
    my.scan({
      success: (res) => {
        if (res.code) {
          //扫码参数获取
          id = res.code.split('=')[1];
        } else if (res.result) {

          id = res.result.split('_')[1];
        } else {
          tost("二维码不存在");
        }  
        console.log(res);
        if (id) {
          //订单进入扫描
          if(that.data.from){
            post("/wxApi/d/getXcxDesk", { id: id }, function (ret) {
              if (ret.code == 0) {
                if (my.getStorageSync({key:'sid'}).data != ret.data.storeId) {
                  that.storeId(ret.data);
                  return;
                }
                my.setStorage({
                  key: 'deskCode',
                  data: ret.data.code,
                });
                my.navigateTo({
                  url: "../shop/shop?deskId=" + ret.data.id + '&deskCode=' + ret.data.code,
                })
              } else {
                tost(ret.msg);
              }
            },true);
          }else if (that.data.change==1){
            post("/wxApi/d/getXcxDesk", { id: id }, function (ret) {
              if (ret.code == 0) {
                if (my.getStorageSync({key:'sid'}).data != ret.data.storeId) {
                  tost('餐桌号不合法');
                  return;
                };
                my.setStorage({
                  key: 'storeId',
                  data: ret.data.storeId,
                });
                my.setStorage({
                  key: 'deskCode',
                  data: ret.data.code,
                });
                my.navigateBack({
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
                tost(ret.msg);
              }
            },true);
          }else{
          post("/wxApi/d/getXcxDesk", { id:id }, function (ret) {
            if (ret.code == 0) {
              console.log(ret);
              if (my.getStorageSync({key:'sid'}).data != ret.data.storeId){
                 that.storeId(ret.data); 
                 return;               
              }
              my.setStorage({
                key: 'deskCode',
                data: ret.data.code,
              });
              my.navigateBack({
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
              tost(ret.msg);
            }
          },true);
          }
        }  
      }
    })
  },
  storeId:function(data){
    my.setStorage({
      key: 'sid',
      data: data.storeId,
    })
    tost('餐桌二维码不属于当前餐厅');
    setTimeout(function () {
      my.navigateBack({
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