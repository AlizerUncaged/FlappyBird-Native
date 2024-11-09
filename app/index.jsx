// ./app/index.jsx
import React, { useState, useEffect } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet, Dimensions, Pressable } from 'react-native';

import Bird from '../components/Bird';
import BackgroundVideo from '../components/BackgroundVideo';

import Obstacles from '../components/Obstacles';

const { height: screenHeight } = Dimensions.get('window');

const App = () => {
     const [birdY, setBirdY] = useState(200); // Initial Y position of the bird
     const [gravity, setGravity] = useState(0);

     // Apply gravity effect with ceiling limit
     useEffect(() => {
          const interval = setInterval(() => {
               setBirdY((y) => {
                    const newY = y + gravity;
                    return Math.max(0, Math.min(newY, screenHeight - 50)); // Limit bird's position
               });
               setGravity((g) => g + 1); // Gravity acceleration
          }, 20);

          return () => clearInterval(interval);
     }, [gravity]);

     // Function to make the bird jump
     const handleJump = () => {
          setGravity(-15); // Instant upward force
     };

     // Function to handle game over
     const onGameOver = () => {
          Alert.alert('GAME OVER');
          setBirdY(200); // Reset bird position
          setGravity(0); // Reset gravity
     };

     return (
          <TouchableWithoutFeedback onPress={handleJump}>
               <View style={styles.container}>
                    <BackgroundVideo />
                    <Bird birdY={birdY} />
                    <Obstacles birdY={birdY} onGameOver={onGameOver} />
               </View>
          </TouchableWithoutFeedback>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#70c5ce',
     },
});

export default App;