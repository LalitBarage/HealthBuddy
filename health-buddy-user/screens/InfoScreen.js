import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export const InfoScreen = () => {
  const medicalHistory = [
    {
      id: '1',
      condition: 'Hypertension',
      date: '2023-12-15',
      notes: 'Prescribed medication and advised lifestyle changes',
    },
    {
      id: '2',
      condition: 'Diabetes',
      date: '2024-02-10',
      notes: 'Routine check-up, blood sugar level elevated',
    },
    {
      id: '3',
      condition: 'Fractured Arm',
      date: '2024-06-01',
      notes: 'X-ray taken, arm in cast, follow-up in 3 weeks',
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.condition}>{item.condition}</Text>
      <Text style={styles.date}>Date: {item.date}</Text>
      <Text style={styles.notes}>{item.notes}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medical History</Text>
      <FlatList
        data={medicalHistory}
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
    backgroundColor: '#f0faff',
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  condition: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: '#666',
  },
});
