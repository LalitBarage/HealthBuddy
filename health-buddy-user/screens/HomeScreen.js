import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Fetching the banner data from the API
const fetchBanner = async () => {
  try {
    const location = await AsyncStorage.getItem("sub_dist");
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(
      `http://192.168.205.106:3000/api/alert/getBanner/${location}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.alerts && Array.isArray(data.alerts)) {
      return data.alerts.map((alert) => alert.image_url);
    } else {
      console.error("No alerts found or alerts is not an array");
      return [];
    }
  } catch (error) {
    console.error("Error fetching banner data:", error);
    return [];
  }
};

// Fetching health schemes from API
const fetchHealthSchemes = async () => {
  const location = await AsyncStorage.getItem("sub_dist");
  const token = await AsyncStorage.getItem("userToken");
  try {
    const response = await fetch(
      `http://192.168.205.106:3000/api/scheme/getSchemes/${location}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched health schemes:", data);
    return data || []; // Return schemes array or empty array if not available
  } catch (error) {
    console.error("Error fetching health schemes:", error);
    return [];
  }
};

export const HomeScreen = () => {
  const [banners, setBanners] = useState([]);
  const [healthSchemes, setHealthSchemes] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [loadingSchemes, setLoadingSchemes] = useState(true);

  // Fetch data when component mounts
  useEffect(() => {
    const getData = async () => {
      try {
        const bannerData = await fetchBanner();
        setBanners(bannerData);
        setLoadingBanners(false);

        const schemesData = await fetchHealthSchemes();
        setHealthSchemes(schemesData);
        setLoadingSchemes(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingBanners(false);
        setLoadingSchemes(false);
      }
    };

    getData();
  }, []);

  // Set up a banner rotation every 5 seconds
  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    // Cleanup the interval on component unmount
    return () => clearInterval(bannerInterval);
  }, [banners.length]);

  if (loadingBanners || loadingSchemes) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Display rotating banners */}
      {banners.length > 0 && (
        <Image
          source={{ uri: banners[currentBannerIndex] }} // Fetch image URL dynamically
          style={styles.banner}
          resizeMode="cover"
          defaultSource={require("../assets/banner.jpg")} // Placeholder image
        />
      )}

      {/* Attractive Title and Subtitle */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Health Schemes</Text>
      </View>

      <FlatList
        data={healthSchemes}
        keyExtractor={(item) => item.scid.toString()} // Use scid as the key
        renderItem={({ item }) => (
          <View style={styles.schemeItem}>
            <Text style={styles.schemeText}>{item.scname}</Text>
            <Text style={styles.schemeDescription}>{item.description}</Text>
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
    backgroundColor: "#fff",
  },
  banner: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 16,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#003366",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  schemeItem: {
    backgroundColor: "#e6f2ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  schemeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
  },
  schemeDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
