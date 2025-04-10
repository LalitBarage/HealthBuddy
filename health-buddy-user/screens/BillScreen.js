import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const BillScreen = () => {
  // Sample bill data — replace with real data or fetch from API
  const bills = [
    { id: '1', title: 'Consultation Bill - Jan', amount: '₹500' },
    { id: '2', title: 'X-Ray Services - Feb', amount: '₹1200' },
    { id: '3', title: 'Lab Test - Mar', amount: '₹800' },
  ];

  const handleView = (bill) => {
    // Add logic to view bill details or navigate to detail screen
    console.log('View bill:', bill);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.billTitle}>{item.title}</Text>
        <Text style={styles.billAmount}>{item.amount}</Text>
      </View>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => handleView(item)}
      >
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Bills</Text>
      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default BillScreen;

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
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  billAmount: {
    color: '#0ba9bb',
    fontWeight: '500',
  },
  viewButton: {
    backgroundColor: '#0ba9bb',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
