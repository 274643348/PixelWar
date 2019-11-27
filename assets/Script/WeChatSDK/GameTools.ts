import { GameConfig } from "../GameScripts/GameConfig";

/**
 * 0--removeRank
 * 1--好友排名
 * 3--提交得分
 * 4--gameover
 * 5--群排名
 */
class GameTools {
  love2048FrameCache: null;

  //获取排行榜()
  getRankData(shareTicket: any) {
    console.log("rangkData---------", shareTicket);
    cc.loader.loadRes("panel/RankingListView", (err, prefab) => {
      console.log("rangkData---------", err);
      if (!err) {
        var node = cc.instantiate(prefab);
        if (shareTicket != undefined) {
          node.getComponent(cc.Component).shareTicket = shareTicket;
        }
        cc.director.getScene().children[0].addChild(node);
      }
    });
  }

  //移除排行榜数据
  removeRankData() {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.postMessage({
        messageType: 0
      });
    } else {
      cc.log("移除排行榜数据。");
    }
  }

  submitScore(score: number) {
    //提交得分
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.postMessage({
        messageType: 3,
        MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
        score: score
      });
    } else {
      cc.log("提交得分:" + GameConfig.MAIN_MENU_NUM + " : " + score);
    }
  }

  //获取本地数据
  public getItemByLocalStorage(key: string, value: any) {
    let values = cc.sys.localStorage.getItem(key);
    if (values === undefined || values === null || values === "") {
      cc.sys.localStorage.setItem(key, value);
      return value;
    }
    if (typeof value === "boolean") {
      if (typeof values === "boolean") {
        return values;
      }
      return "true" == values;
    } else if (typeof value === "number") {
      return Number(values);
    }
    return values;
  }

  playSimpleAudioEngine(engineType: number) {
    if (GameConfig.IS_GAME_MUSIC) {
      switch (engineType) {
        case 0:
          cc.audioEngine.play(
            cc.url.raw("resources/audios/sfx_button.wav"),
            false,
            0.5
          );
          break;
        case 1:
          cc.audioEngine.play(
            cc.url.raw("resources/audios/sfx_highscore.wav"),
            false,
            0.5
          );
          break;
        case 2:
          cc.audioEngine.play(
            cc.url.raw("resources/audios/sfx_player_die.wav"),
            false,
            0.5
          );
          break;
        case 3:
          cc.audioEngine.play(
            cc.url.raw("resources/audios/sfx_player_jump.wav"),
            false,
            0.5
          );
          break;
        case 4:
          cc.audioEngine.play(
            cc.url.raw("resources/audios/sfx_score.wav"),
            false,
            0.5
          );
          break;
        default:
          break;
      }
    }
  }
}

export const gameTools = new GameTools();
