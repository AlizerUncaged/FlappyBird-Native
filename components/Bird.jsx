// ./components/Bird.jsx
import React from 'react';
import { Image, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const birdX = width / 4; // Fixed X position for the bird

const Bird = ({ birdY }) => {
     return (
          <Animated.Image
               source={require('../assets/images/bird.png')}
               style={[
                    styles.bird,
                    {
                         transform: [{ translateY: birdY }, { translateX: birdX }],
                    },
               ]}
          />
     );
};

const styles = StyleSheet.create({
     bird: {
          position: 'absolute',
          width: 50, // Assume uniform width for hitbox
          height: 50, // Assume uniform height for hitbox
     },
});

export default Bird;
