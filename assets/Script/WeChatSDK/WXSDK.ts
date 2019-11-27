import { gameTools } from './GameTools';

class WXSDK {
  login(lable: cc.Label) {
    wx.login({
      success(res) {
        lable.string = `${res.code}`;
        if (res.code) {
          console.log("登录成功！");
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      }
    });
  }

  //获取授权个人信息
  getUserInfoSetting(lable: cc.Node) {
    console.log("获取授权个人信息权限");
    try {
      //获取微信界面大小
      let sysInfo = wx.getSystemInfoSync();
      width = sysInfo.screenWidth;
      height = sysInfo.screenHeight;
    } catch (e) {
      console.log("获取系统参数失败");
    }

    wx.getSetting({
      success(res) {
        console.log(res.authSetting);
        if (res.authSetting["scope.userInfo"]) {
          console.log("userInfo 已经授权");
          //获取用户信息
          wxSDK.getUserInfo(lable);
        } else {
          console.log("userInfo 未授权");
          wxSDK.createUserInfoButton(lable);
          // //请求用户信息
          // if (res.authSetting["scope.userInfo"] === false) {
          //   console.log("用户 userInfo 已经拒绝");
          //   // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
          //   // 方式一:通过button可以实现继续授权;
          //   wxSDK.createUserInfoButton(lable);
          // } else {
          //   // console.log("用户 userInfo 首次操作");
          //   // console.log(res.authSetting)
          //   // createUserInfoButton(lable);
          //   // 下放方法可以申请地理位置,运动步数,保存到相册;
          //   wx.authorize({
          //     scope: "scope.userInfo",
          //     success() {
          //       console.log("用户 成功 授权");
          //       wxSDK.getUserInfo(lable);
          //     },
          //     fail() {
          //       console.log("用户 拒绝 授权");
          //       // 方式一:
          //       wxSDK.createUserInfoButton(lable);
          //       // 方式二:调起客户端小程序设置界面
          //       //  wx.openSetting({
          //       //   success(res) {
          //       //     console.log(res.authSetting);
          //       //     wxSDK.getUserInfo(lable);
          //       //   }
          //       // }
          //     }
          //   });
          // }
        }
      }
    });
  }

  getUserInfo(lable: cc.Node) {
    wx.getUserInfo({
      success(res) {
        console.log("getUserInfo success ");
        console.log("res is ", res);
        console.log("在微信登录里面昵称是 :" + res.userInfo.nickName);
        console.log("用户头像信息 :" + res.userInfo.avatarUrl);

        //必须加上?aa=aa.jpg
        cc.loader.load(res.userInfo.avatarUrl + "?aa=aa.jpg", function(
          err,
          texture
        ) {
          // Use texture to create sprite frame
          const sf = new cc.SpriteFrame();
          sf.setTexture(texture);
          lable.getComponent(cc.Sprite).spriteFrame = sf;
        });
      },
      fail: function() {
        console.log("getUserInfo fail ");
      },
      complete: function() {
        console.log("getUserInfo complete ");
      }
    });
  }

  createUserInfoButton(lable: cc.Node) {
    console.log("width", width);
    console.log("height", height);
    const button = wx.createUserInfoButton({
      type: "text",
      text: "获取用户信息",
      style: {
        left: width / 2 - 100,
        top: height / 2 - 20,
        width: 200,
        height: 40,
        lineHeight: 40,
        backgroundColor: "#ff0000",
        color: "#ffffff",
        textAlign: "center",
        fontSize: 16,
        borderRadius: 4
      }
    });

    button.onTap(res => {
      if (res.userInfo) {
        console.log("用户授权:", res);
        //此时可进行登录操作

        //获取用户信息
        wxSDK.getUserInfo(lable);
        button.destroy();
      } else {
        console.log("用户拒绝授权:", res);
        button.destroy();
      }
    });
  }

  /////////////////////////////游戏圈相关
  createGameClub() {
    console.log("ljy------CreateClub");

    let info = window.wx.getSystemInfoSync();
    const button = wx.createGameClubButton({
      icon: "green",
      style: {
        left: info.windowWidth / 6,
        top: (info.windowHeight * 91) / 100,
        width: 40,
        height: 40
      }
    });

    button.hide();
    return button;
  }

  ////////////////////////////分享功能

  showMenu() {
    console.log("ljy------showShareMenu");
    //更多转发信息 设置 withShareTicket 为 true
    wx.showShareMenu({ withShareTicket: true });

    wx.updateShareMenu({
      withShareTicket: true
    });
  }

  onShareAppMessage() {
    wx.onShareAppMessage(function() {
      // 用户点击了“转发”按钮
      return {
        title: "玩家手动",
        // TODO
        // imageUrl: canvas.toTempFilePathSync({
        //     destWidth: 500,
        //     destHeight: 400
        // })
        //imageUrl: this.data.shareImage,

        //https://developers.weixin.qq.com/community/develop/doc/0000447a5b431807af57249a551408
        //微信
        success(res) {
          console.log("onShareAppMessage ----- success");
        }
      };
    });
  }

  hideMenu() {
    wx.hideShareMenu();
  }

  shareAppMessage(pictureName: string) {
    // wx.shareAppMessage({
    //   title: "直接分享"
    // });

    let titleStr = "快来跟我一起挑战大鸟撞小鸟吧。";
    if ("shareTicket" == pictureName) {
      titleStr = "看看你在群里排第几？快来和我挑战大鸟撞小鸟吧。";
    } else if (pictureName != undefined && pictureName != null) {
      // titleStr = "我得了" + pictureName + "分," + titleStr;
    }
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.shareAppMessage({
        title: titleStr,
        query: "x=" + GameConfig.MAIN_MENU_NUM,
        // imageUrl: canvas.toTempFilePathSync({
        //     destWidth: 500,
        //     destHeight: 400
        // }),
        success(res) {
          console.log("shareAppMessage----success", res);
          if (res.shareTickets != undefined && res.shareTickets.length > 0) {
            if ("shareTicket" == pictureName) {
              wx.postMessage({
                messageType: 5,
                MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                shareTicket: res.shareTickets[0]
              });
            }
          }
        }
      });
    } else {
      wxSDK.toastMessage(1);
      cc.log("执行了截图" + titleStr);
    }
  }

  //////////////////////////////获取好友链,群玩家数据链

  LaunchOptions() {
    //如果小游戏启动时的参数存在则显示好友排行
    let LaunchOption = wx.getLaunchOptionsSync();
    console.log("launchOptions---query", LaunchOption.query);
    console.log("launchOptions---shareTicket", LaunchOption.shareTicket);

    if (LaunchOption.shareTicket != undefined) {
      setTimeout(() => {
        console.log("shareTicket", LaunchOption);
        gameTools.getRankData(LaunchOption.shareTicket);
      }, 3000);
    }
  }
  //调用会失败(必须放在开放数据域中)
  getGroupCloudStorage() {
    wx.getGroupCloudStorage({
      keyList: ["score"], // 你要获取的、托管在微信后台都key
      success: res => {
        console.log("getGroupCloudStorage      success ------", res.data);
      },
      fail: res => {
        console.log("getGroupCloudStorage      fail ------", res.data);
      }
    });
  }
  //调用会失败(必须放在开放数据域中)
  getFriendCloudStorage() {
    wx.getFriendCloudStorage({
      keyList: ["score"], // 你要获取的、托管在微信后台都key
      success: res => {
        console.log("getFriendCloudStorage      success ------", res.data);
      },
      fail: res => {
        console.log("getFriendCloudStorage      fail ------", res.data);
      }
    });
  }
  //调用会失败(必须放在开放数据域中)
  getUserCloudStorage(score: string, label: cc.Label) {
    wx.getUserCloudStorage({
      keyList: [score],
      success(res) {
        console.log("getUserCloudStorage success ---  ", res);
        // label.string = res[score];
      }
    });
  }

  //主域和开放数据域的通信---开放数据域不能向主域发送消息。
  my_postMessage(type: string, data: string) {
    // const openDataContext = wx.getOpenDataContext();
    // /**
    //  * type
    //  * 1:getUserCloudStorage
    //  * 2:getFriendCloudStorage
    //  * 3:getGroupCloudStorage
    //  */
    // openDataContext.postMessage({
    //   text: type,
    //   data: data
    // });
  }

  //////////////////////////////托管用户数据
  setUserCloudStorage(data: any) {
    wx.setUserCloudStorage({
      KVDataList: [data],
      success: res => {
        console.log("setUserCloudStorage success ---  ", res);
      },
      fail: res => {
        console.log("setUserCloudStorage fail ---  ", res);
      }
    });
  }

  ////////////////////////////////广告
  private bannerAd: any;
  my_showBanner() {
    /**
     * 每个 BannerAd 实例在创建后会去拉取一次广告数据并进行渲染，在此之后不再更新。
     * 如果想要展示其他内容的 BannerAd，需要创建新的 BannerAd 并将之前的 BannerAd 进行销毁。
     */
    if (wxSDK.bannerAd !== null) {
      wxSDK.bannerAd.destroy();
    }

    const { screenWidth } = wx.getSystemInfoSync();

    wxSDK.bannerAd = wx.createBannerAd({
      adUnitId: "0",
      style: {
        left: screenWidth / 2 - 150,
        top: 76,
        width: 320
      }
    });

    //拉取失败
    wxSDK.bannerAd.onError(err => {
      console.log("banner 广告加载失败");
      console.log(err);
    });

    //拉去成功
    thwxSDKis.bannerAd.onLoad(() => {
      console.log("banner 广告加载成功");
      wxSDK.bannerAd
        .show()
        .then(() => console.log("banner 广告显示"))
        .catch(err => console.log("bannerAd--load--", err));
    });
  }

  private rewardedVideoAd: any;
  my_showRewardedVideoAd() {
    if (wxSDK.rewardedVideoAd === null) {
      wxSDK.rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: "0" });
      //加载失败;
      wxSDK.rewardedVideoAd.onError(err => {
        console.log(err);
        //重新拉去
        wxSDK.rewardedVideoAd.onLoad();
      });

      //加载成功
      wxSDK.rewardedVideoAd.onLoad(() => {
        console.log("激励视频 广告加载成功");
        wxSDK.rewardedVideoAd
          .show()
          .then(() => console.log("激励视频 广告显示"))
          .catch(err => console.log(err));
      });

      //监听用户关闭
      thwxSDKis.rewardedVideoAd.onClose(res => {
        // 用户点击了【关闭广告】按钮
        // 小于 2.1.0 的基础库版本，res 是一个 undefined
        if ((res && res.isEnded) || res === undefined) {
          // 正常播放结束，可以下发游戏奖励
          console.log("正常播放结束");
        } else {
          // 播放中途退出，不下发游戏奖励
          console.log("播放中途退出");
        }
      });
    } else {
      wxSDK.rewardedVideoAd
        .show()
        .then(() => console.log("激励视频 广告显示"))
        .catch(err => console.log(err));
    }
  }
  ///
  getRandomInt(min: number, max: number) {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
  }
}

export const wxSDK = new WXSDK();

//获取微信界面大小
let width = 0;
let height = 0;
