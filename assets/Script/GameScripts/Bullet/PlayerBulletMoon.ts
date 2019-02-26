import EnemyMoveBase from "../Enemy/EnemyMoveBase";
import { BulletMoveBase } from "./BulletMoveBase";
import { Player } from "../Player";

const { ccclass, property } = cc._decorator;

/**
 * 左右上下移动的怪物
 */
@ccclass
export default class PlayerBulletMoon extends BulletMoveBase {
  ///////////////重写父类
  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    if (other.node.group === "enemy") {
      other.node.getComponent(EnemyMoveBase).die();
      this.player.getComponent(Player).KillEnemy();
    }

    if (other.node.group === "enemyBullet") {
      // other.node.getComponent(EnemyMoveBase).die();
      other.node.getComponent(BulletMoveBase).die();
    }
  }
}
