import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  Provider,
  Dialog,
  DataTable,
  Portal,
  Menu,
  ActivityIndicator,
} from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, UPLOAD_PRESET } from "@env";

const healthSchemes = [
  { id: "1", name: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana" },
  { id: "2", name: "Central Government Health Scheme (CGHS)" },
  { id: "3", name: "National Health Mission (NHM)" },
  { id: "4", name: "Rashtriya Swasthya Bima Yojana (RSBY)" },
  { id: "5", name: "EHS - Employee Health Scheme" },
];

export const SchemeScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;
  const [schemeMenuVisible, setSchemeMenuVisible] = useState(false);
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState();
  const [scid, setScid] = useState("");
  const [pid, setPid] = useState("");
  const [hid, setHid] = useState("");
  const [pincode, setPincode] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [appliedSchemes, setAppliedSchemes] = useState([]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deletePendingId, setDeletePendingId] = useState(null);

  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState(null);

  const [documentUrls, setDocumentUrls] = useState({
    income: "",
    caste: "",
    electricity: "",
    bank: "",
  });

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/du2pijo5y/raw/upload";

  const uploadToCloudinary = async (label) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = {
        uri: result.assets[0].uri,
        type: "application/pdf",
        name: result.assets[0].name || "document.pdf",
      };

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      console.log(CLOUDINARY_URL);

      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        setDocumentUrls((prev) => ({ ...prev, [label]: data.secure_url }));
        Alert.alert(`${label} Uploaded`, "Upload successful!");
      } else {
        Alert.alert("Upload failed", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error", "Upload failed");
    }
  };

  useEffect(() => {
    (async () => {
      const storedHid = await AsyncStorage.getItem("id");
      if (storedHid) setHid(storedHid);
    })();
  }, []);

  useEffect(() => {
    const fetchAppliedSchemes = async () => {
      try {
        const id = await AsyncStorage.getItem("id");
        const token = await AsyncStorage.getItem("userToken");

        const response = await fetch(
          `http://192.168.123.106:3000/api/scheme/getAppliedSchemeByHid/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        const formatted = data.map((item) => ({
          scid: item.scid,
          pid: item.pid,
          hid: item.hid,
          income_cert_url: item.income_cert_url,
          caste_cert_url: item.caste_cert_url,
          ele_bill_url: item.ele_bill_url,
          bank_passbook_url: item.bank_passbook_url,
          pincode: item.pincode,
          sub_dist: item.sub_dist,
          dist: item.dist,
          state: item.state,
          status: item.status,
          createdAt: item.createdAt,
        }));

        if (response.ok) {
          setAppliedSchemes(data.reverse());
        } else {
          console.error("Error fetching applied schemes:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchAppliedSchemes();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const handleSubmit = async () => {
    if (
      !scid ||
      !pid ||
      !hid ||
      !pincode ||
      Object.values(documentUrls).some((url) => !url)
    ) {
      Alert.alert(
        "Validation Error",
        "Please fill all fields and upload documents."
      );
      return;
    }

    const payload = {
      scid,
      pid,
      hid,
      pincode,
      income_cert_url: documentUrls.income,
      caste_cert_url: documentUrls.caste,
      ele_bill_url: documentUrls.electricity,
      bank_passbook_url: documentUrls.bank,
    };

    try {
      const res = await fetch(
        `http://192.168.123.106:3000/api/scheme/applyScheme`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      console.log(res.status);

      if (res.ok) {
        Alert.alert("Success", "Scheme applied successfully!");
        setSelectedScheme("");
        setScid("");
        setPid("");
        setPincode("");
        setDocumentUrls({
          income: "",
          caste: "",
          electricity: "",
          bank: "",
        });
      } else {
        Alert.alert("Error", data.message || "Failed to apply scheme.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Network or server issue.");
    }
  };

  const handleEdit = (item) => {
    setSelectedSchemeId(item);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    console.log("Generated OTP:", otp);
    setOtpModalVisible(true);
  };

  const handleDelete = (id) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setDeletePendingId(id);
    console.log("Generated OTP for delete:", otp);
    setOtpModalVisible(true);
  };

  const handleOtpSubmit = async () => {
    if (enteredOtp === generatedOtp) {
      setOtpModalVisible(false);
      setEnteredOtp("");

      if (deletePendingId) {
        try {
          const response = await fetch(
            `http://192.168.123.106:3000/api/scheme/deleteAppliedScheme/${deletePendingId}`,
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

          if (response.ok) {
            Alert.alert("Success", "Scheme deleted successfully!");
            setDeletePendingId(null);
          } else {
            Alert.alert("Error", "Failed to delete scheme.");
          }
        } catch (error) {
          console.error("Error deleting scheme:", error);
          Alert.alert("Error", "Network or server issue.");
        }
      }

      if (selectedSchemeId) {
        setDocumentUrls({
          income: selectedSchemeId.income_cert_url,
          caste: selectedSchemeId.caste_cert_url,
          electricity: selectedSchemeId.ele_bill_url,
          bank: selectedSchemeId.bank_passbook_url,
        });
        setTimeout(() => setEditModalVisible(true), 100);
      }
    } else {
      Alert.alert("Invalid OTP");
      setEnteredOtp("");
    }
  };

  const handleEditSubmit = async () => {
    try {
      const updateScheme = {
        income_cert_url: documentUrls.income,
        caste_cert_url: documentUrls.caste,
        ele_bill_url: documentUrls.electricity,
        bank_passbook_url: documentUrls.bank,
      };
      console.log(updateScheme);
      const response = await fetch(
        `http://192.168.123.106:3000/api/scheme/updateAppliedScheme/${selectedSchemeId.apscid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
          },
          body: JSON.stringify(updateScheme),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Scheme updated successfully!");
        setEditModalVisible(false);
        setDocumentUrls({
          income: "",
          caste: "",
          electricity: "",
          bank: "",
        });
      } else {
        Alert.alert("Error", data.message || "Failed to update scheme.");
      }
    } catch (error) {
      console.error("Error updating scheme:", error);
      Alert.alert("Error", "Network or server issue.");
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

  const filteredSchemes = applyFilter(appliedSchemes);
  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);
  const paginatedSchemes = filteredSchemes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            onPress={() => setSchemeMenuVisible(!schemeMenuVisible)}
          >
            <TextInput
              label="Scheme Name"
              mode="outlined"
              value={selectedScheme}
              editable={false}
              right={<TextInput.Icon icon="chevron-down" />}
              style={styles.input}
            />
          </TouchableOpacity>

          {schemeMenuVisible && (
            <View style={styles.dropdownList}>
              {healthSchemes.map((scheme) => (
                <TouchableOpacity
                  key={scheme.id}
                  onPress={() => {
                    setSelectedScheme(scheme.name);
                    setScid(scheme.id);
                    setSchemeMenuVisible(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text>{scheme.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TextInput
          label="Patient ID"
          mode="outlined"
          value={pid}
          onChangeText={setPid}
          style={styles.input}
        />

        <TextInput
          label="Hospital ID"
          mode="outlined"
          value={hid}
          editable={false}
          style={styles.input}
        />

        <TextInput
          label="Pincode"
          mode="outlined"
          value={pincode}
          onChangeText={setPincode}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.fileButton}
          onPress={() => uploadToCloudinary("income")}
        >
          <Text style={styles.fileButtonText}>
            {documentUrls.income
              ? "✅ Income Certificate"
              : "📄 Income Certificate"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fileButton}
          onPress={() => uploadToCloudinary("caste")}
        >
          <Text style={styles.fileButtonText}>
            {documentUrls.caste
              ? "✅ Caste Certificate"
              : "📄 Caste Certificate"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fileButton}
          onPress={() => uploadToCloudinary("electricity")}
        >
          <Text style={styles.fileButtonText}>
            {documentUrls.electricity
              ? "✅ Electricity Bill"
              : "📄 Electricity Bill"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fileButton}
          onPress={() => uploadToCloudinary("bank")}
        >
          <Text style={styles.fileButtonText}>
            {documentUrls.bank ? "✅ Bank Passbook" : "📄 Bank Passbook"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Application</Text>
        </TouchableOpacity>

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
                <DataTable.Title style={styles.colSmall}>SCID</DataTable.Title>
                <DataTable.Title style={styles.colSmall}>PID</DataTable.Title>
                <DataTable.Title style={styles.colPin}>Pincode</DataTable.Title>
                <DataTable.Title style={styles.colMedium}>
                  Sub District
                </DataTable.Title>
                <DataTable.Title style={styles.colMedium}>
                  District
                </DataTable.Title>
                <DataTable.Title style={styles.colMedium}>
                  State
                </DataTable.Title>
                <DataTable.Title style={styles.colMedium}>
                  Income
                </DataTable.Title>
                <DataTable.Title style={styles.colMedium}>
                  Caste
                </DataTable.Title>
                <DataTable.Title style={styles.colMedium}>
                  Electricity
                </DataTable.Title>
                <DataTable.Title style={styles.colMedium}>Bank</DataTable.Title>
                <DataTable.Title style={styles.colMedium}>
                  Status
                </DataTable.Title>
                <DataTable.Title style={styles.colActions}>
                  Actions
                </DataTable.Title>
              </DataTable.Header>

              {paginatedSchemes.map((item) => (
                <DataTable.Row key={item.id} style={styles.row}>
                  <DataTable.Cell style={styles.colSmall}>
                    {item.scid}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.colSmall}>
                    {item.pid}
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
                    {item.income_cert_url ? "✅" : "❌"}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.colMedium}>
                    {item.caste_cert_url ? "✅" : "❌"}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.colMedium}>
                    {item.ele_bill_url ? "✅" : "❌"}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.colMedium}>
                    {item.bank_passbook_url ? "✅" : "❌"}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.colMedium}>
                    {item.status === "false"
                      ? "Pending"
                      : item.status === "true"
                      ? "Approved"
                      : "Rejected"}
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
                      onPress={() => handleDelete(item.apscid)}
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
              currentPage * itemsPerPage >= applyFilter(appliedSchemes).length
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
                mode="outlined"
                style={[
                  styles.input,
                  { backgroundColor: "white", outlineColor: "#0ba9bb" },
                ]}
              />

              <Button title="Submit OTP" onPress={handleOtpSubmit} />
            </Dialog.Content>
            <Dialog.Actions>
              <TouchableOpacity onPress={() => setOtpModalVisible(false)}>
                <Text style={styles.blueText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOtpSubmit}>
                <Text style={styles.blueText}>Submit</Text>
              </TouchableOpacity>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Modal
          visible={editModalVisible}
          transparent={false}
          animationType="slide"
        >
          <ScrollView style={styles.container}>
            <Text style={styles.title}>Edit Scheme</Text>

            <TouchableOpacity
              style={styles.fileButton}
              onPress={() => uploadToCloudinary("income")}
            >
              <Text style={styles.fileButtonText}>
                {documentUrls.income
                  ? "✅ Income Certificate"
                  : "📄 Income Certificate"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fileButton}
              onPress={() => uploadToCloudinary("caste")}
            >
              <Text style={styles.fileButtonText}>
                {documentUrls.caste
                  ? "✅ Caste Certificate"
                  : "📄 Caste Certificate"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fileButton}
              onPress={() => uploadToCloudinary("electricity")}
            >
              <Text style={styles.fileButtonText}>
                {documentUrls.electricity
                  ? "✅ Electricity Bill"
                  : "📄 Electricity Bill"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fileButton}
              onPress={() => uploadToCloudinary("bank")}
            >
              <Text style={styles.fileButtonText}>
                {documentUrls.bank ? "✅ Bank Passbook" : "📄 Bank Passbook"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEditSubmit}
              style={{ marginTop: 20, alignSelf: "center" }}
            >
              <Text style={styles.blueText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
              style={{ marginTop: 10, alignSelf: "center" }}
            >
              <Text style={styles.blueText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f9fafd",
    flexGrow: 1,
  },
  dropdownButton: {
    backgroundColor: "white",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "white",
  },
  submitButton: {
    backgroundColor: "#0ba9bb",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  fileButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#e8f8fa",
    marginBottom: 20,
    alignItems: "center",
  },
  fileButtonText: {
    color: "#007a87",
    fontSize: 15,
  },
  dropdownContainer: {
    marginBottom: 16,
    zIndex: 10,
  },
  dropdownList: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
  blueText: {
    color: "#007aff",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: { fontSize: 20, fontWeight: "bold", marginVertical: 16 },
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
  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  option: { paddingVertical: 8 },
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
});
