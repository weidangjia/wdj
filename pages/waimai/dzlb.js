// pages/waimai/dzlb.js
var config = require("../../config.js");
Page({
  data: {
  api: config.ossPath,
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
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({
          key:'color',
          data:'blue'
    });
    }
    // config.navBarColor(my.getStorageSync({key:'color'}).data);
    that.setData({
      state:true,
      color: my.getStorageSync({key:'color'}).data
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
    my.setStorage({
      key: 'dzinfo',
      data: e.currentTarget.dataset.info
    })
    my.navigateTo({
      url: '../waimai/dzxz?state=1',
    })
  },
  select:function(e){
    my.setStorage({
      key: 'wmaddr',
      data: e.currentTarget.dataset.obj
    })
    my.setStorage({
      key: 'lat',
      data: e.currentTarget.dataset.obj.lat
    })
    my.setStorage({
      key: 'lng',
      data: e.currentTarget.dataset.obj.lng
    })
    if (!this.data.from){
      my.navigateBack({
        delta: 1
      });
    }    
  },
  back:function(){
    my.navigateBack({
      delta:1
    })
  },
  add:function(){
    var that=this;
    if(that.data.state){
      my.navigateTo({
        url: '../waimai/dzxz?state=0',
      })
      that.setData({
        state:false
      })
    }    
  }
})