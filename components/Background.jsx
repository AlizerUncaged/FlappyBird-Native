// ./components/Background.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Image, Animated, StyleSheet, Dimensions, Easing } from 'react-native';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BACKGROUND_IMAGE_PATH = require('../assets/images/background.png');
const ASPECT_RATIO = 1920 / 1080;
const Background = () => {
     const backgroundWidth = screenHeight * ASPECT_RATIO; // Calculate the required width to display the full image without cutoff
     const translateX = useRef(new Animated.Value(0)).current;

     // Looping background animation with linear motion
     useEffect(() => {
          const loopBackground = () => {
               translateX.setValue(0);
               Animated.timing(translateX, {
                    toValue: -backgroundWidth, // Move based on calculated background width
                    duration: 17000, // Adjust speed as needed
                    useNativeDriver: true,
                    easing: Easing.linear, // Linear motion
               }).start(loopBackground);
          };
          loopBackground();
     }, [translateX, backgroundWidth]);
     return (
          <Animated.View style={[styles.container, { transform: [{ translateX }] }]}>
               <Image
                    source={BACKGROUND_IMAGE_PATH}
                    style={[styles.backgroundImage, { width: backgroundWidth, height: screenHeight }]}
                    resizeMode="cover"
               />
               <Image
                    source={BACKGROUND_IMAGE_PATH}
                    style={[styles.backgroundImage, { width: backgroundWidth, height: screenHeight }]}
                    resizeMode="cover"
               />
          </Animated.View>
     );
};

const styles = StyleSheet.create({
     container: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%', // Total width to fit two background images side by side
          height: '100%',
          flexDirection: 'row',
     },
     backgroundImage: {
          height: '100%',
     },
});

export default Background;
