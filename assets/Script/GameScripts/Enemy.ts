const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {
  @property
  speed: number = 10;
  @property
  isStop: boolean = false;

  private direction = cc.v2(1, 0);

  onLoad() {
    this.direction =
      Math.floor(Math.random() * 2) === 0 ? cc.v2(1, 0) : cc.v2(1, 0);
    this.speed = Math.floor(Math.random() * 10);
    this.node.position = cc.v2(
      Math.random() * 1080 - 540,
      Math.random() * 1920 - 860
    );
  }

  update() {
    if (this.isStop) {
      return;
    }

    let a = [2, 3, 4, 5];
    for (let index = 0; index < a.length; index++) {
    }
    let move = cc.v2(
      this.direction.x * this.speed,
      this.direction.y * this.speed
    );
    this.node.setPosition(cc.v2(this.node.getPosition()).add(move));

    if (this.node.getPositionX() > 1080 / 2) {
      this.node.x = -1080 / 2;
    }
    if (this.node.getPositionX() < -1080 / 2) {
      this.node.x = 1080 / 2;
    }
    if (this.node.getPositionY() > 1920 / 2) {
      this.node.y = -1920 / 2;
    }
    if (this.node.getPositionY() < -1920 / 2) {
      this.node.y = 1920 / 2;
    }
  }

  public setDirection(dir: cc.Vec2) {
    dir.normalizeSelf();
    // console.log(dir.x +"****"+dir.y);
  }

  public die() {
    this.isStop = true;
    this.node.removeFromParent();
  }
}
