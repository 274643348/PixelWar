import EnemyMoveBase from "../Enemy/EnemyMoveBase";
import Player from "../Player";

const { ccclass, property } = cc._decorator;

/**
 * 左右上下移动的怪物
 */
@ccclass
export default class BulletMoveBase extends cc.Component {
  //子弹图片是否旋转
  @property
  autoRotation: boolean = true;

  //速度
  @property
  speed: number = 10;

  //攻击力
  @property
  hitNum: number = 1;

  //方向
  public direction = cc.v2(0, 1);
  public isStop: boolean = false;
  public player: cc.Node;
  onLoad() {
    this.initEnemy(this.direction, this.speed);
  }

  /**
   * 初始化敌人---初始位置,初始方向,速度.......
   */
  initEnemy(direction: cc.Vec2, speed: number = 10) {
    this.node.rotation = 0;
    this.direction = direction.normalizeSelf();
    this.speed = speed;
  }

  update() {
    if (this.isStop) {
      return;
    }
    this.updataPos();
    this.updataRotation();
  }

  /**
   * 位置刷新
   */
  updataPos() {
    let move = cc.v2(
      this.direction.x * this.speed,
      this.direction.y * this.speed
    );
    this.node.setPosition(cc.v2(this.node.getPosition()).add(move));

    if (
      Math.abs(this.node.getPositionX()) > 1080 / 2 ||
      Math.abs(this.node.getPositionY()) > 1920 / 2
    ) {
      this.die();
    }
  }

  updataRotation() {
    if (!this.autoRotation) {
      return;
    }

    // if (this.oldPos.x < this.node.x) {
    //   this.node.scaleX = -1 * Math.abs(this.node.scaleX);
    // } else {
    //   this.node.scaleX = Math.abs(this.node.scaleX);
    // }

    const angle = Math.atan2(this.direction.y, this.direction.x);
    // 获取旋转角度（-180 -- 180）
    let rotation = (-1 * (angle * 180)) / Math.PI;

    // if (rotation >= 90) {
    //   rotation = rotation - 180;
    // } else if (rotation <= -90) {
    //   rotation = 180 + rotation;
    // }
    this.node.rotation = rotation;

    // this.oldPos = this.node.position;
  }

  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    // console.log('on collision enter');
    // console.log(other);
    if (other.node.group === "enemy") {
      // other.node.getComponent(EnemyMoveBase).die();
      other.node.getComponent(EnemyMoveBase).die();
      this.player.getComponent(Player).addScore(1);
      this.die();
    }

    // other.
    // this.isStop = true;
  }

  //死亡-----效果.......
  public die() {
    this.isStop = true;
    this.node.removeFromParent();
  }
}
