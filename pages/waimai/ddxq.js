// pages/waimai/zf.js
var config = require("../../config.js");
// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
/* 毫秒级倒计时 */ 

function count_down(that) {

  //渲染倒计时时钟
  that.setData({
    count: date_format(that.data.total_micro_second)
  });
  if (that.data.total_micro_second <= 1) {
    // timeout则跳出递归
    that.data.order.state=0;
    that.setData({
      count:'',
      order: that.data.order
    })
    my.removeStorage({
      key: '',
    })
    that.load();
    return;
  }
  setTimeout(function () {
    if (that.data.isstop){
      return;
    }
    // 放在最后--
    that.data.total_micro_second -= 1000;
    count_down(that);
  } , 1000)
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
    path: config.apiPath,
    api: config.ossPath,
    order:'',
    store:'',
    slishow:true,
    diff:'',
    id:'',
    total_micro_second: 0,
    isstop: false,
    loading:true
  },
  onLoad: function (options) {
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({key:'color',data: 'blue'});
    }
    config.navBarColor(my.getStorageSync({key:'color'}).data);
    this.setData({
      color: my.getStorageSync({key:'color'}).data
    });
    if(options){
      this.setData({
        id:options.id
      })
    }
    this.load();    
  },
  onUnload: function () {
    this.setData({
      isstop: true
    })
  },
  load:function(){
    var that = this;
    config.post('wxApi/wm/order', { id: that.data.id }, function (ret) {
      console.log(ret);
      if (ret.code == 0) {
        that.setData({
          order: ret.data.order,
          store: ret.data.store,
        })
        if (ret.data.order.diff > 0) {
          that.setData({
            total_micro_second: ret.data.order.diff
          })
          count_down(that);
        }
      }
      setTimeout(function () {
        that.setData({
          loading: false
        })
      }, 500)
    },true)    
  },
  xzbak:function(){
    my.navigateBack({
      delta:1
    })
  },
  sildlist:function(){
    this.setData({
      slishow: !this.data.slishow
    })
  },
  cancel:function(){
    var that = this;
    my.showModal({
      title: '',
      content: '确定要取消预订吗？',
      success: function (res) {
        if (res.confirm) {
        config.post('wxApi/wm/cancel', { id: that.data.id }, function (ret) {
            if (ret.code == '0') {
              that.load();
            } else {
              config.tost(ret.msg);
            }
          })
        }
      }
    },true)
  },
  gozf:function(e){
    my.navigateTo({
      url: '../waimai/zf?id='+this.data.id,
    })
  },
  gostore: function () {
    my.redirectTo({
      url: '../index/mdxq?id=' + this.data.store.id,
    })
  },
  //拨号
  phone: function () {
    my.makePhoneCall({
      phoneNumber: this.data.store.phone, //仅为示例，并非真实的电话号码
    })
  },
})