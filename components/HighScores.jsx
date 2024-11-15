import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const HighScores = ({ scores }) => {
     return (
          <View style={styles.container}>
               <Text style={styles.title}>TOP PLAYERS</Text>
               {scores.slice(0, 7).map((score, index) => (
                    <View key={index} style={styles.scoreRow}>
                         <Text style={[styles.rank, index < 3 && styles.topThree]}>
                              #{index + 1}
                         </Text>
                         <Text style={styles.name}>{score.name}</Text>
                         <Text style={styles.score}>{score.score}</Text>
                    </View>
               ))}
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 20,
          borderRadius: 15,
          alignItems: 'center',
          minWidth: 300,
          marginBottom: 25
     },
     title: {
          color: '#FFD700',
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 15,
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
     },
     scoreRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 5,
          width: '100%',
     },
     rank: {
          color: 'white',
          width: 40,
          fontSize: 16,
          fontWeight: 'bold',
     },
     topThree: {
          color: '#FFD700',
     },
     name: {
          color: 'white',
          flex: 1,
          fontSize: 16,
          marginLeft: 10,
     },
     score: {
          color: '#FFD700',
          fontSize: 16,
          fontWeight: 'bold',
          minWidth: 80,
          textAlign: 'right',
     },
});