import { getRandomInt } from "../Utils/random";
import { BULLETTYPE } from "../Player";

const { ccclass, property } = cc._decorator;
@ccclass
export class Goods extends cc.Component {
  //子弹纹理
  @property([cc.SpriteFrame])
  goodsSF: cc.SpriteFrame[] = [];

  //速度
  @property
  speed: number = 5;

  @property({ type: cc.Enum(BULLETTYPE) })
  bulletType: BULLETTYPE = BULLETTYPE.NORMAL;

  //方向
  public direction = cc.v2(1, 0);

  onLoad() {
    this.direction = cc
      .v2(getRandomInt(-1, 2), getRandomInt(-1, 2))
      .normalize();

    //随机类型
    this.randomType();
  }

  randomType() {
    let newType = getRandomInt(BULLETTYPE.FIRE, BULLETTYPE.MOON + 1);
    while (newType === this.bulletType) {
      newType = getRandomInt(BULLETTYPE.FIRE, BULLETTYPE.MOON + 1);
    }
    this.bulletType = newType;
    this.node.getComponent(cc.Sprite).spriteFrame = this.goodsSF[
      this.bulletType
    ];
  }

  update() {
    let move = cc.v2(
      this.direction.x * this.speed,
      this.direction.y * this.speed
    );
    this.node.setPosition(cc.v2(this.node.getPosition()).add(move));

    if (this.node.getPositionX() >= 1080 / 2) {
      this.node.x = 1080 / 2;
      this.direction.x *= -1;
    }
    if (this.node.getPositionX() <= -1080 / 2) {
      this.node.x = -1080 / 2;
      this.direction.x *= -1;
    }
    if (this.node.getPositionY() >= 1920 / 2) {
      this.node.y = 1920 / 2;
      this.direction.y *= -1;
    }
    if (this.node.getPositionY() <= -1920 / 2) {
      this.node.y = -1920 / 2;
      this.direction.y *= -1;
    }
  }

  die() {
    this.node.removeFromParent();
  }
}
