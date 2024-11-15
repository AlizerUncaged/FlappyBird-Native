// ImagePreloader.jsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const obstacleImages = [
     {
          source: require('../assets/images/obstacles/1.png'),
          default: require('../assets/images/obstacles/1.png')
     },
     {
          source: require('../assets/images/obstacles/2.png'),
          default: require('../assets/images/obstacles/2.png')
     },
     {
          source: require('../assets/images/obstacles/3.png'),
          default: require('../assets/images/obstacles/3.png')
     }
];

export const ImagePreloader = () => {
     return (
          <View style={styles.preloader}>
               {obstacleImages.map((image, index) => (
                    <Image
                         key={index}
                         source={image.source}
                         defaultSource={image.default}
                         style={styles.hiddenImage}
                         fadeDuration={0}
                    />
               ))}
          </View>
     );
};

const styles = StyleSheet.create({
     preloader: {
          position: 'absolute',
          opacity: 0,
          width: 1,
          height: 1,
          overflow: 'hidden',
     },
     hiddenImage: {
          width: 1,
          height: 1,
     },
});

// Modify Obstacles.jsx to use the shared obstacle images
export const sharedObstacleImages = obstacleImages;