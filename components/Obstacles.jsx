// ./components/Obstacles.jsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet, Alert } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const OBSTACLE_WIDTH = 60;
const OBSTACLE_GAP = 200;
const SPAWN_INTERVAL = 2000;
const MAX_OBSTACLES = 3;
const BIRD_SIZE = 50;
const BIRD_X_POSITION = screenWidth / 4;

const Obstacles = ({ onGameOver, birdY }) => {
     const [obstacles, setObstacles] = useState([]);
     const gameRunning = useRef(true);

     const generateObstacleY = () => Math.floor(Math.random() * (screenHeight - OBSTACLE_GAP - 200));

     // Spawn and move obstacles
     useEffect(() => {
          if (!gameRunning.current) return;

          const moveAndSpawnObstacles = () => {
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
                                   topObstacleY: generateObstacleY(),
                                   x: screenWidth,
                                   id: Date.now(),
                              }];
                         }
                    }

                    return movedObstacles;
               });
          };

          const gameLoop = setInterval(moveAndSpawnObstacles, 20);
          return () => clearInterval(gameLoop);
     }, []);

     // Enhanced collision detection
     useEffect(() => {
          if (!gameRunning.current) return;

          const checkCollision = () => {
               const birdLeft = BIRD_X_POSITION;
               const birdRight = birdLeft + BIRD_SIZE;
               const birdTop = birdY;
               const birdBottom = birdY + BIRD_SIZE;

               obstacles.forEach(({ x, topObstacleY }) => {
                    // Horizontal collision check
                    if (birdRight > x && birdLeft < x + OBSTACLE_WIDTH) {
                         // Vertical collision check with top obstacle
                         if (birdTop < topObstacleY || birdBottom > topObstacleY + OBSTACLE_GAP) {
                              gameRunning.current = false;

                              // Debug info
                              console.log('Collision detected!');
                              console.log('Bird position:', { top: birdTop, bottom: birdBottom });
                              console.log('Obstacle position:', { x, topY: topObstacleY, bottomY: topObstacleY + OBSTACLE_GAP });

                              Alert.alert(
                                   "Game Over!",
                                   "You hit an obstacle!",
                                   [
                                        {
                                             text: "Restart",
                                             onPress: () => {
                                                  setObstacles([]);
                                                  gameRunning.current = true;
                                                  if (onGameOver) onGameOver();
                                             }
                                        }
                                   ]
                              );
                         }
                    }
               });

               // Floor and ceiling collision
               if (birdY < 0 || birdY + BIRD_SIZE > screenHeight) {
                    gameRunning.current = false;
                    Alert.alert(
                         "Game Over!",
                         "You hit the boundary!",
                         [
                              {
                                   text: "Restart",
                                   onPress: () => {
                                        setObstacles([]);
                                        gameRunning.current = true;
                                        if (onGameOver) onGameOver();
                                   }
                              }
                         ]
                    );
               }
          };

          const collisionInterval = setInterval(checkCollision, 16); // Increased frequency for better detection
          return () => clearInterval(collisionInterval);
     }, [birdY, obstacles, onGameOver]);

     return (
          <>
               {obstacles.map(({ topObstacleY, x, id }) => (
                    <View
                         key={id}
                         style={[
                              styles.obstacleContainer,
                              {
                                   left: x,
                                   width: OBSTACLE_WIDTH,
                              }
                         ]}
                    >
                         {/* Top obstacle */}
                         <View
                              style={[
                                   styles.obstacle,
                                   {
                                        height: topObstacleY,
                                        backgroundColor: 'green',
                                   }
                              ]}
                         />
                         {/* Bottom obstacle */}
                         <View
                              style={[
                                   styles.obstacle,
                                   {
                                        height: screenHeight - topObstacleY - OBSTACLE_GAP,
                                        top: topObstacleY + OBSTACLE_GAP,
                                        backgroundColor: 'green',
                                   },
                              ]}
                         />
                    </View>
               ))}
          </>
     );
};

const styles = StyleSheet.create({
     obstacleContainer: {
          position: 'absolute',
          top: 0,
          height: screenHeight,
     },
     obstacle: {
          position: 'absolute',
          width: '100%',
     },
});

export default Obstacles;