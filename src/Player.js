import React, {useEffect, useMemo, useRef} from 'react';
import {Player, PlayerEvent} from 'bitmovin-player';
import {UIFactory} from 'bitmovin-player-ui';
import 'bitmovin-player-ui/dist/css/bitmovinplayer-ui.css';
import {TSAnalyticsMitigtionSDK} from 'selfheal-analytics-mitigation';


const BitmovinPlayer = () => {
  const playerContainerRef = useRef(null);
  const playerRef = useRef(null);
  const analyticsSDK = useMemo(() => new TSAnalyticsMitigtionSDK(), []);
  console.log('analyticsSDK', analyticsSDK);

  const setupPlayer = useMemo(() => {
    const playerConfig = {
      key: 'A7ACFA3C-C4C0-4847-A593-792CA02D24A7',
      playback: {
        muted: true,
        autoplay: true,
      },
    };
    return () => {
      const playerConfigFromSDK = analyticsSDK.getMitigationConfiguration(playerConfig);
      console.log('playerConfigFromSDK', playerConfigFromSDK);
      const player = new Player(playerContainerRef.current, playerConfig);
      playerRef.current = player;

      const uiManager = UIFactory?.buildDefaultUI(player);
      player.on(PlayerEvent.Destroy, () => {
        uiManager.release();
      });

      const source = {
        // dash: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd',
        // hls: 'http://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
        hls: 'http://content.jwplatform.com/manifests/vM7nH0Kl.m3u8',
        // hls: 'http://qthttp.apple.com.edgesuite.net/1010qwoeiuryfg/sl.m3u8',
        poster: ''
      };

      const assetInfo = {
        AssetID: "1235",
        Provider: "Hotstar",
        CDN: "AKAMAI"
      };

      analyticsSDK.registerPlaybackSession(assetInfo, player);

      player.load(source).then(() => {
        console.log('Player loaded successfully');
      }).catch((error) => {
        console.error('Error loading player:', error);
      });
    };
  }, [playerContainerRef, playerRef, analyticsSDK]);


  useEffect(() => {
    if (analyticsSDK && !playerRef.current) {
      console.log('analyticsSDK', analyticsSDK);
      var appProperties = {
        ApplicationName: "bitmovin_based_react_app",
        PlayerName: "bitmovin player",
        UEID: "guest@gmail.com"
      }
      analyticsSDK.registerApplication(appProperties);
      setupPlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        analyticsSDK.unregisterApplication();
      };
    }
  }, [analyticsSDK, setupPlayer]);

  return <div ref={playerContainerRef} style={
    {
      position: 'relative',
      width: '100%',
      height: '100vh',
      maxWidth: '100%',
      maxHeight: '100vh',
      overflow: 'hidden',
    }
  } />;
};

export default BitmovinPlayer;
