import EnemyMoveBase, { MOVETYPE } from "./EnemyMoveBase";

const { ccclass, property } = cc._decorator;

@ccclass
export class EnemySnakeBody extends EnemyMoveBase {
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  /////////////////////////////重写父类
  die() {
    console.log("snake body can not die,only snake head die");
  }

  BodyDid() {
    super.die();
  }
}
