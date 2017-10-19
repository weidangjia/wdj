// pages/index/zf.js
var config = require("../../config.js");
var id;
Page({
  data:{
    Path: config.resPath,
    api: config.apiPath,
    faslid:false,
    rad:false,
    liselec:-1,
    lishow:false,
    disshow:false,
    orderId:'',
    order:'',
    djList:'',
    mjList:'',
    types:'1',
    fainfo:'',
    state:'1',
    loading:true
  },
  onLoad: function (options){
    var that = this;
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    if(options.id){
    that.data.orderId=options.id;
    that.setData({
      orderId: options.id
    })   
    }
    that.setData({
      color:wx.getStorageSync('color')
    })
  },
  onShow: function (){
    var that=this; 
    //支付订单信息
    config.post("/wxApi/o/payInfo", { id: that.data.orderId }, function (ret) {
      console.log(ret);
      if (ret.code == 0) {
        that.setData({
          order: ret.data
        })
        if (ret.data.unionPay != 1 && ret.data.wxPay == 1 && ret.data.aliPay != 1 && ret.data.sytPay != 1 && ret.data.qrPay!=1){
          that.data.order.way=4;
          that.setData({ Seleted: 4, order: that.data.order});
        } else if (ret.data.unionPay != 1 && ret.data.wxPay == 0 && ret.data.aliPay != 1 && ret.data.sytPay != 1 && ret.data.qrPay != 1){
          that.data.order.way = 6;
          that.setData({ Seleted: 6, order: that.data.order });
        }
        wx.setStorageSync('sid', ret.data.storeId);
      }
      else if (ret.code == -1) {
        config.alert(ret.msg);
        // wx.redirectTo({
        //   url: '../index/wddd',
        // })
      } else {
        config.tost(ret.msg);
      }
      setTimeout(function () {
        that.setData({
          loading: false
        })
      }, 500)
    },true);
  },
  	faslid:function(){
		this.setData({
			faslid:!this.data.faslid
		})
	},
  goDj:function(){
    wx.setStorageSync('order',this.data.order);
    wx.navigateTo({
      url: '../index/djq?id=' + this.data.orderId,
    })
  },
  goMj:function(){
    wx.setStorageSync('order', this.data.order);
    wx.navigateTo ({
      url: '../index/mjq?id=' + this.data.orderId,
    })
  },
  faback:function(){
    this.data.order.invoiceHead='';
    this.setData({
      faslid: !this.data.faslid,
      order:this.data.order
    })
  },
  fpcom:function(){
    this.data.order.invoiceHead = this.data.fainfo;
    this.setData({
      faslid: !this.data.faslid,
      order: this.data.order
    })
  },
  goBack:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  lishow:function(){
    this.setData({
      lishow:!this.data.lishow
    })
  },
  liback:function(){
    this.setData({
      lishow:false,
      disshow:false
    })
  },
  invoiceHead:function(e){
    this.setData({
      fainfo: e.detail.value
    })
  },
  confirm:function(){
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
      order:this.data.order
    });
  },
  pay:function(e){
    var that= this;
    if (that.data.order.way == 0) {
      config.tost("请选择支付方式");
      return;
    }

    if (that.data.order.way == 1) {
      if(that.data.state==1){
      config.post("/wxApi/o/payByQr", { id: that.data.orderId }, function (ret) {
        config.formid(e.detail.formId);
        if (ret.code == 0) {
          wx.redirectTo({
            url: '../index/zf-sm',
          })
        } else {
          config.tost(ret.msg);
        }
      });
      that.setData({
        state:'2'
      },true)
      }
    } else if (that.data.order.way == 2) {
      wx.redirectTo({
          url: '../index/zf-syd?deskCode='+that.data.order.deskCode,
        })
    }else if(that.data.order.way == 4){//微信
      config.post('wxApi/xcx/payByWx', { id: that.data.orderId },function(ret){
        config.formid(e.detail.formId);
        if(ret.code==0){
          wx.requestPayment({
            'timeStamp':ret.data.timeStamp,
            'nonceStr': ret.data.nonceStr,
            'package': ret.data.package,
            'signType': ret.data.signType,
            'paySign': ret.data.paySign,
            'success': function (res) {
              config.tost("支付成功");
              wx.redirectTo({
                url: '../index/ddxq?id=' + that.data.orderId,
              })
            },            
          })
        }
      },true)
    }else if(that.data.order.way==6){
      config.post('wxApi/s/addService', { deskId: that.data.order.deskId, type: '其他' }, function (ret) {
        if (ret.code != 0) {
          config.tost(ret.msg);
          setTimeout(function(){
            wx.redirectTo({
              url: '../index/ddxq?id=' + that.data.orderId,
            })
          },3000)          
        }
      }, true)
    }
  }
})