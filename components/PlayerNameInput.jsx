import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

export const PlayerNameInput = ({ playerName, onNameChange }) => {
     const handlePress = (e) => {
          if (e) {
               e.preventDefault();
               e.stopPropagation();
          }
     };

     return (
          <TouchableWithoutFeedback onPress={handlePress}>
               <View style={styles.container}>
                    <Text style={styles.label}>ENTER YOUR NAME:</Text>
                    <TextInput
                         style={styles.input}
                         value={playerName}
                         onChangeText={onNameChange}
                         maxLength={15}
                         placeholder="Player Name"
                         placeholderTextColor="rgba(255, 255, 255, 0.5)"
                         onTouchStart={handlePress}
                    />
               </View>
          </TouchableWithoutFeedback>
     );
};

const styles = StyleSheet.create({
     container: {
          alignItems: 'center',
          marginVertical: 10,
     },
     label: {
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 5,
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
     },
     input: {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 8,
          padding: 10,
          width: 200,
          color: 'white',
          textAlign: 'center',
          fontSize: 18,
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.3)',
     },
});