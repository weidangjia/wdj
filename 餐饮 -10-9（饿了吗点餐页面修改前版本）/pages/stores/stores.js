var config = require("../../config.js");
var QQMapWX = require("../../qqmap-wx-jssdk.min.js");
var qqmapsdk;
Page({
  data: {
    Path:config.resPath,
    api: config.apiPath,
    geoCity: "",
    nowCity: { title: '', code: '' },
    stores:'',
    index: 0,
    froms:'',
    citys:[],
    allct:'',
    loading: true
  },
  onLoad: function (options){
    var that=this;
    var ct=[];
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    that.setData({
      froms:options.from,
      color: wx.getStorageSync('color')
    })
    config.post("/wxApi/c/citys", {}, function (ret) {
      if (ret.code == 0) {
        if (ret.data.length > 0) {
          for (var i = 0; i < ret.data.length; i++) {
            ct.push(ret.data[i].title);
          }
          that.setData({
            citys: ct,
            allct:ret.data
          })
          if (that.data.nowCity.code == '') {
            that.setData({
              nowCity: ret.data[0],
              geoCity: ret.data[0].title
            })
          }
        }
        setTimeout(function () {
          that.setData({
            loading: false
          })
        }, 500)
        that.load();
      }
    },true);  
  },
  load:function(){
    var that=this;
    config.post("/wxApi/c/stores", { lat: wx.getStorageSync('lat'), lng: wx.getStorageSync('lng'), cityCode: that.data.nowCity.code }, function (ret) {
      if (ret.code == 0) {
        that.data.stores = ret.data;
        that.setData({
          stores: ret.data
        })
      } else {
        config.tost(ret.msg);
      }
    },true);
    that.setData({
      address: wx.getStorageSync('address')
    })
  },
  open: function () {
    var that = this;
      wx.showActionSheet({
        itemList: that.data.citys,
        success: function (res) {
          if (!res.cancel) {
            that.setData({
              geoCity: that.data.citys[res.tapIndex],
              nowCity: that.data.allct[res.tapIndex]
            })
            that.load();
          }
        }
      });
  },
  refresh:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var lat, lng;
    qqmapsdk = new QQMapWX({
      key: 'YWZBZ-5MFCP-WRSDO-LAWMH-GFZRT-WUFST'
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.hideLoading();
        lat = res.latitude
        lng = res.longitude
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: lat,
            longitude: lng
          },
          success: function (res) {
            wx.setStorageSync('address', res.result.address);
            wx.setStorageSync('city', res.result.address_component.city);
            wx.setStorageSync('lat', lat);
            wx.setStorageSync('lng', lng);
            that.load();
          },
        }); 
      }
    })
  },
  toStore:function(id){
    wx.navigateTo({
      url: '../index/mdxq?id='+id,
    })
  },
  selectStore:function(e){
    var that = this;
    var id = e.currentTarget.dataset.obj.id; 
    if (that.data.froms == 'yd') {
      wx.setStorageSync('sid', id);
      wx.navigateTo({
        url: '../index/ydwz',
      })
    } else if (that.data.froms == 'dc') {
      wx.setStorageSync('sid', id);
      wx.navigateTo({
        url: '../shop/shop',
      })
    } else {
      that.toStore(id);
    }
  },
  onShareAppMessage: function (res) {

  }
})