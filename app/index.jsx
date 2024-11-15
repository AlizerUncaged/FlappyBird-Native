import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, Text, Image, Animated, Linking } from 'react-native';

import Bird from '../components/Bird';
import BackgroundVideo from '../components/BackgroundVideo';
import Obstacles from '../components/Obstacles';
import Boundaries from '../components/Boundaries';
import StatusBar from '../components/StatusBar';
import { Platform } from 'react-native';
import { ImagePreloader } from '../components/ImagePreloader';
import { TouchableOpacity } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const aspectRatioLimit = 16 / 9;
const maxGameHeight = screenWidth * aspectRatioLimit;
const boundaryHeight = Math.max(0, (screenHeight - maxGameHeight) / 2);
const INITIAL_BIRD_Y = screenHeight / 2 - 25;

const GitHubButton = () => {
     const handlePress = () => {
          Linking.openURL('https://github.com/AlizerUncaged');
     };

     return (
          <TouchableOpacity
               onPress={handlePress}
               style={styles.githubButton}
               activeOpacity={0.7}
          >
               <Image
                    source={require('../assets/images/github-mark-white.png')} // Make sure to add this image to your assets
                    style={styles.githubLogo}
                    resizeMode="contain"
               />
               <Text style={styles.githubText}>Floyd</Text>
          </TouchableOpacity>
     );
};
const App = () => {
     const [birdY, setBirdY] = useState(INITIAL_BIRD_Y);
     const [gravity, setGravity] = useState(0);
     const [isGameOver, setIsGameOver] = useState(false);
     const [gameActive, setGameActive] = useState(false);
     const [lives, setLives] = useState(3);
     const [score, setScore] = useState(0);
     const [highScore, setHighScore] = useState(0);
     const [isInvincible, setIsInvincible] = useState(false);
     const [titleVisible, setTitleVisible] = useState(true);
     const [scoreScale, setScoreScale] = useState(1);

     useEffect(() => {
          if (!gameActive && !isGameOver) {
               const interval = setInterval(() => {
                    setBirdY(y => y + Math.sin(Date.now() / 500) * 0.7);
               }, 16);
               return () => clearInterval(interval);
          }
     }, [gameActive, isGameOver]);

     useEffect(() => {
          if (Platform.OS === 'web') {
               const handleKeyPress = (e) => {
                    if ((e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') && gameActive && !isGameOver) {
                         e.preventDefault();
                         setGravity(-15);
                    }
               };

               window.addEventListener('keydown', handleKeyPress);
               return () => window.removeEventListener('keydown', handleKeyPress);
          }
     }, [gameActive, isGameOver]);

     useEffect(() => {
          if (Platform.OS === 'web') {
               const preventDefault = (e) => e.preventDefault();
               window.addEventListener('contextmenu', preventDefault);
               return () => window.removeEventListener('contextmenu', preventDefault);
          }
     }, []);



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
          setTitleVisible(show);
     };

     const handleJump = useCallback((e) => {
          if (isGameOver) return;

          // Web-specific event handling
          if (Platform.OS === 'web' && e) {
               e.preventDefault();
               e.stopPropagation();
          }

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
                    setHighScore(current => Math.max(current, score));
                    animateTitle(true);
                    return 0;
               }

               setIsInvincible(true);
               setTimeout(() => {
                    setIsInvincible(false);
               }, 2000);

               return newLives;
          });
     }, [isInvincible, score]);

     const handleScore = useCallback((points) => {
          setScore(prev => prev + points);
          setScoreScale(1.2);
          setTimeout(() => setScoreScale(1), 200);
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
                    <ImagePreloader></ImagePreloader>
                    <View style={StyleSheet.absoluteFill}>
                         <BackgroundVideo />
                    </View>

                    <View style={styles.githubContainer}>
                         <GitHubButton />
                    </View>

                    <Boundaries maxHeight={screenHeight} />

                    <View pointerEvents="none">
                         <StatusBar
                              lives={lives}
                              score={score}
                              highScore={highScore}
                              showHighScore={!gameActive || isGameOver}
                              scoreScale={scoreScale}
                         />
                    </View>

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

                    <View
                         style={[
                              styles.titleContainer,
                              titleVisible ? styles.titleVisible : styles.titleHidden
                         ]}
                    >
                         <Image
                              source={require('../assets/images/title.png')}
                              style={styles.titleImage}
                              resizeMode="contain"
                         />
                         <Text style={styles.creditText}></Text>
                         {!gameActive && !isGameOver && (
                              <Text style={styles.startText}>TAP TO START!</Text>
                         )}
                    </View>

                    {isGameOver && (
                         <TouchableWithoutFeedback>
                              <View style={styles.gameOverContainer}>
                                   <Text style={styles.gameOverText}>GAME OVER</Text>
                                   <Text style={styles.scoreText}>Score: {score}</Text>
                                   {score >= highScore && (
                                        <Text style={styles.newHighScoreText}>NEW HIGH SCORE!</Text>
                                   )}
                                   <TouchableWithoutFeedback
                                        onPress={(e) => {
                                             if (Platform.OS === 'web') e.stopPropagation();
                                             handleRetry();
                                        }}
                                   >
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
          ...(Platform.OS === 'web' ? {
               userSelect: 'none',
               WebkitUserSelect: 'none',
               WebkitTouchCallout: 'none',
          } : {})
     },
     titleContainer: {
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 2,
          transition: 'all 0.3s ease-out',
     },
     titleImage: {
          width: screenWidth * 0.8,
          height: 300,
     },
     titleVisible: {
          transform: 'translateY(0)',
     },
     titleHidden: {
          transform: 'translateY(-400px)',
     },
     startText: {
          fontSize: 24,
          fontWeight: 'bold',
          color: 'white',
          marginTop: 20,
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 5,
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
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 5,
     },
     scoreText: {
          fontSize: 32,
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 10,
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
          transition: 'transform 0.2s ease-out',
          transform: `scale(${props => props.scale})`,
     },
     newHighScoreText: {
          fontSize: 36,
          fontWeight: 'bold',
          color: '#FFD700',
          marginBottom: 30,
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 5,
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
     }, githubContainer: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          zIndex: 10, // Ensure it stays above other elements
     },
     githubButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
     },
     githubLogo: {
          width: 24,
          height: 24,
          marginRight: 8,
     },
     githubText: {
          color: 'white',
          fontSize: 14,
          fontWeight: '500',
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
     }, creditText: {
          fontSize: 16,
          color: 'white',
          marginTop: 20, // Negative margin to bring it closer to the title
          marginBottom: 20,
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
          fontStyle: 'italic',
     },
});

export default App;