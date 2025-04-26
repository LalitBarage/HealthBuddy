import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Linking,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const ITEMS_PER_PAGE = 5;

export const AschemeScreen = () => {
  const [appliedSchemes, setAppliedSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAppliedSchemes = async () => {
      try {
        const id = await AsyncStorage.getItem("id");
        const token = await AsyncStorage.getItem("userToken");

        const response = await fetch(
          `http://192.168.205.106:3000/api/scheme/getAppliedSchemePid/${id}`,
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
          setAppliedSchemes(data);
          setFilteredSchemes(data);
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
    const filtered = appliedSchemes.filter((item) =>
      item.scid?.toString().toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredSchemes(filtered);
    setCurrentPage(1);
  }, [searchText, appliedSchemes]);

  const totalPages = Math.ceil(filteredSchemes.length / ITEMS_PER_PAGE);

  const paginatedData = filteredSchemes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Scheme ID: {item.scid}</Text>
      <Text style={styles.location}>
        Location: {item.sub_dist}, {item.dist}, {item.state} - {item.pincode}
      </Text>
      <Text
        style={[styles.status, item.status ? styles.approved : styles.pending]}
      >
        {item.status ? "Approved" : "Pending"}
      </Text>

      <View style={styles.linksContainer}>
        <Link label="Income Cert" url={item.income_cert_url} />
        <Link label="Caste Cert" url={item.caste_cert_url} />
        <Link label="Elec. Bill" url={item.ele_bill_url} />
        <Link label="Passbook" url={item.bank_passbook_url} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by Scheme ID..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      <FlatList
        data={paginatedData}
        keyExtractor={(item) => item.apscid.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center" }}>No schemes found.</Text>
        }
      />

      {filteredSchemes.length > 0 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={[
              styles.pageButton,
              currentPage === 1 && styles.disabledButton,
            ]}
          >
            <Text style={styles.pageText}>Previous</Text>
          </TouchableOpacity>

          <Text style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </Text>

          <TouchableOpacity
            onPress={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            style={[
              styles.pageButton,
              currentPage === totalPages && styles.disabledButton,
            ]}
          >
            <Text style={styles.pageText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const Link = ({ label, url }) => (
  <TouchableOpacity
    onPress={() => Linking.openURL(url)}
    style={styles.linkButton}
  >
    <Text style={styles.linkText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: "#0ba9bb",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#f0faff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  pending: {
    color: "red",
  },
  approved: {
    color: "green",
  },
  linksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  linkButton: {
    backgroundColor: "#0ba9bb",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 6,
    marginTop: 6,
  },
  linkText: {
    color: "#fff",
    fontSize: 12,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  pageButton: {
    backgroundColor: "#0ba9bb",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  pageText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pageInfo: {
    fontSize: 16,
    color: "#333",
  },
});
