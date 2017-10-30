// pages/index/mjq.js
var config = require("../../config.js");
Page({
  data: {
    api:config.ossPath,
    mjList: '',
    order: '',
    orderId: '',
    from:'',
    loading:true
  },
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({key:'color',data: 'blue'});
    }
    config.navBarColor(my.getStorageSync({key:'color'}).data);
    that.setData({
      order: my.getStorageSync({key:'order'}).data,
      orderId: options.id,
      color: my.getStorageSync({key:'color'}).data
    })
    
    if (options.from == 'wm') {
      that.setData({
        from: options.from
      })
      //外卖满减券
      config.post("/wxApi/wm/getCoupons", { id: id, type: 1 }, function (ret) {
        if (ret.code == 0) {
          that.setData({
            mjList: ret.data
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
        //普通订单满减券
      config.post("/wxApi/o/getCoupons", { id: id, type: 1 }, function (ret) {
        if (ret.code == 0) {
          that.setData({
            mjList: ret.data
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
    var id = e.currentTarget.dataset.id;
    that.setData({
      liselec: index
    })
    if (id == '') {
      that.data.order.mjId = "";
      that.setData({
        order: that.data.order
      })
      id = "noMj";
    } if (that.data.from == 'wm') {
      //外卖选中满减券
      setTimeout(function () {
        config.post("/wxApi/wm/selectCoupon", { id: that.data.orderId, couponId: id }, function (ret) {
          if (ret.code == 0) {
            if (id) {
              that.data.order.mjId = id;
              that.setData({
                order: that.data.order
              })
            }
            my.navigateBack({
              delta: 1
            })
          } else {
            config.tost(ret.msg);
          }
        },true);
      }, 100)
    }else{    
    setTimeout(function () {
      //普通订单满减券
      config.post("/wxApi/o/selectCoupon", { id: that.data.orderId, couponId: id }, function (ret) {
        if (ret.code == 0) {
          if (id) {
              that.data.order.mjId = id;
              that.setData({
                order: that.data.order
              })
          }
          my.navigateBack({
            delta: 1
          })  
        } else {
          config.tost(ret.msg);
        }
      },true);
    }, 100)
    }
  },
})