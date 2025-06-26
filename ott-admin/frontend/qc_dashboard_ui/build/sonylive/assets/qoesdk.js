/* eslint-disable */
window.qoe_FRONT_END_SDK = (() => {
  var AD_SERVER_URL =
    "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpostpodbumper&cmsid=496&vid=short_onecue&correlator=";
  var logger;
  var outputDiv;
  var customContentForm;
  var authenticationForm;
  var NATIVE_EVENTS;
  var CUSTOM_EVENTS;
  var ADS_EVENTS;
  var sdkConfig;
  var playerDiv;
  var urlParams;
  var urlConfig = {};
  var eventsRegistered = false;
  var isPlayerCreated = false;

  function getToken() {
    var authentication = document.getElementById("authentication").value;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          // console.log(this.responseText);
          resolve(JSON.parse(this.responseText).data.token);
        }
      });

      xhr.open(
        "GET",
        "https://tb.tapi.videoready.tv/zee5-playback-api/sony/fetch/token"
      );
      xhr.setRequestHeader("Cache-Control", "no-cache");
      xhr.setRequestHeader("rule", "BA");
      xhr.setRequestHeader("locale", "USA");
      xhr.setRequestHeader("deviceId", "654a37c8e9cadf72");
      xhr.setRequestHeader("deviceType", "Android");
      xhr.setRequestHeader("deviceName", "Samsung SM-A707F");
      xhr.setRequestHeader("profileId", "f8164ff4-e359-4bee-a2b4-429b4a68c6b6");
      xhr.setRequestHeader("authorization", "bearer " + authentication);
      xhr.setRequestHeader("platform", "qoe_ANYWHERE");
      xhr.setRequestHeader("deviceToken", "ta58yHFsTg67udrRq9cZHGOMj9DfVzNS");
      xhr.setRequestHeader("subscriberId", "1405827971");

      xhr.send();
    });
  }

  function renderList() {
    var videolist = document.getElementById("contentCarousel1");
    videolist.innerHTML = "";
    var data = [
      {
        image:
          "https://origin-staticv2.sonyliv.com/landscape_thumb/SETHD1_Landscape_Thumb.jpg",
        title: "SET Live",
        videoId: "1000009246",
      },
      {
        image:
          "https://origin-staticv2.sonyliv.com/landscape_thumb/tarak_ep3383_landscape_thumb.jpg",
        title: "TMKUC: E3383",
        videoId: "1000160930",
      },
      {
        image:
          "https://origin-staticv2.sonyliv.com/landscape_thumb/show_set_kbcs13_ep84_india_Landscape_Thumb.jpg",
        title: "KBC: S13E84",
        videoId: "1000149886",
      },
      {
        image:
          "https://origin-staticv2.sonyliv.com/landscape_thumb/RocketBoys1_first_episode1.jpg",
        title: "Rocket Boys: E01 [DRM][Free]",
        videoId: "1000158649",
      },
      {
        image:
          "https://origin-staticv2.sonyliv.com/landscape_thumb/scam_ep02_landscape_thumb.jpg",
        title: "Scam 1992: E02 [DRM]",
        videoId: "1000062136",
      },
    ];

    function renderCard(cardData, parentDiv) {
      const card = document.createElement("div");
      card.setAttribute("class", "card");
      const cardImageDiv = document.createElement("div");
      cardImageDiv.setAttribute("class", "card-img-top");
      const cardImage = document.createElement("img");
      cardImage.setAttribute("src", cardData.image);
      cardImageDiv.appendChild(cardImage);
      card.appendChild(cardImageDiv);
      const cardBody = document.createElement("div");
      cardBody.setAttribute("class", "card-body");
      const cardTitle = document.createElement("h5");
      cardTitle.setAttribute("class", "card-title");
      card.addEventListener("click", () => {
        const { videoId } = cardData;
        createPlayerOuter(videoId);
      });
      cardTitle.innerHTML = cardData.title;
      cardBody.appendChild(cardTitle);
      card.appendChild(cardBody);
      parentDiv.appendChild(card);
    }

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const itemDiv = document.createElement("div");
      itemDiv.setAttribute("class", "item");
      itemDiv.setAttribute("id", item.videoId);
      renderCard(item, itemDiv);
      videolist.appendChild(itemDiv);
    }
  }

  function registerUIEvents() {
    if (eventsRegistered) {
      return;
    }
    const isPlayingBtn = document.getElementById("isPlaying");
    isPlayingBtn.addEventListener("click", () => {
      window.qoe_PLAYER.isPlaying().then((isPlaying) => {
        outputDiv.innerHTML = isPlaying;
      });
    });
    const togglePlay = document.getElementById("togglePlay");
    togglePlay.addEventListener("click", async () => {
      const isPlaying = await window.qoe_PLAYER.isPlaying();
      if (isPlaying) togglePlay.innerHTML = "Play";
      else togglePlay.innerHTML = "Pause";
      window.qoe_PLAYER.togglePlayPause();
    });
    const destroyPlayer = document.getElementById("destroyPlayer");
    destroyPlayer.addEventListener("click", () => {
      window.qoe_PLAYER.destroyPlayer();
    });
    const seekForward = document.getElementById("seekForward");
    seekForward.addEventListener("click", () => {
      window.qoe_PLAYER.forward({
        time: 10,
      });
    });
    const seekBackward = document.getElementById("seekBackward");
    seekBackward.addEventListener("click", () => {
      window.qoe_PLAYER.forward({
        time: -10,
      });
    });
    const checkMultiAudio = document.getElementById("checkMultiAudio");
    checkMultiAudio.addEventListener("click", () => {
      window.qoe_PLAYER
        .isMultiAudioAvailable()
        .then((isMultiAudioAvailable) => {
          outputDiv.innerHTML = isMultiAudioAvailable;
        });
    });
    const getMultiAudio = document.getElementById("getMultiAudio");
    getMultiAudio.addEventListener("click", () => {
      window.qoe_PLAYER.getMultiAudio().then((multiAudio) => {
        outputDiv.innerHTML = multiAudio;
      });
    });
    const getDuration = document.getElementById("getDuration");
    getDuration.addEventListener("click", () => {
      window.qoe_PLAYER.getTotalDuration().then((duration) => {
        outputDiv.innerHTML = duration;
      });
    });
    const isSubtitle = document.getElementById("isSubtitle");
    isSubtitle.addEventListener("click", () => {
      window.qoe_PLAYER.isSubtitleAvailable().then((res) => {
        outputDiv.innerHTML = res;
      });
    });
    const getSubtitle = document.getElementById("getSubtitle");
    getSubtitle.addEventListener("click", () => {
      window.qoe_PLAYER.getSubtitleLanguages().then((subTitleLanguages) => {
        outputDiv.innerHTML = subTitleLanguages;
      });
    });
    const getCurrentPosition = document.getElementById("getCurrentPosition");
    getCurrentPosition.addEventListener("click", () => {
      window.qoe_PLAYER.getCurrentPosition().then((currPos) => {
        outputDiv.innerHTML = currPos;
      });
    });
    const getPlaybackVariants = document.getElementById("getPlaybackVariants");
    getPlaybackVariants.addEventListener("click", () => {
      window.qoe_PLAYER.getPlaybackVariants().then((variants) => {
        outputDiv.innerHTML = variants;
      });
    });
    const getCurrentPlaybackVariant = document.getElementById(
      "getCurrentPlaybackVariant"
    );
    getCurrentPlaybackVariant.addEventListener("click", () => {
      window.qoe_PLAYER.getCurrentPlaybackVariant().then((currVariant) => {
        outputDiv.innerHTML = currVariant;
      });
    });
    const seekToLastTenSec = document.getElementById("seekToLastTenSec");
    seekToLastTenSec.addEventListener("click", () => {
      window.qoe_PLAYER.seekToLastTenSec();
    });
    const isSubtitleEnabled = document.getElementById("isSubtitleEnabled");
    isSubtitleEnabled.addEventListener("click", () => {
      window.qoe_PLAYER.isSubtitleEnabled().then((res) => {
        outputDiv.innerHTML = res;
      });
    });

    const getTotalBufferedDuration = document.getElementById(
      "getTotalBufferedDuration"
    );
    getTotalBufferedDuration.addEventListener("click", () => {
      window.qoe_PLAYER.getTotalBufferedDuration().then((buffer) => {
        outputDiv.innerHTML = buffer;
      });
    });
    eventsRegistered = true;
  }

  function playerCallback(eventName, eventData) {
    if (window.qoe_CONTROLS && window.qoe_CONTROLS.playerCallback) {
      window.qoe_CONTROLS.playerCallback(eventName, eventData);
    }

    if (eventName == NATIVE_EVENTS.LOADSTART) {
      registerUIEvents();
    }

    if (
      [
        NATIVE_EVENTS.PROGRESS,
        NATIVE_EVENTS.SEEKBAR_UPDATE,
        NATIVE_EVENTS.TIMEUPDATE,
      ].includes(eventName)
    ) {
      return;
    }
    console.log("playerCallback :: ", eventName, eventData);
    logger.innerHTML += `playerCallback :: ${eventName} :: ${eventData} <br /><br />`;
  }

  function playerCustomCallback(eventName, eventData) {
    if (window.qoe_CONTROLS && window.qoe_CONTROLS.playerCustomCallback) {
      window.qoe_CONTROLS.playerCustomCallback(eventName, eventData);
    }
    if ([CUSTOM_EVENTS.TIMEUPDATE].includes(eventName)) {
      return;
    }
    console.log("playerCustomCallback :: ", eventName, eventData);
    logger.innerHTML += `playerCustomCallback :: ${eventName} :: ${eventData}<br /><br />`;
  }

  function adCallback(eventName, eventData) {
    console.log("adCallback :: ", eventName, eventData);
    logger.innerHTML += `adCallback :: ${eventName} :: ${eventData}<br /><br />`;
    if (window.qoe_CONTROLS && window.qoe_CONTROLS.adCallback) {
      window.qoe_CONTROLS.adCallback(eventName, eventData);
    }
  }

  function createPlayerOuter(videoId) {
    console.log("createPlayerOuter");
    if (window.qoe_PLAYER) {
      sdkConfig.video.videoId = videoId;
      document.getElementById("togglePlay").innerHTML = "Pause";
      window.qoe_PLAYER.playContent(sdkConfig, (err, data) => {
        if (err) {
          console.error("Error :: ", err);
          return;
        }
        console.info("data :: ", data);
        if (window.qoe_CONTROLS) {
          window.qoe_CONTROLS.destroy();
          window.qoe_CONTROLS = null;
        }
        if (!window.ENABLE_UI) {
          const controlsConfig = {
            EVENTS: { NATIVE_EVENTS, CUSTOM_EVENTS, ADS_EVENTS },
            playerDiv,
            currentPlayer: window.qoe_PLAYER,
          };
          const controls = new controlManager(controlsConfig);
          window.qoe_CONTROLS = controls;
        }
      });
    } else {
      console.log("SPNManager not found");
    }
  }

  function getUrlParameters(url) {
    var url = url || window.location.href;
    var queryString = url ? url.split("#")[1] : window.location.search.slice(1);
    var obj = {};
    if (queryString) {
      // queryString = queryString.split("#")[0];
      var arr = queryString.split("&");
      for (var i = 0; i < arr.length; i++) {
        var a = arr[i].split("=");
        var paramName = a[0];
        var paramValue = typeof a[1] === "undefined" ? true : a[1];
        paramName = paramName.toLowerCase();
        if (typeof paramValue === "string")
          paramValue = paramValue.toLowerCase();
        if (paramName.match(/\[(\d+)?\]$/)) {
          var key = paramName.replace(/\[(\d+)?\]/, "");
          if (!obj[key]) obj[key] = [];
          if (paramValue !== true)
            obj[key][paramName.match(/\[(\d+)?\]$/)[1]] = paramValue;
          else obj[key].push(paramValue);
        } else {
          if (paramValue === true) {
            if (!obj[paramName]) obj[paramName] = [];
            obj[paramName].push(paramValue);
          } else obj[paramName] = paramValue;
        }
      }
    }
    return obj;
  }

  function getPlayerConfig() {
    var configOptions = ["enableui", "useiframe", "enableads", "enabletestad"];

    configOptions.forEach((option) => {
      if (urlParams[option] && urlParams[option] == "true") {
        urlConfig[option] = true;
      } else {
        urlConfig[option] = false;
      }
    });

    return {
      enableUI: urlConfig.enableui,
      useIFrame: urlConfig.useiframe,
      enableAds: urlConfig.enableads,
      adServerUrl: urlConfig.enabletestad ? AD_SERVER_URL : null,
    };
  }

  function bodyOnLoad() {
    urlParams = getUrlParameters();
    playerDiv = document.getElementById("playerWrapper");
    logger = document.getElementById("logger");
    outputDiv = document.getElementById("output");
    customContentForm = document.getElementById("customContentForm");
    authenticationForm = document.getElementById("authenticationForm");

    sdkConfig = {
      playerDiv,
      video: {
        videoId: null,
      },
      playerConfig: getPlayerConfig(),
      playerCallback,
      playerCustomCallback,
      adCallback,
    };

    const toggleLogs = document.getElementById("toggleLogs");
    toggleLogs.addEventListener("click", () => {
      const logsContainer = document.getElementById("logsContainer");
      if (logsContainer.classList.contains("hide")) {
        logsContainer.classList.remove("hide");
      } else {
        logsContainer.classList.add("hide");
      }
    });
    const clearLogs = document.getElementById("clearLogs");
    clearLogs.addEventListener("click", () => {
      logger.innerHTML = "";
    });

    customContentForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const videoId = document.getElementById("videoId").value;
      createPlayerOuter(videoId);
    });

    authenticationForm.addEventListener("submit", function (e) {
      e.preventDefault();
      getTokenAndInitSDK();
    });

    //renderList();
  }

  function initializeCallback(res) {
    var success = res.success;
    var message = res.message;
    var result = res.result;
    var player = res.player;

    if (urlParams.createplayer == "false" && !isPlayerCreated) {
      player = window.SPN_MANAGER.createPlayer();
      isPlayerCreated = true;
    }

    if (success) {
      console.log("initializeCallback :: ", result);
      window.qoe_PLAYER = player;
      window.qoe_PLAYER.on("error", function (error) {
        setTimeout(() => {
          alert("Error :: " + error.errorMessage);
        }, 0);
        console.error("error :: ", error);
      });
      if (urlParams.prefetchplayer == "true") {
        const config = {
          playerDiv: document.getElementById("playerWrapper"),
        };
        window.qoe_PLAYER.prefetchPlayerSdk(config, function (res) {
          console.log("prefetchPlayerSdk :: ", res);
        });
      }
      NATIVE_EVENTS = window.SPN_MANAGER.EVENTS.NATIVE_EVENTS;
      CUSTOM_EVENTS = window.SPN_MANAGER.EVENTS.CUSTOM_EVENTS;
      ADS_EVENTS = window.SPN_MANAGER.EVENTS.ADS_EVENTS;
      // createPlayerOuter(1000149886);
    } else {
      console.error("initializeCallback Error :: ", res);
    }
  }

  function getTokenAndInitSDK() {
    getToken().then((token) => {
      window.SPN_MANAGER.initSDK(
        {
          shortToken: localStorage.getItem("device_token"), //"73Wi8uC1MJJIQ5kHM7k7DnKJujTkYL6D",
          uniqueId: "qoe",
          deviceType: "TSMOBILE",
          deviceToken: "1662106944338", //localStorage.getItem("deviceid"),//
          partnerToken: token,
          useIFrame: urlParams.useiframe == "true" ? true : false,
          createPlayer: urlParams.createplayer == "true" ? true : false,
        },
        initializeCallback
      );
    });
  }

  function registerBodyOnload() {
    if (document.body) {
      bodyOnLoad();
    } else {
      document.addEventListener("DOMContentLoaded", bodyOnLoad);
    }
  }

  registerBodyOnload();
})();
