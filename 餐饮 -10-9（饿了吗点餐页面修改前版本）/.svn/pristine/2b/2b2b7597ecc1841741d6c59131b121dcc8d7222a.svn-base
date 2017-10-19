// pages/index/djq.js
var config = require("../../config.js");
Page({
  data: {
  api: config.apiPath,
  djList:'',
  order:'',
  orderId:'',
  from:'',
  loading:true
  },
  onLoad: function (options) {
    var that=this;
    var id=options.id;
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    that.setData({
      order:wx.getStorageSync('order'),
      orderId:options.id,
      color: wx.getStorageSync('color')
    })
    if(options.from=='wm'){
      that.setData({
        from: options.from
      })
      //外卖代金券
      config.post("/wxApi/wm/getCoupons", { id: id, type: 2 }, function (ret) {
        if (ret.code == 0) {
          that.setData({
            djList: ret.data
          })
        } else {
          config.tost(ret.msg);
        }
        setTimeout(function () {
          that.setData({
            loading: false
          })
        }, 500)
      },true);
    }else{
      //普通订单代金券
      config.post("/wxApi/o/getCoupons", { id: id, type: 2 }, function (ret) {
        if (ret.code == 0) {
          that.setData({
            djList: ret.data
          })
        } else {
          config.tost(ret.msg);
        }
        setTimeout(function () {
          that.setData({
            loading: false
          })
        }, 500)
      },true);
    }
  },
  liselec: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var types = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    that.setData({
      liselec: index
    })
    if (id == '') {
        that.data.order.djId = "";
        that.setData({
          order: that.data.order
        })
        id = "noDj";
    }
    if(that.data.from=='wm'){
      //外卖选中代金券
      setTimeout(function () {
        config.post("/wxApi/wm/selectCoupon", { id: that.data.orderId, couponId: id }, function (ret) {
          if (ret.code == 0) {
            if (id) {
                that.data.order.djId = id;
                that.setData({
                  order: that.data.order
                })
            }
            wx.navigateBack({
              delta: 1
            })
          } else {
            config.tost(ret.msg);
          }
        });
      },true)
    }else{
      //普通订单选中代金券
      setTimeout(function () {
        config.post("/wxApi/o/selectCoupon", { id: that.data.orderId, couponId: id }, function (ret) {
          if (ret.code == 0) {
            if (id) {
              if (types == 1) {
                that.data.order.mjId = id;
                that.setData({
                  order: that.data.order
                })
              } else {
                that.data.order.djId = id;
                that.setData({
                  order: that.data.order
                })
              }
            }
            wx.navigateBack({
              delta: 1
            })
          } else {
            config.tost(ret.msg);
          }
        });
      }, 100)
    }
  },
})