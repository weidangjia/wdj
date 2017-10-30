var qqmapsdk;

App({
  userInfo2: null,
  onauthorsuccess:undefined,
  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.userInfo2) resolve(this.userInfo2);

      my.getAuthCode({
        success: (authcode) => {
          my.getAuthUserInfo({
            scopes: ['auth_user'],
            success: (res) => {
              this.userInfo2 = res;
              resolve(this.userInfo2);
            },
            fail: () => {
              reject({});
            },
          });
        },
        fail: () => {
          reject({});
        },
      });
    });
  },
  getaddress:function () {
    my.getLocation({
      success(res) {
        my.hideLoading();
        my.setStorageSync({key:'lat',data:res.latitude})
        my.setStorageSync({key:'lng',data:res.longitude})
      },
      fail() {
        my.setStorageSync({key:'lat',data:0})
        my.setStorageSync({key:'lng',data:0})
        my.alert({ title: '定位失败' });
      },
    })
  }

});
