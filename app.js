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

});
