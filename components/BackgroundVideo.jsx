// ./components/BackgroundVideo.jsx
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BackgroundVideo = () => {
     let videoAsset = require('../assets/videos/day-bg-low.mp4');
     const ref = useRef(null);
     const [isPlaying, setIsPlaying] = useState(true);
     const player = useVideoPlayer(videoAsset, player => {
          player.loop = true;
          player.muted = true;
          player.play();
     });


     useEffect(() => {
          player.play()
     }, []);

     return (

          <VideoView
               ref={ref}
               style={styles.backgroundVideo}
               player={player}
               contentFit='cover'
               nativeControls={false}
          />
          /*     <Video
                   source={require('../assets/videos/bg.mp4')} // Path to your video file
                   style={styles.backgroundVideo}
                   resizeMode="cover" // Ensures the video fills the screen
                   repeat // Loop the video
                   muted // Mute the video
                   playInBackground={false} // Optional: keep false to prevent background playback when app is minimized
                   playWhenInactive={false} // Optional: prevent video from playing when the app is inactive
                   ignoreSilentSwitch="obey" // iOS setting to follow the silent mode
              /> */
     );
};

const styles = StyleSheet.create({
     backgroundVideo: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: screenWidth,
          height: screenHeight,
     },
});

export default BackgroundVideo;
