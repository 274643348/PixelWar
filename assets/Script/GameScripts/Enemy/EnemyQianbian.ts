import EnemyMoveBase from "./EnemyMoveBase";
import { BulletMoveBase } from "../Bullet/BulletMoveBase";

const { ccclass, property } = cc._decorator;

@ccclass
export class EnemyQianbian extends EnemyMoveBase {
  @property(cc.Prefab)
  bulletQiangbian: cc.Prefab;

  // onLoad () {}

  start() {
    //从新设置位置
    this.node.x =
      this.getRandomInt(0, 2) > 0 ? this.startPosX.max : this.startPosX.min;
  }

  // update (dt) {}

  /////////////////////////////重写父类
  Fire() {
    console.log("EnemyLRUP-- no ---- fire", this.hitNum);
    this.node.runAction(
      cc.sequence(
        cc.delayTime(0),
        cc.callFunc(() => {
          const bullet = cc.instantiate(this.bulletQiangbian);
          bullet.getComponent(BulletMoveBase).direction =
            this.node.x < 0 ? cc.v2(1, 0) : cc.v2(-1, 0);
          bullet.position = cc.v2(this.node.position);
          this.node.parent.addChild(bullet);
          this.node.active = true;
        }, this)
      )
    );

    this.node.runAction(
      cc.sequence(
        cc.delayTime(0.1),
        cc.callFunc(() => {
          const bullet = cc.instantiate(this.bulletQiangbian);
          bullet.getComponent(BulletMoveBase).direction =
            this.node.x < 0 ? cc.v2(1, 0) : cc.v2(-1, 0);
          bullet.position = cc.v2(this.node.position);
          this.node.parent.addChild(bullet);
          this.node.active = true;
        }, this)
      )
    );
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

    if (this.node.getPositionX() > 1080 / 2) {
      this.node.x = 1080 / 2;
    }
    if (this.node.getPositionX() < -1080 / 2) {
      this.node.x = -1080 / 2;
    }
    if (this.node.getPositionY() > 1920 / 2) {
      this.direction.y *= -1;
    }
    if (this.node.getPositionY() < -1920 / 2) {
      this.direction.y *= -1;
    }
  }
}
