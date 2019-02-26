import EnemyMoveBase from "../Enemy/EnemyMoveBase";
import { BulletMoveBase } from "./BulletMoveBase";
import { Player } from "../Player";

const { ccclass, property } = cc._decorator;

/**
 * 左右上下移动的怪物
 */
@ccclass
export default class PlayerBulletFire extends BulletMoveBase {
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

  //////////////////////////
  die() {
    //
    console.log("火焰子弹,不会自己死亡");
  }

  /**
   * 位置刷新
   */
  updataPos() {
    const pos = cc.v2(
      (this.player.getComponent(Player).direction.x * this.player.width) / 2,
      (this.player.getComponent(Player).direction.y * this.player.height) / 2
    );
    this.direction = cc.v2(this.player.getComponent(Player).direction);
    this.node.setPosition(this.player.position.add(pos));
  }
}
