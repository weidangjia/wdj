var apiPath = "https://www.zhcanting.com/";
const ossPath = "https://img.zhcanting.com/";
var cid = "458996";
var uid = "858249554318479cb3353a7452c39b70";
var sid = "f40dd1e228324a8297c8b6cc22602b60";
var client = 2;
export default {
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
    }
}