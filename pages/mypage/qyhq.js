// pages/index/mjq.js
var config = require("../../config.js");

// function count_down(that) {

//   //渲染倒计时时钟
//   that.data.count=[];
//   var times = that.data.total_micro_second;
//   times.forEach(function(o,i){
//     that.data.count.push(date_format(o));    
//   })
//   that.setData({
//     count: that.data.count
//   })
//   times.forEach(function(o,i){
//     if (o<= 1) {
//       that.data.count[i]=0;
//       // timeout则跳出递归
//       that.setData({
//         count: that.data.count,
//       })
//       return;
//     }
//   })
//   setTimeout(function () {
//     if (that.data.isstop) {
//       return;
//     }
//     // 放在最后--
//     for(let i=0;i<times.length;i++){
//       if (that.data.total_micro_second[i]>0){
//         that.data.total_micro_second[i] -= 1000;
//       }else{
//         that.data.total_micro_second[i]=0;
//       }
//     }
    
//     // that.data.total_micro_second -= 1000;
//     count_down(that);
//   }, 1000)
// }
function add(that){
  that.data.count = 0;
  setInterval(function (){
    that.setData({
      count: ++that.data.count
    })
  },1000)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 总秒数
  var second = Math.floor(micro_second / 1000);
  // 天数
  var day = Math.floor(second / 3600 / 24);
  // 小时
  var hr = fill_zero_prefix(Math.floor(second / 3600 % 24));
  // 分钟
  var min = fill_zero_prefix(Math.floor(second / 60 % 60));
  // 秒
  var sec = fill_zero_prefix(Math.floor(second % 60));
  if(day>0){
    return day + '天' + hr + ":" + min + ":" + sec;
  }else if(hr>0){
    return hr + ":" + min + ":" + sec;
  }else{
    return min + ":" + sec;
  }
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
Page({
  data: {
    api: config.apiPath,
    ossPath:config.ossPath,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,  
    order: '',
    count: [],
    list:'',
    orderId: '',
    from: '',
    isstop: true,
    total_micro_second: [],
    loading:true
  },
  onShow:function(){
    var that=this;
    // that.load();
    if (that.data.isstop) {
      that.setData({
        isstop: false
      })
      that.load();
      add(that);                    
    }
    my.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    }); 
  },
  onUnload: function () {
    this.setData({
      isstop: true
    })
  },
  onLoad: function (options) {
    var that = this;
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({key:'color',data: 'blue'});
    }
    config.navBarColor(my.getStorageSync({key:'color'}).data);
    that.setData({
      order: my.getStorageSync({key:'order'}).data,
      orderId: options.id,
      color: my.getStorageSync({key:'color'}).data
    })
  },
  load:function(){
    var that=this;
    //抢购活动列表
    config.post('wxApi/coupon/all', { apiVersion:1},function(ret){
      if(ret.code==0){
        that.setData({
          list:ret.data
        })
        that.data.list.forEach(function(o,i){
          if (o.seconds>0){
            var se = o.seconds*1000;
            that.data.total_micro_second.push(se);
          }else{
            that.data.total_micro_second.push(0);
          }
        })
        that.setData({
          total_micro_second: that.data.total_micro_second
        })
        // count_down(that);       
      }
      setTimeout(function () {
        that.setData({
          loading: false
        })
      }, 500)
    },true)
  },
  get:function(e){
    var that=this;
    var id=0;
    if(e.from=='button'){
      
      id = e.target.dataset.id;
    }else{
      id = e.currentTarget.dataset.id;
    }
    //领取优惠券
    
    config.post('wxApi/coupon/get', { actId:id},function(ret){
      var isAdd = false;      
      if(ret.code==0){
        if (ret.data){
          my.tradePay({
            'orderStr': ret.data.orderStr,
            'success': function (res) {
              console.log(ret);
              that.load();
              config.tost("领取成功！");             
            },
          })
        }
        console.log(ret);
        that.load();  
        if(ret.data!=null){
          config.tost("领取成功！");          
        }      
      }else{
        config.alert(ret.msg);
      }
    },true)
  },
  sharing:function (e) {
      console.log(e)
      // my.setStorageSync({key:'datasetInfo',data:e.target.dataset.info})
      // my.setStorageSync({key:'datasetImg',data:e.target.dataset.img})
      my.setStorageSync({key:'datasetE',data:e})
      
  },
  onShareAppMessage: function () {
    var that=this;
    var e = my.getStorageSync({key:'datasetE'}).data
    //转发
    var obj = my.getStorageSync({key:'userInfo'}).data;
    var title = e.target.dataset.info == null ? '' : e.target.dataset.info;
    console.log(title);
    return {
      title: title,
      path: 'pages/mypage/share?img='+e.target.dataset.img,
      imageUrl: that.data.api + e.target.dataset.img,
      success: function (res) {
        config.tost("分享成功");  
        that.get(e);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  swichNav: function (e) {

    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });

  },  
})