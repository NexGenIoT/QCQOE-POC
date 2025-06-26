## How to use
Add these tags to your document's `<head>`:
```html
<script src="en-web-sdk.js"></script>
<link href="en-web-sdk.css" rel="stylesheet">
```

Firstly you need to initialize the library instance
```js
 var config = {
    partnerCode: partnerCode,
    deviceId: deviceId,
    country: country,
    env: env
};
// Function to intialize the player instance
sdkInstance = new WebSDK(config);
```

Once initialized, first call login to validate the user<br/>
- Input - <br/>
  - partner user token<br/>
  - partner id<br/>
- Output -<br/>
  - auth token<br/>
```js
//Function to login, having input parameter partner token and partner id
// This will return the object having auth token which will be used further
sdkInstance.doLogin(partnerUserToken, partnerId).then((result) => {
    authtoken = result.data.auth_token;
}).catch((err) => {
    console.log("login error: ", err);
});
```

To play the content, paramters includes the html id where the player is to be loaded and content id which is to be played. The prerequisite to call this function is to call login first.<br/>
- Input -<br/>
  - divid - id of the div where player should be populated<br/>
  - contentId - id of the content to be played<br/>
- Output -<br/>
  - eventObject having event handling variables<br/>
```js
sdkInstance.playContent("erosPlayer", contentId).then((result) => {
    console.log('play content: ', res);
}).catch((err) => {
    console.log("play content error: ", err);
});
```

To fetch the content profile of the provided contentId. Requires auth token to call the API<br/>
- Input -<br/>
  - contentId - id of the content to get profile<br/>
  - authToken - token received from login api<br/>
- Output -<br/>
  - content profile object<br/>
```js
sdkInstance.fetchContentProfile(contentId, authtoken).then((res) => {
    console.log('fetch content: ', res);
}).catch((err) => {
    console.log("fetch content error: ", err);
});
```

To fetch the progress data of the asset provided.<br/>
- Input -<br/>
  - assetId - id of the asset to get progress data<br/>
- Output -<br/>
  - progress information of contents in a particular asset<br/>
```js
sdkInstance.fetchProgressData(contentId).then((res) => {
    console.log('asset content progress: ', res);
}).catch((err) => {
    console.log("asset content progress error: ", err);
});
```

To add event listeners you can access the event handler variable which is available in player instance variable
```js
sdkInstance.eventHandler.playerEvent.addEventListener('onPlaying', function(event) {
    console.log('on playing event called');
});
sdkInstance.eventHandler.uiEvent.addEventListener('onPlayClick', function(event) {
    console.log('on playing button clicked');
});
```
There are 2 event handlers `playerEvent` and `uiEvent`. Following is the list of player events and ui events that can be listened.
Events for `playerEvent`:
  - onProgress
  - onPlaying
  - onFullScreenChange
  - onError
  - onLoadedMetadata
  - onLoadedData
  - onEnded
  - onLoadStart
  - onPlay
  - onPause
  - onTimeUpdate
  - onPlayerReady
  - onStalled
  - onSuspend
  - onSeeking
  - onSeeked
  - onVolumechange
  - onAbort
  - onFirstPlay
  - onClose

Events for `uiEvent`:
  - onForwardButtonClick
  - onRewindButtonClick
  - onSeekBarClick
  - onPlayClick
  - onPauseClick
  - onFullScreenClick
  - onExitFullScreenClick
  - onUnmuteClick
  - onMuteClick
  - qualityPopupClick
  - subtitlePopupClick
  - onCloseButtonClick
  - qualityChanged
  - audioLanguageChanged
  - reportIssueClicked