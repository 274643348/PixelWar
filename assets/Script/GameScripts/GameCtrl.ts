import { Player } from "./Player";
import { ENEMYTYPE } from "./GameConfig";
import { getRandomInt } from "./Utils/random";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameCtrl extends cc.Component {
  //敌人层
  @property(cc.Node)
  enemyPanel: cc.Node;

  //敌人预制体
  @property([cc.Prefab])
  enemyPres: cc.Prefab[] = [];

  //Goods层
  @property(cc.Node)
  goodsPanel: cc.Node;

  @property(cc.Node)
  coinPanel: cc.Node;

  @property(cc.Prefab)
  goodsPre: cc.Prefab;

  @property(cc.Prefab)
  coinPre: cc.Prefab;

  @property(cc.Node)
  touchCtrLayer: cc.Node;

  @property(cc.Node)
  player: cc.Node;

  @property(cc.Label)
  scoreLabel: cc.Label;

  // LIFE-CYCLE CALLBACKS:

  private goldScore: number = 0;

  private killNum: number = 0;
  onLoad() {
    let manager = cc.director.getCollisionManager();
    manager.enabled = true;
    // manager.enabledDebugDraw = true;
  }
  update() {
    //敌人小于3个,直接创造normal怪
    if (this.enemyPanel.children.length < 3) {
      this.createEnemy(ENEMYTYPE.LRUP);
    }

    if (this.coinPanel.children.length < 3) {
      this.createCoin();
    }
    // if (this.goodsPanel.children.length < 1) {
    //   this.createGoods();
    // }
    // let getRandomInt = function(min: number, max: number) {
    //   const minCeil = Math.ceil(min);
    //   const maxFloor = Math.floor(max);
    //   return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
    // };
    //测试子弹方向是否与移动方向相同逻辑
    // if (this.enemyPanel.children.length < 20) {
    //   let enemyItem = cc.instantiate(this.bulletPre);
    //   enemyItem.getComponent(BulletMoveBase).direction = cc.v2(
    //     getRandomInt(-100, 101),
    //     getRandomInt(-100, 101)
    //   );
    //   enemyItem.position = cc.v2(0, 0);
    //   this.enemyPanel.addChild(enemyItem);
    // }
  }

  onEnable() {
    this.addTouchEvent();
  }

  onDisable() {
    this.removeTouchEvent();
  }

  addTouchEvent() {
    this.touchCtrLayer.on(
      cc.Node.EventType.TOUCH_START,
      this.touchStartEvent,
      this
    );
    this.touchCtrLayer.on(
      cc.Node.EventType.TOUCH_END,
      this.touchEndEvent,
      this
    );
  }
  removeTouchEvent() {
    this.touchCtrLayer.off(
      cc.Node.EventType.TOUCH_START,
      this.touchStartEvent,
      this
    );
    this.touchCtrLayer.off(
      cc.Node.EventType.TOUCH_END,
      this.touchEndEvent,
      this
    );
  }

  touchStartEvent(event: cc.Event.EventTouch) {
    let touchLoc = event.getLocation();
    if (
      cc.Intersection.pointInPolygon(
        this.player.convertToNodeSpaceAR(touchLoc),
        this.player.getComponent(cc.PolygonCollider).points
      )
    ) {
      //   console.log("hit");
    } else {
      // console.log("not hit");
    }
  }

  touchEndEvent(event: cc.Event.EventTouch) {
    //记录点击位置;
    let startTouchPos = cc.v2(event.getStartLocation());
    let endTouchPos = cc.v2(event.getLocation());
    // console.log(startTouchPos.x+"-------startTouchPos-------"+startTouchPos.y);
    // console.log(endTouchPos.x+"--------endTouchPos------"+endTouchPos.y);

    let delta = endTouchPos.sub(startTouchPos);
    Math.abs(delta.x) > Math.abs(delta.y) ? (delta.y = 0) : (delta.x = 0);

    if (delta.x === 0 && delta.y === 0) {
      return;
    }

    this.player.getComponent(Player).setDirection(delta);
    // let startNodePos = this.touchCtrLayer.convertToNodeSpaceAR(startTouchPos);
    // let endNodePos = this.touchCtrLayer.convertToNodeSpaceAR(endTouchPos);
    // console.log(startNodePos.x+"-------startNodePos-------"+startNodePos.y);
    // console.log(endNodePos.x+"--------endNodePos------"+endNodePos.y);
  }

  addScore(score: number) {
    this.goldScore = this.goldScore + score;
    this.scoreLabel.string = this.goldScore + "";

    //TODO 根据分数创造敌人
    this.createEnemy(getRandomInt(ENEMYTYPE.LRUP, ENEMYTYPE.SNAKE + 1));

    //TODO 根据分数创造子弹
    this.createGoods();

    //TODO 游戏过关,或boss来袭;
    if (this.goldScore === 10) {
      this.onPauseButton();
    }
  }

  KillEnemy(score: number) {
    this.killNum += score;

    //敌人小于3个,直接创造normal怪
    if (this.enemyPanel.children.length < 3) {
      this.createEnemy(ENEMYTYPE.LRUP);
    }
  }

  createCoin() {
    let coinItem = cc.instantiate(this.coinPre);
    this.coinPanel.addChild(coinItem);
  }

  ///////////////////////////////////////////
  /**
   * 创建敌人
   * @param type 怪物类型
   */
  createEnemy(type: ENEMYTYPE) {
    let enemyItem = cc.instantiate(this.enemyPres[type]);
    this.enemyPanel.addChild(enemyItem);
  }

  /**
   * 创建物品
   */
  createGoods() {
    let enemyItem = cc.instantiate(this.goodsPre);
    this.goodsPanel.addChild(enemyItem);
  }

  ///////////////////////////////////////////
  private onPauseButton() {
    if (!cc.game.isPaused()) {
      // 在Web中，cc.game.pause();会立刻停止渲染，所有无法显示popup面板，所以将game暂停放在下一帧。
      this.scheduleOnce(() => {
        cc.game.pause();
      }, 0);
    }
  }

  private onContinueButton() {
    cc.game.resume();
  }

  private onExitButton() {
    cc.game.resume();
    // cc.game.restart();
  }
}
