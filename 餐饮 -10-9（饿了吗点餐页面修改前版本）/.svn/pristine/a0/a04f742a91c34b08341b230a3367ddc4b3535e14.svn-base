var config = require("../../config.js");
var QQMapWX = require("../../qqmap-wx-jssdk.min.js");
var qqmapsdk;
var app=getApp();
Page({
  data: {
    Path: config.resPath,
    api: config.apiPath,
    geoCity: "",
    nowCity: { title: '', code: '' },
    path:{},
    stores: [],
    store:[],
    qid:'',
    sliding:false,
    city:[],
    citys:[],
    loading:true
  },
  onShow:function(){
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    this.setData({
      Path: config.resPath,
      api: config.apiPath,
      address: wx.getStorageSync('address'),
      color: wx.getStorageSync('color')
    })
    this.citys();
  },
  citys:function(){
    var that=this;
    var city = that.data.city;
    //获取城市信息
    config.post("/wxApi/c/citys", {}, function (ret) {
      if (ret.code == 0) {
        that.setData({
          citys:ret.data
        })
        if (ret.data.length > 0&&city=='') {
          ret.data.forEach(function (o, i) {          
              city.push(o.title);
          });
          if (that.data.nowCity.code == '') {
            that.data.nowCity = ret.data[0];
            that.setData({
              nowCity: ret.data[0],
              geoCity: ret.data[0].title
            })
          that.onLoad();
          }
        }        
      }
    },true);
  },
 onLoad:function(){
   var that=this;
   //门店列表信息
   config.post("/wxApi/q/pdStores", { lat:wx.getStorageSync('lat'), lng: wx.getStorageSync('lng'), cityCode:that.data.nowCity.code }, function (ret) {
     if (ret.code == 0) {
       that.setData({
         stores:ret.data
       })
     } else if (ret.code == -1) {
       that.load(ret.msg);
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
  open: function () {
    var that = this;
    wx.showActionSheet({
      itemList: that.data.city,
      success: function (res) {
        if (!res.cancel) {
          // console.log(res.tapIndex)
          that.setData({
            geoCity: that.data.city[res.tapIndex],
            nowCity:that.data.citys[res.tapIndex],
          })
          that.onLoad();
        }
      }
    });
  },
  refresh: function () {
    //地址刷新
    var that = this;
    var lat, lng;
    wx.showLoading({
      title: '加载中',
    })
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
          },
        });
      }
    })
  },  
  lineUp:function(e){
    //排队接口调用
    var that=this;
    var index = e.currentTarget.dataset.index;
    var num=[];
    var queues= that.data.stores[index].queues;
    for (var i = 0; i < queues.length;i++){
      num.push(queues[i].min+'~'+queues[i].max+'人');
    }
    wx.showActionSheet({
      itemList: num,
      success: function (res) {
        if (!res.cancel) {
          config.formid(e.detail.formId);
          config.post("/wxApi/q/addQueue", { storeId: that.data.stores[index].id, groupCode: queues[res.tapIndex].groupCode }, function (ret) {
            wx.setStorage({
              key: 'sid',
              data: that.data.stores[index].id,
            })
            if (ret.code == 0) {
              that.load(ret.msg)
            } else {
              config.tost(ret.msg);
            }
          },true);
        }
      }
    });
  },
  load:function(id){
    var that = this;
    that.setData({
      sliding:true
    })
    //排队按钮调用
    config.post("/wxApi/q/queueInfo", { id: id }, function (ret) {
      if (ret.code == 0) {
        that.setData({
          stroe:ret.data
        })
        that.data.qid = id;
      } else {
        config.tost(ret.msg);
      }
    },true);
  },
  cancel:function(){
    var that=this;
    wx.showModal({
      content: '确定要取消排队吗？',
      success: function (res) {
        if (res.confirm) {
          config.post("/wxApi/q/cancel", { id:that.data.qid }, function (ret) {
            if (ret.code == 0) {
              wx.redirectTo({
                url: '../index/mdxz',
              })
            } else {
              config.tost(ret.msg);
            }
          }, true);
        }
      }
    })
  },
  toMenu:function(){
    wx.navigateTo({
      url: '../shop/shop?from=queue&storeId='+this.data.stroe.id,
    })
  },
  onShareAppMessage: function (res) {
  }
})