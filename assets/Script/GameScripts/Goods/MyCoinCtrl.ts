import { getRandomInt } from "../Utils/random";
import { GameConfig } from "../GameConfig";

const { ccclass, property } = cc._decorator;

export enum BULLETTYPE {
  FIRE,
  NORMAL,
  HOLE,
  MOON,
  NONE
}

@ccclass
export class MyCoinCtrl extends cc.Component {
  @property(cc.Boolean)
  autoDie: boolean = false;

  @property(cc.Integer)
  score: number = 1;

  onLoad() {
    if (this.autoDie) {
      this.scheduleOnce(this.die, 20);
    }

    this.node.position = cc.v2(
      getRandomInt(-GameConfig.DEVICE_WIDTH / 2, GameConfig.DEVICE_WIDTH / 2),
      getRandomInt(-GameConfig.DEVICE_HEIGHT / 2, GameConfig.DEVICE_HEIGHT / 2)
    );
  }

  public die() {
    this.node.removeFromParent();
  }
}
