// ./app/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, Text } from 'react-native';

import Bird from '../components/Bird';
import BackgroundVideo from '../components/BackgroundVideo';
import Obstacles from '../components/Obstacles';
import Boundaries from '../components/Boundaries';
import StatusBar from '../components/StatusBar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const aspectRatioLimit = 16 / 9;
const maxGameHeight = screenWidth * aspectRatioLimit;
const boundaryHeight = Math.max(0, (screenHeight - maxGameHeight) / 2);

const App = () => {
     const [birdY, setBirdY] = useState(200);
     const [gravity, setGravity] = useState(0);
     const [isGameOver, setIsGameOver] = useState(false);
     const [gameActive, setGameActive] = useState(true);
     const [lives, setLives] = useState(3);
     const [score, setScore] = useState(0);
     const [isInvincible, setIsInvincible] = useState(false);

     useEffect(() => {
          if (!gameActive) return;

          const interval = setInterval(() => {
               setBirdY((y) => {
                    const newY = y + gravity;
                    const minY = boundaryHeight;
                    const maxY = screenHeight - boundaryHeight - 50;

                    // Check if bird hits boundaries
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

     const handleJump = useCallback(() => {
          if (!isGameOver && gameActive) {
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
                    return 0;
               }

               // Set invincibility
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
          setBirdY(200);
          setGravity(0);
          setIsGameOver(false);
          setGameActive(true);
          setLives(3);
          setScore(0);
          setIsInvincible(false);
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