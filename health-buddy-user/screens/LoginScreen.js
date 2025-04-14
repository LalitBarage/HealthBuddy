import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
// import { API_URL } from "@env";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LoginScreen = ({ onLoginSuccess }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [paddhar, setPaddhar] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    const payload = {
      paddhar,
      password,
    };
    console.log("Login button pressed");
    try {
      console.log("Payload:", payload);
      // console.log(API_URL);
      const response = await fetch(
        "http://192.168.184.106:3000/api/auth/loginUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      console.log(response);

      const data = await response.json();

      if (response.ok || data.token) {
        Alert.alert("Login Success", "You have successfully logged in!");
        onLoginSuccess(data.token);
        console.log(data.token);
        await AsyncStorage.setItem("id", String(data.user?.pid));
        await AsyncStorage.setItem("adhar", String(data.user?.paddhar));
        console.log("User ID:", data.user?.pid);
        console.log("User Adhar:", data.user?.paddhar);
        navigation.navigate("Main");
      } else {
        Alert.alert("Login Failed", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Failed to login. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome To HealthBuddy</Text>

      <TextInput
        label="Adhar No"
        mode="outlined"
        value={paddhar}
        onChangeText={setPaddhar}
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!passwordVisible}
        style={styles.input}
        right={
          <TextInput.Icon
            icon={passwordVisible ? "eye-off" : "eye"}
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        }
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerLink}> Register here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  loginButton: {
    backgroundColor: "#0ba9bb",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  registerLink: {
    color: "#0ba9bb",
  },
});
