App({
  data:{
    "extEnable": true,
    "extAppid": "wxf6444710f6da188e",
    "ext": {
      "cid": "458996",
      "uid":"858249554318479cb3353a7452c39b70",
      "fileMode": "oss",
      "ossPath": "https://img.zhcanting.com",
      "path": "https://www.zhcanting.com/"
    }
  },
  onLaunch(query) { 
    // console.log(query)
  },
  onShow:function(res){
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        this.data.ext.uid = res.authCode
      },
    });
  }
})
