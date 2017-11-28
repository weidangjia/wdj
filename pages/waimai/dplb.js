// pages/waimai/dplb.js
var config = require("../../config.js")
var app=getApp();
Page({
  data: {
    path: config.apiPath,
    api: config.ossPath,
    dplist: '',
    address:'',
    seadd:'',
    loading:true
  },
  onLoad:function(options){
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({key:'color',data: 'blue'});
    }
    config.navBarColor(my.getStorageSync({key:'color'}).data);
    this.setData({
      color: my.getStorageSync({key:'color'}).data
    });
  },
  onShow:function(){
    var that=this;
    
    if (my.getStorageSync({key:'wmaddr'}).data) {
      that.setData({
        seadd: my.getStorageSync({key:'wmaddr'}).data
      })
      that.listdata();
    } else {
      config.post('wxApi/addr/getDefault', {}, function (ret) {
        if (ret.code == 0) {
          
          that.setData({
            seadd: ret.data
          })
          my.setStorage({
            key: 'wmaddr',
            data: ret.data,
          })
        } else {
          
          // app.getaddress({
          //   successgeocoder:function(res){
          //     console.log(res)
          //     that.setData({
          //       address: my.getStorageSync({key:'address'}).data
          //     })
          //     that.listdata();
          //   }
          // });
          if (my.getStorageSync({key:'wmaddr'}).data == undefined){
              that.setData({
                seadd: ''
              })
          } else {
            that.setData({
              seadd: my.getStorageSync({key:'wmaddr'}).data
            })
          }
          
          that.setData({
            address: my.getStorageSync({key:'address'}).data
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
    if (my.getStorageSync({key:'wmaddr'}).lat){
       lat = my.getStorageSync({key:'wmaddr'}).lat;
       lng = my.getStorageSync({key:'wmaddr'}).lng;
    }else{
      lat = my.getStorageSync({key:'lat'}).data;
      lng = my.getStorageSync({key:'lng'}).data;
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
    my.setStorage({
      key: 'sid',
      data: e.currentTarget.dataset.id,
    })
    my.navigateTo({
      url: '../shop/shop?isWm=1',
    })
  }
})