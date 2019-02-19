import EnemyMoveBase from "./EnemyMoveBase";

const { ccclass, property } = cc._decorator;

@ccclass
export class EnemyQianbian extends EnemyMoveBase {
  // LIFE-CYCLE CALLBACKS:

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
