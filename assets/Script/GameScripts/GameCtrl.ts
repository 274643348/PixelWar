import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameCtrl extends cc.Component {

    @property(cc.Node)
    enemyPanel: cc.Node;
    @property(cc.Prefab)
    enemyPre: cc.Prefab;

    @property(cc.Node)
    touchCtrLayer: cc.Node;

    @property(cc.Node)
    player: cc.Node;

    @property(cc.Label)
    scoreLabel: cc.Label;

    // LIFE-CYCLE CALLBACKS:

    private score:number = 0;
    onLoad () {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;

    }
    update()
    {
        if (this.enemyPanel.children.length < 5) {
            let enemyItem = cc.instantiate(this.enemyPre);
            this.enemyPanel.addChild(enemyItem);
        }
    }

    onEnable()
    {
        this.addTouchEvent();
    }

    onDisable()
    {
        this.removeTouchEvent();
    }

    addTouchEvent()
    {
        this.touchCtrLayer.on(cc.Node.EventType.TOUCH_START,this.touchStartEvent,this);
        this.touchCtrLayer.on(cc.Node.EventType.TOUCH_END,this.touchEndEvent,this);
    }
    removeTouchEvent()
    {
        this.touchCtrLayer.off(cc.Node.EventType.TOUCH_START,this.touchStartEvent,this);
        this.touchCtrLayer.off(cc.Node.EventType.TOUCH_END,this.touchEndEvent,this);
    }

    touchStartEvent(event: cc.Event.EventTouch)
    {
        let touchLoc = event.getLocation();
        if (cc.Intersection.pointInPolygon(this.player.convertToNodeSpaceAR(touchLoc), this.player.getComponent(cc.PolygonCollider).points)) {
        //   console.log("hit");
        }
        else {
            // console.log("not hit");
        }
    }

    touchEndEvent(event: cc.Event.EventTouch)
    {
        //记录点击位置;
        let startTouchPos = cc.v2(event.getStartLocation());
        let endTouchPos = cc.v2(event.getLocation());
        // console.log(startTouchPos.x+"-------startTouchPos-------"+startTouchPos.y);
        // console.log(endTouchPos.x+"--------endTouchPos------"+endTouchPos.y);

        let delta = endTouchPos.sub(startTouchPos);
        Math.abs(delta.x) > Math.abs(delta.y)? delta.y = 0:delta.x = 0;

        if (delta.x === 0 && delta.y === 0) {
            return;
        }


        this.player.getComponent(Player).setDirection(delta);
        // let startNodePos = this.touchCtrLayer.convertToNodeSpaceAR(startTouchPos);
        // let endNodePos = this.touchCtrLayer.convertToNodeSpaceAR(endTouchPos);
        // console.log(startNodePos.x+"-------startNodePos-------"+startNodePos.y);
        // console.log(endNodePos.x+"--------endNodePos------"+endNodePos.y);
    }




    addScore(score:number)
    {
        this.score = this.score +score;
        this.scoreLabel.string = this.score +"";
    }

    // update (dt) {}
}
