import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');
const BIRD_X = width / 4;
const FRAME_DURATION = 100;
const SPRITE_FRAME_WIDTH = 76;
const SPRITE_FRAME_HEIGHT = 60;
const TOTAL_FRAMES = 6;
const BLINK_DURATION = 200;

const Bird = ({ birdY, gravity, isFlipped = true, isInvincible = false, isCheatMode = false }) => {
     const [currentFrame, setCurrentFrame] = useState(0);
     const [isVisible, setIsVisible] = useState(true);
     const blinkInterval = useRef(null);
     const frameInterval = useRef(null);

     const [rotation, setRotation] = useState(0);
     // Frame animation
     useEffect(() => {
          frameInterval.current = setInterval(() => {
               setCurrentFrame(current => (current + 1) % TOTAL_FRAMES);
          }, FRAME_DURATION);

          return () => clearInterval(frameInterval.current);
     }, []);

     // Rotation based on gravity
     useEffect(() => {
          const newRotation = gravity < 0 ? -30 : Math.min(30, gravity * 2);
          setRotation(newRotation);
     }, [gravity]);

     // Blink effect
     useEffect(() => {
          if (isInvincible && !isCheatMode) {
               blinkInterval.current = setInterval(() => {
                    setIsVisible(v => !v);
               }, BLINK_DURATION);
          } else {
               setIsVisible(true);
               if (blinkInterval.current) {
                    clearInterval(blinkInterval.current);
               }
          }

          return () => {
               if (blinkInterval.current) {
                    clearInterval(blinkInterval.current);
               }
          };
     }, [isInvincible]);

     return (
          <View
               style={[
                    styles.birdContainer,
                    {
                         opacity: isVisible ? 1 : 0.2,
                         transform: [
                              { translateY: birdY },
                              { translateX: BIRD_X },
                              { rotate: `${rotation}deg` },
                              { scaleX: isFlipped ? -1 : 1 },
                         ],
                    },
               ]}
          >
               <View style={styles.spriteWrapper}>
                    <Image
                         source={require('../assets/images/fish/spritesheet.png')}
                         style={[
                              styles.spritesheet,
                              {
                                   left: -currentFrame * SPRITE_FRAME_WIDTH,
                              }
                         ]}
                         resizeMode='stretch'
                    />
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     birdContainer: {
          position: 'absolute',
          width: SPRITE_FRAME_WIDTH,
          height: SPRITE_FRAME_HEIGHT,
     },
     spriteWrapper: {
          width: SPRITE_FRAME_WIDTH,
          height: SPRITE_FRAME_HEIGHT,
          overflow: 'hidden',
     },
     spritesheet: {
          position: 'absolute',
          width: SPRITE_FRAME_WIDTH * TOTAL_FRAMES,
          height: SPRITE_FRAME_HEIGHT,
     }
});

export default Bird;