import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Dimensions, StyleSheet, Animated } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const OBSTACLE_WIDTH = 180;
const VERTICAL_GAP = 240;
const SPAWN_INTERVAL = 1300;
const MAX_OBSTACLES = 3;
const BIRD_SIZE = 50;
const BIRD_X_POSITION = screenWidth / 4;
const OBSTACLE_IMAGE_WIDTH = 676;
const OBSTACLE_IMAGE_HEIGHT = 1315;
const OBSTACLE_OVERFLOW = 0.7;

const MAX_OBSTACLE_HEIGHT = (OBSTACLE_WIDTH / OBSTACLE_IMAGE_WIDTH) * OBSTACLE_IMAGE_HEIGHT * (1 + OBSTACLE_OVERFLOW);

const obstacleImages = [
     require('../assets/images/obstacles/1.png'),
     require('../assets/images/obstacles/2.png'),
     require('../assets/images/obstacles/3.png'),
];

const Obstacles = ({ onGameOver, birdY, isActive, onScore, isInvincible }) => {
     const [obstacles, setObstacles] = useState([]);
     const gameRunning = useRef(true);
     const passedObstacles = useRef(new Set());
     const gapAnimations = useRef(new Map()).current;
     const lastUpdate = useRef(Date.now());

     const generateGapPosition = () => {
          const minGapPosition = BIRD_SIZE * 2;
          const maxGapPosition = screenHeight - VERTICAL_GAP - (BIRD_SIZE * 2);
          return Math.floor(Math.random() * (maxGapPosition - minGapPosition) + minGapPosition);
     };

     const getRandomImage = () => obstacleImages[Math.floor(Math.random() * obstacleImages.length)];

     const animateObstacleGap = (obstacleId) => {
          if (!gapAnimations.has(obstacleId)) {
               const topAnim = new Animated.Value(0);
               const bottomAnim = new Animated.Value(0);
               gapAnimations.set(obstacleId, { top: topAnim, bottom: bottomAnim });

               Animated.parallel([
                    Animated.timing(topAnim, {
                         toValue: -100,
                         duration: 500,
                         useNativeDriver: true,
                    }),
                    Animated.timing(bottomAnim, {
                         toValue: 100,
                         duration: 500,
                         useNativeDriver: true,
                    }),
               ]).start();
          }
     };

     useEffect(() => {
          if (!isActive) {
               gameRunning.current = false;
               return;
          }

          gameRunning.current = true;
          passedObstacles.current.clear();
          gapAnimations.clear();
          setObstacles([]);
     }, [isActive]);

     // Handle obstacle movement and spawning
     useEffect(() => {
          if (!gameRunning.current || !isActive) return;

          const moveAndSpawnObstacles = () => {
               const now = Date.now();
               const deltaTime = now - lastUpdate.current;
               lastUpdate.current = now;

               setObstacles(prevObstacles => {
                    const movedObstacles = prevObstacles
                         .map(obstacle => ({
                              ...obstacle,
                              x: obstacle.x - 5,
                         }))
                         .filter(obstacle => obstacle.x + OBSTACLE_WIDTH > 0);

                    if (movedObstacles.length < MAX_OBSTACLES) {
                         const lastObstacle = movedObstacles[movedObstacles.length - 1];
                         if (!lastObstacle || screenWidth - lastObstacle.x >= SPAWN_INTERVAL / 3) {
                              return [...movedObstacles, {
                                   gapY: generateGapPosition(),
                                   x: screenWidth,
                                   id: Date.now(),
                                   image: getRandomImage(),
                              }];
                         }
                    }
                    return movedObstacles;
               });
          };

          const gameLoop = setInterval(moveAndSpawnObstacles, 20);
          return () => clearInterval(gameLoop);
     }, [isActive]);

     // Handle scoring in a separate effect
     useEffect(() => {
          if (!isActive) return;

          obstacles.forEach(obstacle => {
               if (obstacle.x + OBSTACLE_WIDTH < BIRD_X_POSITION && !passedObstacles.current.has(obstacle.id)) {
                    passedObstacles.current.add(obstacle.id);
                    onScore && onScore(2);
               }
          });
     }, [obstacles, isActive, onScore]);

     // Handle collision detection
     useEffect(() => {
          if (!gameRunning.current || !isActive || isInvincible) return;

          const checkCollision = () => {
               const birdLeft = BIRD_X_POSITION;
               const birdRight = birdLeft + BIRD_SIZE;
               const birdTop = birdY;
               const birdBottom = birdY + BIRD_SIZE;

               obstacles.forEach(({ x, gapY, id }) => {
                    if (birdRight > x && birdLeft < x + OBSTACLE_WIDTH) {
                         if (birdTop < gapY || birdBottom > gapY + VERTICAL_GAP) {
                              if (!isInvincible) {
                                   animateObstacleGap(id);
                                   onGameOver();
                              }
                         }
                    }
               });
          };

          const collisionInterval = setInterval(checkCollision, 16);
          return () => clearInterval(collisionInterval);
     }, [birdY, obstacles, onGameOver, isActive, isInvincible]);

     return (
          <>
               {obstacles.map(({ gapY, x, id, image }) => {
                    const animations = gapAnimations.get(id) || { top: new Animated.Value(0), bottom: new Animated.Value(0) };

                    return (
                         <View key={id} style={[styles.obstacleContainer, { left: x }]}>
                              <Animated.View
                                   style={[
                                        styles.obstacleWrapper,
                                        { height: gapY, transform: [{ translateY: animations.top }] }
                                   ]}
                              >
                                   <View style={styles.topObstacleImageContainer}>
                                        <Image
                                             source={image}
                                             style={[styles.obstacleImage, { transform: [{ scaleY: -1 }] }]}
                                             resizeMode="stretch"
                                        />
                                   </View>
                              </Animated.View>

                              <View style={{ height: VERTICAL_GAP }} />

                              <Animated.View
                                   style={[
                                        styles.obstacleWrapper,
                                        {
                                             height: screenHeight - gapY - VERTICAL_GAP,
                                             overflow: 'visible',
                                             transform: [{ translateY: animations.bottom }]
                                        }
                                   ]}
                              >
                                   <View style={styles.bottomObstacleImageContainer}>
                                        <Image
                                             source={image}
                                             style={styles.obstacleImage}
                                             resizeMode="stretch"
                                        />
                                   </View>
                              </Animated.View>
                         </View>
                    );
               })}
          </>
     );
};

const styles = StyleSheet.create({
     obstacleContainer: {
          position: 'absolute',
          top: 0,
          width: OBSTACLE_WIDTH,
          height: screenHeight,
          alignItems: 'center',
     },
     obstacleWrapper: {
          width: '100%',
          overflow: 'hidden',
     },
     topObstacleImageContainer: {
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: MAX_OBSTACLE_HEIGHT,
          justifyContent: 'flex-end',
     },
     bottomObstacleImageContainer: {
          position: 'absolute',
          top: 0,
          width: '100%',
          height: MAX_OBSTACLE_HEIGHT,
     },
     obstacleImage: {
          width: '100%',
          height: '100%',
     },
});

export default Obstacles;