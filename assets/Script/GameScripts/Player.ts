import GameCtrl from "./GameCtrl";
import { BulletMoveBase } from "./Bullet/BulletMoveBase";
import { Goods } from "./Goods/Goods";
import { delayCallFunc } from "./Utils/random";

const { ccclass, property } = cc._decorator;

export enum BULLETTYPE {
  FIRE,
  NORMAL,
  HOLE,
  MOON,
  NONE
}

@ccclass
export default class Player extends cc.Component {
  //敌人容器
  @property(cc.Node)
  enemyPanel: cc.Node;

  @property(cc.Node)
  gameCtrlNode: cc.Node;

  //子弹预制体
  @property([cc.Prefab])
  bulletPres: cc.Prefab[] = [];

  //火焰子弹
  @property(cc.Node)
  bulletFire: cc.Node;

  //移动速度
  @property
  speed: number = 10;

  @property
  isStop: boolean = false;
  // LIFE-CYCLE CALLBACKS:

  public direction = cc.v2(1, 0);

  // onLoad () {}

  public BulletType: BULLETTYPE = BULLETTYPE.NONE;
  update(dt: any) {
    if (this.isStop) {
      return;
    }

    let move = cc.v2(
      this.direction.x * this.speed,
      this.direction.y * this.speed
    );
    this.node.setPosition(cc.v2(this.node.getPosition()).add(move));

    if (this.node.getPositionX() > 1080 / 2) {
      this.node.x = -1080 / 2;
    }
    if (this.node.getPositionX() < -1080 / 2) {
      this.node.x = 1080 / 2;
    }
    if (this.node.getPositionY() > 1920 / 2) {
      this.node.y = -1920 / 2;
    }
    if (this.node.getPositionY() < -1920 / 2) {
      this.node.y = 1920 / 2;
    }
  }

  start() {
    //测试开火
    // this.startFire(BULLETTYPE.HOLE);
  }

  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    // console.log('on collision enter');
    // console.log(other);
    if (other.node.group === "enemy") {
      this.addScore(-1);
    }

    if (other.node.group === "enemyBullet") {
      other.node.getComponent(BulletMoveBase).die();
      this.addScore(-1);
    }

    if (other.node.group === "goods") {
      this.startFire(other.node.getComponent(Goods).bulletType);
      other.node.getComponent(Goods).die();
    }

    // other.
    // this.isStop = true;
  }

  // onCollisionStay(other, self){
  //     console.log('on collision stay');
  // }

  setDirection(dir: cc.Vec2) {
    dir.normalizeSelf();
    // console.log(dir.x +"****"+dir.y);
    this.direction = dir;
  }

  stopAllFire() {
    this.bulletFire.active = false;
    this.unschedule(this.FireBullet);
  }

  /**
   * 初始化开火--------开火频率
   */
  startFire(bullet: BULLETTYPE) {
    this.unschedule(this.stopAllFire);
    this.stopAllFire();
    switch (this.BulletType) {
      case BULLETTYPE.FIRE:
        this.schedule(this.FireBullet, 0.1, cc.macro.REPEAT_FOREVER);
        this.scheduleOnce(this.stopAllFire, 5);
        break;
      case BULLETTYPE.NORMAL:
        this.schedule(this.FireBullet, 0.1, cc.macro.REPEAT_FOREVER);
        this.scheduleOnce(this.stopAllFire, 5);
        break;
      case BULLETTYPE.HOLE:
        this.schedule(this.FireBullet, 1, cc.macro.REPEAT_FOREVER);
        this.scheduleOnce(this.stopAllFire, 5);
        break;
      case BULLETTYPE.MOON:
        this.schedule(this.FireBullet, 1, cc.macro.REPEAT_FOREVER);
        this.scheduleOnce(this.stopAllFire, 5);
        break;
    }
  }

  FireBullet() {
    switch (this.BulletType) {
      case BULLETTYPE.FIRE:
        this.bulletFire.active = true;
        break;
      case BULLETTYPE.NORMAL:
      case BULLETTYPE.HOLE:
      case BULLETTYPE.MOON:
        this.createBullet(this.node.position, this.direction, this.BulletType);
        break;
    }
  }

  addScore(score: number) {
    this.gameCtrlNode.getComponent(GameCtrl).addScore(score);
  }

  createBullet(pos: cc.Vec2, dir: cc.Vec2, index: BULLETTYPE) {
    if (index === BULLETTYPE.FIRE) {
      return;
    }
    let bulletItem = cc.instantiate(this.bulletPres[index]);
    bulletItem.getComponent(BulletMoveBase).direction = cc.v2(dir);
    bulletItem.position = cc.v2(pos);
    // enemyItem.getComponent(BulletMoveBase).player = this.player;
    this.enemyPanel.addChild(bulletItem);
  }
}
