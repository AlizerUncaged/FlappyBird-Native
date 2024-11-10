import React, { useEffect, useRef, useState } from 'react';
import { Image, Animated, StyleSheet, Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');
const BIRD_X = width / 4;
const FRAME_DURATION = 100; // milliseconds per frame
const SPRITE_FRAME_WIDTH = 76;
const SPRITE_FRAME_HEIGHT = 60;
const TOTAL_FRAMES = 6;
const ROTATION_THRESHOLD = 5;
const ROTATION_UPDATE_INTERVAL = 100;
const BLINK_DURATION = 200; // Duration of each blink cycle

const Bird = ({ birdY, gravity, isFlipped = true, isInvincible = false }) => {
     const [currentFrame, setCurrentFrame] = useState(0);
     const animationTimer = useRef(null);
     const rotationAnim = useRef(new Animated.Value(0)).current;
     const lastRotationUpdate = useRef(Date.now());
     const opacityAnim = useRef(new Animated.Value(1)).current;
     const blinkTimer = useRef(null);

     // Frame animation
     useEffect(() => {
          const animate = () => {
               setCurrentFrame(current => (current + 1) % TOTAL_FRAMES);
          };

          animationTimer.current = setInterval(animate, FRAME_DURATION);

          return () => {
               if (animationTimer.current) {
                    clearInterval(animationTimer.current);
               }
          };
     }, []);

     // Blink animation when invincible
     useEffect(() => {
          const startBlinking = () => {
               // Clear any existing animation
               if (blinkTimer.current) {
                    clearInterval(blinkTimer.current);
               }

               if (isInvincible) {
                    // Create alternating opacity animation
                    blinkTimer.current = setInterval(() => {
                         Animated.sequence([
                              Animated.timing(opacityAnim, {
                                   toValue: 0.2,
                                   duration: BLINK_DURATION / 2,
                                   useNativeDriver: true,
                              }),
                              Animated.timing(opacityAnim, {
                                   toValue: 1,
                                   duration: BLINK_DURATION / 2,
                                   useNativeDriver: true,
                              }),
                         ]).start();
                    }, BLINK_DURATION);
               } else {
                    // Reset opacity when not invincible
                    Animated.timing(opacityAnim, {
                         toValue: 1,
                         duration: 0,
                         useNativeDriver: true,
                    }).start();
               }
          };

          startBlinking();

          // Cleanup
          return () => {
               if (blinkTimer.current) {
                    clearInterval(blinkTimer.current);
               }
          };
     }, [isInvincible, opacityAnim]);

     return (
          <Animated.View
               style={[
                    styles.birdContainer,
                    {
                         opacity: opacityAnim,
                         transform: [
                              { translateY: birdY },
                              { translateX: BIRD_X },
                              {
                                   rotate: rotationAnim.interpolate({
                                        inputRange: [-30, 0, 30],
                                        outputRange: ['-30deg', '0deg', '30deg']
                                   })
                              },
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
          </Animated.View>
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