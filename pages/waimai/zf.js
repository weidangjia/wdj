// pages/index/zf.js
var config = require("../../config.js");
var id;

function count_down(that) {

  //渲染倒计时时钟
  that.setData({
    count: date_format(that.data.total_micro_second)
  });
  if (that.data.total_micro_second <= 1) {
    // timeout则跳出递归
    that.data.order.state=-1;
    that.setData({
      count: '',
      order:that.data.order
    })
    my.removeStorage({
      key: '',
    })
    that.load();
    return;
  }
  setTimeout(function () {
    if (that.data.isstop) {
      return;
    }
    // 放在最后--
    that.data.total_micro_second -= 1000;
    count_down(that);
  }, 1000)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  return min + ":" + sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

Page({
  data: {
    api:config.ossPath,
    faslid: false,
    rad: false,
    liselec: -1,
    lishow: false,
    disshow: false,
    orderId: '',
    order: '',
    djList: '',
    mjList: '',
    types: '1',
    fainfo: '',
    state: '1',
    total_micro_second : 0,
    isstop : true,
    loading:true
  },
  onLoad: function (options) {
    var that = this;
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({key:'color',data:'blue'});
    }
    config.navBarColor(my.getStorageSync({key:'color'}).data);
    that.setData({
      color: my.getStorageSync({key:'color'}).data
    });
    if (options.id) {
      that.data.orderId = options.id;
      that.setData({
        orderId: options.id
      })
    }
  },    
  onUnload: function () {
    this.setData({
      isstop: true
    })
  },
  onShow: function () {
    this.setData({
      fainfo: this.data.fainfo
    })
    var that = this;
    my.showLoading({
      title: '加载中',
    });
    config.post("/wxApi/wm/payInfo", { id: that.data.orderId }, function (ret) {
      my.hideLoading();
      if (ret.code == 0) {
        if (that.data.fainfo){
          ret.data.invoiceHead=that.data.fainfo;
        }        
        that.setData({
          order: ret.data,
        })
        my.setStorageSync({key:'sid',data:ret.data.storeId});
        if (ret.data.diff > 0) {
          // my.setStorage({
          //   key: 'diff',
          //   data: ret.data.diff,
          // })
          that.setData({
            total_micro_second: ret.data.diff
          })
          if(that.data.isstop){
            that.setData({
              isstop: false
            })
             count_down(that);
          }
        }
      }else{
        config.tost(ret.msg);
      }
      setTimeout(function () {
        that.setData({
          loading: false
        })
      }, 500)
    },true);
  },
  faslid: function () {
    this.setData({
      faslid: !this.data.faslid
    })
  },
  goDj: function () {
    my.setStorageSync('order', this.data.order);
    my.navigateTo({
      url: '../index/djq?id='+this.data.orderId+'&from=wm' ,
    })
  },
  goMj: function () {
    my.setStorageSync('order', this.data.order);
    my.navigateTo({
      url: '../index/mjq?id='+this.data.orderId + '&from=wm',
    })
  },
  faback: function () {
    this.data.order.invoiceHead = '';
    this.setData({
      faslid: !this.data.faslid,
      order: this.data.order
    })
  },
  fpcom: function () {
    this.data.order.invoiceHead = this.data.fainfo;
    this.setData({
      faslid: !this.data.faslid,
      order: this.data.order
    })
  },
  goBack: function () {
    my.navigateBack({
      delta: 1
    })
  },
  lishow: function () {
    this.setData({
      lishow: !this.data.lishow
    })
  },
  liback: function () {
    this.setData({
      lishow: false,
      disshow: false
    })
  },
  invoiceHead: function (e) {
    this.setData({
      fainfo: e.detail.value
    })
  },
  confirm: function () {
    this.invoiceHead();
    this.setData({
      faslid: !this.data.faslid,
    })
  },
  tapClassify: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.order.way = index;
    this.setData({
      Seleted: index,
      order: this.data.order
    });
  },
  pay: function (e) {
    var that = this;
    config.post('wxApi/wm/payByXcx', { id: that.data.orderId }, function (ret) {
        config.formid(e.detail.formId);
        if (ret.code == 0) {
          my.requestPayment({
            'timeStamp': ret.data.timeStamp,
            'nonceStr': ret.data.nonceStr,
            'package': ret.data.package,
            'signType': ret.data.signType,
            'paySign': ret.data.paySign,
            'success': function (res) {
              config.tost("支付成功");
              my.redirectTo({
                url: '../waimai/ddxq?id=' + that.data.orderId,
              })
            },
          })
        }
      },true)
  },
  offline:function(e){
    var that=this;
    config.post('wxApi/wm/payByOffline', { id: that.data.orderId }, function (ret) {
      console.log(ret);
      config.formid(e.detail.formId);
      if (ret.code == 0) {
        my.redirectTo({
          url: '../waimai/ddxq?id=' + that.data.orderId,
        })
      }else{
        config.tost(ret.msg);
      }
    }, true)
  }
})