/* eslint-disable */

function controlManager(controlsConfig) {
  var __this = this;
  __this.controlsConfig = controlsConfig;
  let controlsOuter;
  let playerDiv = controlsConfig.playerDiv;
  let currentTimeDiv;
  let centerPlayPause;
  let leftPlayPause;
  let seekBarProgress;
  let currentTime = 0;
  let currentPlayer = controlsConfig.currentPlayer;
  let subtitlesDiv;

  var NATIVE_EVENTS = controlsConfig.EVENTS.NATIVE_EVENTS;
  var CUSTOM_EVENTS = controlsConfig.EVENTS.CUSTOM_EVENTS;
  var ADS_EVENTS = controlsConfig.EVENTS.ADS_EVENTS;

  let currentDuration = 0;
  var controlsRendered = false;

  function init() {
    console.log("CONTROL_MANAGER :: init");
    // renderControls();
  }

  /* Render the control */
  function renderControls() {
    console.log("CONTROL_MANAGER :: renderControls");
    controlsOuter = document.createElement("div");
    controlsOuter.setAttribute("id", "controlsOuter");
    controlsOuter.setAttribute("class", "controlsOuter hidden");
    playerDiv.appendChild(controlsOuter);

    renderTopMenu();
    renderCenterMenu();
    renderBottomMenu();
    renderSubtitles();
    controlsRendered = true;
  }

  function renderSubtitles() {
    console.log("CONTROL_MANAGER :: renderSubtitles");
    subtitlesDiv = document.createElement("div");
    subtitlesDiv.setAttribute("id", "subtitlesDiv");
    subtitlesDiv.setAttribute("class", "subtitlesDiv");
    controlsOuter.appendChild(subtitlesDiv);
  }

  function enableControls() {
    controlsOuter.classList.remove("hidden");
  }

  function destroyControls() {
    controlsOuter.remove();
  }

  function renderTopMenu() {
    const topMenu = document.createElement("div");
    topMenu.setAttribute("id", "topMenu");
    topMenu.setAttribute("class", "topMenu");
    controlsOuter.appendChild(topMenu);
  }

  function renderCenterMenu() {
    const centerMenu = document.createElement("div");
    centerMenu.setAttribute("id", "centerMenu");
    centerMenu.setAttribute("class", "centerMenu positionCenter");
    controlsOuter.appendChild(centerMenu);
    renderLoader(centerMenu);
    renderCenterPlayPause(centerMenu);
  }

  function renderBottomMenu() {
    const bottomMenu = document.createElement("div");
    bottomMenu.setAttribute("id", "bottomMenu");
    bottomMenu.setAttribute("class", "bottomMenu");
    controlsOuter.appendChild(bottomMenu);

    let seekBarMenu = document.createElement("div");
    seekBarMenu.setAttribute("id", "seekBarMenu");
    seekBarMenu.setAttribute("class", "seekBarMenu");
    bottomMenu.appendChild(seekBarMenu);

    let leftMenu = document.createElement("div");
    leftMenu.setAttribute("id", "leftMenu");
    leftMenu.setAttribute("class", "leftMenu");
    bottomMenu.appendChild(leftMenu);

    let rightMenu = document.createElement("div");
    rightMenu.setAttribute("id", "rightMenu");
    rightMenu.setAttribute("class", "rightMenu");
    bottomMenu.appendChild(rightMenu);

    renderSeekbar(seekBarMenu);

    //float left
    renderPlayPause(leftMenu);
    renderVolume(leftMenu);
    renderTime(leftMenu);

    //float Right
    renderFullScreen(rightMenu);
    renderQuality(rightMenu);
    renderLanguage(rightMenu);
    renderAudio(rightMenu);
  }

  function renderLoader(parentDiv) {
    const loader = document.createElement("div");
    loader.setAttribute("id", "loader");
    loader.setAttribute("class", "loader hidden");
    loader.innerHTML = "Loading...";
    parentDiv.appendChild(loader);
  }

  function renderCenterPlayPause(parentDiv) {
    centerPlayPause = document.createElement("div");
    centerPlayPause.setAttribute("id", "centerPlayPause");
    centerPlayPause.setAttribute("class", "centerPlayPause hidden");
    centerPlayPause.innerHTML = "PAUSE";
    centerPlayPause.addEventListener("click", function () {
      toglePlay();
    });
    parentDiv.appendChild(centerPlayPause);
  }

  function renderSeekbar(parentDiv) {
    console.log("CONTROL_MANAGER :: renderSeekbar");
    let seekBarOuter = document.createElement("div");
    seekBarOuter.setAttribute("id", "seekBarOuter");
    seekBarOuter.setAttribute("class", "seekBarOuter");

    let seekBar = document.createElement("div");
    seekBar.setAttribute("id", "seekBar");
    seekBar.setAttribute("class", "seekBar");

    let seekBarBuffer = document.createElement("div");
    seekBarBuffer.setAttribute("id", "seekBarBuffer");
    seekBarBuffer.setAttribute("class", "seekBarBuffer");

    seekBarProgress = document.createElement("div");
    seekBarProgress.setAttribute("id", "seekBarProgress");
    seekBarProgress.setAttribute("class", "seekBarProgress");

    parentDiv.appendChild(seekBarOuter);
    seekBarOuter.appendChild(seekBar);
    seekBar.appendChild(seekBarBuffer);
    seekBar.appendChild(seekBarProgress);

    seekBarOuter.addEventListener("click", seekbarClick);

    function seekbarClick(e) {
      var seekBarClicked = e.target;
      var seekBarClickedPosition = e.offsetX;
      var seekBarClickedWidth = seekBarClicked.offsetWidth;
      var seekBarClickedPercent = seekBarClickedPosition / seekBarClickedWidth;

      if (currentDuration) {
        var seekBarClickedTime = seekBarClickedPercent * currentDuration;
        seek(seekBarClickedTime);
      }
    }
  }

  /* Left Menu */
  function renderPlayPause(leftMenu) {
    console.log("CONTROL_MANAGER :: renderPlayPause");
    leftPlayPause = document.createElement("div");
    leftPlayPause.setAttribute("id", "leftPlayPause");
    leftPlayPause.setAttribute("class", "leftPlayPause eachIcon");
    leftPlayPause.innerHTML = "PAUSE";
    leftMenu.appendChild(leftPlayPause);
    leftPlayPause.addEventListener("click", function () {
      toglePlay();
    });
  }

  function renderVolume(leftMenu) {
    console.log("CONTROL_MANAGER :: renderVolume");
    let volume = document.createElement("div");
    volume.setAttribute("id", "volume");
    volume.setAttribute("class", "volumeDiv eachIcon");
    volume.innerHTML = "VOLUME";
    leftMenu.appendChild(volume);
    volume.addEventListener("click", function () {
      toggleMute();
    });
  }

  function renderTime(leftMenu) {
    console.log("CONTROL_MANAGER :: renderTime");
    currentTimeDiv = document.createElement("div");
    currentTimeDiv.setAttribute("id", "currentTime");
    currentTimeDiv.setAttribute("class", "currentTime eachIcon");
    currentTimeDiv.innerHTML = "00:00";
    leftMenu.appendChild(currentTimeDiv);
  }

  /* Right Menu */
  function renderQuality(rightMenu) {
    console.log("CONTROL_MANAGER :: renderQuality");
    let qualityMenu = document.createElement("div");
    qualityMenu.setAttribute("id", "qualityMenu");
    qualityMenu.setAttribute("class", "qualityMenu eachIcon");
    let qualityMenuText = document.createElement("span");
    qualityMenuText.setAttribute("id", "qualityMenuText");
    qualityMenuText.setAttribute("class", "qualityMenuText");
    qualityMenuText.innerHTML = "HD";
    qualityMenu.appendChild(qualityMenuText);
    rightMenu.appendChild(qualityMenu);
    qualityMenu.addEventListener("click", function () {
      toggleQualityMenu();
    });
    renderQualitySubMenu(qualityMenu);

    function renderQualitySubMenu(qualityMenu) {
      console.log("CONTROL_MANAGER :: renderQualitySubMenu");
      let qualitySubMenu = document.createElement("div");
      qualitySubMenu.setAttribute("id", "qualitySubMenu");
      qualitySubMenu.setAttribute("class", "qualitySubMenu hidden");
      qualityMenu.appendChild(qualitySubMenu);

      let qualityList = ["HD", "SD", "LD"];

      currentPlayer.getPlaybackVariants().then((levels) => {
        for (let i = 0; i < levels.length; i++) {
          let qualityItem = document.createElement("div");
          qualityItem.setAttribute("id", "qualityItem");
          qualityItem.setAttribute("class", "qualityItem");
          qualityItem.setAttribute("value", levels[i]);
          qualityItem.innerHTML = levels[i] / 1000 + "K";
          qualitySubMenu.appendChild(qualityItem);
          qualityItem.addEventListener("click", function (event) {
            event.stopPropagation();
            // qualityItem.innerHTML = levels[i];
            let allQualityItems =
              document.getElementsByClassName("qualityItem");
            for (let j = 0; j < allQualityItems.length; j++) {
              allQualityItems[j].classList.remove("qualityItemActive");
            }
            qualityItem.classList.add("qualityItemActive");
            closeQualityMenu();
            const qualityValueToSet = qualityItem.getAttribute("value");
            currentPlayer.setPlaybackVariant({
              quality: qualityValueToSet
            });
          });
        }
      });
    }

    function closeQualityMenu() {
      qualitySubMenu.classList.add("hidden");
    }

    function openQualityMenu() {
      qualitySubMenu.classList.remove("hidden");
    }

    function toggleQualityMenu() {
      if (qualitySubMenu.classList.contains("hidden")) {
        openQualityMenu();
      } else {
        closeQualityMenu();
      }
    }
  }

  function renderLanguage(rightMenu) {
    let subtitleMenu = document.createElement("div");
    subtitleMenu.setAttribute("id", "subtitleMenu");
    subtitleMenu.setAttribute("class", "subtitleMenu eachIcon");
    rightMenu.appendChild(subtitleMenu);
    subtitleMenu.innerHTML = "Subtitles Language";
    subtitleMenu.addEventListener("click", function () {
      toggleQualityMenu();
    });
    renderQualitySubMenu(subtitleMenu);

    function renderQualitySubMenu(qualityMenu) {
      console.log("CONTROL_MANAGER :: renderQualitySubMenu");
      let subtitleSubMenu = document.createElement("div");
      subtitleSubMenu.setAttribute("id", "subtitleSubMenu");
      subtitleSubMenu.setAttribute("class", "subtitleSubMenu hidden");
      qualityMenu.appendChild(subtitleSubMenu);

      currentPlayer.getSubtitleLanguages().then((levels) => {
        let noneItem = document.createElement("div");
        noneItem.setAttribute("id", "subtitleItem");
        noneItem.setAttribute("class", "subtitleItem");
        noneItem.setAttribute("value", "none");
        noneItem.innerHTML = "None";
        subtitleSubMenu.appendChild(noneItem);
        noneItem.addEventListener("click", function (event) {
          event.stopPropagation();
          let allQualityItems = document.getElementsByClassName("qualityItem");
          for (let j = 0; j < allQualityItems.length; j++) {
            allQualityItems[j].classList.remove("qualityItemActive");
          }
          noneItem.classList.add("qualityItemActive");
          closeQualityMenu();
          const lang = noneItem.getAttribute("value");
          currentPlayer.setSubtitleLanguage(lang);
          subtitlesDiv.style.display = "none";
        });
        for (let i = 0; i < levels.length; i++) {
          let qualityItem = document.createElement("div");
          qualityItem.setAttribute("id", "subtitleItem");
          qualityItem.setAttribute("class", "subtitleItem");
          qualityItem.setAttribute("value", levels[i]);
          qualityItem.innerHTML = levels[i];
          subtitleSubMenu.appendChild(qualityItem);
          qualityItem.addEventListener("click", function (event) {
            event.stopPropagation();
            // qualityItem.innerHTML = levels[i];
            let allQualityItems =
              document.getElementsByClassName("qualityItem");
            for (let j = 0; j < allQualityItems.length; j++) {
              allQualityItems[j].classList.remove("qualityItemActive");
            }
            qualityItem.classList.add("qualityItemActive");
            closeQualityMenu();
            const lang = qualityItem.getAttribute("value");
            currentPlayer.setSubtitleLanguage(lang);
            subtitlesDiv.style.display = "block";
          });
        }
      });
    }

    function closeQualityMenu() {
      subtitleSubMenu.classList.add("hidden");
    }

    function openQualityMenu() {
      subtitleSubMenu.classList.remove("hidden");
    }

    function toggleQualityMenu() {
      if (subtitleSubMenu.classList.contains("hidden")) {
        openQualityMenu();
      } else {
        closeQualityMenu();
      }
    }
  }

  function renderAudio(rightMenu) {
    let audioMenu = document.createElement("div");
    audioMenu.setAttribute("id", "audioMenu");
    audioMenu.setAttribute("class", "audioMenu eachIcon");
    rightMenu.appendChild(audioMenu);
    // audioMenu.innerHTML = "Audio";
    let audioMenuText = document.createElement("span");
    audioMenuText.setAttribute("id", "audioMenuText");
    audioMenuText.setAttribute("class", "audioMenuText");
    audioMenuText.innerHTML = "Audio";
    audioMenu.appendChild(audioMenuText);
    audioMenu.addEventListener("click", function () {
      toggleAudioMenu();
    });
    renderAudioSubMenu(audioMenu);

    function renderAudioSubMenu(audioMenu) {
      console.log("CONTROL_MANAGER :: renderAudioSubMenu");
      let audioSubMenu = document.createElement("div");
      audioSubMenu.setAttribute("id", "audioSubMenu");
      audioSubMenu.setAttribute("class", "audioSubMenu hidden");
      audioMenu.appendChild(audioSubMenu);

      currentPlayer.getMultiAudio().then((levels) => {
        for (let i = 0; i < levels.length; i++) {
          let audioItem = document.createElement("div");
          audioItem.setAttribute("id", "audioItem");
          audioItem.setAttribute("class", "audioItem");
          audioItem.setAttribute("value", levels[i]);
          audioItem.innerHTML = levels[i];
          audioSubMenu.appendChild(audioItem);
          audioItem.addEventListener("click", function (event) {
            event.stopPropagation();
            audioItem.innerHTML = levels[i];
            let allAudioItems = document.getElementsByClassName("audioItem");
            for (let j = 0; j < allAudioItems.length; j++) {
              allAudioItems[j].classList.remove("audioItemActive");
            }
            audioItem.classList.add("audioItemActive");
            closeAudioMenu();
            const lang = audioItem.getAttribute("value");
            currentPlayer.setMultiAudio(lang);
          });
        }
      });
    }

    function closeAudioMenu() {
      audioSubMenu.classList.add("hidden");
    }

    function openAudioMenu() {
      audioSubMenu.classList.remove("hidden");
    }

    function toggleAudioMenu() {
      if (audioSubMenu.classList.contains("hidden")) {
        openAudioMenu();
      } else {
        closeAudioMenu();
      }
    }
  }

  function renderVolume(rightMenu) {
    let volumeMenu = document.createElement("div");
    volumeMenu.setAttribute("id", "volumeMenu");
    volumeMenu.setAttribute("class", "volumeMenu eachIcon");
    rightMenu.appendChild(volumeMenu);
    // audioMenu.innerHTML = "Audio";
    let volumeMenuText = document.createElement("span");
    volumeMenuText.setAttribute("id", "volumeMenuText");
    volumeMenuText.setAttribute("class", "volumeMenuText");
    volumeMenuText.innerHTML = "Volume";
    volumeMenu.appendChild(volumeMenuText);
    volumeMenu.addEventListener("click", function () {
      toggleVolumeMenu();
    });
    renderVolumeSubMenu(volumeMenu);

    function renderVolumeSubMenu(volumeMenu) {
      console.log("CONTROL_MANAGER :: renderVolumeSubMenu");
      let volumeSubMenu = document.createElement("div");
      volumeSubMenu.setAttribute("id", "volumeSubMenu");
      volumeSubMenu.setAttribute("class", "volumeSubMenu hidden");
      volumeMenu.appendChild(volumeSubMenu);

      const levels = ["mute", "0.5", "1"];
      // currentPlayer.getMultiAudio().then((levels) => {
      for (let i = 0; i < levels.length; i++) {
        let volumeItem = document.createElement("div");
        volumeItem.setAttribute("id", "volumeItem");
        volumeItem.setAttribute("class", "volumeItem");
        volumeItem.setAttribute("value", levels[i]);
        volumeItem.innerHTML = levels[i];
        volumeSubMenu.appendChild(volumeItem);
        volumeItem.addEventListener("click", function (event) {
          event.stopPropagation();
          volumeItem.innerHTML = levels[i];
          let allVolumeItems = document.getElementsByClassName("volumeItem");
          for (let j = 0; j < allVolumeItems.length; j++) {
            allVolumeItems[j].classList.remove("volumeItemActive");
          }
          volumeItem.classList.add("volumeItemActive");
          closeAudioMenu();
          const vol = volumeItem.getAttribute("value");
          currentPlayer.setVolume(vol);
        });
      }
      // });
    }

    function closeAudioMenu() {
      volumeSubMenu.classList.add("hidden");
    }

    function openAudioMenu() {
      volumeSubMenu.classList.remove("hidden");
    }

    function toggleVolumeMenu() {
      if (volumeSubMenu.classList.contains("hidden")) {
        openAudioMenu();
      } else {
        closeAudioMenu();
      }
    }
  }

  function renderFullScreen(rightMenu) {
    console.log("CONTROL_MANAGER :: renderFullScreen");
    let fullScreenMenu = document.createElement("div");
    fullScreenMenu.setAttribute("id", "fullScreenMenu");
    fullScreenMenu.setAttribute("class", "fullScreenMenu eachIcon");
    fullScreenMenu.innerHTML = "FULL SCREEN";
    rightMenu.appendChild(fullScreenMenu);
    fullScreenMenu.addEventListener("click", function () {
      toggleFullScreen();
    });
  }
  /* Rendering Ended */

  /* Commands */
  function toglePlay() {
    console.log("CONTROL_MANAGER :: toglePlay");
    // if (centerPlayPause.innerHTML == "PLAY") {
    //   play();
    // } else if (centerPlayPause.innerHTML === "PAUSE") {
    //   pause();
    // }
    currentPlayer.togglePlayPause();
  }

  function getTotalDuration(callback) {
    currentPlayer.getTotalDuration().then((duration) => {
      callback(duration);
    });
  }

  function play() {
    currentPlayer.play();
  }

  function pause() {
    currentPlayer.pause();
  }

  function seek(position) {
    if (position > 0 && position <= currentDuration) {
      currentPlayer.seekTo({ position });
    }
  }

  function toggleMute() {
    currentPlayer.mute(10);
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      playerDiv.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  /* Events */
  function onPlay() {
    centerPlayPause.innerHTML = "PAUSE";

    setTimeout(function () {
      centerPlayPause.classList.add("hidden");
    }, 3000);

    leftPlayPause.innerHTML = "PAUSE";
  }

  function onPause() {
    centerPlayPause.classList.remove("hidden");
    centerPlayPause.innerHTML = "PLAY";
    leftPlayPause.innerHTML = "PLAY";
  }

  function onSeek() {
    console.log("CONTROL_MANAGER :: onSeek");
  }

  // function onVolumeChange(currentVolume) {
  //   if (currentVolume === 0) {
  //     volume.innerHTML = "MUTE";
  //   } else {
  //     volume.innerHTML = "UNMUTE";
  //   }
  // }

  function onFullscreenChange() {
    console.log("CONTROL_MANAGER :: onFullscreenChange");
  }

  function onTimeUpdate(_currentTime) {
    currentTime = _currentTime;
    console.log("CONTROL_MANAGER :: onTimeUpdate", currentTime);
    if (currentTime) {
      currentTimeDiv.innerHTML =
        formatTime(currentTime) + " / " + formatTime(currentDuration);
      if (currentDuration) {
        let currentTimePercentage = (currentTime / currentDuration) * 100;
        seekBarProgress.style.width = currentTimePercentage + "%";
      }
    }
  }

  function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  }

  function playerCallback(eventName, eventData) {
    switch (eventName) {
      case NATIVE_EVENTS.LOADEDMETADATA:
        // console.error(NATIVE_EVENTS.LOADEDMETADATA, eventData);
        currentDuration = eventData.duration;
        if (!controlsRendered) {
          renderControls();
        }
        break;
      case NATIVE_EVENTS.PROGRESS:
        var seekBarBuffer = document.getElementById("seekBarBuffer");
        currentPlayer.getTotalBufferedDuration().then((buffer) => {
          seekBarBuffer.style.width = (buffer / currentDuration) * 100 + "%";
        });
        break;
      case NATIVE_EVENTS.PLAY:
        onPlay();
        break;
      case NATIVE_EVENTS.PAUSE:
        onPause();
        break;
      case NATIVE_EVENTS.SEEKING:
        onSeek();
        break;
      case NATIVE_EVENTS.VOLUMECHANGE:
        let currentVolume = eventData.volume;
        // onVolumeChange(currentVolume);
        break;
      case "fullscreenChange":
        onFullscreenChange();
        break;
      case "TEXT_TRACK_CUE_CHANGE":
        subtitlesDiv.innerHTML = eventData.text;
        break;
      case NATIVE_EVENTS.DURATIONCHANGE:
        currentPlayer.getTotalDuration().then((duration) => {
          currentDuration = duration;
        });
        break;
    }
  }

  function playerCustomCallback(eventName, eventData) {
    switch (eventName) {
      case CUSTOM_EVENTS.VIDEO_LANGUAGE_CHANGE:
        var audioMenuText = document.getElementById("audioMenuText");
        audioMenuText.innerHTML = eventData.selectedLanguage;
        break;
      case CUSTOM_EVENTS.BITRATE_CHANGED:
        var qualityMenuText = document.getElementById("qualityMenuText");
        qualityMenuText.innerHTML = eventData.bitrate / 1000 + "K";
        break;
      case CUSTOM_EVENTS.FIRST_PLAY:
        enableControls();
        break;
      case CUSTOM_EVENTS.TIMEUPDATE:
        let currentTime = eventData.currentTime;
        onTimeUpdate(currentTime);
        break;
    }
  }

  function adCallback(eventName, eventData) {
    switch (eventName) {
      case "test":
        break;
      default:
        break;
    }
  }

  function exposeMethods() {
    __this.init = init;
    __this.playerCallback = playerCallback;
    __this.playerCustomCallback = playerCustomCallback;
    __this.adCallback = adCallback;
    __this.destroy = destroy;
  }
  // exposeMethods();

  function destroy() {
    __this.init = null;
    __this.playerCallback = null;
    __this.playerCustomCallback = null;
    __this.adCallback = null;
    __this.controlsConfig = null;
    playerCallback = null;
    playerCustomCallback = null;
    adCallback = null;
    init = null;
    controlsOuter && controlsOuter.remove();
    controlsOuter = null;
    playerDiv = null;
    currentTimeDiv = null;
    centerPlayPause = null;
    leftPlayPause = null;
    seekBarProgress = null;
    currentTime = null;
    currentDuration = null;
    __this = null;
  }

  return {
    init,
    playerCallback,
    playerCustomCallback,
    adCallback,
    destroy
  };
}
