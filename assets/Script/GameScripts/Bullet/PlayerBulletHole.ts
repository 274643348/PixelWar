import EnemyMoveBase from "../Enemy/EnemyMoveBase";
import { BulletMoveBase } from "./BulletMoveBase";
import { Player } from "../Player";

const { ccclass, property } = cc._decorator;

/**
 * 左右上下移动的怪物
 */
@ccclass
export class PlayerBulletHole extends BulletMoveBase {
  //被吸附的敌人
  public enemyAry: cc.Node[] = [];

  //吸附范围
  public holeWidth: number = 500;
  start() {
    this.schedule(this.attraction, 0.1, cc.macro.REPEAT_FOREVER, 0.5);
  }

  attraction() {
    const enemyChild = this.enemyPanel.children;
    for (const iterator of enemyChild) {
      if (iterator.group === "enemy") {
        // iterator.getComponent(EnemyMoveBase).isStop = true;
        const dis = iterator.position.sub(this.node.position);
        if (
          Math.abs(dis.x) < this.holeWidth &&
          Math.abs(dis.y) < this.holeWidth
        ) {
          iterator.getComponent(EnemyMoveBase).moveToTarget(this.node);
          this.enemyAry.push(iterator);
        }
      }
    }
  }

  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    if (other.node.group === "enemy") {
      this.die();
    }

    if (other.node.group === "enemyBullet") {
      this.die();
    }
  }

  /////////////////////重写父类

  // updataPos() {
  //   this.node.position = cc.v2(this.player.position);
  // }

  die() {
    this.attraction();
    //范围内的全死
    for (const iterator of this.enemyAry) {
      // iterator.getComponent(EnemyMoveBase).isStop = true;
      if (iterator.isValid) {
        iterator.getComponent(EnemyMoveBase).die();
        this.player.getComponent(Player).KillEnemy();
      }
    }

    super.die();
  }
}
