import { post } from '../../config.js';
import { ossPath} from '../../config.js';

Page({
  data: {
    api:ossPath, 
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
    order:''
  },
  onLoad() {
    console.log(this.data.api);
    // 页面加载
    var that=this;
    post("/wxApi/c/index", { lat: '31.811226', lng: '119.974062' }, function (ret) {
      
      //优惠券
      that.setData({
        order: ret.data.order,
        store: ret.data.store,
        imgs: that.data.imgs,
      })
      if (ret.data.coupons.length > 0) {
        var sendInfo = {};
        sendInfo.couponCanGet = ret.data.couponCanGet;
        sendInfo.couponTotalPrice = ret.data.couponTotalPrice;
        sendInfo.coupons = ret.data.coupons;
        my.setStorageSync('sendInfo', sendInfo);
        that.setData({
          sendInfo: sendInfo,
          sendShow: true
        })
      }
      if (ret.data.couponCanGet && ret.data.couponCanGet != '') {
        var old = my.getStorageSync('couponCanGet');
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
        console.log(that.data.muti);

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
    })

  },
  theme () {
      var that = this;
      post("/wxApi/c/theme", {}, function (ret) {
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
            my.setStorageSync({key:'aliasQr',data:aliasQr} );
          }else{
            my.removeStorageSync('aliasQr');
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
          my.setStorageSync({key:'color',data:ret.data.color})
          my.setStorage({
            key: 'alias',
            data: alias,
          })
          my.setStorage({
            key: 'menuStyle',
            data: ret.data.menuStyle
          })
          if (!my.getStorageSync({key:'color'})) {
            my.setStorageSync({key:'color',data:'blue'});
          }
          // config.navBarColor(my.getStorageSync('color'));
          that.setData({
            btnNum: ret.data.btnDc + ret.data.btnPd + ret.data.btnWm + ret.data.btnYd,
            btnArry: btnArry,
            color: my.getStorageSync({key:'color'}).data,
            btnHj: ret.data.btnHj
          })
        }
      },true)
    },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    this.theme()
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
  },
})