const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  //project文件
  @property(cc.RawAsset)
  manifestUrl: cc.RawAsset;

  @property(cc.Node)
  updateUI: cc.Node;

  // LIFE-CYCLE CALLBACKS:

  private mySoragePath: string = "";

  private myAssetsManager: any;

  private _updating: boolean = false;

  private _checkListener: any;
  private _updateListener: any;
  onLoad() {
    //非原生平台,直接return
    if (!CC_JSB) {
      return;
    }

    //生产临时更新文件夹;
    this.mySoragePath =
      (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") +
      "blackjack-remote-asset";
    cc.log("Storage path for remote asset : " + this.mySoragePath);

    // Init with empty manifest url for testing custom manifest
    this.myAssetsManager = new jsb.AssetsManager(
      "",
      this.mySoragePath,
      this.versionCompile
    );

    if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
      this.myAssetsManager.retain();
    }

    //设置验证回调
    this.myAssetsManager.setVerifyCallback(function(path: any, asset: any) {
      // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
      var compressed = asset.compressed;
      // Retrieve the correct md5 value.
      var expectedMD5 = asset.md5;
      // asset.path is relative path and path is absolute.
      var relativePath = asset.path;
      // The size of asset file, but this value could be absent.
      var size = asset.size;
      if (compressed) {
        console.log("ljy--------Verification passed : " + relativePath);
        return true;
      } else {
        console.log(
          "ljy--------Verification passed : " +
            relativePath +
            " (" +
            expectedMD5 +
            ")--" +
            size
        );
        return true;
      }
    });

    if (cc.sys.os === cc.sys.OS_ANDROID) {
      // Some Android device may slow down the download process when concurrent tasks is too much.
      // The value may not be accurate, please do more test and find what's most suitable for your game.
      this.myAssetsManager.setMaxConcurrentTask(2);
      console.log(
        "ljy--------Max concurrent tasks count have been limited to 2"
      );
    }

    // this.panel.fileProgress.progress = 0;
    // this.panel.byteProgress.progress = 0;
  }

  //版本对比
  versionCompile(versionA: any, versionB: any) {
    cc.log(
      "ljy--------JS Custom Version Compare: version A is " +
        versionA +
        ", version B is " +
        versionB
    );
    var vA = versionA.split(".");
    var vB = versionB.split(".");
    for (var i = 0; i < vA.length; ++i) {
      var a = parseInt(vA[i]);
      var b = parseInt(vB[i] || 0);
      if (a === b) {
        continue;
      } else {
        return a - b;
      }
    }
    if (vB.length > vA.length) {
      return -1;
    } else {
      return 0;
    }
  }

  //清理工作
  onDestroy() {
    // if (this._updateListener) {
    //     cc.eventManager.removeListener(this._updateListener);
    //     this._updateListener = null;
    // }
    if (this.myAssetsManager && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
      this.myAssetsManager.release();
    }
  }

  //检查热更新
  checkUpdate() {
    if (this._updating) {
      console.log("Checking or updating ...");
      // this.panel.info.string = 'Checking or updating ...';
      return;
    }
    if (this.myAssetsManager.getState() === jsb.AssetsManager.State.UNINITED) {
      this.myAssetsManager.loadLocalManifest(this.manifestUrl);
    }
    if (
      !this.myAssetsManager.getLocalManifest() ||
      !this.myAssetsManager.getLocalManifest().isLoaded()
    ) {
      // this.panel.info.string = 'Failed to load local manifest ...';
      console.log("Failed to load local manifest ...");
      return;
    }
    this._checkListener = new jsb.EventListenerAssetsManager(
      this.myAssetsManager,
      this.checkCbEvent.bind(this)
    );
    cc.eventManager.addListener(this._checkListener, 1);

    this.myAssetsManager.checkUpdate();
    this._updating = true;
  }

  checkCbEvent(event: any) {
    cc.log("Code: " + event.getEventCode());
    switch (event.getEventCode()) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        // this.panel.info.string = "No local manifest file found, hot update skipped.";
        console.log("No local manifest file found, hot update skipped.");
        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        // this.panel.info.string = "Fail to download manifest file, hot update skipped.";
        console.log("Fail to download manifest file, hot update skipped.");
        break;
      case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
        // this.panel.info.string = "Already up to date with the latest remote version.";
        console.log("Already up to date with the latest remote version.");
        break;
      case jsb.EventAssetsManager.NEW_VERSION_FOUND:
        // this.panel.info.string = 'New version found, please try to update.';
        console.log("New version found, please try to update.");

        // this.panel.checkBtn.active = false;
        // this.panel.fileProgress.progress = 0;
        // this.panel.byteProgress.progress = 0;
        break;
      default:
        return;
    }

    cc.eventManager.removeListener(this._checkListener);
    this._checkListener = null;
    this._updating = false;
  }

  hotUpdate() {
    if (this.myAssetsManager && !this._updating) {
      this._updateListener = new jsb.EventListenerAssetsManager(
        this.myAssetsManager,
        this.updateCbEvent.bind(this)
      );
      cc.eventManager.addListener(this._updateListener, 1);

      if (
        this.myAssetsManager.getState() === jsb.AssetsManager.State.UNINITED
      ) {
        this.myAssetsManager.loadLocalManifest(this.manifestUrl);
      }

      //   this._failCount = 0;
      this.myAssetsManager.update();
      //   this.panel.updateBtn.active = false;
      this._updating = true;
    }
  }

  updateCbEvent(event: any) {
    var needRestart = false;
    var failed = false;
    switch (event.getEventCode()) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        // this.panel.info.string = 'No local manifest file found, hot update skipped.';
        console.log("No local manifest file found, hot update skipped.");
        failed = true;
        break;
      case jsb.EventAssetsManager.UPDATE_PROGRESSION:
        // this.panel.byteProgress.progress = event.getPercent();
        // this.panel.fileProgress.progress = event.getPercentByFile();

        // this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
        // this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();

        console.log("更新进度条");
        console.log(event.getPercent());
        console.log(event.getPercentByFile());
        console.log(event.getDownloadedFiles() + " / " + event.getTotalFiles());
        console.log(event.getDownloadedBytes() + " / " + event.getTotalBytes());
        var msg = event.getMessage();
        if (msg) {
          // this.panel.info.string = 'Updated file: ' + msg;
          console.log("Updated file: " + msg);
          // cc.log(event.getPercent()/100 + '% : ' + msg);
        }
        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        // this.panel.info.string = 'Fail to download manifest file, hot update skipped.';
        console.log("Fail to download manifest file, hot update skipped.");
        failed = true;
        break;
      case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
        // this.panel.info.string = 'Already up to date with the latest remote version.';
        console.log("Already up to date with the latest remote version.");
        failed = true;
        break;
      case jsb.EventAssetsManager.UPDATE_FINISHED:
        // this.panel.info.string = 'Update finished. ' + event.getMessage();
        console.log("Update finished. " + event.getMessage());
        needRestart = true;
        break;
      case jsb.EventAssetsManager.UPDATE_FAILED:
        // this.panel.info.string = 'Update failed. ' + event.getMessage();
        console.log("Update failed. " + event.getMessage());
        // this.panel.retryBtn.active = true;
        // this._canRetry = true;
        this._updating = false;
        break;
      case jsb.EventAssetsManager.ERROR_UPDATING:
        // this.panel.info.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
        console.log(
          "Asset update error: " +
            event.getAssetId() +
            ", " +
            event.getMessage()
        );
        break;
      case jsb.EventAssetsManager.ERROR_DECOMPRESS:
        // this.panel.info.string = event.getMessage();
        console.log(event.getMessage());

        break;
      default:
        break;
    }

    if (failed) {
      cc.eventManager.removeListener(this._updateListener);
      this._updateListener = null;
      this._updating = false;
    }

    if (needRestart) {
      cc.eventManager.removeListener(this._updateListener);
      this._updateListener = null;
      // Prepend the manifest's search path
      var searchPaths = jsb.fileUtils.getSearchPaths();
      var newPaths = this.myAssetsManager.getLocalManifest().getSearchPaths();
      console.log(JSON.stringify(newPaths));
      Array.prototype.unshift(searchPaths, newPaths);
      // This value will be retrieved and appended to the default search path during game startup,
      // please refer to samples/js-tests/main.js for detailed usage.
      // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
      cc.sys.localStorage.setItem(
        "HotUpdateSearchPaths",
        JSON.stringify(searchPaths)
      );
      jsb.fileUtils.setSearchPaths(searchPaths);

      cc.audioEngine.stopAll();
      cc.game.restart();
    }
  }
}
