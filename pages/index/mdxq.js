var config = require("../../config.js");
// var WxParse = require('../../wxParse/wxParse.js')
Page({
    data: {
        resPath: config.resPath,
        api: config.ossPath,
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 1200,
        path:{},
        obj:'',
        imgs:'',
        id:'',
        loading:true
    },
    onLoad: function (options){
      var that=this;
      var id =options.id;
      //首页按钮名称
      var alias = my.getStorageSync({key:'alias'}).data;
      if (alias){
        that.setData({ alias: alias});
      }
      if (options.deskId){
        that.setData({
          deskId: options.deskId,
          storeId: options.storeId
        })
      }
      if (!my.getStorageSync({key:'color'}).data) {
        my.setStorageSync({key:'color',data: 'blue'});
      }
      config.navBarColor(my.getStorageSync({key:'color'}).data);
      that.setData({
        color: my.getStorageSync({key:'color'}).data
      })
      my.setStorageSync({key:'sid',data:id});  
      //门店详情数据    
      config.post('wxApi/s/info',{id:id},function(ret){
  
        that.data.obj = ret.data;
        that.setData({
          obj: that.data.obj,
          logo:my.getStorageSync({key:'logo'}).data,
          btnPd:ret.data.btnPd,
          btnYd: ret.data.btnYd,
          btnDc: ret.data.btnDc,
          btnWm: ret.data.btnWm
        })
        console.log(that.data)
        if (ret.code == 0) {
          that.data.imgs = ret.data.imgs.split(",");
          that.setData({
            imgs: that.data.imgs
          })
        }      
        setTimeout(function () {
          that.setData({
            loading: false
          })
        if (that.data.obj.remark == '') {
          return;
        }
        // WxParse.wxParse('remark', 'html', that.data.obj.remark, that, 5);   
        
        }, 500) 
      },true);   
        that.getYh(id);
     },  
    getYh:function(id){
      var that=this;
      //优惠券
      config.post('wxApi/coupon/store', { id:id},function(ret){
        if(ret.code==0){
          that.setData({
            couponList:ret.data
          })
        }
      },true)
    },
     phone:function(){
       my.makePhoneCall({
         number: this.data.obj.phone
       })
     },
     goyd:function(){
       my.redirectTo({
         url:'../index/ydwz',
       })
     },
     loaction:function(e){
       var obj=e.currentTarget.dataset.data;
       my.openLocation({
         latitude:Number(obj.lat),
         longitude: Number(obj.lng),
         name:obj.title,
         address:obj.address,
       })
     },
    //右上角转发
     onShareAppMessage: function (res) {
     },
     goYd:function(){
       my.navigateTo({
         url: '../index/ydwz',
       })
     },
     goDc: function () {
       var deskId=this.data.deskId;
       var storeId = this.data.storeId;
       if (this.data.obj.id == storeId){
         my.navigateTo({
           url: '../shop/shop?deskId='+deskId,
         })
       }else{
         my.navigateTo({
           url: '../shop/shop',
         })
       }       
     },
     goPd: function () {
       my.navigateTo({
         url: '../index/mdxz',
       })
     },
     goWm: function () {
       my.redirectTo({
         url: '../shop/shop?isWm=1',
       })
     },
     get:function(){
       my.navigateTo({
         url: '../mypage/qyhq',
       })
     }
})
