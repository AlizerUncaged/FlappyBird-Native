import React from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';

const StatusBar = ({ lives, score, highScore, showHighScore, scoreScale }) => {
     return (
          <View style={styles.container}>
               <View style={styles.livesContainer}>
                    {[...Array(3)].map((_, index) => (
                         <Image
                              key={index}
                              source={require('../assets/images/fish/1.png')}
                              style={[
                                   styles.heartIcon,
                                   { opacity: index < lives ? 1 : 0.3 }
                              ]}
                              resizeMode='contain'
                         />
                    ))}
               </View>
               <View style={styles.scoreContainer}>
                    <Animated.Text
                         style={[
                              styles.scoreText,
                              { transform: [{ scale: scoreScale }] }
                         ]}
                    >
                         Score: {score}
                    </Animated.Text>
                    {showHighScore && (
                         <Text style={styles.highScoreText}>High Score: {highScore}</Text>
                    )}
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          zIndex: 2,
     },
     livesContainer: {
          flexDirection: 'row',
          gap: 5,
     },
     heartIcon: {
          width: 30,
          height: 30,
     },
     scoreContainer: {
          alignItems: 'flex-end',
     },
     scoreText: {
          fontSize: 24,
          fontWeight: 'bold',
          color: 'white',
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
     },
     highScoreText: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#FFD700',
          marginTop: 5,
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
     },
});

export default StatusBar;