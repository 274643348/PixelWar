import GameCtrl from "./GameCtrl";
import { BulletMoveBase } from "./Bullet/BulletMoveBase";
import { MyGoodsCtrl, BULLETTYPE } from "./Goods/MyGoodsCtrl";
import { MyCoinCtrl } from "./Goods/MyCoinCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export class Player extends cc.Component {
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
    // this.startFire(BULLETTYPE.FIRE);
  }

  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    // console.log('on collision enter');
    // console.log(other);

    //碰撞敌人
    if (other.node.group === "enemy") {
      // this.KillEnemy();
      // this.addScore(-1);
      //TODO 玩家减去一条生命;
    }

    //碰撞敌人子弹
    if (other.node.group === "enemyBullet") {
      other.node.getComponent(BulletMoveBase).die();
      // this.addScore(-1);
      //TODO 玩家减去一条生命;
    }

    //碰撞物品
    if (other.node.group === "goods") {
      //碰撞子弹
      if (other.node.getComponent(MyGoodsCtrl)) {
        this.startFire(other.node.getComponent(MyGoodsCtrl).bulletType);
        other.node.getComponent(MyGoodsCtrl).die();
      } else if (other.node.getComponent(MyCoinCtrl)) {
        //碰撞金币
        this.addScore(other.node.getComponent(MyCoinCtrl).score);
        other.node.getComponent(MyCoinCtrl).die();
      }
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
    this.bulletFire.active = false;
  }

  /**
   * 初始化开火--------开火频率
   */
  startFire(bullet: BULLETTYPE) {
    this.BulletType = bullet;
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

  KillEnemy() {
    this.gameCtrlNode.getComponent(GameCtrl).KillEnemy(1);
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
