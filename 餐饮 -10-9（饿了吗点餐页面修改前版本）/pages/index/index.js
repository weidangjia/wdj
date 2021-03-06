var config = require("../../config.js");
var QQMapWX = require("../../qqmap-wx-jssdk.min.js");
var WxParse = require('../../wxParse/wxParse.js')
var qqmapsdk;
var app = getApp();
Page({
    data: {
        path:config.resPath,
        api: config.apiPath,
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 1200,
        order:'',
        imgs:'',
        stores:'',
        store: '',
        lat:'',
        lng:'',
        getSrc: config.getSrc,
        state:'1',
        tabbar: {},
        sheight:0,
        stype:'down'
    },
    onLoad: function (q) {
      if (q.q) {
        var q = q.q.split('_')[1];
        //扫码进入传参
        config.post("/wxApi/d/getXcxDesk", { id: q }, function (ret) {
          if (ret.code == 0) {            
            wx.navigateTo({
              url: '../shop/shop?storeId=' + ret.data.storeId + '&deskId=' + ret.data.id + '&deskCode=' + ret.data.code
            })
          } else {
            config.tost(ret.msg);
          }
        },true);
      }
      this.setData({
        order:''
      })
      
    },
    onHide:function(){
      this.setData({
        robShow:false,
        sendShow:false
      })
    },
    onShow:function(){  
      var minute = (new Date()).getMinutes(); 
      //首页数据五分钟刷新一次   
      if (wx.getStorageSync('minute')){
        var oldminute = wx.getStorageSync('minute');
        if (minute - oldminute>=5){
          wx.setStorageSync('minute', minute)
          this.load(this);
        }
      }else{
        wx.setStorageSync('minute', minute)
        this.load(this);
      }
      //根据经纬度获取首页数据
      if (wx.getStorageSync('lat')){
        let lat=wx.getStorageSync('lat');
        let lng = wx.getStorageSync('lng')
        this.getdata(lat,lng);
      }else{
        this.getdata('0','0');
        this.setData({
          state:0
        })
      }           
      this.setData({
        logo: wx.getStorageSync('logo')
      })
      //首页按钮
      this.theme();
    },
    theme: function () {
      var that = this;
      config.post("/wxApi/c/theme", {}, function (ret) {
        if (ret.code == 0) {
          var btnArry = [];
          var alias=[];
          var num = ret.data.btnDc + ret.data.btnPd + ret.data.btnWm + ret.data.btnYd;
          //首页四个按钮
          var aliasPd = ret.data.aliasPd;
          var aliasYd = ret.data.aliasYd;
          var aliasWm = ret.data.aliasWm;
          var aliasDc = ret.data.aliasDc;
          var aliasQr = ret.data.aliasQr;
          if (aliasQr){
            wx.setStorageSync('aliasQr', aliasQr);
          }else{
            wx.removeStorageSync('aliasQr');
          }
          if (num == 3 && !ret.data.btnPd) {
            if (ret.data.btnYd == 1) {
              if (aliasYd != 1 && aliasYd){
                that.setData({ aliasYd: aliasYd.substring(0, 4)});
                btnArry.push(aliasYd.substring(0, 4));
                alias.push(aliasYd);
              }else{
                btnArry.push('预定');
                alias.push('预定');
                that.setData({ aliasYd: '预定' });                
              }
            }else{
              alias.push('预定');
            }
            if (ret.data.btnDc == 1) {
              if (aliasDc != 1 && aliasDc) {
                that.setData({ aliasDc: aliasDc.substring(0, 4) });
                btnArry.push(aliasDc.substring(0, 4));
                alias.push(aliasDc);
              } else {
                that.setData({ aliasDc: '点餐' });
                btnArry.push('点餐');
                alias.push('点餐');
              }
            }else{
              alias.push('点餐');
            }
            if (ret.data.btnWm == 1) {
              if (aliasWm != 1 && aliasWm) {
                that.setData({ aliasWm: aliasWm.substring(0, 4) });
                btnArry.push(aliasWm.substring(0, 4));
                alias.push(aliasWm);
              } else {
                that.setData({ aliasWm: '外卖' });
                btnArry.push('外卖');
                alias.push('外卖'); 
              }
            }else{
              alias.push('外卖');              
            }
          } else {
            if (ret.data.btnYd == 1) {
              if (aliasYd != 1 && aliasYd) {
                that.setData({ aliasYd: aliasYd.substring(0, 4) });
                btnArry.push(aliasYd.substring(0, 4));
                alias.push(aliasYd);
              } else {
                that.setData({ aliasYd: '预定' });
                btnArry.push('预定');
                alias.push('预定');
              }
            }else{
              alias.push('预定');
            }
            if (ret.data.btnDc == 1) {
              if (aliasDc != 1 && aliasDc) {
                that.setData({ aliasDc: aliasDc.substring(0, 2) });
                btnArry.push(aliasDc.substring(0, 2));
                alias.push(aliasDc);
              } else {
                that.setData({ aliasDc: '点餐' });
                btnArry.push('点餐');
                alias.push('点餐'); 
              }
            }else{
              alias.push('点餐');              
            }
            if (ret.data.btnWm == 1) {
              if (aliasWm != 1 && aliasWm) {
                that.setData({ aliasWm: aliasWm.substring(0, 4) });
                btnArry.push(aliasWm.substring(0, 4));
                alias.push(aliasWm);
              } else {
                that.setData({ aliasWm: '外卖' });
                btnArry.push('外卖');
                alias.push('外卖'); 
              }
            }else{
              alias.push('外卖');              
            }
            if (ret.data.btnPd == 1) {
              if (aliasPd != 1 && aliasPd) {
                that.setData({ aliasPd: aliasPd.substring(0, 4) });
                btnArry.push(aliasPd.substring(0, 4));
                alias.push(aliasPd);
              } else {
                that.setData({ aliasPd: '排队' });
                btnArry.push('排队');
                alias.push('排队');
              }
            }else{
              alias.push('排队');
            }           
          }
          wx.setStorageSync('color', ret.data.color)
          wx.setStorage({
            key: 'alias',
            data: alias,
          })
          wx.setStorage({
            key: 'menuStyle',
            data: ret.data.menuStyle
          })
          if (!wx.getStorageSync('color')) {
            wx.setStorageSync('color', 'blue');
          }
          config.navBarColor(wx.getStorageSync('color'));
          that.setData({
            btnNum: ret.data.btnDc + ret.data.btnPd + ret.data.btnWm + ret.data.btnYd,
            btnArry: btnArry,
            color: wx.getStorageSync('color'),
            btnHj: ret.data.btnHj
          })
        }
      },true)
    },
    getdata:function(lat,lng){
      var that = this;
      if(that.data.state=='1'){
        that.setData({
          state:'2'
        })
      }    
      if(!wx.getStorageSync('uid')) return;
        config.post('wxApi/c/index', { lat: lat, lng: lng }, function (ret) {

          //优惠券
          if (ret.data.coupons.length>0){
            var sendInfo={};
            sendInfo.couponCanGet = ret.data.couponCanGet;
            sendInfo.couponTotalPrice = ret.data.couponTotalPrice;
            sendInfo.coupons = ret.data.coupons;
            wx.setStorageSync('sendInfo', sendInfo);
            that.setData({
              sendInfo: sendInfo,
              sendShow: true
            })
          }           
          if (ret.data.couponCanGet && ret.data.couponCanGet!=''){
            var old = wx.getStorageSync('couponCanGet');                     
            var now = ret.data.couponCanGet.split(',');
            if (old) {
              now.forEach(function(o,i){
                if (old.indexOf(o) == -1 && !that.data.sendShow){
                  that.setData({
                    robShow:true                    
                  })
                  return;
                }
              })
              
            }else{
              if (!that.data.sendShow){
                that.setData({
                  robShow: true,
                  stype: 'up'
                })
              }              
            }       
          }
          that.setData({
            couponCanGet: ret.data.couponCanGet,
            loading:false
          })
          wx.setStorageSync('couponCanGet', ret.data.couponCanGet); 
          //技术支持图片
          if (ret.data.supportImg) {
            that.setData({ supportImg: ret.data.supportImg })
            wx.setStorage({
              key: 'supportImg',
              data: ret.data.supportImg,
            })
          }
          wx.setStorage({
            key: 'logo',
            data: ret.data.hasSupport,
          })
          that.setData({
            logo: ret.data.hasSupport,
            cname: ret.data.cname,
          });
          if (ret.data.imgs.length > 0) {
            that.data.imgs = ret.data.imgs.split(",");
          } else {
            that.data.imgs = '';
          }
          if (ret.code == 0 && ret.data.muti == 1) {
            var order = ret.data.order;
            that.setData({
              muti: ret.data.muti
            })
            
            if (!order) {
              that.setData({
                stores: ret.data.stores,
                imgs: that.data.imgs,
                order: '',
              })
            } else {
              that.setData({
                order: ret.data.order,
                stores: ret.data.stores,
                imgs: that.data.imgs,
              })
            }
          //单门店
          } else if (ret.data.muti == 0) {
            wx.setStorage({
              "key":"sid",
              "data":ret.data.store.id
            })
            var order = ret.data.order;
            that.setData({
              muti: ret.data.muti
            })
            if (!order) {
              that.setData({
                store: ret.data.store,
                imgs: that.data.imgs,
                order: ''
              })
            } else {
              that.setData({
                order: ret.data.order,
                store: ret.data.store,
                imgs: that.data.imgs,
              })
            }
          }
          WxParse.wxParse('remark', 'html', that.data.store.remark, that, 5);
          setTimeout(function(){
            wx.hideNavigationBarLoading(); 
          },800)          
        },true)  

    },
    load:function(self){
      var that = self;
      that.setData({
        loading: true
      })
      if(!wx.getStorageSync('uid')){  //如果已经登录 设置监听授权信息 否则 不监听直接获取位置
        app.onauthorsuccess=function(){
          that.getdata('0', '0');
          that.load(self);
        }
        return;
      }else{
        app.onauthorsuccess=undefined;
      }
      app.getaddress({
        successlocation:function(res){
          that.setData({
            lat: res.latitude,
            lng: res.longitude
          })
          that.setData({
            state: 1
          })
          that.getdata(that.data.lat, that.data.lng);
        }
      })
    },
    changeIndicatorDots: function (e) {
        this.setData({
            indicatorDots: !this.data.indicatorDots
        })
    },
    changeVertical: function (e) {
        this.setData({
            vertical: !this.data.vertical
        })
    },
    changeAutoplay: function (e) {
        this.setData({
            autoplay: !this.data.autoplay
        })
    },
    intervalChange: function (e) {
        this.setData({
            interval: e.detail.value
        })
    },
    durationChange: function (e) {
        this.setData({
            duration: e.detail.value
        })
    },
    toMenu:function(){
      var that = this;
      var order = that.data.order;
      if(that.data.muti==0&&!order) {
      wx.setStorageSync('sid', that.data.store.id);
      wx.navigateTo({
        url: '../shop/shop',
      })
      } else if (that.data.muti == 0 && !order){
        wx.navigateTo({
          url: '../shop/shop?deskId='+order.deskId,
        })
    }else if (order && order.state != 3) {
        wx.setStorageSync('sid', order.storeId)
        if (order.state == 0) {
          wx.navigateTo({
            url: '../stores/stores?from=dc',
          })
        } else {
          wx.setStorageSync('sid', order.storeId)
          wx.navigateTo({
            url: '../shop/shop?deskId=' + order.deskId + '&deskCode=' + order.deskName
          })
        }
      }else{
        wx.navigateTo({
          url: '../stores/stores?from=dc',
        })
      }
    },
    goYd:function(){
      if(this.data.muti==0){   
      wx.setStorageSync('sid',this.data.store.id)  
      wx.navigateTo({
        url: '../index/ydwz'
      })
      }else{
        wx.navigateTo({
          url: '../stores/stores?from=yd',
        })
      }
    },
    goPh:function(){
      wx.navigateTo({
        url: '../index/mdxz',
      })
    },
    goMdxq:function(e){
      var id = e.currentTarget.dataset.id;
      var order=this.data.order;
      if(order){
        wx.navigateTo({
          url: '../index/mdxq?id=' + id + "&deskId=" + order.deskId + "&storeId=" + order.storeId,
        })
      }else{
        wx.navigateTo({
          url: '../index/mdxq?id=' + id
        })
      }
    },
    goNext:function(e){
      var text = e.currentTarget.dataset.text;
      var s=this.data;
      if (text == s.aliasDc){
        this.toMenu();
      } else if (text == s.aliasYd){
        this.goYd();
      } else if (text == s.aliasPd){
        this.goPh();
      } else if (text == s.aliasWm){
        this.takeOut();
      }
    },
    takeOut:function(){
      var that=this;
      if(that.data.muti==0){
        wx.navigateTo({
          url: '../shop/shop?isWm=1',
        })
      }else{
        wx.navigateTo({
          url: '../waimai/dplb'
        })
      }      
    },
  onShareAppMessage: function (res) {      
  },
  loaction: function (e) {
    var obj = e.currentTarget.dataset.data;
    wx.openLocation({
      latitude: Number(obj.lat),
      longitude: Number(obj.lng),
      name: obj.title,
      address: obj.address,
    })
  },
  phone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },

  //抢优惠券
  // scroll:function(e){
  //   var data=this.data;
  //   var h = e.detail.scrollTop+100;
  //   if (h<data.sheight){
  //     this.setData({
  //       stype:'up'
  //     })
  //   }else{
  //     this.setData({
  //       stype:'down'
  //     })
  //   }
  //   this.setData({
  //     sheight:h
  //   })
  // },
  up:function(){
    this.setData({
      stype:'up'
    })
    
  },
  // move:function(){
  //   if(this.data.stype=='up'){
  //     wx.showNavigationBarLoading();
  //     if (wx.getStorageSync('lat')) {
  //       let lat = wx.getStorageSync('lat');
  //       let lng = wx.getStorageSync('lng')
  //       this.getdata(lat, lng);
  //     }
  //   }    
  // },
  down:function(){
    this.setData({
      stype: 'down'
    }) 
  },
  shutDown:function(){
    wx.removeStorageSync('sendInfo');
    this.setData({
      sendShow:false
    })
  },
  shutDown1:function(){
    this.setData({
      robShow:false
    })
  },
  goyhq:function(){
    wx.navigateTo({
      url: '../mypage/qyhq',
    })
  }
})
