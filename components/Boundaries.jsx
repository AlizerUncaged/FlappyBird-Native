// ./components/Boundaries.jsx
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const Boundaries = ({ maxHeight }) => {
     const aspectRatioLimit = 16 / 9;
     const boundaryHeight = Math.max(0, (maxHeight - screenWidth * aspectRatioLimit) / 2);

     if (boundaryHeight <= 0) return null;

     return (
          <>
               {/* Ceiling */}
               <View
                    style={[
                         styles.boundary,
                         {
                              top: 0,
                              height: boundaryHeight,
                              transform: [{ rotate: '180deg' }],
                         },
                    ]}
               >
                    <Image
                         source={require('../assets/images/ground-1.png')}
                         style={styles.boundaryImage}
                         resizeMode="cover"
                    />
               </View>
               {/* Ground */}
               <View
                    style={[
                         styles.boundary,
                         {
                              bottom: 0,
                              height: boundaryHeight,
                         },
                    ]}
               >
                    <Image
                         source={require('../assets/images/ground-1.png')}
                         style={styles.boundaryImage}
                         resizeMode="cover"
                    />
               </View>
          </>
     );
};

const styles = StyleSheet.create({
     boundary: {
          position: 'absolute',
          width: '100%',
          overflow: 'hidden',
          zIndex: 1,
     },
     boundaryImage: {
          width: '100%',
          height: '100%',
     },
});

export default Boundaries;