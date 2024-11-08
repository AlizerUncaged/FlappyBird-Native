// ./components/Background.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Image, Animated, StyleSheet, Dimensions, Easing } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BACKGROUND_IMAGE_PATH = require('../assets/images/background.png');


const Background = () => {
     const [backgroundWidth, setBackgroundWidth] = useState(screenWidth); // Default width to screen width
     const translateX = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          // Preload the background image to get its actual width and height
          Image.getSize(BACKGROUND_IMAGE_PATH, (width, height) => {
               // Calculate the required width to display the full image without cutoff
               const requiredWidth = (screenHeight / height) * width;
               setBackgroundWidth(Math.max(screenWidth, width)); // Ensure it’s at least screen width
          });
     }, []);

     // Looping background animation with linear motion
     useEffect(() => {
          const loopBackground = () => {
               translateX.setValue(0);
               Animated.timing(translateX, {
                    toValue: -backgroundWidth, // Move based on actual background width
                    duration: 3000, // Adjust speed as needed
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
                    style={[styles.backgroundImage, { width: backgroundWidth, height: screenHeight, left: backgroundWidth }]}
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
          width: '100%',
          height: '100%',
          flexDirection: 'row',
     },
     backgroundImage: {
          position: 'absolute',
     },
});

export default Background;
