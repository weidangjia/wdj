var config = require("../../config.js");
//获取应用实例  
var app = getApp()
Page({
  data: {
    path: config.resPath,
    api: config.apiPath,
    scroll: false,
    winWidth: 0,
    winHeight: 0,
    loading: false,
    currentTab: 0,
    list: [],
    page: 1,
    num: '',
    limit: 20,
    hasMore: true,
    types: 1,
    loadShow:true
  },
  onLoad: function () {
    var that = this;
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({key:'color',data: 'blue'});
    }
    config.navBarColor(my.getStorageSync({key:'color'}).data);
    that.setData({
      color: my.getStorageSync({key:'color'}).data
    });
    my.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          heht: res.windowHeight
        });
      }
    });
  },
  onShow: function () {
    this.setData({
      list: []
    })
    this.load();
  },
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  load: function () {
    var that = this;
    config.post("wxApi/wm/orders", { type: that.data.types, page: that.data.page, limit: that.data.limit }, function (ret) {
      if (ret.code == 0) {
        that.data.num = ret.data.length;
        ret.data.forEach(function (o, i) {
          that.data.list.push(o)
        })
        that.setData({
          list: that.data.list,
          num: that.data.num,
          listShow:true
        })
      }
      setTimeout(function () {
        my.hideLoading();
        that.setData({
          loadShow: false
        })
      }, 500)
    },true)
  },
  swichNav: function (e) {
    var that = this;
    that.data.page = 1;
    that.data.list = [];
    that.setData({
      list: that.data.list,
      listShow:false
    })
    var current = e.target.dataset.current;
    if (current == 1) {
      that.data.types = 0;
    } else {
      that.data.types = 1;
    }
    if (this.data.currentTab === current) {
      return false;
    } else {
      that.setData({
        currentTab: current
      })
    }
    my.showLoading({
      title: 'loading...',
    });
    that.load();
  },
  //加载更多
  getMore: function () {
    this.setData({
      loading: true
    })
  },
  end: function () {
    if (this.data.loading && this.data.num == 20) {
      this.data.page+=1;
      this.setData({
        page: this.data.page,
        loading: false
      })
      this.load();
    }
  },
})


