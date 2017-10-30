// pages/index/ydwz.js
import config from '../../config.js';
import {post ,ossPath ,apiPath, sid} from '../../config.js';
Page({
  data:{
        path:apiPath,
        api:ossPath,
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
        loading:true,
        sid:sid,
        servicesItems:[],
        a1:['a','b','c']
  },
  onLoad:function(options){
    var that=this;
    that.setData({
      sid:options.sid
    })

    var services;
    var serviceId;
    //姓名号码
    if(my.getStorageSync({key:'ydName'}).data){
      that.data.book.bookName = my.getStorageSync({key:'ydName'}).data;
      that.setData({
        book:that.data.book
      })
    }
    if(my.getStorageSync({key:'ydPhone'}).data){
      that.data.book.bookPhone = my.getStorageSync({key:'ydPhone'}).data;
      that.setData({
        book: that.data.book
      })
    }
    //预定信息
    if (!my.getStorageSync({key:'color'}).data) {
      my.setStorageSync({
        key:'color',
        data:"blue"
      });
    }
    config.navBarColor(my.getStorageSync({ key: 'color' }).data);
    this.setData({
      color: my.getStorageSync({key:'color'}).data
    })
    post('wxApi/s/ydInfo',{ sid: that.data.sid },function(ret){
      if(ret.code==0){
        that.setData({
          obj: ret.data,
          years: ret.data.days,
        }) 
        if (ret.data.services.length>0){
          serviceId = ret.data.services[0].id;
          that.data.book.storeId = serviceId;
          
          // var servicesItems = [];
          // for (var i=0;i<ret.data.services.length; i++){
          //   servicesItems.push(ret.data.services[i].times)
          // }
          // that.setData({
          //   servicesItems:servicesItems
          // })
          // console.log(that.data.servicesItems)

        }else{
          my.alert({
            title: '商家暂不支持预约！',
            success:()=>{
              my.navigateBack({delta:Page.getCurrentPages});
            }
          });
          
        }            
      }else if(ret.code==-1){
        my.alert({
            title: '商家暂不支持预约！',
            success:()=>{
              my.navigateBack({delta:Page.getCurrentPages});
            }
        });       
      }else{
        my.alert({
          title: ret.msg
        });
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
    post("wxApi/d/ydDesks", { 
      date: that.data.book.day.date, 
      serviceId: that.data.book.storeId,
      sid: that.data.sid
    }, function (ret) {
      if (ret.code == 0) {
        that.data.desks = ret.data;
        that.setData({
          desks: that.data.desks
        })
        console.log(that.data.desks)
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
     var t = e.currentTarget.dataset.t;
     var index = e.currentTarget.dataset.index;
    if (!this.data.store.days.no) {
      my.showToast({
        content: '请先选择日期',
        duration: 1000
      })
      return;
    } else if (this.data.book.day.isToday && s.over == 1) {
      my.showToast({
        content: '当天预定至少提前一个餐点',
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
      my.showToast({
        content: '请选择用餐时间',
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
    my.setStorage({
      key: 'ydName',
      data: e.detail.value,
    })
  },
  //号码
  phone(e){
    this.data.book.bookPhone = e.detail.value;
    my.setStorage({
      key: 'ydPhone',
      data: e.detail.value,
    })
  },
  //提交
  submit:function(e){
    
    var that=this;
    console.log(that.data)
    var used;
    if (!that.data.book.service.id) {
      my.alert({title: '请选择用餐时间'});
      return;
    } else if (!that.data.book.desk.id) {
      my.alert({title: '请选择用餐位置'});
      return;
    } else if (!that.data.book.bookName) {
       my.alert({title: '请填写姓名'});
      return;
    } else if (!that.data.book.bookPhone){
       my.alert({title: '请填写联系电话'});
      return;
    } else if (config.isphone(that.data.book.bookPhone) == '2') {
      my.showToast({
        content: '手机号码不正确！',
        icon: 'success',
        duration: 1000
      })
    } else{
      var date = that.data.book.day.date + " " + that.data.book.time+':00';
      post("wxApi/o/addYd", {
        date: date,
        serviceId: that.data.book.service.id,
        deskId: that.data.book.desk.id,
        bookName: that.data.book.bookName,
        bookPhone: that.data.book.bookPhone,
        sid: that.data.sid
      },function(ret){
        if(ret.code == 0){
          console.log(ret.msg)
          // config.formid(e.detail.formId);
          my.redirectTo({
            url: '../index/ddxq?id='+ret.msg,
          })
        }else{
          my.showToast({
            content: ret.msg,
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
    my.navigateBack({
      delta: 1
    })
  }
})