// pages/index/ydwz.js
var config = require("../../config.js");
Page({
  data:{
        path:config.resPath,
        api:config.apiPath,
        activeIndex:'-1',
        store: { days: [], services: [] },
        sltse:'-1',
        obj:'',
        book: { storeId:'', bookName: '', bookPhone: '', day:'', time: '', service: {}, desk:'' },
        desks:'',
        showtime:false,
        daytitle:false,
        time:false,
        showDialog:false,
        path:{},
        loading:true
  },
  onLoad:function(){
    var that=this;
    var services;
    var serviceId;
    //姓名号码
    if(wx.getStorageSync('ydName')){
      that.data.book.bookName = wx.getStorageSync('ydName');
      that.setData({
        book:that.data.book
      })
    }
    if (wx.getStorageSync('ydPhone')) {
      that.data.book.bookPhone = wx.getStorageSync('ydPhone');
      that.setData({
        book: that.data.book
      })
    }
    //预定信息
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    this.setData({
      color: wx.getStorageSync('color')
    })
    config.post('wxApi/s/ydInfo',{},function(ret){
      if(ret.code==0){  
        that.setData({
          obj: ret.data,
          years: ret.data.days,
        }) 
        if (ret.data.services.length>0){
          serviceId = ret.data.services[0].id;
          that.data.book.storeId = serviceId;    
        }else{
          config.tost('商家暂不支持预约！');
        }            
      }else if(ret.code==-1){
        wx.showModal({
          content: ret.msg,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        });        
      }else{
        config.tost(ret.msg);
      }
      setTimeout(function () {
        that.setData({
          loading: false
        })
      }, 500)
    },true)    
  },
  loadDesks(){
    var that=this;
    //预定桌号
    config.post("wxApi/d/ydDesks", { date: that.data.book.day.date, serviceId: that.data.book.storeId }, function (ret) {
      if (ret.code == 0) {
        that.data.desks = ret.data;
        that.setData({
          desks: that.data.desks
        })
      }
    });
  },
  filterTab: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.date = this.data.years[index].date;
    this.data.store.days = this.data.obj.days[index];
    this.data.book.day = this.data.obj.days[index];
    this.setData({
      activeIndex: index,
    });
  },
  toggletime: function (e) {
    this.data.sltse='-1'
    this.data.book.desk = '';
    this.setData({
      book: this.data.book,
      sltse:this.data.sltse
    })
    this.setData({
      showtime: !this.data.showtime
    });
  },
  mealtimeclose: function (e) {
     var s = e.currentTarget.dataset.s;    
     console.log(s);
     var t = e.currentTarget.dataset.t;
     var index = e.currentTarget.dataset.index;
    if (!this.data.store.days.no) {
      wx.showToast({
        title: '请先选择日期',
        duration: 1000
      })
      return;
    } else if (this.data.book.day.isToday && s.over == 1) {
      wx.showToast({
        title: '当天预定至少提前一个餐点',
        duration: 1000
      })
      return;
    }
    this.data.book.service = { id: s.id, title: s.title };
    this.data.book.time = t[index].time;
    this.data.store.services = t[index].time;
    this.data.book.storeId=s.id;
      this.loadDesks();
      this.setData({
        time: false,
        showtime: !this.data.showtime,
        store: this.data.store,
        book: this.data.book,
        storeId: this.data.book.storeId
      })
  },
  //预约位置
  toggleDialog: function () {
    if (this.data.book.service.id) {
      this.setData({
        showDialog: !this.data.showDialog,
      });     
    } else {
      wx.showToast({
        title: '请选择用餐时间',
        duration: 2000
      })
    }
  },
  close:function(){
    this.setData({
      showDialog: !this.data.showDialog,
    })
  },
  seatclose: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.sltse = index;
    this.data.book.desk = this.data.desks[index];
    this.setData({
      time: false,
      showDialog: !this.data.showDialog,
      sltse: this.data.sltse,
      book: this.data.book
    })
  },
  //姓名
  name(e){
    this.data.book.bookName=e.detail.value;
    wx.setStorage({
      key: 'ydName',
      data: e.detail.value,
    })
  },
  //号码
  phone(e){
    this.data.book.bookPhone = e.detail.value;
    wx.setStorage({
      key: 'ydPhone',
      data: e.detail.value,
    })
  },
  //提交
  submit:function(e){
    var used;
    var that=this;
    if (!that.data.book.service.id) {
      config.tost('请选择用餐时间');
      return;
    } else if (!that.data.book.desk.id) {
      config.tost('请选择用餐位置');;
      return;
    } else if (!that.data.book.bookName) {
      config.tost('请填写姓名');
      return;
    } else if (!that.data.book.bookPhone){
      config.tost('请填写联系电话');
      return;
    } else if (config.isphone(that.data.book.bookPhone) == '2') {
      wx.showToast({
        title: '手机号码不正确！',
        icon: 'success',
        duration: 1000
      })
    } else{
      var date = that.data.book.day.date + " " + that.data.book.time+':00';
      config.post("wxApi/o/addYd", {
        date: date,
        serviceId: that.data.book.service.id,
        deskId: that.data.book.desk.id,
        bookName: that.data.book.bookName,
        bookPhone: that.data.book.bookPhone
      },function(ret){
        if(ret.code == 0){
          config.formid(e.detail.formId);
          wx.redirectTo({
            url: '../index/ddxq?id='+ret.msg,
          })
        }else{
          wx.showToast({
            title: ret.msg,
            duration: 3000
          })
        }
      })
    }
  },
  timeclose: function (e) {
       this.setData({
         showtime: !this.data.showtime
       })
   },
  dinnerclose:function(e){
      var index=e.currentTarget.dataset.index;
    this.setData({
            time:false,   
            lunchval:this.data.dinner[index]       
        })
  },
  back:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})