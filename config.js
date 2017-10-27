var apiPath = "http://apptest.udows.com:8089/wdj/";
const ossPath = "https://img.zhcanting.com/";
var cid = "458996";
var uid = "14b64ca9b06b40d9a5bec836e1e8c4aa";
var sid = "7cb399660bfd4d41a14777c847ac2b7e";
var client = 3;
export default {
    sid,
    apiPath,
    ossPath,//图片服务器
    post(path, data, success) {
        data.cid = cid;
        data.uid = uid;
        data.sid = sid;
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
        var myreg = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
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
    }
}