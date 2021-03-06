// pages/waimai/qrdc.js
var config = require("../../config.js");
Page({
  data: {
    path: config.resPath,
    api: config.apiPath,
    dplist: '',
    address: '',
    seadd: '',
    showtime:false,
    obj:'',
    active:'-1',
    time:'',
    strname:'',
    remark:'',
    invoiceHead:'',
    userNum:'',
    dcwc:false,
    state:'1',
    orderId:'',
    loading:true
  },
  onShow: function () {
    var that = this;
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    that.setData({
      color: wx.getStorageSync('color')
    })
    if (wx.getStorageSync('wmaddr')) {
      that.setData({
        seadd: wx.getStorageSync('wmaddr')
      })
    }else{
    config.post('wxApi/addr/getDefault', {}, function (ret) {
      if (ret.code == 0) {
        that.setData({
          seadd: ret.data
        })
        wx.setStorage({
          key: 'wmaddr',
          data: ret.data,
        })
      } else {
        that.setData({
          seadd: wx.getStorageSync('wmaddr')
        })
        that.setData({
          address: wx.getStorageSync('address')
        })
      }
    },true)
    }
  },
  onLoad: function (options) {
    var that = this;
    var obj = wx.getStorageSync('wm');
    var state=1;
    var arry=[];
    if (options) {
      that.setData({
        strname: options.strname
      })
    }   
    if (obj.periods[0]!=undefined){
    arry.push(obj.date + ' ' + obj.periods[0]);
    for (var i = 1; i < obj.periods.length;i++){
      if ((obj.periods[i] > obj.periods[i-1])&&state){
        arry.push(obj.date+' '+obj.periods[i]);        
      }else{
        arry.push(that.addDate(obj.date, 1)+' '+obj.periods[i]);
        state = 0;
      }
    }
    obj.periods = arry;
    that.setData({
      address: wx.getStorageSync('address'),
      obj: obj,
      time: arry[0],
    })
    }else{
      that.setData({
        address: wx.getStorageSync('address'),
        obj: obj,
        time: wx.getStorageSync('wm').periods[0],
      })
    }
    setTimeout(function () {
      that.setData({
        loading: false
      })
    }, 500)
  },
  goshop: function (e) {
    wx.setStorage({
      key: 'sid',
      data: e.currentTarget.dataset.id,
    })
    wx.redirectTo({
      url: '../shop/shop?limit=' + e.currentTarget.dataset.limit,
    })
  },
  toggletime: function (e) {
    this.setData({
      showtime: !this.data.showtime
    });
  },
  timeclose:function(e){
    this.setData({
      showtime:!this.data.showtime
    })
  },
  filterTab:function(e){
    var data=wx.getStorageSync('wm');
    var index = e.currentTarget.dataset.index
    this.data.time =this.data.obj.periods[index];
    this.setData({
      active: index ,
      showtime: !this.data.showtime,
      time: this.data.time
    })
  },
  addDate:function(date, days) {
    if(days == undefined || days == '') {
      days = 1;
    }
    var date = new Date(date);
    date.setDate(date.getDate() + days);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return date.getFullYear() + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day);
  },
  getFormatDate:function(arg) {
    if (arg == undefined || arg == '') {
      return '';
    }

    var re = arg + '';
    if (re.length < 2) {
      re = '0' + re;
    }

    return re;
  },
  userNum:function(e){
    var num = Number(e.detail.value);
    this.setData({
      userNum: num
    })
  },
  remark: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  invoiceHead: function (e) {
    this.setData({
      invoiceHead: e.detail.value
    })
  },
  sub:function(){
    var addrId = wx.getStorageSync('wmaddr').id;
    var t=this.data;
    var sendTime = t.time+":00";
    console.log(sendTime);
    var obj = { list:t.obj.list};
    var json = JSON.stringify(obj);
    var that=this;
    if (typeof(that.data.time) == 'undefined'){
      config.tost('商家停止接单了');
      return;
    }else{    
    if(that.data.state=='1'){
      config.post("wxApi/wm/add", { addrId: addrId, remark: t.remark, jsonStr: json, sendTime: sendTime, invoiceHead: t.invoiceHead, userNum: t.userNum},function(ret){
      if(ret.code==0){
          that.setData({
            dcwc: true,
            state:'2',
            orderId: ret.msg
          })
          var sid=wx.getStorageSync("sid");
          wx.removeStorage({
            key: sid + 'wmNewmap',
          })
          wx.redirectTo({
            url: '../waimai/zf?id=' + that.data.orderId,
          })
      }else{
        config.tost(ret.msg);
      }
    },true)

    }
    }
  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  }
})