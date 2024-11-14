// ./app/index.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, Text, Image, Animated } from 'react-native';

import Bird from '../components/Bird';
import BackgroundVideo from '../components/BackgroundVideo';
import Obstacles from '../components/Obstacles';
import Boundaries from '../components/Boundaries';
import StatusBar from '../components/StatusBar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const aspectRatioLimit = 16 / 9;
const maxGameHeight = screenWidth * aspectRatioLimit;
const boundaryHeight = Math.max(0, (screenHeight - maxGameHeight) / 2);
const INITIAL_BIRD_Y = screenHeight / 2 - 25; // Center position for bird

const App = () => {
     const [birdY, setBirdY] = useState(INITIAL_BIRD_Y);
     const [gravity, setGravity] = useState(0);
     const [isGameOver, setIsGameOver] = useState(false);
     const [gameActive, setGameActive] = useState(false);
     const [lives, setLives] = useState(3);
     const [score, setScore] = useState(0);
     const [isInvincible, setIsInvincible] = useState(false);
     const titlePosition = useRef(new Animated.Value(0)).current;
     const titleOpacity = useRef(new Animated.Value(1)).current;

     // Idle animation for bird
     useEffect(() => {
          if (!gameActive && !isGameOver) {
               const interval = setInterval(() => {
                    setBirdY(y => y + Math.sin(Date.now() / 500) * 0.7);
               }, 16);
               return () => clearInterval(interval);
          }
     }, [gameActive, isGameOver]);

     // Game physics
     useEffect(() => {
          if (!gameActive) return;

          const interval = setInterval(() => {
               setBirdY((y) => {
                    const newY = y + gravity;
                    const minY = boundaryHeight;
                    const maxY = screenHeight - boundaryHeight - 50;

                    if (newY <= minY || newY >= maxY) {
                         handleObstacleHit();
                         return Math.max(minY, Math.min(newY, maxY));
                    }

                    return Math.max(minY, Math.min(newY, maxY));
               });
               setGravity((g) => g + 1);
          }, 20);

          return () => clearInterval(interval);
     }, [gravity, gameActive, boundaryHeight]);

     const animateTitle = (show) => {
          Animated.parallel([
               Animated.spring(titlePosition, {
                    toValue: show ? 0 : -200,
                    useNativeDriver: true,
                    tension: 40,
                    friction: 8
               }),
               Animated.timing(titleOpacity, {
                    toValue: show ? 1 : 0,
                    duration: 300,
                    useNativeDriver: true
               })
          ]).start();
     };

     const handleJump = useCallback(() => {
          if (isGameOver) return;

          if (!gameActive) {
               setGameActive(true);
               animateTitle(false);
          } else {
               setGravity(-15);
          }
     }, [isGameOver, gameActive]);

     const handleObstacleHit = useCallback(() => {
          if (isInvincible) return;

          setLives(prev => {
               const newLives = prev - 1;
               if (newLives <= 0) {
                    setGameActive(false);
                    setIsGameOver(true);
                    animateTitle(true);
                    return 0;
               }

               setIsInvincible(true);
               setTimeout(() => {
                    setIsInvincible(false);
               }, 2000);

               return newLives;
          });
     }, [isInvincible]);

     const handleScore = useCallback((points) => {
          setScore(prev => prev + points);
     }, []);

     const handleRetry = () => {
          setBirdY(INITIAL_BIRD_Y);
          setGravity(0);
          setIsGameOver(false);
          setGameActive(false);
          setLives(3);
          setScore(0);
          setIsInvincible(false);
          animateTitle(true);
     };

     return (
          <TouchableWithoutFeedback onPress={handleJump}>
               <View style={styles.container}>
                    <View style={StyleSheet.absoluteFill}>
                         <BackgroundVideo />
                    </View>

                    <Boundaries maxHeight={screenHeight} />

                    <StatusBar lives={lives} score={score} />

                    <Bird
                         birdY={birdY}
                         gravity={gravity}
                         isInvincible={isInvincible}
                    />

                    <Obstacles
                         birdY={birdY}
                         onGameOver={handleObstacleHit}
                         isActive={gameActive}
                         onScore={handleScore}
                         isInvincible={isInvincible}
                    />

                    <Animated.View style={[
                         styles.titleContainer,
                         {
                              transform: [{ translateY: titlePosition }],
                              opacity: titleOpacity
                         }
                    ]}>
                         <Image
                              source={require('../assets/images/title.png')}
                              style={styles.titleImage}
                              resizeMode="contain"
                         />
                    </Animated.View>

                    {isGameOver && (
                         <TouchableWithoutFeedback>
                              <View style={styles.gameOverContainer}>
                                   <Text style={styles.gameOverText}>GAME OVER</Text>
                                   <Text style={styles.scoreText}>Final Score: {score}</Text>
                                   <TouchableWithoutFeedback onPress={handleRetry}>
                                        <View style={styles.retryButton}>
                                             <Text style={styles.retryText}>RETRY</Text>
                                        </View>
                                   </TouchableWithoutFeedback>
                              </View>
                         </TouchableWithoutFeedback>
                    )}
               </View>
          </TouchableWithoutFeedback>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#70c5ce',
     },
     titleContainer: {
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 2,
     },
     titleImage: {
          width: screenWidth * 0.8,
          height: 300,
     },
     gameOverContainer: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 2,
     },
     gameOverText: {
          fontSize: 48,
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 20,
     },
     scoreText: {
          fontSize: 32,
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 30,
     },
     retryButton: {
          backgroundColor: 'white',
          paddingHorizontal: 40,
          paddingVertical: 15,
          borderRadius: 8,
          elevation: 5,
     },
     retryText: {
          fontSize: 24,
          fontWeight: 'bold',
          color: 'black',
     },
});

export default App;