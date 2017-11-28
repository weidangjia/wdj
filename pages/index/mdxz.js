
var config = require("../../config.js");
var app = getApp();
Page({
  data: {
    Path: config.apiPath,
    api: config.ossPath,
    geoCity: "",
    nowCity: { title: '', code: '' },
    path: {},
    stores: [],
    store: [],
    qid: '',
    sliding: false,
    city: [],
    citys: [],
    loading: true
  },
  onShow: function () {
    if (!my.getStorageSync({ key: "color" }).data) {
      my.setStorageSync({
        key: "color",
        data: 'blue'
      });
    }
    config.navBarColor(my.getStorageSync({ key: 'color' }).data);
    this.setData({
      Path: config.apiPath,
      api: config.ossPath,
      address: my.getStorageSync({ key: "address" }).data,
      color: my.getStorageSync({ key: "color" }).data
    })
    this.citys();
  },
  citys: function () {
    var that = this;
    var city = that.data.city;
    //获取城市信息
    config.post("/wxApi/c/citys", {}, function (ret) {
      if (ret.code == 0) {
        that.setData({
          citys: ret.data
        })
        if (ret.data.length > 0 && city == '') {
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
            console.log(that.data)
          }
        }
      }
    }, true);
  },
  onLoad: function () {
    var that = this;
    //门店列表信息
    config.post("/wxApi/q/pdStores", { lat: my.getStorageSync({ key: 'lat' }).data, lng: my.getStorageSync({ key: 'lng' }).data, cityCode: that.data.nowCity.code }, function (ret) {

      if (ret.code == 0) {
        that.setData({
          stores: ret.data
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
    }, true);
  },
  open: function () {
    var that = this;
    my.showActionSheet({
      items: that.data.city,
      success: function (res) {
        console.log(res);
        if (!res.cancel) {
          that.setData({
            geoCity: that.data.city[res.index],
            nowCity: that.data.citys[res.index],
          })
          if (res.index != -1){
            that.onLoad();
          }
        }
      }
    });
  },
  refresh: function () {
    //地址刷新
    var that = this;
    var lat, lng;
    my.showToast({
      type: 'success',
      content: '刷新成功',
      duration: 2000,
    });
    my.getLocation({
      type: 'wgs84',
      success: function (res) {
        lat = res.latitude
        lng = res.longitude
        my.setStorageSync({ key: 'lat', data: lat });
        my.setStorageSync({ key: 'lng', data: lng });
      }
    })
    that.onLoad();
  },
  lineUp: function (e) {
    //排队接口调用
    var that = this;
    var index = e.currentTarget.dataset.index;
    var num = [];
    var queues = that.data.stores[index].queues;
    for (var i = 0; i < queues.length; i++) {
      num.push(queues[i].min + '~' + queues[i].max + '人');
    }
    my.showActionSheet({
      items: num,
      success: function (res) {
        if (res.index != -1) {
          config.formid(e.detail.formId);
          config.post("/wxApi/q/addQueue", { storeId: that.data.stores[index].id, groupCode: queues[res.index].groupCode }, function (ret) {
            my.setStorage({
              key: 'sid',
              data: that.data.stores[index].id,
            })
            if (ret.code == 0) {
              that.load(ret.msg)
            } else {
              config.tost(ret.msg);
            }
          }, true);
        }
      }
    });
  },
  load: function (id) {
    var that = this;
    that.setData({
      sliding: true
    })
    //排队按钮调用
    config.post("/wxApi/q/queueInfo", { id: id }, function (ret) {
      if (ret.code == 0) {
        that.setData({
          stroe: ret.data
        })
        that.data.qid = id;
      } else {
        config.tost(ret.msg);
      }
    }, true);
  },
  cancel: function () {
    var that = this;
    my.confirm({
      content: '确定要取消排队吗？',
      success: function (res) {
        if (res.confirm) {
          config.post("/wxApi/q/cancel", { id: that.data.qid }, function (ret) {
            if (ret.code == 0) {
              my.redirectTo({
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
  toMenu: function () {
    my.navigateTo({
      url: '../shop/shop?from=queue&storeId=' + this.data.stroe.id,
    })
  },
  onShareAppMessage: function (res) {
  }
})