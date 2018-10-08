import Enemy from "./Enemy";
import GameCtrl from "./GameCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.Node)
    gameCtrlNode: cc.Node;

    @property
    speed: number = 10;

    @property
    isStop: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    private direction= cc.v2(1,0);

    // onLoad () {}


    update (dt) {
        if(this.isStop)
        {
            return;
        }

        let move = cc.v2(this.direction.x * this.speed,this.direction.y * this.speed );
        this.node.setPosition(cc.v2(this.node.getPosition()).add(move));
        
        if (this.node.getPositionX() >1080 /2) {
            this.node.x = -1080 /2;
        }
        if (this.node.getPositionX() < -1080 /2) {
            this.node.x = 1080 /2;
        }
        if (this.node.getPositionY() >1920 /2) {
            this.node.y = -1920 /2;
        }
        if (this.node.getPositionY() < -1920 /2) {
            this.node.y = 1920 /2;
        }
    }

    onCollisionEnter(other:cc.Collider, self:cc.Collider)
    {
        // console.log('on collision enter');
        // console.log(other);
        other.node.getComponent(Enemy).die();

        this.gameCtrlNode.getComponent(GameCtrl).addScore(1);

        // other.
        // this.isStop = true;
    }

    // onCollisionStay(other, self){
    //     console.log('on collision stay');
    // }

    setDirection(dir:cc.Vec2)
    {
        dir.normalizeSelf();
        // console.log(dir.x +"****"+dir.y);
        this.direction = dir;
    }
}
