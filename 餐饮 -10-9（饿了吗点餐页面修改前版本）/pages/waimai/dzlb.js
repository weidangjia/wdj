// pages/waimai/dzlb.js
var config = require("../../config.js");
Page({
  data: {
  api: config.apiPath,
  dzlist:'',
  state:'',
  byGeo:'',
  state:true,
  loading:true
  },
  onLoad: function (options) {    
    if(options.state){
     this.setData({
       state:1
     })
    }else if(options.byGeo){
      this.setData({
        byGeo:'1'
      })
    } else if (options.from){
      this.setData({
        from: options.from
      })
    }
  },  
  onShow:function(){
    var that = this;
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    that.setData({
      state:true,
      color: wx.getStorageSync('color')
    })
    if (that.data.byGeo) {
      config.post('wxApi/addr/listByGeo', {}, function (ret) {
        if (ret.code == 0) {
          that.setData({
            dzlist: ret.data
          })
        }
        setTimeout(function () {
          that.setData({
            loading: false
          })
        }, 500)
      },true)
    } else {
      config.post('wxApi/addr/list', {}, function (ret) {
        if (ret.code == 0) {
          that.setData({
            dzlist: ret.data
          })
        }
        setTimeout(function () {
          that.setData({
            loading: false
          })
        }, 500)
      },true)
    }   
  },
  godz:function(e){
    wx.setStorage({
      key: 'dzinfo',
      data: e.currentTarget.dataset.info,
    })
    wx.navigateTo({
      url: '../waimai/dzxz?state=1',
    })
  },
  select:function(e){
    wx.setStorage({
      key: 'wmaddr',
      data: e.currentTarget.dataset.obj,
    })
    wx.setStorage({
      key: 'lat',
      data: e.currentTarget.dataset.obj.lat,
    })
    wx.setStorage({
      key: 'lng',
      data: e.currentTarget.dataset.obj.lng,
    })
    if (!this.data.from){
      wx.navigateBack({
        delta: 1
      });
    }    
  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  },
  add:function(){
    var that=this;
    if(that.data.state){
      wx.navigateTo({
        url: '../waimai/dzxz',
      })
      that.setData({
        state:false
      })
    }    
  }
})