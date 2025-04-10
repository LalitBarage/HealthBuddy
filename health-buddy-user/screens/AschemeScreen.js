import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export const AschemeScreen = () => {
  // Sample applied scheme data (you can replace with actual fetched data)
  const appliedSchemes = [
    { id: '1', name: 'Health Plus Scheme' },
    { id: '2', name: 'Senior Citizen Benefit' },
    { id: '3', name: 'Emergency Aid Program' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Applied Schemes</Text>
      <FlatList
        data={appliedSchemes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7fb', // light blue background
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#0ba9bb',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardText: {
    fontSize: 16,
    color: '#0ba9bb',
    fontWeight: '600',
  },
});
