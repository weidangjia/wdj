import { post } from '../../config.js';
import { ossPath } from '../../config.js';

Page({
  data: {
    api: ossPath,
    background: ['blue', 'red', 'yellow'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1200,
    order: '',
    imgs: '',
    stores: '',
    store: '',
    lat: '',
    lng: '',
    state: '1',
    tabbar: {},
    sheight: 0,
    stype: 'down',
    order: ''
  },
  onLoad() {
    var that=this;
    // my.getAuthCode({
    //   scopes: 'auth_user',
    //   success: (res) => {
    //     console.log(res);
    //     my.alert({
    //       content: res.authCode,
    //     });
    //   },
    // });
    my.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight:res.windowHeight
        })
      }
    })
    this.getdata();
  },
  getdata: function (lat, lng) {
    // 页面加载
    var that = this;
    post("/wxApi/c/index", { lat: '31.811226', lng: '119.974062' }, function (ret) {

      if (ret.data.coupons.length > 0) {
        var sendInfo = {};
        sendInfo.couponCanGet = ret.data.couponCanGet;
        sendInfo.couponTotalPrice = ret.data.couponTotalPrice;
        sendInfo.coupons = ret.data.coupons;
        my.setStorageSync({
          key:'sendInfo',
          data:sendInfo
        });
        that.setData({
          sendInfo: sendInfo,
          sendShow: true
        })
      }
      if (ret.data.couponCanGet && ret.data.couponCanGet != '') {
        var old = my.getStorageSync({key:'couponCanGet'}).data;
        var now = ret.data.couponCanGet.split(',');
        if (old) {
          now.forEach(function (o, i) {

            if (old.indexOf(o) == -1 && !that.data.sendShow) {
              that.setData({
                robShow: true
              })
              return;
            }
          })

        } else {
          console.log(that.data.sendShow);
          if (!that.data.sendShow) {
            that.setData({
              robShow: true,
              stype: 'up'
            })
          }
        }
      }
      that.setData({
        couponCanGet: ret.data.couponCanGet,
        loading: false
      })
      my.setStorageSync({ key: 'couponCanGet', data: ret.data.couponCanGet });
      my.setStorage({
        key: 'logo',
        data: ret.data.hasSupport
      });
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
        my.setStorage({
          "key": "sid",
          "data": ret.data.store.id
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
      //停止下拉刷新
      my.stopPullDownRefresh()
    })

  },
  theme() {
    var that = this;
    post("/wxApi/c/theme", {}, function (ret) {
      if (ret.code == 0) {
        var btnArry = [];
        var alias = [];
        var num = ret.data.btnDc + ret.data.btnPd + ret.data.btnWm + ret.data.btnYd;
        //首页四个按钮
        var aliasPd = ret.data.aliasPd;
        var aliasYd = ret.data.aliasYd;
        var aliasWm = ret.data.aliasWm;
        var aliasDc = ret.data.aliasDc;
        var aliasQr = ret.data.aliasQr;
        if (aliasQr) {
          my.setStorageSync({ key: 'aliasQr', data: aliasQr });
        } else {
          my.removeStorageSync('aliasQr');
        }
        if (num == 3 && !ret.data.btnPd) {
          if (ret.data.btnYd == 1) {
            if (aliasYd != 1 && aliasYd) {
              that.setData({ aliasYd: aliasYd.substring(0, 4) });
              btnArry.push(aliasYd.substring(0, 4));
              alias.push(aliasYd);
            } else {
              btnArry.push('预定');
              alias.push('预定');
              that.setData({ aliasYd: '预定' });
            }
          } else {
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
          } else {
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
          } else {
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
          } else {
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
          } else {
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
          } else {
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
          } else {
            alias.push('排队');
          }
        }
        my.setStorageSync({ key: 'color', data: ret.data.color })
        my.setStorage({
          key: 'alias',
          data: alias,
        })
        my.setStorage({
          key: 'menuStyle',
          data: ret.data.menuStyle
        })
        if (!my.getStorageSync({ key: 'color' })) {
          my.setStorageSync({ key: 'color', data: 'blue' });
        }
        // config.navBarColor(my.getStorageSync('color'));
        that.setData({
          btnNum: ret.data.btnDc + ret.data.btnPd + ret.data.btnWm + ret.data.btnYd,
          btnArry: btnArry,
          color: my.getStorageSync({ key: 'color' }).data,
          btnHj: ret.data.btnHj
        })
      }
    }, true)
  },
  load: function (self) {
    // var that = self;
    // that.setData({
    //   loading: true
    // })
    // if(!my.getStorageSync('uid')){  //如果已经登录 设置监听授权信息 否则 不监听直接获取位置
    //   app.onauthorsuccess=function(){
    //     that.getdata('0', '0');
    //     that.load(self);
    //   }
    //   return;
    // }else{
    //   app.onauthorsuccess=undefined;
    // }
    // app.getaddress({
    //   successlocation:function(res){
    //     that.setData({
    //       lat: res.latitude,
    //       lng: res.longitude
    //     })
    //     that.setData({
    //       state: 1
    //     })
    //     that.getdata(that.data.lat, that.data.lng);
    //   }
    // })
  },
  up:function(){
    this.setData({
      stype:'up'
    })
  },
  down:function(){
    this.setData({
      stype: 'down'
    }) 
  },
  shutDown:function(){
    console.log(11);
    my.removeStorageSync({key:'sendInfo'});
    this.setData({
      sendShow:false
    })
  },
  shutDown1:function(){
    console.log(111);
    this.setData({
      robShow:false
    })
  },
  goyhq:function(){
    my.navigateTo({
      url: '../mypage/qyhq',
    })
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    this.theme();
  },
  onPullDownRefresh() {
    // 页面被下拉
    this.getdata();
  },
  goYd:function(){
    var that = this;
    if(that.data.muti == 0){

    } else {
      my.navigateTo({
          url: '../stores/stores?from=yd',
      })
    }
  },
  toMenu:function(){
    var that = this;
    console.log(that.data)
    var order = that.data.order;
    if(that.data.muti==0&&!order) {
    my.setStorageSync({
      key:'sid',
      data:that.data.store.id
    });
    my.navigateTo({
      url: '../shop/shop',
    })
    } else if (that.data.muti == 0 && !order){
      my.navigateTo({
        url: '../shop/shop?deskId='+order.deskId,
      })
    }else if (order && order.state != 3) {
        my.setStorageSync({
          key:'sid',
          'sid': order.storeId
        })
        if (order.state == 0) {
          my.navigateTo({
            url: '../stores/stores?from=dc',
          })
        } else {
          my.setStorageSync({
            key:'sid',
            data: order.storeId
          })
          my.navigateTo({
            url: '../shop/shop?deskId=' + order.deskId + '&deskCode=' + order.deskName
          })
        }
      }else{
        my.navigateTo({
          url: '../stores/stores?from=dc',
      })
    }
  },
  goPh:function(){
    my.navigateTo({
      url: '../index/mdxz',
    })
  },
})