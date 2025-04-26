import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import axios from "axios";

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [otpTarget, setOtpTarget] = useState(""); // 'edit' or 'password'
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const id = await AsyncStorage.getItem("id");
      const token = await AsyncStorage.getItem("userToken");
      const adhar = await AsyncStorage.getItem("adhar");

      const res = await fetch(`${API_URL}/api/auth/userProfile/${adhar}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  // const generateOtp = () => {
  //   const generated = Math.floor(100000 + Math.random() * 900000).toString();
  //   setServerOtp(generated);
  //   console.log("OTP:", generated); // In real scenario, send to user
  //   setOtp("");
  //   setOtpModalVisible(true);
  // };
  const generateOtp = async () => {
    const id = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("userToken");
    await axios.get(`$${API_URL}/api/enquiry/getOtp/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    setOtpModalVisible(true);
  };

  // const handleOtpSubmit = () => {
  //   if (otp === serverOtp) {
  //     setOtpModalVisible(false);
  //     if (otpTarget === "edit") {
  //       setEditModalVisible(true);
  //     } else {
  //       setPasswordModalVisible(true);
  //     }
  //   } else {
  //     Alert.alert("Invalid OTP");
  //     setPasswordModalVisible(false);
  //   }
  // };

  const handleOtpSubmit = async () => {
    const id = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("userToken");
    const result = await axios.post(
      `$${API_URL}/api/enquiry/checkOtp/${id}/${otp}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (result.status === 200) {
      setOtpModalVisible(false);
      if (otpTarget === "edit") {
        setEditModalVisible(true);
      } else {
        setPasswordModalVisible(true);
      }
    } else {
      Alert.alert("Invalid OTP");
      setPasswordModalVisible(false);
    }
  };

  const handlePasswordUpdate = async () => {
    const payload = {
      newPassword: newPassword,
    };

    try {
      const adhar = await AsyncStorage.getItem("adhar");
      const token = await AsyncStorage.getItem("userToken");
      console.log(adhar);
      const response = await fetch(
        `${API_URL}/api/auth/changePassword/${adhar}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Password Changed",
          "You have successfully changed your password"
        );
        setPasswordModalVisible(false);
      } else {
        console.error("Change password failed:", data);
        Alert.alert(
          "Error",
          data.message || "Failed to change password. Please try again."
        );
      }
    } catch (error) {
      console.error("Password change error:", error);
      Alert.alert("Error", "Failed to change password. Please try again.");
      setPasswordModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {profile && (
        <View style={styles.card}>
          <Text style={styles.label}>
            Name: {profile.pname_firstname} {profile.pname_lastname}
          </Text>
          <Text style={styles.label}>
            Aadhar: {profile.paddhar?.replace(/\d(?=\d{4})/g, "X")}
          </Text>

          <Text style={styles.label}>Mobile: {profile.pmobileno}</Text>
          <Text style={styles.label}>DOB: {profile.dob}</Text>
          <Text style={styles.label}>Gender: {profile.gender}</Text>
          <Text style={styles.label}>Pincode: {profile.pincode}</Text>
          <Text style={styles.label}>
            Location: {profile.sub_dist}, {profile.dist}, {profile.state}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setOtpTarget("password");
          generateOtp();
        }}
      >
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      {/* OTP Modal */}
      <Modal visible={otpModalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <TextInput
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleOtpSubmit}
            >
              <Text style={styles.modalButtonText}>Verify OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}

      {/* Change Password Modal */}
      <Modal visible={passwordModalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>New Password</Text>
            <TextInput
              placeholder="Enter New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handlePasswordUpdate}
            >
              <Text style={styles.modalButtonText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: "#0ba9bb",
    marginBottom: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#f0faff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#444",
  },
  button: {
    backgroundColor: "#0ba9bb",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#0ba9bb",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  modalButton: {
    backgroundColor: "#0ba9bb",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
