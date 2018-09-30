const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    @property
    speed: number = 10;

    // LIFE-CYCLE CALLBACKS:

    private direction= cc.v2(1,0);

    // onLoad () {}


    update (dt) {
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

    setDirection(dir:cc.Vec2)
    {
        dir.normalizeSelf();
        console.log(dir.x +"****"+dir.y);
        this.direction = dir;
    }
}
