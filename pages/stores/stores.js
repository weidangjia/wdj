
import config from '../../config.js';
import { ossPath } from '../../config.js';
Page({
  data: {
    Path: config.apiPath,
    api: ossPath,
    geoCity: "",
    nowCity: { title: '', code: '' },
    stores: '',
    index: 0,
    froms: '',
    citys: [],
    allct: '',
    loading: true,
    color: 'blue'
  },
  onLoad: function (options) {
    console.log(options)
    var that = this;
    var ct = [];
    if (!my.getStorageSync({ key: 'color' }).data) {
      my.setStorageSync({
        key: 'color',
        data: 'blue'
      });
    }
    config.navBarColor(my.getStorageSync({ key: 'color' }).data);
    that.setData({
      froms: options.from
    })

    // 获取城市
    config.post("/wxApi/c/citys", {}, function (ret) {
      if (ret.code == 0) {
        if (ret.data.length > 0) {
          for (var i = 0; i < ret.data.length; i++) {
            ct.push(ret.data[i].title);
          }
          that.setData({
            citys: ct,
            allct: ret.data
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
    }, true);
  },
  load: function () {
    var that = this;
    // 获取页面数据
    config.post("/wxApi/c/stores", {
      lat: my.getStorageSync({ key: 'lat' }).data, lng: my.getStorageSync({ key: 'lng' }).data,
      cityCode: that.data.nowCity.code
    }, function (ret) {
      if (ret.code == 0) {
        that.data.stores = ret.data;
        that.setData({
          stores: ret.data
        })
      } else {
        my.alert({
          title: ret.msg, // alert 框的标题
        });
      }
    }, true);
    that.setData({
      // address: my.getStorageSync('address')
    })
  },
  open: function () {
    var that = this;
    my.showActionSheet({
      items: that.data.citys,
      success: function (res) {
        console.log(res);
        if (!res.cancel) {
          that.setData({
            geoCity: that.data.citys[res.index],
            nowCity: that.data.allct[res.index]
          })
          that.load();
        }
      }
    });
  },
  refresh: function () {
    var that = this;
    var lat, lng;
    my.showToast({
      type: 'success',
      content: '刷新成功',
      duration: 2000,
    });
    // 获取经纬度
    my.getLocation({
      type: 2,
      success: (res) => {
        // my.setStorageSync('address', res.result.address);
        // my.setStorageSync('city', res.result.address_component.city);
        lat = res.latitude;
        lng = res.longitude;
        // 经纬度加入缓存
        my.setStorageSync({
          key: 'lat',
          data: lat
        })
        my.setStorageSync({
          key: 'lng',
          data: lng
        })

        that.load();
      },
      fail() {
        my.alert({ title: '定位失败' });
      },
    })
  },
  toStore: function (id) {
    my.navigateTo({
      url: '../index/mdxq?id=' + id,
    })
  },
  selectStore: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.obj.id;
    if (that.data.froms == 'yd') {
      my.setStorageSync({
        key: "sid",
        data: id
      });
      my.navigateTo({
        url: '/pages/index/ydwz?sid=' + id,
      })
    } else if (that.data.froms == 'dc') {
      my.setStorageSync({
        key: "sid",
        data: id
      });
      my.navigateTo({
        url: '../shop/shop?isWm=0',
      })
      console.log('shop')
    } else {
      that.toStore(id);
      console.log(id)
    }
  }
})
