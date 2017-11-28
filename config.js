var apiPath = "https://www.zhcanting.com/";
const ossPath = "https://img.zhcanting.com/";
var cid = "458996";
var client = 3;
export default {
    apiPath,
    ossPath,//图片服务器
    post(path, data, success) { 
        if(my.getStorageSync({key:'uid'}).data){
            data.uid = my.getStorageSync({key:'uid'}).data;           
        }    
        if(my.getStorageSync({key:'sid'}).data){
            data.sid = my.getStorageSync({key:'sid'}).data;            
        }    
        data.cid = cid;
        my.httpRequest({
            url: apiPath + path,
            method: 'POST',
            data: data,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                try {
                    // if (res.statusCode == 200) {
                        var ret;
                        if (typeof (res.data) != 'object') {
                            ret = JSON.parse(res.data);
                        } else {
                            ret = res.data;
                        }
                        success(ret);
                    // }
                    //else {
                    //     alert('服务器繁忙请稍后再试 !');
                    // }
                } finally {
                    // if (!hasloading) {
                    //     setTimeout(function () {
                    //         wx.hideLoading();
                    //     }, setTime)
                    // }
                }
            },
        });
    },
    isphone(mobile){
        var myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        if (!myreg.test(mobile)) {
            return 2;
        }
        return 1;
    },
    tost(content){
        my.showToast({
            type: 'success',
            content: content,
            duration: 3000
        })
    },
    //设置导航栏背景色
    navBarColor(color) {
        if (color == 'green') {
            color = '#1ebda7'
        } else if (color == 'gray') {
            color = '#303030'
        } else {
            color = '#0f96fe'
        }
        if (my.setNavigationBar) {
            my.setNavigationBar({
                backgroundColor: color,
            })
        } else {
            my.setNavigationBar({
                backgroundColor: '#303030',
            })
        }
    },
    formid(id){
        if (id == 'the formId is a mock one') { return; }
        var openid = my.getStorageSync({key:'openid'}).data;
        my.httpRequest({
            url: apiPath + 'wxApi/xcx/pushFormId',
            data: { openid: openid, formid: id },
            header: {
            'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
        })
    },
    alert(content){
        my.confirm({
            content: content,
            showCancel: false,
            success: function (res) {
                if (res.confirm) {

                }
            }
        });
    },
    //推送
    formid(id) {
      if (id == 'the formId is a mock one') { return; }
      var openid = my.getStorageSync({key:'openid'}).data;
      my.httpRequest({
        url: apiPath + 'wxApi/xcx/pushFormId',
        data: { openid: openid, formid: id },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
      })
    },
}