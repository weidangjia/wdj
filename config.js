var apiPath = "https://www.zhcanting.com/";
const ossPath = "https://img.zhcanting.com/";
var cid = "458996";
var uid = "858249554318479cb3353a7452c39b70";
var sid = "f40dd1e228324a8297c8b6cc22602b60";
var client = 2;
export default {
    sid,
    apiPath,
    ossPath,//图片服务器
    post(path, data, success) {
        data.cid = cid;
        data.uid = uid;
        // data.sid = sid;
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
            content: content,
            duration: 3000
        })
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
    }
}