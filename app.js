var qqmapsdk;

App({
  userInfo: null,
  onauthorsuccess:undefined,
  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.userInfo) resolve(this.userInfo);

      my.getAuthCode({
        scopes: ['auth_user'],
        success: (authcode) => {
          my.getAuthUserInfo({
            success: (res) => {
              this.userInfo = res;
              resolve(this.userInfo);
            },
            fail: () => {
              reject({});
              zf()
            },
          });
        },
        fail: () => {
          reject({});
          zf()
        },
      });

      function zf() {
        my.getAuthUserInfo({
            success: (res) => {
              this.userInfo = res;
              resolve(this.userInfo);
            },
            fail: () => {
              reject({});
              zf()
            },
          });
      }

    });
  },

});
