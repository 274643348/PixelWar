import GameCtrl from "./GameCtrl";
import { BulletMoveBase } from "./Bullet/BulletMoveBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
  @property(cc.Node)
  gameCtrlNode: cc.Node;

  @property
  speed: number = 10;

  @property
  isStop: boolean = false;
  // LIFE-CYCLE CALLBACKS:

  private direction = cc.v2(1, 0);

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

    //测试开火
    // this.initFire();
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
  initFire() {
    this.schedule(this.Fire, 0.1, cc.macro.REPEAT_FOREVER);
  }

  Fire() {
    this.gameCtrlNode
      .getComponent(GameCtrl)
      .createBullet(this.node.position, this.direction);
  }

  addScore(score: number) {
    this.gameCtrlNode.getComponent(GameCtrl).addScore(score);
  }
}
