const { ccclass, property } = cc._decorator;

@ccclass("RangeNums")
export class RangeNums {
  @property(Number)
  min: number = -540;

  @property(Number)
  max: number = -540;
}

export enum MOVETYPE {
  NONE,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  UP_DOWN,
  LEFT_RIGHT,
  ENEMYSELF
}

/**
 * 左右上下移动的怪物
 */
@ccclass
export default class EnemyMoveBase extends cc.Component {
  //初始化位置随机
  @property
  autoStartPos: boolean = true;

  @property(RangeNums)
  startPosX: RangeNums = new RangeNums();

  @property(RangeNums)
  startPosY: RangeNums = new RangeNums();

  //移动类型
  @property({
    tooltip: "移动方式",
    type: cc.Enum(MOVETYPE)
  })
  moveType: MOVETYPE = MOVETYPE.NONE;

  //攻击力
  @property
  hitNum: number = 0;

  //得分
  @property
  score: number = 1;

  //速度
  @property
  speed: number = 10;

  //血量
  @property
  bloodNum: number = 1;

  //攻击速度
  @property
  fireSpeed: number = 3;

  //停止移动
  @property
  isStop: boolean = false;

  //方向
  public direction = cc.v2(1, 0);

  //移动目标
  public moveTarget: cc.Node;
  onLoad() {
    //初始化相关信息
    this.initEnemy(this.moveType, this.speed);

    if (this.autoStartPos) {
      this.node.position = cc.v2(
        this.getRandomInt(this.startPosX.min, this.startPosX.max),
        this.getRandomInt(this.startPosY.min, this.startPosY.max)
      );
    }

    //初始化开火信息();
    this.initFire();
  }

  /**
   * 初始化敌人---初始位置,初始方向,速度.......
   */
  initEnemy(moveType: MOVETYPE = MOVETYPE.UP, speed: number = 10) {
    switch (moveType) {
      case MOVETYPE.NONE:
        this.direction = cc.v2(0, 0);
        break;
      case MOVETYPE.UP:
        this.direction = cc.v2(0, 1);
        break;
      case MOVETYPE.DOWN:
        this.direction = cc.v2(0, -1);
        break;
      case MOVETYPE.LEFT:
        this.direction = cc.v2(-1, 0);
        break;
      case MOVETYPE.RIGHT:
        this.direction = cc.v2(1, 0);
        break;
      case MOVETYPE.UP_DOWN:
        this.direction = cc.v2(0, this.getRandomInt(0, 2) > 0 ? -1 : 1);
        break;
      case MOVETYPE.LEFT_RIGHT:
        this.direction = cc.v2(this.getRandomInt(0, 2) > 0 ? -1 : 1, 0);
        break;
      case MOVETYPE.ENEMYSELF:
        this.direction = cc.v2(
          this.getRandomInt(-1, 2),
          this.getRandomInt(-1, 2)
        );
        this.direction.normalizeSelf();
        break;
    }

    this.speed = speed;
  }

  update() {
    if (this.isStop) {
      return;
    }
    this.updataPos();
  }

  /**
   * 位置刷新
   */
  updataPos() {
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
      if (this.moveType === MOVETYPE.LEFT_RIGHT) {
        this.direction.x *= -1;
      } else if (this.moveType === MOVETYPE.UP_DOWN) {
        this.direction.y *= -1;
      } else {
        this.node.y = -1920 / 2;
      }
    }
    if (this.node.getPositionY() < -1920 / 2) {
      if (this.moveType === MOVETYPE.LEFT_RIGHT) {
        this.direction.x *= -1;
      } else if (this.moveType === MOVETYPE.UP_DOWN) {
        this.direction.y *= -1;
      } else {
        this.node.y = 1920 / 2;
      }
    }
  }

  //死亡-----效果.......
  public die() {
    this.bloodNum -= 1;
    if (this.bloodNum <= 0) {
      this.isStop = true;
      this.node.removeFromParent();
    }
  }

  /**
   * 初始化开火--------开会频率
   */
  initFire() {
    this.schedule(this.Fire, this.fireSpeed, cc.macro.REPEAT_FOREVER);
  }

  /**
   * 开火操作------------开火效果......
   */
  Fire() {
    console.log("fire----hitNum--", this.hitNum);
  }

  getRandomInt(min: number, max: number) {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
  }

  moveToTarget(target: cc.Node) {
    if (!this.moveTarget) {
      this.isStop = true;
      this.moveTarget = target;
      this.schedule(this.moveToTargetSchedule, 0.01, cc.macro.REPEAT_FOREVER);
    }
  }

  moveToTargetSchedule() {
    if (this.moveTarget.isValid) {
      let dir = this.moveTarget.position.sub(this.node.position);
      dir = dir.normalize();
      let move = cc.v2(dir.x * this.speed * 2, dir.y * this.speed * 2);
      this.node.setPosition(cc.v2(this.node.getPosition()).add(move));
    }
  }
}
