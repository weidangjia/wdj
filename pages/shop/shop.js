import { post,ossPath,tost,formid,navBarColor} from '../../config.js';
Page({
  data: {
    api: ossPath,
    sliding: true,
    confirmslid: false,
    faslid: false,
    dcslid: false,
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1200,
    remark: '',
    order: {},
    tt: {},
    deskCode: '',
    deskId: '',
    orderId: '',
    ydId: '',
    menu: '',
    menutab: 1,
    storeId: '7cb399660bfd4d41a14777c847ac2b7e',
    cart: {
      count: 0,
      total: 0,
      list: {}
    },
    tcshow: false,
    showCartDetail: false,
    isWm: 0,
    window_width: 375,// 单位是px
    tab_config: {
      tabs: [],// tabs
      fixed: false, // tabbar是否固定宽度
      active_tab: 0, //当前激活的tab
      item_width: 90,// 单位是px
      tab_left: 0, // 如果tabbar不是固定宽度，则目前左移的位置
      underline: {
        offset: 0 //下划线的位移
      }
    },
    swipe_config: {
      swipes: [],// 不同面板的内容
      indicator_dots: false, // 不显示小圆点
      autoplay: false,// 自动切换
      interval: 2000,// 自动切换频率
      duration: 500, // 切换时间
      current: 0 // 当前激活的panel
    },
    loading: true,
    text:{data:'sdfsdfds'},
    newmap: {},
  },
  //获取数据
  onLoad: function (options) {
    var that = this;
    that.data.deskCode = options.deskCode;
    that.data.deskId = options.deskId;
    that.data.ydId = options.ydId;
    if (!my.getStorageSync({ key: 'color' }).data) {
      my.setStorageSync({ key: 'color', data: 'blue' });
    }
    if (!my.getStorageSync({ key: 'menuStyle' }).data) {
      my.setStorageSync({ key: 'menuStyle', data: '1' }, );
    }
    that.setData({
      storeId: '7cb399660bfd4d41a14777c847ac2b7e',
      deskCode: that.data.deskCode,
      deskId: that.data.deskId,
      ydId: that.data.ydId,
      color: my.getStorageSync({ key:'color' }).data,
      menutab: 1
    })
    navBarColor(that.data.color);
    if (options.isWm) {
      that.setData({
        isWm: options.isWm
      })
    }
    //计算高度，宽度
    try {
      let { window_width, tab_config } = that.data;
      var res = my.getSystemInfoSync()
      window_width = res.windowWidth;

      if (tab_config.fixed) {
        tab_config.item_width = window_width / tab_config.tabs.length;
      }
      var length = that.data.text.length * that.data.size;
      that.setData({
        "window_width": window_width,
        "tab_config": tab_config
      });

    } catch (e) {

    }
    var newMenu = my.getStorageSync({ key: that.data.storeId + 'menu' }).data;
    if (newMenu) {
      that.recommended(newMenu);
    }
    setTimeout(function () {
      that.setData({
        loading: false
      })
    }, 800)
    if (that.data.isWm == 0) {
      var newmap = my.getStorageSync({ key: that.data.storeId + 'newmap' }).data;
    } else if (that.data.isWm == 1) {
      var newmap = my.getStorageSync({ key: that.data.storeId + 'wmNewmap' }).data;
    }
    if (!newmap) {
      newmap = { total: 0, amount: 0 }
    }
    that.setData({
      menu: newMenu,
      newmap: newmap,
      text:newmap
    });
    that.loadata(that.data.menu);
  },
  onShow: function () {
    this.getYh();
  },
  category: function (menuInfo) {
    var that = this, menu = that.data.menu, newmap = that.data.newmap;
    menu.cates.forEach(function (c, j) {
      c.glist.forEach(function (g, k) {
        if (newmap[g.id]) {
          if (newmap[g.id].NO > 0) {
            menuInfo.gCates.forEach(function (m, i) {
              if (g.cateId == m.id) {
                m.num += newmap[g.id].NO;
                return;
              }
            })
          }
        }
      })
    })
    that.setData({
      menuInfo: menuInfo
    })
  },
  loadata: function (oldMenu) {
    var that = this;
    var version = my.getStorageSync({ key: that.data.storeId + 'menu' }).version;
    post('wxApi/s/menuV3', { version:'' }, function (ret) {
      if (ret.code == 0) {
        if (that.data.isWm) {
          that.setData({
            limit: ret.data.wmLimit
          })
        }
        that.data.menu = ret.data;
        if (that.data.menu.cates.length > 0) {
          that.setData({
            menu: that.data.menu,
            classifySeleted: that.data.menu.cates[0].title
          })
        }
        setTimeout(function () {
          that.setData({
            loading: false
          })
        }, 800)        
        my.setStorage({
          key: that.data.storeId + 'menu',
          data: ret.data,
        })
        // that.recommended(ret.data);
        console.log(ret.data);
        that.screen(ret.data,that.data.isWm);
      }else{
        that.screen(oldMenu,that.data.isWm);
      }
    }, true)
    //分类
    post('wxApi/s/menuInfo', {sid:my.getStorageSync({key:'sid'}).data}, function (ret) {
      console.log(ret);
      if (ret.code == 0) {
        var menuInfo = ret.data;
        var newmap = that.data.newmap;
        var newMenu = my.getStorageSync({ key: that.data.storeId + 'menu' }).data;
        menuInfo.gCates.forEach(function (g, i) {
          if (newmap[g.id] > 0) {
            m.num = newmap[g.id];
          }
        })
        //所属分类
        if (newMenu) {
          that.category(menuInfo);
        }
        that.setData({
          menuInfo: menuInfo
        })
      }
    }, true)
  },  
  getYh: function () {
    var id = my.getStorageSync({key:'sid'}).data;
    var that = this;
    post('wxApi/coupon/store', { id: id }, function (ret) {
      if (ret.code == 0) {
        that.setData({
          couponList: ret.data
        })
      }
    }, true)
    post('wxApi/coupon/present', {}, function (ret) {
      if (ret.data.coupons.length > 0) {
        var sendInfo = {};
        sendInfo.couponCanGet = ret.data.couponCanGet;
        sendInfo.couponTotalPrice = ret.data.couponTotalPrice;
        sendInfo.coupons = ret.data.coupons;
        sendInfo.cname = ret.data.cname;
        my.setStorageSync('sendInfo', sendInfo);
        that.setData({
          sendInfo: sendInfo,
          sendShow: true,
        })
      }
    }, true)
  },
  recommended: function (menu) {
    var menu = menu, that = this, tjList = [], swipes = [], tabs = [], data = { glist: '' };
    menu.cates.forEach(function (c, j) {
      c.glist.forEach(function (g, k) {
        if (g.isTop > 0) {
          tjList.push(g);
        }
      })
    })
    data.glist = tjList;
    for (var i = 0; i < menu.cates.length; i++) {
      var tj = { id: menu.cates[i].id, title: menu.cates[i].title, data: menu.cates[i] };
      tabs.push(tj);
      swipes.push(i);
    }
    if (menu.top > 0) {
      var tj = { id: "tj", title: "热门推荐", data: data }
      tabs.unshift(tj);
      swipes.push(i);
    }
    that.setData({
      tjList: tjList,
      swipes: swipes,
      tabs: tabs,
      menu: menu
    })
  },
  screen:function(menu,isWm){
    if(isWm==1){
      isWm=3;
    }else{
      isWm=2;
    }
    menu.cates.forEach(function(c,i){
      c.glist.forEach(function(g,j){
        if(g.showType==1||g.showType==isWm){
        }else{
          c.glist.splice(0,j);
          menu.top-=1;
        }
      })
    })
    this.setData({menu:menu});
    this.recommended(menu);
  },
  newmap: function (id, num, sns, price, tcinfo) {
    var that = this;
    var key = sns ? (id + "_" + sns) : id;
    var newmap = that.data.newmap;
    if (newmap.total == undefined) newmap.total = 0;
    if (newmap.amount == undefined) newmap.amount = 0;
    if (newmap[key] == undefined) newmap[key] = { NO: 0, PR: 0 };
    if (newmap[id] == undefined || newmap[id] == 0) newmap[id] = { NO: 0, PR: 0 };
    var cnt = newmap[key].NO;
    cnt = cnt + num;
    cnt = cnt > 0 ? cnt : 0;

    if (newmap[key].NO != cnt) {
      newmap[key].NO = cnt;
      newmap.total = newmap.total + num;
      if (num > 0) {
        newmap.amount = Number((newmap.amount + price).toFixed(2));
        newmap[key].PR = Number((newmap[key].NO * price).toFixed(2));
        if (sns) {
          newmap[id].NO += 1;
          var total = 0;
          for (var p in newmap) {
            if (p.startsWith(id + "_")) {
              total += newmap[p].PR;
            }
          }
          newmap[id].PR = total;
        } else {
          newmap[id].PR = Number((newmap[id].NO * price).toFixed(2));
        }

      } else {
        newmap.amount = Number((newmap.amount - price).toFixed(2));
        newmap[key].PR = Number((newmap[key].NO * price).toFixed(2));
        if (sns) {
          newmap[id].NO -= 1;
          newmap[id].PR -= price;
        } else {
          newmap[id].PR = Number((newmap[id].NO * price).toFixed(2));
        }
      }
    }
    if (tcinfo) {
      tcinfo.num = newmap[id];
      if (tcinfo.hasSn) {
        tcinfo.sns.forEach(function (s, i) {
          if (newmap[tcinfo.id + '_' + s.id]) {
            if (newmap[tcinfo.id + '_' + s.id].NO > 0) s.num = newmap[tcinfo.id + '_' + s.id].NO;
          }
        })
      }
    }
    that.setData({
      newmap: newmap,
      tcinfo: tcinfo
    })
    if (that.data.isWm == 0) {
      my.setStorage({
        key: that.data.storeId + 'newmap',
        data: newmap,
      })
    } else {
      my.setStorage({
        key: that.data.storeId + 'wmNewmap',
        data: newmap,
      })
    }

  },
  //增加
  tapAddCart: function (e) {
    var that = this;
    var g = e.currentTarget.dataset.g || e.currentTarget.dataset.tcinfo;
    var index = e.currentTarget.dataset.index;
    if (g.num.NO || g.num.NO == 0) {
      g.num = g.num.NO;
    }
    if (g.total > g.num && (g.max == 0 || g.max > g.num) && g.num < 99) {
      that.data.menu.cates.forEach(function (o, i) {
        if (o.id == g.storeCateId) {
          o.glist.forEach(function (k, j) {
            if (k.id == g.id) {
              if (!g.sns) {
                that.newmap(k.id, 1, null, k.nowPrice);
              }
              if (g.sns) {
                that.newmap(k.id, 1, g.sns[index].id, g.sns[index].price, g);
              }
              return;
            }
          })
        }
      });
      that.data.menuInfo.gCates.forEach(function (o, i) {
        if (o.id == g.cateId) {
          o.num++;
          return false;
        }
      });
      my.setStorage({
        key: that.data.storeId + 'menu',
        data: that.data.menu,
      })
      that.setData({
        menu: that.data.menu,
        menuInfo: that.data.menuInfo
      })
    }
  },
  //减少
  tapDecCart: function (e) {
    var that = this;
    var g = e.currentTarget.dataset.g || e.currentTarget.dataset.tcinfo;
    var index = e.currentTarget.dataset.index;
    var isreturn = false;
    if (g.sns) {
      that.data.menu.cates.forEach(function (k, i) {
        if (k.id == g.storeCateId) {
          k.glist.forEach(function (o, j) {
            if (o.id == g.id) {
              that.newmap(g.id, -1, g.sns[index].id, g.sns[index].price, g);
              isreturn = true;
              return;
            }
          })
        }
        if (isreturn) return;
      });
    } else {
      that.data.menu.cates.forEach(function (o, i) {
        if (o.id == g.storeCateId) {
          o.glist.forEach(function (k, j) {
            if (k.id == g.id) {
              that.newmap(k.id, -1, null, k.nowPrice);
            }
          })
        }
      });
    }
    that.data.menuInfo.gCates.forEach(function (o, i) {
      if (o.id == g.cateId) {
        o.num--
        return false;
      }
    });
    my.setStorage({
      key: that.data.storeId + 'menu',
      data: that.data.menu,
    })
    that.setData({
      menu: that.data.menu,
      menuInfo: that.data.menuInfo
    })
  },
  //提交已点菜单
  confirm: function (e) {
    var that = this;
    var array = [];
    var newmap = that.data.newmap;
    that.data.menu.cates.forEach(function (p, j) {
      p.glist.forEach(function (o, i) {
        if (newmap[o.id]) {
          if (newmap[o.id].NO > 0) {
            var goods = { id: o.id, hasSn: o.hasSn, num: newmap[o.id].NO };
            if (o.hasSn == 1) {
              var goodsSns = [];
              var snum = 0;
              o.sns.forEach(function (s, k) {
                if (newmap[o.id + '_' + s.id]) {
                  snum = newmap[o.id + '_' + s.id].NO;
                  snum = snum ? snum : 0;
                  goodsSns.push({ id: s.id, num: snum });
                }
              })
              goods.sns = goodsSns;
            }
            array.push(goods);
          }
        }
      })
    });
    var obj = { glist: array };
    var json = JSON.stringify(obj);

    if (that.data.isWm==1) {
      if (newmap.total > 0) {

        post('wxApi/wm/confirm', { jsonStr: json }, function (ret) {
          if (ret.code == 0) {
            my.setStorage({
              key: 'wm',
              data: ret.data,
            })
            var sid = my.getStorageSync({key:'sid'}).data;
            my.redirectTo({
              url: '../waimai/qrdc?strname=' + that.data.menuInfo.storeName,
            })
          } else if (ret.code == -2) {
            that.onShow();
          } else {
            tost(ret.msg);
          }

        }, true)
      } else {
        tost("请点餐！")
      }
    } else {
      if (newmap.total > 0 && newmap.amount > 0) {
        if (that.data.ydId) {
          post("wxApi/o/confirm", { ydId: that.data.ydId, jsonStr: json }, function (ret) {
            if (ret.code == 0) {
              that.data.order = ret.data;
              if (!that.data.order.remark) that.data.order.remark = '';
              that.setData({
                order: that.data.order,
                confirmslid: true,
              })
            } else if (ret.code > 0) {
              tost(ret.msg)
            } else if (ret.code == -3) {
              tost(ret.msg);
              my.navigateTo({
                url: '../index/dc',
              })
            }
          }, true)
        } else {
          if (that.data.deskId == null || that.data.deskId == '') {
            my.navigateTo({
              url: '../index/dc',
            })
            return;
          }
          post("wxApi/o/confirm", { deskId: that.data.deskId, jsonStr: json }, function (ret) {
            if (ret.code == 0) {
              that.data.order = ret.data;
              if (!that.data.order.remark) that.data.order.remark = '';
              that.setData({
                order: that.data.order,
                confirmslid: true,
              })
              var sid = my.getStorageSync({key:'sid'}).data;
            } else if (ret.code > 0) {
              tost(ret.msg);
              if (ret.msg != '您已经有一个正在进行的订单') {
                setTimeout(function () {
                  my.navigateTo({
                    url: '../index/dc',
                  })
                }, 1000)
              }
            } else if (ret.code == -2) {
              tost(ret.msg);
            }
          }, true)
        }
      } else {
        tost('请点菜');
      }
    }
  },
  addCart: function (id) {
    var num = this.data.cart.list[id] || 0;
    this.data.cart.list[id] = num + 1;
    this.countCart();
  },
  reduceCart: function (id) {
    var num = this.data.cart.list[id] || 0;
    if (num <= 1) {
      delete this.data.cart.list[id];
    } else {
      this.data.cart.list[id] = num - 1;
    }
    this.countCart();
  },
  countCart: function () {
    var count = 0,
      total = 0;
    for (var id in this.data.cart.list) {
      var goods = this.data.goods[id];
      count += this.data.cart.list[id];
      total += goods.price * this.data.cart.list[id];
    }
    this.data.cart.count = count;
    this.data.cart.total = total;
    this.setData({
      cart: this.data.cart,
    });
  },
  //滚动事件
  // // onGoodsScroll: function (e) {
  // //   if (e.detail.scrollTop > 150 && !this.data.scrollDown) {
  // //     this.setData({
  // //       scrollDown: true
  // //     });
  // //   } else if (e.detail.scrollTop < 150 && this.data.scrollDown) {
  // //     this.setData({
  // //       scrollDown: false
  // //     });
  // //   }

  // //   var scale = e.detail.scrollWidth / 585,
  // //     scrollTop = e.detail.scrollTop / scale,
  // //     h = 0,
  // //     classifySeleted,
  // //     len = this.data.menu.cates.length;
  // //   this.data.menu.cates.forEach(function 　(classify, i) {
  // //     var _h = classify.glist.length * (257) + 62;
  // //     if (scrollTop >= h - 100 / scale) {
  // //       classifySeleted = classify.title;
  // //     }
  // //     h += _h;
  // //   })
  // //   this.setData({
  // //     classifySeleted: classifySeleted
  // //   });
  // // },
  tapClassify: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      classifyViewed: id
    });
    var that = this;
    setTimeout(function () {
      that.setData({
        classifySeleted: id
      });
    }, 10);
  },
  showCartDetail: function () {
    this.setData({
      showCartDetail: !this.data.showCartDetail
    });
  },
  hideCartDetail: function () {
    this.setData({
      showCartDetail: false
    });
  },
  silde: function () {
    this.setData({
      sliding: !this.data.sliding
    })
  },
  //确认点餐
  submits: function (e) {
    console.log(e);
    formid(e.detail.formId);
    var that = this;
    var newmap = that.data.newmap;
    if (that.data.isWm == 0) {
      my.removeStorageSync({key:that.data.storeId + 'newmap'});
    } else if (that.data.isWm == 1) {
      my.removeStorageSync(that.data.storeId + 'wmNewmap');
    }
    if (newmap.total > 0 && newmap.amount > 0) {
      var obj = { list: that.data.order.list };
      var json = JSON.stringify(obj);
      if (that.data.ydId) {
        post("/wxApi/o/add", { ydId: that.data.ydId, remark: that.data.order.remark, jsonStr: json }, function (ret) {
          if (ret.code == 0) {
            that.data.orderId = ret.msg;
            that.setData({
              dcslid: true,
              orderId: ret.msg
            })
          } else if (ret.code = -2) {
            tost(ret.msg);
            that.onShow();
          } else {
            tost(ret.msg);
          }
        }, true);
      } else {
        post("/wxApi/o/add", { deskId: that.data.deskId, remark: that.data.order.remark, jsonStr: json }, function (ret) {
          if (ret.code == 0) {
            that.data.orderId = ret.msg;
            if (that.data.menuInfo.mode == 2) {
              my.redirectTo({
                url: '../index/zf?id=' + that.data.orderId,
              })
            } else {
              that.setData({
                dcslid: true,
                orderId: ret.msg
              })
            }
          } else if (ret.code = -2) {
            tost(ret.msg);
            that.onShow();
          } else {
            tost(ret.msg);
          }
        }, true);
      }
    }
  },
  remark: function (e) {
    this.data.order.remark = e.detail.value;
    this.setData({
      order: this.data.order,
    })
  },
  goback: function () {
    this.setData({
      confirmslid: false,
    })
  },
  faslid: function () {
    this.setData({
      faslid: !this.data.faslid
    })
  },
  faback: function () {
    this.setData({
      faslid: false,
    })
  },
  goddxq: function () {
    my.navigateTo({
      url: '../index/ddxq-wzf'
    })
  },
  //查看订单
  ckdd: function () {
    my.redirectTo({
      url: '../index/ddxq?id=' + this.data.orderId,
    })
  },
  ljzf: function () {
    my.redirectTo({
      url: '../index/zf?id=' + this.data.orderId,
    })
  },
  onShareAppMessage: function (res) {
  },
  // 更换页面到指定page ，从0开始
  updateSelectedPage(page) {
    let that = this;
    let { window_width, tab_config, swipe_config } = this.data;
    let underline_offset = tab_config.item_width * page;

    tab_config.active_tab = page;
    swipe_config.current = page;
    tab_config.underline.offset = underline_offset;
    if (!tab_config.fixed) {
      // 如果tab不是固定的 就要 检测tab是否被遮挡
      let show_item_num = Math.round(window_width / tab_config.item_width); // 一个界面完整显示的tab item个数
      let min_left_item = tab_config.item_width * (page - show_item_num + 1); // 最小scroll-left 
      let max_left_item = tab_config.item_width * page; //  最大scroll-left
      if (tab_config.tab_left < min_left_item || tab_config.tab_left > max_left_item) {
        // 如果被遮挡，则要移到当前元素居中位置
        tab_config.tab_left = max_left_item - (window_width - tab_config.item_width) / 2;
      }
    }
    that.setData({
      "tab_config": tab_config,
      "swipe_config": swipe_config
    });
  },
  handlerTabTap(e) {
    let that = this;
    that.updateSelectedPage(e.currentTarget.dataset.index);
  },
  swiperChange(e) {
    let that = this;
    that.updateSelectedPage(e.detail.current);
  },
  onScroll(e) {
    let that = this;
  },
  tcshow: function (e) {
    var that = this;
    var newmap = that.data.newmap;
    var obj = e.currentTarget.dataset.g;
    if (obj.hasSn) {
      obj.sns.forEach(function (s, j) {
        if (newmap[obj.id + '_' + s.id] > 0) {
          s.num = newmap[obj.id + '_' + s.id] > 0;
        }
      })
    } else {
      if (newmap[obj.id] > 0) {
        obj.num = newmap[obj.id]
      }
    }
    var tcimgs = obj.imgs.split(",");
    that.setData({
      tcinfo: obj,
      tcshow: true,
      tcimgs: tcimgs
    })
  },
  tcdown: function () {
    this.setData({
      tcshow: false
    })
  },
  get: function () {
    my.navigateTo({
      url: '../mypage/qyhq',
    })
  },
  shutDown: function () {
    my.removeStorageSync('sendInfo');
    this.setData({
      sendShow: false
    })
  },
  shutDown1: function () {
    this.setData({
      robShow: false
    })
  },
  goyhq: function () {
    my.navigateTo({
      url: '../mypage/qyhq',
    })
  },
  empty: function () {
    this.data.newmap = {};
    this.data.menuInfo.gCates = {};
    if (this.data.isWm == 0) {
      my.removeStorage({
        key: this.data.storeId + 'newmap',
        success: function (res) { },
      })
    } else if (isWm == 1) {
      my.removeStorage({
        key: this.data.storeId + 'wmNewmap',
        success: function (res) { },
      })
      this.setData({
        newmap: this.data.newmap,
        menuInfo: this.data.menuInfo,
        showCartDetail: false
      })
    }
  },
  goDetail: function () {
    var deskId = this.data.deskId;
    var storeId = this.data.storeId;
    if (deskId && storeId) {
      my.redirectTo({
        url: '../index/mdxq?id=' + storeId + "&deskId=" + deskId + "&storeId=" + storeId,
      })
    } else {
      my.redirectTo({
        url: '../index/mdxq?id=' + storeId
      })
    }
  }
});

