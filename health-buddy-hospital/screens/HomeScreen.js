import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import banner from "../assets/banner.jpg"

const healthSchemes = [
  { id: '1', name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana' },
  { id: '2', name: 'Central Government Health Scheme (CGHS)' },
  { id: '3', name: 'National Health Mission (NHM)' },
  { id: '4', name: 'Rashtriya Swasthya Bima Yojana (RSBY)' },
  { id: '5', name: 'EHS - Employee Health Scheme' },
];

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={banner}
        style={styles.banner}
        resizeMode="cover"
      />
      <Text style={styles.title}>Health Schemes</Text>
      <FlatList
        data={healthSchemes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.schemeItem}>
            <Text style={styles.schemeText}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  banner: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  schemeItem: {
    backgroundColor: '#e6f2ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  schemeText: {
    fontSize: 16,
    color: '#003366',
  },
});
