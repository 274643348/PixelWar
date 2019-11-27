import { GameConfig } from '../GameScripts/GameConfig';
import { getRandomInt } from '../GameScripts/Utils/random';
import { gameTools } from './GameTools';
import { wxSDK } from './WXSDK';

const { ccclass, property } = cc._decorator;

@ccclass
export class TestWeChart extends cc.Component {
  @property(cc.Label)
  label: cc.Label;

  @property(cc.Node)
  touxiang: cc.Node;

  @property(cc.Node)
  opendataRoot: cc.Node;

  private tex: cc.Texture2D;
  onLoad() {
    wxSDK.setUserCloudStorage({
      key: "xClassic",
      value: "" + getRandomInt(10, 1000)
    });
    this.tex = new cc.Texture2D();

    //监听小游戏回到前台的事件
    wx.onShow(function(res) {
      console.log("onshow ------ res", res);

      if (res.shareTicket != undefined && res.shareTicket.length > 0) {
        console.log("postMessage--5--success");
        wx.postMessage({
          messageType: 5,
          MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
          shareTicket: res.shareTickets[0]
        });
      }
    });
  }

  start() {
    //111111111
    setTimeout(() => {
      this.loadingResource();
    }, 10);
  }
  loadingResource() {
    //22222222
    GameConfig.IS_GAME_MUSIC = gameTools.getItemByLocalStorage(
      "IS_GAME_MUSIC",
      true
    );
    GameConfig.GameHeightScore = gameTools.getItemByLocalStorage(
      "GameHeightScore",
      0
    );
    // 提前记载需要的图集
    // this.initFrameCache();
    // this.initWxSetting();
    //加载并切换到主界面
    // cc.director.preloadScene("MenuUI", function () {
    //   cc.director.loadScene("MenuUI");
    // });
  }

  //33333333
  initWxSetting() {
    //右上角“...”显示分享按钮
    wxSDK.showMenu();

    //游戏圈
    GameConfig.GameClubButton = wxSDK.createGameClub();
    GameConfig.GameClubButton.show();

    //对用户托管数据进行写数据操作
    if (gameTools.getItemByLocalStorage("UserPlayGame", true)) {
      cc.sys.localStorage.setItem("UserPlayGame", false);
      // 对用户托管数据进行写数据操作
      wxSDK.setUserCloudStorage({ key: "UserPlayGame", value: "1" });
    }
    // 获取小游戏启动时的参数。
    wxSDK.LaunchOptions();
  }

  initFrameCache() {
    //加载图集
    // cc.loader.loadRes("watchout", cc.SpriteAtlas, function(err, atlas) {
    //   gameTools.love2048FrameCache = atlas;
    // });
    // 使用图集
    // let messageBack = new cc.Node();
    // messageBack.addComponent(cc.Sprite).spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("messageBox0");
    // messageBack.setPosition(x, y);
    // messageBack.rotation = rotation;
    // messageBack.opacity = 0;
    // parentNode.addChild(messageBack);
  }

  // // 刷新开放数据域的纹理
  // updateSubDomainCanvas() {
  //   if (!this.tex) {
  //     return;
  //   }
  //   var openDataContext = wx.getOpenDataContext();
  //   var sharedCanvas = openDataContext.canvas;
  //   this.tex.initWithElement(sharedCanvas);
  //   this.tex.handleLoadedTexture();
  //   this.opendataRoot.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(
  //     this.tex
  //   );
  // }
  // update() {
  //   this.updateSubDomainCanvas();
  // }

  loginEvent(event: cc.Event.EventTouch, customEventData: any) {
    console.log("ljy------loginevent");
    wxSDK.login(this.label);

    wxSDK.getUserInfoSetting(this.touxiang);

    //域名被限制
    // var remoteUrl = "http://172.16.0.143:8080/static/img/tuoyuan.png";
    // cc.loader.load(remoteUrl, function (err, texture) {
    //     // Use texture to create sprite frame
    //     const sf = new cc.SpriteFrame();
    //     sf.setTexture(texture)
    //     this.touxiang.getCompment(cc.Sprite).SpriteFrame = sf;
    // });
  }

  GameClubEvent(event: cc.Event.EventTouch, customEventData: any) {
    console.log("ljy------GameClubEvent");
    wxSDK.createGameClub();
  }

  hideMenuEvent(event: cc.Event.EventTouch, customEventData: any) {
    console.log("ljy------hideMenuEvent");
    wxSDK.hideMenu();
  }

  showMenuEvent(event: cc.Event.EventTouch, customEventData: any) {
    console.log("ljy------ShowMenuEvent");
    wxSDK.showMenu();
  }

  shareEvent(event: cc.Event.EventTouch, customEventData: any) {
    console.log("ljy------shareEvent");
    wxSDK.shareAppMessage("shareTicket");
  }

  getGroupCloudStorage(event: cc.Event.EventTouch, customEventData: any) {
    console.log("ljy------getGroupCloudStorage");
    wxSDK.my_postMessage("3", "");
    wxSDK.shareAppMessage("shareTicket");
  }

  getFriendCloudStorage(event: cc.Event.EventTouch, customEventData: any) {
    console.log("ljy------getFriendCloudStorage");
    wxSDK.my_postMessage("2", "");

    gameTools.getRankData(null);
  }

  getUserCloudStorage(event: cc.Event.EventTouch, customEventData: any) {
    console.log("ljy------getUserCloudStorage");
    wxSDK.my_postMessage("1", "");
  }

  showBanner(event: cc.Event.EventTouch, customEventData: any) {
    console.log("ljy------showBanner");
    wxSDK.my_showBanner();
  }
  showRewardedVideoAd(event: cc.Event.EventTouch, customEventData: any) {
    console.log("ljy------showRewardedVideoAd");
    wxSDK.my_showRewardedVideoAd();
  }

  runData(event: cc.Event.EventTouch, customEventData: any) {
    console.log("ljy------getgetWeRunDataSetting");
    wxSDK.getgetWeRunDataSetting();
  }
  location(event: cc.Event.EventTouch, customEventData: any) {
    console.log("ljy------getgetWegetLocationSetting");
    wxSDK.getgetWegetLocationSetting();
  }
}
