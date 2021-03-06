function consts() {
  return {
    apiPath: wx.getExtConfigSync().path,
    imgPath: wx.getExtConfigSync().path+"download?id=",
    cid: wx.getExtConfigSync().cid,
    fileMode: wx.getExtConfigSync().fileMode,
    ossPath: wx.getExtConfigSync().ossPath,
    verson:1,
  }
}

function post(path,data,success,hasloading,setTime) {
  if(!setTime){
    setTime=200;
  }
  data.cid = consts().cid;
  data.uid = wx.getStorageSync('uid');
  data.sid = wx.getStorageSync('sid');
  data.client=2;
  if (!hasloading){
    wx.showLoading({
      title: '加载中',
    });
  }
  wx.request({
    url: consts().apiPath + path,
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (res) {
      try{
        if (res.statusCode == 200) {
          var ret;
          if (typeof (res.data)!='object'){
           ret= JSON.parse(res.data);
          }else{
            ret = res.data;
          }          
          success(ret);
        } else {
          alert('服务器繁忙请稍后再试 !');
        }
      }finally{
        if (!hasloading) {
        setTimeout(function(){
          wx.hideLoading();
        }, setTime)
        }
      }
    },
  })
}
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function alert(content) {
  wx.showModal({
    content: content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {

      }
    }
  });
}
function numberAdd(a, b) {
  return Number((a + b).toFixed(2));
}
function numberRed(a, b) {
  return Number((a - b).toFixed(2));
}
function formid(id) {
  if (id == 'the formId is a mock one') { return; }
  var openid = wx.getStorageSync('openid');
  wx.request({
    url: consts().apiPath + 'wxApi/xcx/pushFormId',
    data: { openid: openid, formid: id },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
  })
}
function getSrc(id, w, h, initSrc) {
  if (id) {
    if (consts().fileMode != "oss") {
      var url = consts().apiPath + "download?id=" + id;
      if (w) url = url + "&w=" + w;
      if (h) url = url + "&h=" + h;
      return url;
    } else {
      var url = consts().ossPath + "/" + id;
      if (w || h) {
        url = url + "?x-oss-process=image/resize,m_fixed";
        if (w) url = url + ",w_" + w;
        if (h) url = url + ",h_" + h;
      }
      return url;

    }
  } else {
    if (initSrc) return initSrc;
    else return "";
  }
}

function tost(content) {
  wx.showToast({
    title: content,
    duration: 3000
  })
}
//手机号码校验
function isphone(mobile) {
  var myreg = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
  if (!myreg.test(mobile)) {
    return 2;
  }
  return 1;
}
function navBarColor(color){
  if(color=='green'){
    color ='#1ebda7'
  }else if(color=='gray'){
    color = '#303030'
  }else{
    color = '#3f74ec'
  }
  if (wx.setNavigationBarColor) {
    setTimeout(function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color,
    })
    },300)
  }else{
    setTimeout(function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#303030',
    })
    }, 300)
  }
  
}

// function support(res,func){
  
//     wx.openBluetoothAdapter()
//   } else {
//     func()
//   }
// }

module.exports = {
  apiPath: consts().fileMode == 'oss' ? (consts().ossPath + '/') : consts().imgPath,
  cid: consts().cid,
  appid: consts().appid,
  post: post,
  tost: tost,
  formid: formid,
  alert: alert,
  formatTime: formatTime,
  isphone: isphone,
  numberAdd: numberAdd,
  numberRed: numberRed,
  getSrc: getSrc,
  navBarColor: navBarColor,
  verson: consts().verson
}