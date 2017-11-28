import config from '../../config.js';
Page({
  data: {
    api: config.ossPath,
    dplist: '',
    address: '',
    seadd: '',
    showtime: false,
    obj: '',
    active: '-1',
    time: '',
    strname: '',
    remark: '',
    invoiceHead: '',
    userNum: '',
    dcwc: false,
    state: '1',
    orderId: '',
    loading: true,
    select: 1
  },
  onShow: function () {
    var that = this;
    if (!my.getStorageSync({ key: 'color' }).data) {
      my.setStorageSync({ key: 'color', data: 'blue' });
    }
    config.navBarColor(my.getStorageSync({ key: 'color' }).data);
    that.setData({
      color: my.getStorageSync({ key: 'color' }).data
    })
    if (my.getStorageSync({ key: 'wmaddr' }).data) {
      that.setData({
        seadd: my.getStorageSync({ key: 'wmaddr' }).data
      })
    } else {
      config.post('wxApi/addr/getDefault', {}, function (ret) {
        if (ret.code == 0) {
          that.setData({
            seadd: ret.data
          })
          my.setStorage({
            key: 'wmaddr',
            data: ret.data,
          })
        } else {
          
          if (my.getStorageSync({ key: 'wmaddr' }).data == undefined){
            that.setData({
              seadd: ''
            })
          } else{
            that.setData({
              seadd: my.getStorageSync({ key: 'wmaddr' }).data
            })
          }

          that.setData({
            address: my.getStorageSync({ key: 'address' }).data
          })
        }
      }, true)
    }
  },
  onLoad: function (options) {
    var that = this;
    var obj = my.getStorageSync({ key: 'wm' }).data;
    var state = 1;
    var arry = [];
    if (options) {
      that.setData({
        strname: options.strname
      })
    }
    if (obj.periods[0] != undefined) {
      arry.push(obj.date + ' ' + obj.periods[0]);
      for (var i = 1; i < obj.periods.length; i++) {
        if ((obj.periods[i] > obj.periods[i - 1]) && state) {
          arry.push(obj.date + ' ' + obj.periods[i]);
        } else {
          arry.push(that.addDate(obj.date, 1) + ' ' + obj.periods[i]);
          state = 0;
        }
      }
      obj.periods = arry;
      that.setData({
        address: my.getStorageSync({ key: 'address' }).data,
        obj: obj,
        time: arry[0],
      })
    } else {
      that.setData({
        address: my.getStorageSync({ key: 'addresss' }).data,
        obj: obj,
        time: my.getStorageSync({ key: 'wm' }).data.periods[0],
      })
    }
    setTimeout(function () {
      that.setData({
        loading: false
      })
    }, 500)
    //手机号码
    if(my.getStorageSync({key:'userPhone'}).data){      
      that.setData({
        phone:my.getStorageSync({key:'userPhone'}).data
      })
    }
  },
  goshop: function (e) {
    my.setStorage({
      key: 'sid',
      data: e.currentTarget.dataset.id,
    })
    my.redirectTo({
      url: '../shop/shop?limit=' + e.currentTarget.dataset.limit,
    })
  },
  toggletime: function (e) {
    this.setData({
      showtime: !this.data.showtime
    });
  },
  timeclose: function (e) {
    this.setData({
      showtime: !this.data.showtime
    })
  },
  filterTab: function (e) {
    var data = my.getStorageSync({ key: 'wm' }).data;
    var index = e.currentTarget.dataset.index
    this.data.time = this.data.obj.periods[index];
    this.setData({
      active: index,
      showtime: !this.data.showtime,
      time: this.data.time
    })
  },
  addDate: function (date, days) {
    if (days == undefined || days == '') {
      days = 1;
    }
    var date = new Date(date);
    date.setDate(date.getDate() + days);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return date.getFullYear() + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day);
  },
  getFormatDate: function (arg) {
    if (arg == undefined || arg == '') {
      return '';
    }

    var re = arg + '';
    if (re.length < 2) {
      re = '0' + re;
    }

    return re;
  },
  userNum: function (e) {
    var num = Number(e.detail.value);
    this.setData({
      userNum: num
    })
  },
  remark: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  invoiceHead: function (e) {
    this.setData({
      invoiceHead: e.detail.value
    })
  },
  sub: function () {
    if (my.getStorageSync({ key: 'wmaddr' }).data != undefined){
      var addrId = my.getStorageSync({ key: 'wmaddr' }).data.id;
    }
    
    var t = this.data;
    var sendTime = t.time + ":00";
    var obj = { list: t.obj.list };
    var json = JSON.stringify(obj);
    var that = this;
    var phone=my.getStorageSync({key:'userPhone'}).data;
    that.setData({phone:phone});
    if(!phone){
      config.tost('请输入手机号')
    }
    else if (config.isphone(phone) == '2'&&phone!='') {
      my.showToast({
        type: 'fail',
        content: '手机号码格式不正确！',
        duration: 2000,
      });
    } else if(config.isphone(phone)==1&&my.getStorageSync({key:'isGetPhone'}).data!=2){
      config.post('wxApi/ali/updatePhone', {phone:phone},function(ret){
               if(ret.code==0){
                  my.setStorageSync({key:'isGetPhone',data:2});
               }
            })
    }
    else if (typeof (that.data.time) == 'undefined') {
      config.tost('商家停止接单了');
      return;
    } else {
      if (that.data.state == '1') {
        config.post("wxApi/wm/add", { addrId: addrId, remark: t.remark, jsonStr: json, sendTime: sendTime, invoiceHead: t.invoiceHead, userNum: t.userNum }, function (ret) {
          if (ret.code == 0) {
            that.setData({
              dcwc: true,
              state: '2',
              orderId: ret.msg
            })
            var sid = my.getStorageSync({key:'sid'}).data;
            my.removeStorage({
              key: sid + 'newmap',
            })
            my.removeStorage({
              key: sid + 'menu',
            })
            my.redirectTo({
              url: '../waimai/zf?id=' + that.data.orderId,
            })
          } else {
            config.tost(ret.msg);
          }
        }, true)
      }
    }
  },
  back: function () {
    my.navigateBack({
      delta: 1
    })
  },
  phone: function (e) {
    my.setStorageSync({ key: 'userPhone', data: e.detail.value });
  },
  way: function (e) {
    this.setData({ select: e.currentTarget.dataset.index })
  }
})