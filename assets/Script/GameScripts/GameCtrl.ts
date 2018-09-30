import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameCtrl extends cc.Component {

    @property(cc.Node)
    touchCtrLayer: cc.Node;

    @property(cc.Node)
    player: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {}
    

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

    }

    touchEndEvent(event: cc.Event.EventTouch)
    {
        //记录点击位置;
        let startTouchPos = cc.v2(event.getStartLocation());
        let endTouchPos = cc.v2(event.getLocation());
        console.log(startTouchPos.x+"-------startTouchPos-------"+startTouchPos.y);
        console.log(endTouchPos.x+"--------endTouchPos------"+endTouchPos.y);

        let delta = endTouchPos.sub(startTouchPos);
        Math.abs(delta.x) > Math.abs(delta.y)? delta.y = 0:delta.x = 0;

        this.player.getComponent(Player).setDirection(delta);
        // let startNodePos = this.touchCtrLayer.convertToNodeSpaceAR(startTouchPos);
        // let endNodePos = this.touchCtrLayer.convertToNodeSpaceAR(endTouchPos);
        // console.log(startNodePos.x+"-------startNodePos-------"+startNodePos.y);
        // console.log(endNodePos.x+"--------endNodePos------"+endNodePos.y);
    }




    // update (dt) {}
}
