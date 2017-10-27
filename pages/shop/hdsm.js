//获取应用实例
import { post,ossPath,tost,formid,navBarColor} from '../../config.js';
Page({
  data: {
    api: ossPath,
    store: {},
  },
  onLoad: function () {
    var that = this;
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({key:'color',data:'blue'});
    }
    navBarColor(my.getStorageSync({key:'color'}).data);
    that.setData({
      color: my.getStorageSync({key:'color'}).data
    })
    post('/wxApi/s/yh',{},function(ret){
      that.setData({
        store:ret.data
      })
    })
  }
})
