import EnemyMoveBase, { MOVETYPE } from "./EnemyMoveBase";
import { EnemySnakeBody } from "./EnemySnakeBody";

const { ccclass, property } = cc._decorator;

@ccclass
export class PosDirObject {
  public pos: cc.Vec2;
  public dir: MOVETYPE;
  constructor(pos: cc.Vec2, dir: MOVETYPE) {
    this.pos = cc.v2(pos);
    this.dir = dir;
  }
}

@ccclass
export class EnemySnakeHead extends EnemyMoveBase {
  @property(cc.Prefab)
  bodyPre: cc.Prefab;

  //转向-位置数组
  public posDir: PosDirObject | null = null;

  //身体数组
  public bodyAry: cc.Node[] = [];

  public moveBodyIndex: number = 0;
  start() {
    //10s 后改变方向
    this.schedule(this.changeDir, 3, cc.macro.REPEAT_FOREVER);

    //随机设置方向
    this.moveType = this.getRandomInt(MOVETYPE.UP, MOVETYPE.RIGHT + 1);

    this.initEnemy(this.moveType, this.speed);

    //生产身体
    this.createBody();

    //实时刷新身体方向
    this.schedule(this.updataBodyDir, 0.01, cc.macro.REPEAT_FOREVER);
  }

  changeDir() {
    if (this.isStop || this.posDir !== null) {
      return;
    }
    let newMoveType = MOVETYPE.UP;
    do {
      newMoveType = this.getRandomInt(MOVETYPE.UP, MOVETYPE.RIGHT + 1);
    } while (newMoveType === this.moveType);

    this.moveType = newMoveType;
    this.initEnemy(this.moveType, this.speed);
    let posDir = new PosDirObject(this.node.position, this.moveType);

    console.log("snake----", JSON.stringify(posDir));
    this.posDir = posDir;
  }

  updataBodyDir() {
    if (this.posDir === null) {
      return;
    }

    const iterator = this.bodyAry[this.moveBodyIndex];
    const dis = iterator.position.sub(this.posDir.pos);
    if (Math.abs(dis.x) < this.speed && Math.abs(dis.y) < this.speed) {
      iterator.getComponent(EnemyMoveBase).moveType = this.posDir.dir;
      iterator.position = cc.v2(this.posDir.pos);
      iterator.getComponent(EnemyMoveBase).initEnemy(this.moveType, this.speed);
      this.moveBodyIndex += 1;

      //最后一节身体转过去后,置为null
      if (iterator === this.bodyAry[this.bodyAry.length - 1]) {
        this.posDir = null;
        this.moveBodyIndex = 0;
      }
    }
  }

  createBody() {
    const width = cc.instantiate(this.bodyPre).width;
    let offset = cc.v2();
    switch (this.moveType) {
      case MOVETYPE.UP:
        offset = cc.v2(0, -width);
        break;
      case MOVETYPE.DOWN:
        offset = cc.v2(0, width);
        break;
      case MOVETYPE.LEFT:
        offset = cc.v2(width, 0);
        break;
      case MOVETYPE.RIGHT:
        offset = cc.v2(-width, 0);
        break;
    }

    for (let index = 0; index < 5; index++) {
      const body = cc.instantiate(this.bodyPre);
      body.x = this.node.x + (index + 1) * offset.x;
      body.y = this.node.y + (index + 1) * offset.y;
      body.getComponent(EnemyMoveBase).moveType = this.moveType;
      body.getComponent(EnemyMoveBase).speed = this.speed;
      this.node.parent.addChild(body);
      this.bodyAry.push(body);
    }
  }

  /////////////////////////////重写父类

  die() {
    for (const iterator of this.bodyAry) {
      iterator.getComponent(EnemySnakeBody).BodyDid();
    }
    super.die();
  }
}
