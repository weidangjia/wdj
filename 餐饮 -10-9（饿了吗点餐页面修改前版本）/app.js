var config = require("config.js");
var QQMapWX = require("qqmap-wx-jssdk.min.js");
var qqmapsdk;
App({
  onauthorsuccess:undefined,
  //资源服务器路径
  onLaunch: function () {
    if (!wx.getStorageSync('verson') || wx.getStorageSync('verson') != config.verson){
      wx.clearStorage();
    }
    wx.setStorage({
      key: 'verson',
      data: config.verson,
    })
    //调用API从本地缓存中获取数据
    this.appauthorize();
  },
  appauthorize: function (onauthorl){
    var that = this;
    wx.authorize({
      scope: 'scope.userInfo',
      success() {
        //获取用户信息
        userInfo();
      },
      fail() {
        wx.showModal({
          title: '登录',
          content: '该程序必须授权才能使用！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              author();
            }
          }
        })
      }
    })
    //再次授权
    function author() {
      wx.openSetting({
        success: function (res) {
          var authors = res.authSetting["scope.userInfo"];
          if (authors) {
            userInfo();
            wx.setStorageSync('author', "true");
          } else if (!authors) {
            wx.showModal({
              title: '登录',
              content: '该程序必须授权才能使用！',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  author();
                }
              }
            })
          }
        }
      });
    }
    //获取用户信息
    function userInfo() {
      //获取用户登录状态
      wx.login({
        success: function (r) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.iv = res.iv;
              that.globalData.encryptedData = res.encryptedData;
              that.globalData.userInfo = res.userInfo;
              wx.setStorage({
                key: "userInfo",
                data: res.userInfo
              })
              typeof cb == "function" && cb(that.globalData.userInfo)
              if (r.code) {
                //登录
                wx.setStorageSync('code', r.code);
                config.post('wxApi/xcx/login', {
                  encryptedData: that.globalData.encryptedData,
                  iv: that.globalData.iv,
                  code: r.code
                }, function (ret) {
                  if (ret.code == 0) {
                    wx.setStorageSync('uid', ret.data.id);
                    wx.setStorage({
                      key: "openid",
                      data: ret.data.xcxOpenId
                    })
                    if (that.onauthorsuccess) {
                      that.onauthorsuccess();
                    }
                    if (onauthorl){
                      onauthorl();
                    }
                  }
                }, true)
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
                wx.clearStorage();
              }
            }
          })
        }
      })
    }
  },
  // editTabBar: function () {
  //   var tabbar = this.globalData.tabbar,
  //       currentPages = getCurrentPages(),
  //       _this = currentPages[currentPages.length - 1],
  //       pagePath = _this.__route__,
  //       color='green';
  //   if (color=='blue'){
  //     tabbar.selectedColor ='#3f74ec';
  //     tabbar.list[0].selectedIconPath = "https://img.zhcanting.com/res/xcx/images/bluesfooter1_h.png";
  //     tabbar.list[1].selectedIconPath = "https://img.zhcanting.com/res/xcx/images/bluesaom.png";
  //     tabbar.list[2].selectedIconPath = "https://img.zhcanting.com/res/xcx/images/bluesfooter3_h.png";
  //   } else if (color == 'gray') {
  //     tabbar.selectedColor = '#303030';
  //     tabbar.list[0].selectedIconPath = "https://img.zhcanting.com/res/xcx/images/graysfooter1_h.png";
  //     tabbar.list[1].selectedIconPath = "https://img.zhcanting.com/res/xcx/images/graysaom.png";
  //     tabbar.list[2].selectedIconPath = "https://img.zhcanting.com/res/xcx/images/graysfooter3_h.png";
  //   }else{
  //     tabbar.selectedColor = '#1ebda7';
  //     tabbar.list[0].selectedIconPath = "https://img.zhcanting.com/res/xcx/images/greensfooter1_h.png";
  //     tabbar.list[1].selectedIconPath = "https://img.zhcanting.com/res/xcx/images/greensaom.png";
  //     tabbar.list[2].selectedIconPath = "https://img.zhcanting.com/res/xcx/images/greensfooter3_h.png";
  //   }
  //   (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
  //   for (var i in tabbar.list) {
  //     tabbar.list[i].selected = false;
  //     (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
  //   }
  //   _this.setData({
  //     tabbar: tabbar
  //   });
  // },
  globalData: {
    // tabbar: {
    //   color: "#999",
    //   selectedColor: "#0f87ff",
    //   backgroundColor: "#ffffff",
    //   borderStyle: "black",
    //   list: [
    //     {
    //       pagePath: "/pages/index/index",
    //       text: "首页",
    //       iconPath: "/images/sfooter1_n.png",
    //       selectedIconPath: "/images/sfooter1_h.png",
    //       selected: true
    //     },
    //     {
    //       pagePath: "/pages/index/smdc",
    //       text: "点餐",
    //       iconPath: "/images/saom_n.png",
    //       selectedIconPath: "/images/saom.png",
    //       selected: false
    //     },
    //     {
    //       pagePath: "/pages/mypage/mypage",
    //       text: "我的",
    //       iconPath: "/images/sfooter3_n.png",
    //       selectedIconPath: "/images/sfooter3_h.png",
    //       selected: false
    //     }
    //   ],
    //   position: "bottom"
    // }
  },
  getaddress:function (addressListener) {
    qqmapsdk = new QQMapWX({
      key: 'YWZBZ-5MFCP-WRSDO-LAWMH-GFZRT-WUFST'
    });
    //经纬度
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        wx.setStorageSync('lat', res.latitude);
        wx.setStorageSync('lng', res.longitude);
        if (addressListener.successlocation) {  //回调定位成功方法
          addressListener.successlocation(res)
        }
        
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function (res) {
              wx.setStorageSync('address', res.result.address);
              wx.setStorageSync('cityCode', res.result.ad_info.adcode);
              wx.setStorageSync('city', res.result.address_component.city);
              if (addressListener.successgeocoder) {
              addressListener.successgeocoder(res)
              }
            },
          });
        
      },
      fail: function () {
        wx.setStorage({
          key: 'lat',
          data: '0',
        });
        wx.setStorage({
          key: 'lng',
          data: '0',
        });
        addressListener.successlocation({ latitude: 0, longitude: 0, speed: 0, accuracy: 0 })
      }
    })
  }
})