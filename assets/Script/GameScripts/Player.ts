import GameCtrl from "./GameCtrl";
import { BulletMoveBase } from "./Bullet/BulletMoveBase";

const { ccclass, property } = cc._decorator;

enum BULLETTYPE {
  FIRE,
  NORMAL,
  HOLE,
  MOON
}

@ccclass
export default class Player extends cc.Component {
  @property(cc.Node)
  enemyPanel: cc.Node;

  @property(cc.Node)
  gameCtrlNode: cc.Node;

  @property([cc.Prefab])
  bulletPres: cc.Prefab[] = [];

  @property(cc.Node)
  bulletFire: cc.Node;

  @property
  speed: number = 10;

  @property
  isStop: boolean = false;
  // LIFE-CYCLE CALLBACKS:

  public direction = cc.v2(1, 0);

  // onLoad () {}

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
    this.initFire(BULLETTYPE.HOLE);
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

  /**
   * 初始化开火--------开会频率
   */
  initFire(bullet: BULLETTYPE) {
    this.bulletFire.active = false;
    this.unschedule(this.FireNormal);
    this.unschedule(this.FireHole);
    this.unschedule(this.FireMoon);

    switch (bullet) {
      case BULLETTYPE.FIRE:
        this.FireFire();
        break;
      case BULLETTYPE.NORMAL:
        this.schedule(this.FireNormal, 0.1, cc.macro.REPEAT_FOREVER);
        break;
      case BULLETTYPE.HOLE:
        this.schedule(this.FireHole, 1, cc.macro.REPEAT_FOREVER);
        break;
      case BULLETTYPE.MOON:
        this.schedule(this.FireMoon, 1, cc.macro.REPEAT_FOREVER);
        break;
    }
  }

  FireFire() {
    this.bulletFire.active = true;
  }
  FireNormal() {
    this.createBullet(this.node.position, this.direction, BULLETTYPE.NORMAL);
  }
  FireHole() {
    this.createBullet(this.node.position, this.direction, BULLETTYPE.HOLE);
  }
  FireMoon() {
    this.createBullet(this.node.position, this.direction, BULLETTYPE.MOON);
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
