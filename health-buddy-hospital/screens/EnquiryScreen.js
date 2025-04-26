import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  Provider as PaperProvider,
  DefaultTheme,
  Dialog,
  Portal,
  Menu,
  ActivityIndicator,
  DataTable,
} from "react-native-paper";

import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0ba9bb",
    background: "#f9fafd",
    surface: "#ffffff",
    text: "#000000",
    placeholder: "#aaa",
  },
};

export const EnquiryScreen = () => {
  const [enquiry, setEnquiry] = useState({
    pid: "",
    hid: "",
    diseases: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [errors, setErrors] = useState({});
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Add this state at the top
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [deletePendingId, setDeletePendingId] = useState(null);

  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState(null);

  const genderOptions = ["Male", "Female", "Other"];

  const [currentPid, setCurrentPid] = useState(null);

  const validateAadhar = (value) => /^\d{12}$/.test(value);

  useEffect(() => {
    const fetchId = async () => {
      const id = await AsyncStorage.getItem("id");
      setEnquiry((prev) => ({ ...prev, hid: id }));
    };
    fetchId();
  }, []);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const id = await AsyncStorage.getItem("id");
        // Check if the ID is being fetched correctly
        const token = await AsyncStorage.getItem("userToken");
        console.log(API_URL);
        const response = await fetch(
          `${API_URL}/api/enquiry/getAllEnquiries/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        // Log the fetched data for debugging

        const formatted = data.map((item) => ({
          id: item.eid.toString(),
          pid: item.pid,
          hid: item.hid,
          diseases: item.diseases,
          pincode: item.pincode,
          sub_dist: item.sub_dist,
          dist: item.dist,
          state: item.state,
          createdAt: item.createdAt,
        }));

        setEnquiries(formatted.reverse());
      } catch (error) {
        console.error("Error fetching enquiries:", error);
        Alert.alert("Error", "Failed to load enquiries");
      }
    };

    fetchEnquiries();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const openEditModal = (item) => {
    console.log("Edit enquiry:", enquiry);

    setEnquiry(item); // `item` should contain pid, hid, etc.
    setEditModalVisible(true);
  };

  const handleChange = (field, value) => {
    setEnquiry((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    console.log("clicked");
    setLoading(true);
    const id = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("userToken");

    const newEntry = {
      pid: enquiry.pid,
      hid: id,
      diseases: enquiry.diseases,
      pincode: enquiry.pincode,
      createdAt: new Date().toISOString(),
    };

    console.log("New Entry:", newEntry);
    try {
      const response = await fetch(`${API_URL}/api/enquiry/addEnquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });
      console.log("Response:", response);

      if (!response.ok) {
        throw new Error("Failed to submit enquiry.");
      }

      const data = await response.json();
      setEnquiries([newEntry, ...enquiries]); // you can still use timestamp locally if needed
      Alert.alert("Submitted", "Enquiry submitted successfully.");
      setEnquiry({
        pid: "",
        diseases: "",
        pincode: "",
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (entries) => {
    const now = new Date();
    let filtered = entries;

    if (filter === "10days") {
      filtered = filtered.filter(
        (e) => now - new Date(e.createdAt) <= 10 * 86400000
      );
    } else if (filter === "3months") {
      filtered = filtered.filter(
        (e) => now - new Date(e.createdAt) <= 90 * 86400000
      );
    }

    if (search) {
      filtered = filtered.filter((e) =>
        e.pid.toString().toLowerCase().includes(search.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredEnquiries = applyFilter(enquiries);

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // const handleEdit = async (enquiry) => {
  //   setSelectedEnquiry(enquiry);
  //   await axios.get(`$${API_URL}/getOtp/${enquiry.pid}`);
  //   // const otp = Math.floor(100000 + Math.random() * 900000).toString();
  //   // setGeneratedOtp(otp);
  //   // console.log("Generated OTP:", otp);
  //   setOtpModalVisible(true);
  // };

  const handleEdit = async (enquiry) => {
    setSelectedEnquiry(enquiry);
    console.log(API_URL);
    setCurrentPid(enquiry.pid);
    console.log("Enquiry ID:", enquiry.pid);
    const token = await AsyncStorage.getItem("userToken");
    try {
      await axios.get(`${API_URL}/api/enquiry/getOtp/${enquiry.pid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("OTP fetch failed:", error);
    }
    setOtpModalVisible(true);
  };

  const handleOtpSubmit = async () => {
    console.log("Entered OTP:", enteredOtp);

    console.log("Enquiry ID:", currentPid);
    try {
      const result = await axios.post(
        `${API_URL}/api/enquiry/checkOtp/${currentPid}/${enteredOtp}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
          },
        }
      );
      console.log("OTP verification status:", result.status);

      if (result.status === 200) {
        setOtpModalVisible(false);
        setEnteredOtp("");

        // DELETE flow
        if (deletePendingId) {
          try {
            const response = await fetch(
              `${API_URL}/api/enquiry/deleteEnquiry/${deletePendingId}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${await AsyncStorage.getItem(
                    "userToken"
                  )}`,
                },
              }
            );

            if (!response.ok) throw new Error("Failed to delete enquiry.");

            setEnquiries((prev) =>
              prev.filter((e) => e.id !== deletePendingId)
            );
            Alert.alert("Deleted", "Enquiry deleted successfully.");
          } catch (err) {
            Alert.alert("Error", err.message);
          } finally {
            setDeletePendingId(null);
          }
          return;
        }

        // EDIT flow
        if (selectedEnquiry) {
          setEnquiry({
            pid: selectedEnquiry.pid?.toString() || "",
            hid: selectedEnquiry.hid?.toString() || "",
            diseases: selectedEnquiry.diseases || "",
            pincode: selectedEnquiry.pincode || "",
          });

          setTimeout(() => setEditModalVisible(true), 100);
        }
      } else {
        Alert.alert("Invalid OTP");
        setEnteredOtp("");
      }
    } catch (error) {
      console.error(
        "OTP verification error:",
        error?.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error?.response?.data?.message || "OTP check failed"
      );
      setEnteredOtp("");
    }
  };

  const handleDelete = async (enquiry) => {
    setSelectedEnquiry(enquiry);

    console.log(API_URL);
    setCurrentPid(enquiry.pid);

    console.log("Enquiry ID:", enquiry.pid);
    const token = await AsyncStorage.getItem("userToken");
    console.log("Token:", token);
    try {
      await axios.get(`${API_URL}/api/enquiry/getOtp/${enquiry.pid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("OTP fetch failed:", error);
    }
    setOtpModalVisible(true);
    setDeletePendingId(enquiry.id); // store id
  };

  const handleEditSubmit = async () => {
    try {
      const updatedEnquiry = {
        pid: enquiry.pid,
        hid: enquiry.hid,
        diseases: enquiry.diseases,
        pincode: enquiry.pincode,
      };
      console.log(selectedEnquiry);

      const response = await fetch(
        `${API_URL}/api/enquiry/updateEnquiry/${selectedEnquiry.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
          },
          body: JSON.stringify(updatedEnquiry),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update enquiry.");
      }

      // Update local state
      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === selectedEnquiry.id ? { ...e, ...updatedEnquiry } : e
        )
      );

      Alert.alert("Success", "Enquiry updated successfully.");
      setEnquiry({
        pid: "",
        hid: "",
        diseases: "",
        pincode: "",
      });
      setSelectedEnquiry(null);

      setEditModalVisible(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          label="Patient ID"
          mode="outlined"
          value={enquiry.pid}
          onChangeText={(val) => handleChange("pid", val)}
          style={styles.input}
        />
        <TextInput
          label="Hospital ID"
          mode="outlined"
          keyboardType="phone-pad"
          value={enquiry.hid}
          editable={false}
          onChangeText={(val) => handleChange("hid", val)}
          style={styles.input}
        />

        <TextInput
          label="Disease"
          mode="outlined"
          multiline
          value={enquiry.diseases}
          onChangeText={(val) => handleChange("diseases", val)}
          style={styles.input}
        />
        <TextInput
          label="Pincode"
          mode="outlined"
          keyboardType="phone-pad"
          value={enquiry.pincode}
          onChangeText={(val) => handleChange("pincode", val)}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          // optionally disable the button while loading
        >
          {loading ? (
            <ActivityIndicator animating={true} color="white" size="small" />
          ) : (
            "Submit"
          )}
        </Button>

        <View style={styles.filterWrapper}>
          <Text style={styles.subtitle}>Previous Enquiries</Text>

          <Menu
            visible={filterMenuVisible}
            onDismiss={() => setFilterMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={(event) => {
                  setFilterAnchor(event.nativeEvent.target);
                  setFilterMenuVisible(true);
                }}
                style={styles.dropdownButton}
              >
                {filter === "all"
                  ? "All"
                  : filter === "10days"
                  ? "Last 10 Days"
                  : "Last 3 Months"}
              </Button>
            }
            contentStyle={{
              backgroundColor: "white",
              borderRadius: 8,
              paddingVertical: 4,
            }}
          >
            <Menu.Item
              onPress={() => {
                setFilter("all");
                setFilterMenuVisible(false);
              }}
              title="All"
              titleStyle={{ color: "black" }}
            />
            <Menu.Item
              onPress={() => {
                setFilter("10days");
                setFilterMenuVisible(false);
              }}
              title="Last 10 Days"
              titleStyle={{ color: "black" }}
            />
            <Menu.Item
              onPress={() => {
                setFilter("3months");
                setFilterMenuVisible(false);
              }}
              title="Last 3 Months"
              titleStyle={{ color: "black" }}
            />
          </Menu>
        </View>

        <TextInput
          placeholder="Search by Patient ID"
          value={search}
          onChangeText={setSearch}
          mode="outlined"
          style={styles.input}
        />

        <ScrollView horizontal>
          <View style={styles.tableWrapper}>
            <DataTable style={styles.table}>
              <DataTable.Header style={styles.header}>
                <DataTable.Title style={styles.colSmall}>EID</DataTable.Title>
                <DataTable.Title style={styles.colSmall}>PID</DataTable.Title>
                <DataTable.Title style={styles.colLarge}>
                  Disease
                </DataTable.Title>
                <DataTable.Title style={styles.colPin}>Pincode</DataTable.Title>
                <DataTable.Title style={styles.colMedium}>
                  Sub-Dist
                </DataTable.Title>
                <DataTable.Title style={styles.colMedium}>
                  District
                </DataTable.Title>
                <DataTable.Title style={styles.colMedium}>
                  State
                </DataTable.Title>
                <DataTable.Title style={styles.colMedium}>Date</DataTable.Title>
                <DataTable.Title style={styles.colActions}>
                  Actions
                </DataTable.Title>
              </DataTable.Header>

              {paginatedEnquiries.map((item) => (
                <DataTable.Row key={item.id} style={styles.row}>
                  <DataTable.Cell style={styles.colSmall}>
                    {item.id}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.colSmall}>
                    {item.pid}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.colLarge}>
                    {item.diseases}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.colPin}>
                    {item.pincode}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.colMedium}>
                    {item.sub_dist}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.colMedium}>
                    {item.dist}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.colMedium}>
                    {item.state}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.colMedium}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.colActions}>
                    <Button
                      onPress={() => handleEdit(item)}
                      compact
                      mode="text"
                      icon="pencil"
                      textColor="#007aff"
                    />
                    <Button
                      onPress={() => handleDelete(item)}
                      compact
                      mode="text"
                      icon="delete"
                      textColor="red"
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </View>
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 2,
          }}
        >
          <Button
            mode="outlined"
            disabled={currentPage === 1}
            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
            Page {currentPage}
          </Text>
          <Button
            mode="outlined"
            disabled={
              currentPage * itemsPerPage >= applyFilter(enquiries).length
            }
            onPress={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </View>

        <Portal>
          <Dialog
            visible={otpModalVisible}
            onDismiss={() => setOtpModalVisible(false)}
            style={{
              backgroundColor: "white",
              padding: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ccc",
              marginBottom: 16,
            }}
          >
            <Dialog.Title>OTP Verification</Dialog.Title>
            <Dialog.Content>
              <TextInput
                placeholder="Enter OTP"
                value={enteredOtp}
                onChangeText={setEnteredOtp}
                keyboardType="numeric"
                maxLength={6}
                style={{ backgroundColor: "white" }}
              />
              <Button title="Submit OTP" onPress={handleOtpSubmit} />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setOtpModalVisible(false)}>Cancel</Button>
              <Button onPress={handleOtpSubmit}>Submit</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Modal
          visible={editModalVisible}
          transparent={false}
          animationType="slide"
        >
          <ScrollView style={styles.container}>
            <Text style={styles.title}>Edit Enquiry</Text>
            <TextInput
              label="Patient ID"
              mode="outlined"
              value={enquiry.pid}
              onChangeText={(val) => handleChange("pid", val)}
              style={styles.input}
            />

            <TextInput
              label="Hospital ID"
              mode="outlined"
              value={enquiry.hid}
              onChangeText={(val) => handleChange("hid", val)}
              style={styles.input}
            />

            <TextInput
              label="Disease"
              mode="outlined"
              multiline
              value={enquiry.diseases}
              onChangeText={(val) => handleChange("diseases", val)}
              style={styles.input}
            />

            <TextInput
              label="Pincode"
              mode="outlined"
              keyboardType="phone-pad"
              value={enquiry.pincode}
              onChangeText={(val) => handleChange("pincode", val)}
              style={styles.input}
            />

            <Button onPress={handleEditSubmit} style={styles.submitButton}>
              Save Changes
            </Button>
            <Button onPress={() => setEditModalVisible(false)}>Cancel</Button>
          </ScrollView>
        </Modal>
      </ScrollView>
    </PaperProvider>
  );
};

export const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f9fafd", flexGrow: 1 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: { fontSize: 20, fontWeight: "bold", marginVertical: 16 },
  input: { marginBottom: 12 },
  dropdown: { backgroundColor: "#fff", padding: 8, borderRadius: 4 },
  option: { paddingVertical: 8 },
  submitButton: { marginVertical: 16 },
  enquiryItem: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  enquiryActions: { flexDirection: "row", justifyContent: "space-between" },
  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  filterWrapper: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dropdownButton: {
    backgroundColor: "white",
  },
  tableWrapper: {
    marginHorizontal: 2,
    marginBottom: 20,
  },
  table: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    minWidth: 1000,
  },
  header: {
    backgroundColor: "#f9fafd",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  row: {
    backgroundColor: "#fff",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },

  // Use fixed widths for consistent alignment
  colXSmall: {
    width: 60,
  },
  colSmall: {
    width: 60,
  },
  colMedium: {
    width: 120,
  },
  colLarge: {
    width: 120,
  },
  colPin: {
    width: 80,
  },
  colActions: {
    width: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
