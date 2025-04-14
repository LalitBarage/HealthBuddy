import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export const NotificationScreen = () => {
  const [expandedId, setExpandedId] = useState(null);

  const notifications = [
    {
      id: '1',
      message:
        'Join our free medical camp this weekend for blood pressure and sugar checkup. All services are free.',
    },
    {
      id: '2',
      message:
        'Awareness campaign on women’s health this Sunday. Open to all with free consultation and talks by specialists.',
    },
    {
      id: '3',
      message:
        'COVID-19 booster dose drive now open for everyone above 18. Walk-in or book online. Limited slots!',
    },
  ];

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const renderItem = ({ item }) => {
    const isExpanded = item.id === expandedId;
    return (
      <TouchableOpacity style={styles.card} onPress={() => toggleExpand(item.id)}>
        <Text style={styles.message}>
          {isExpanded
            ? item.message
            : item.message.length > 70
            ? item.message.substring(0, 70) + '...'
            : item.message}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
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
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  message: {
    fontSize: 15,
    color: '#333',
  },
});
