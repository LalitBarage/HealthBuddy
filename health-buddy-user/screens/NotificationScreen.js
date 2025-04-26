import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Make sure this is imported

export const NotificationScreen = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const location = await AsyncStorage.getItem("sub_dist");
        console.log("Location:", location);
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch(
          `http://192.168.205.106:3000/api/alert/getAlertNotification/${location}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setNotifications(data.alerts);
          console.log("Notifications:", data.alerts);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString(); // You can format it better if needed
  };

  const renderItem = ({ item }) => {
    const isExpanded = item.id === expandedId;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => toggleExpand(item.id)}
      >
        <Text style={styles.message}>
          {item.message.length > 70 && !isExpanded
            ? item.message.substring(0, 70) + "..."
            : item.message}
        </Text>
        {isExpanded && (
          <>
            <Text style={styles.detail}>Severity: {item.severity}</Text>
            <Text style={styles.detail}>Location: {item.location}</Text>
            <Text style={styles.detail}>
              Created At: {formatDate(item.created_at)}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alerts</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0faff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: "#0ba9bb",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
});
