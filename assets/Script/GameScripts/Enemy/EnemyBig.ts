import EnemyMoveBase, { MOVETYPE } from "./EnemyMoveBase";

const { ccclass } = cc._decorator;

@ccclass
export class EnemyLRUP extends EnemyMoveBase {
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {
    //随机生成左右上下移动的怪物
    // this.initEnemy(MOVETYPE.ENEMYSELF, this.getRandomInt(10, 30));
    //三条命
  }

  /////////////////////////////重写父类
  updataPos() {
    let move = cc.v2(
      this.direction.x * this.speed,
      this.direction.y * this.speed
    );
    this.node.setPosition(cc.v2(this.node.getPosition()).add(move));

    if (this.node.getPositionX() > 1080 / 2) {
      this.node.x = 1080 / 2;
      this.direction.x *= -1;
    }
    if (this.node.getPositionX() < -1080 / 2) {
      this.node.x = -1080 / 2;
      this.direction.x *= -1;
    }
    if (this.node.getPositionY() > 1920 / 2) {
      this.node.y = 1920 / 2;
      this.direction.y *= -1;
    }
    if (this.node.getPositionY() < -1920 / 2) {
      this.node.y = -1920 / 2;
      this.direction.y *= -1;
    }
  }

  Fire() {
    console.log("EnemyLRUP-- no ---- fire", this.hitNum);
  }
}
