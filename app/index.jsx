// ./app/index.jsx
import React, { useState, useEffect } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import Background from '../components/Background';
import Bird from '../components/Bird';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const App = () => {
     const [birdY, setBirdY] = useState(200); // Initial Y position of the bird
     const [gravity, setGravity] = useState(0);

     // Apply gravity effect
     useEffect(() => {
          const interval = setInterval(() => {
               setBirdY((y) => Math.min(y + gravity, screenHeight)); // Stop at ground level (example)
               setGravity((g) => g + 1); // Gravity acceleration
          }, 20);

          return () => clearInterval(interval);
     }, [gravity]);

     // Function to make the bird jump
     const handleJump = () => {
          setGravity(-15); // Instant upward force
     };

     return (
          <TouchableWithoutFeedback onPress={handleJump}>
               <View style={styles.container}>
                    <Background />
                    <Bird birdY={birdY} />
               </View>
          </TouchableWithoutFeedback>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#70c5ce', // Example sky-blue background color
     },
});

export default App;
