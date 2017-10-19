// pages/index/ddxq.js
var config = require("../../config.js");
Page({
  data:{
    resPath: config.resPath,
    api: config.apiPath,
    store:{},
    order:{},
    orderId:'',
    show: true,
    slishow:false,
    loading:true
  },
  onLoad:function(options){
    var that=this;    
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    that.setData({
      orderId: options.id,
      color: wx.getStorageSync('color')
    });
    //获取订单数据
    config.post('/wxApi/o/order', { id: that.data.orderId},function(ret){
      if(ret.code==0){
        that.data.store = ret.data.store;
        that.data.order = ret.data.order;
        that.setData({
          store:that.data.store,
          order:that.data.order,
        })
        wx.setStorage({
          key: 'sid',
          data: ret.data.store.id,
        })
        if (that.data.order.goodsAmount>0){
          that.setData({
            slishow:true
          })
        }
      }
      setTimeout(function () {
        that.setData({
          loading: false
        })
      }, 500)
    },true)
  },
  
  //拨号
  phone:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.store.phone, //仅为示例，并非真实的电话号码
    })
  },
  //门店详情
  gostore: function(){
    wx.redirectTo({
      url: '../index/mdxq?id=' + this.data.store.id,
    })
  },
  //取消预订
  ydcancel:function(e){
  var  that=this;
    wx.showModal({
      title: '',
      content: '确定要取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          config.formid(e.detail.formId);
          config.post('/wxApi/o/ydCancel', { id: that.data.orderId},function(ret){
            if(ret.code=='0'){
              wx.navigateBack({
                delta: 1
              })
            } else if (ret.code=='-1'){
              config.tost(ret.msg)
              wx.redirectTo({
                url: '../index/index',
              })
            }else{
              config.tost(ret.msg);
            }
          },true)
        }
      }
    })
  },
  //我已到店
  wydd: function (){
    wx.navigateTo({
      url: '../index/dc?from=ddxq',
    })
  },
  gozf:function(){
    wx.navigateTo({
      url: '../index/zf?id='+this.data.orderId,
    })
  },
  //立即点餐
  goAddYdGoods:function(){
    if (this.data.order.state == 0 && this.data.order.bookState == 1) {
      wx.redirectTo({
        url: '../shop/shop?storeId=' + this.data.store.id + '&ydId=' + this.data.orderId + '&deskId=' + this.data.order.deskId + '&deskCode=' + this.data.order.deskCode,
      })
    }
  },
  dcslid:function(){
    wx.navigateTo({ 
      url: '../index/zf?id=' + this.data.orderId ,
    })
  },
  gostore:function(){
    wx.navigateTo({
      url: '../index/mdxq?id=' + this.data.store.id,
    })
  }
})