//yhj.js  
var config = require("../../config.js");
Page( {  
  data: {  
    api:config.ossPath,
    winWidth: 0,  
    winHeight: 0,  
    currentTab: 0,  
    types:'2',
    xjList:'',
    mjList:'',
    loading:true
  },  
  onLoad: function() {  
    var that = this;  
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({
          key:'color',
          data:'blue'
      });
    }
    // config.navBarColor(my.getStorageSync('color'));
    that.setData({
      color: my.getStorageSync({key:'color'}).data
    })
    my.getSystemInfo( { 
      success: function( res ) {  
        that.setData( {  
          winWidth: res.windowWidth,  
          winHeight: res.windowHeight  
        });  
      }  
    });  
    //优惠券列表
    config.post("/wxApi/u/yhq", {}, function (ret) {
      if (ret.code == 0) {
        that.data.xjList = ret.data.xjList;
        that.data.mjList = ret.data.mjList;
        that.setData({
          xjList: that.data.xjList,
          mjList: that.data.mjList,
          loading:false
        })
        console.log(that.data)
      } else {
        config.tost(ret.msg);
      }
    },true);
  },
  give:function(e){
    
    config.post("/wxApi/u/yhqSendCheck", { id: e.currentTarget.dataset.id}, function (ret) {
      if(ret.code==0){
        my.navigateTo({
          url: '../mypage/yhj-zz?id=' + e.currentTarget.dataset.id,
        })
      }else{
        config.tost('使用中！')
      }
    },true)    
  },
  onShareAppMessage: function (e) {
    return {
      title: '优惠券',
      path: '/page/yhq-lq'
    }
  },
  bindChange: function( e ) {  
  
    var that = this;  
    that.setData( { currentTab: e.detail.current });  
  
  },  
  swichNav: function( e ) {  
  
    var that = this;  
    if( this.data.currentTab === e.target.dataset.current ) {  
      return false;  
    } else {  
      that.setData( {  
        currentTab: e.target.dataset.current  
      })  
    }  
  }
})  


