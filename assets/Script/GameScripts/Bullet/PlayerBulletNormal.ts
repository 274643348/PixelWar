import EnemyMoveBase from "../Enemy/EnemyMoveBase";
import Player from "../Player";
import { BulletMoveBase } from "./BulletMoveBase";

const { ccclass, property } = cc._decorator;

/**
 * 左右上下移动的怪物
 */
@ccclass
export default class PlayerBulletNormal extends BulletMoveBase {
  ///////////////重写父类
  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    if (other.node.group === "enemy") {
      other.node.getComponent(EnemyMoveBase).die();
      this.player.getComponent(Player).addScore(1);
      this.die();
    }

    if (other.node.group === "enemyBullet") {
      // other.node.getComponent(EnemyMoveBase).die();
      other.node.getComponent(BulletMoveBase).die();
      this.die();
    }
  }
}
