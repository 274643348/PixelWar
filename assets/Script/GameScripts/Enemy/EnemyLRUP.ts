import EnemyMoveBase, { MOVETYPE } from "./EnemyMoveBase";

const { ccclass, property } = cc._decorator;

@ccclass
export class EnemyLRUP extends EnemyMoveBase {
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {
    //随机生成左右上下移动的怪物
    this.initEnemy(
      this.getRandomInt(MOVETYPE.UP, MOVETYPE.RIGHT),
      this.getRandomInt(10, 30)
    );
  }

  /////////////////////////////重写父类
  Fire() {
    console.log("EnemyLRUP-- no ---- fire", this.hitNum);
  }
}
