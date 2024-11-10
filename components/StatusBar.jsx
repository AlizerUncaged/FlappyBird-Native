// ./components/StatusBar.jsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const StatusBar = ({ lives, score }) => {
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
               <Text style={styles.scoreText}>Score: {score}</Text>
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
     scoreText: {
          fontSize: 24,
          fontWeight: 'bold',
          color: 'white',
 
     },
});

export default StatusBar;