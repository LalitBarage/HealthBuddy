import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  FlatList, 
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Provider as PaperProvider,
  DefaultTheme,
  Dialog,
  Portal,
  Menu,
  ActivityIndicator
} from 'react-native-paper';
import { useHospital } from '../HospitalContext';
import {API_URL} from '@env'; // Make sure this is defined in your .env file
import AsyncStorage from '@react-native-async-storage/async-storage';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0ba9bb',
    background: '#f9fafd',
    surface: '#ffffff',
    text: '#000000',
    placeholder: '#aaa',
  },
};


export const EnquiryScreen = () => {
 
  const [enquiry, setEnquiry] = useState({
    name: '',
    phone: '',
    dob: '',
    pid:'',
    hid: '',
    gender: '',
    diseases: '',
    pincode:'',
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [errors, setErrors] = useState({});
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  

 
  // Add this state at the top
const [generatedOtp, setGeneratedOtp] = useState('');
const [enteredOtp, setEnteredOtp] = useState('');



 
const [filterMenuVisible, setFilterMenuVisible] = useState(false);
const [filterAnchor, setFilterAnchor] = useState(null);

  const genderOptions = ['Male', 'Female', 'Other'];

  const validateAadhar = (value) => /^\d{12}$/.test(value);

  useEffect(() => {
    const fetchId = async () => {
      const id = await AsyncStorage.getItem('id');
      setEnquiry(prev => ({ ...prev, hid: id }));
    };
    fetchId();
  }, []);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const id = await AsyncStorage.getItem('id');
        const response = await fetch(`${API_URL}/api/enquiry/getAllEnquiries`);
        const data = await response.json();
  
        
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
        console.error('Error fetching enquiries:', error);
        Alert.alert('Error', 'Failed to load enquiries');
      }
    };
  
    fetchEnquiries();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);
  
  

  const handleChange = (field, value) => {
    setEnquiry({ ...enquiry, [field]: value });
    if (field === 'phone' && value.length > 0 && !/^\d{10}$/.test(value)) {
      setErrors((prev) => ({ ...prev, phone: 'Phone must be 10 digits' }));
    } else if (field === 'phone') {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const handleSubmit = async () => {
    console.log("clicked");
    setLoading(true);
    const id = await AsyncStorage.getItem('id');
    
  
    const newEntry = {
      pid: enquiry.pid,
      hid: id,
      diseases: enquiry.diseases,
      pincode: enquiry.pincode,
      createdAt: new Date().toISOString()
    };
    
    console.log('New Entry:', newEntry);
    try {
      const response = await fetch(`${API_URL}/api/enquiry/addEnquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });
      console.log('Response:', response);
  
      if (!response.ok) {
        throw new Error('Failed to submit enquiry.');
      }
  
      const data = await response.json();
      setEnquiries([newEntry, ...enquiries]); // you can still use timestamp locally if needed
      Alert.alert('Submitted', 'Enquiry submitted successfully.');
      setEnquiry({
        pid: '',
        diseases: '',
        pincode: '',
      });
      
    } catch (error) {
      Alert.alert('Error', error.message);
    }finally{
      setLoading(false);
    }
  };
  

  const handleDateChange = (_, selectedDate) => {
    setDobPickerVisible(false);
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      handleChange('dob', dateStr);
    }
  };

  const applyFilter = (entries) => {
    const now = new Date();
    let filtered = entries;

    if (filter === '10days') {
      filtered = filtered.filter((e) => now - new Date(e.createdAt) <= 10 * 86400000);
    } else if (filter === '3months') {
      filtered = filtered.filter((e) => now - new Date(e.createdAt) <= 90 * 86400000);
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

  const handleEdit = (enquiry) => {
    setSelectedEnquiry(enquiry);
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    console.log('Generated OTP:', otp); // In real app, send this via SMS or email
  
    setGeneratedOtp(otp); // store the generated OTP
    setOtpModalVisible(true);
  };
  

  const handleOtpSubmit = () => {
    if (enteredOtp === generatedOtp) {
      setOtpModalVisible(false);
      setEditModalVisible(true);
      setEnteredOtp('');
    } else {
      Alert.alert('Invalid OTP');
      setEnteredOtp('');
    }
  };
  

  const handleEditSubmit = () => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === selectedEnquiry.id ? selectedEnquiry : e))
    );
    setEditModalVisible(false);
    Alert.alert('Updated');
  };

  const handleDelete = (id) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <PaperProvider theme={theme}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <TextInput
          label="Patient ID"
          mode="outlined"
          value={enquiry.pid}
          onChangeText={(val) => handleChange('pid', val)}
          style={styles.input}
        />
        <TextInput
          label="Hospital ID"
          mode="outlined"
          keyboardType="phone-pad"
          value={enquiry.hid}
          onChangeText={(val) => handleChange('hid', val)}
          style={styles.input}
        />
     
        <TextInput
          label="Disease"
          mode="outlined"
          multiline
          value={enquiry.disease}
          onChangeText={(val) => handleChange('diseases', val)}
          style={styles.input}
        />
        <TextInput
          label="Pincode"
          mode="outlined"
          keyboardType='phone-pad'
          value={enquiry.pincode}
          onChangeText={(val) => handleChange('pincode', val)}
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
    'Submit'
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
        {filter === 'all'
          ? 'All'
          : filter === '10days'
          ? 'Last 10 Days'
          : 'Last 3 Months'}
      </Button>
    }
    contentStyle={{
      backgroundColor: 'white',
      borderRadius: 8,
      paddingVertical: 4,
    }}
  >
    <Menu.Item
      onPress={() => {
        setFilter('all');
        setFilterMenuVisible(false);
      }}
      title="All"
      titleStyle={{ color: 'black' }}
    />
    <Menu.Item
      onPress={() => {
        setFilter('10days');
        setFilterMenuVisible(false);
      }}
      title="Last 10 Days"
      titleStyle={{ color: 'black' }}
    />
    <Menu.Item
      onPress={() => {
        setFilter('3months');
        setFilterMenuVisible(false);
      }}
      title="Last 3 Months"
      titleStyle={{ color: 'black' }}
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

<FlatList
  data={paginatedEnquiries}
  scrollEnabled={false}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ paddingBottom: 100 }}
  renderItem={({ item }) => (
    <View style={styles.enquiryItem}>
      <Text>
        PID: {item.pid} | Disease: {item.diseases}{"\n"}
        Pincode: {item.pincode}, {item.sub_dist}, {item.dist}, {item.state}{"\n"}
        Date: {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <View style={styles.enquiryActions}>
        <Button onPress={() => handleEdit(item)}>Edit</Button>
        <Button onPress={() => handleDelete(item.id)}>Delete</Button>
      </View>
    </View>
  )}
/>

<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 }}>
  <Button
    mode="outlined"
    disabled={currentPage === 1}
    onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
  >
    Previous
  </Button>
  <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>
    Page {currentPage}
  </Text>
  <Button
    mode="outlined"
    disabled={currentPage * itemsPerPage >= applyFilter(enquiries).length}
    onPress={() => setCurrentPage((prev) => prev + 1)}
  >
    Next
  </Button>
</View>

        <Portal>
  <Dialog visible={otpModalVisible} onDismiss={() => setOtpModalVisible(false)}  style={{
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ccc',
          marginBottom: 16,
        }}>
    <Dialog.Title>OTP Verification</Dialog.Title>
    <Dialog.Content>
      <TextInput
        placeholder="Enter OTP"
        value={enteredOtp}
        onChangeText={setEnteredOtp}
        keyboardType="numeric"
        maxLength={6}
        style={{backgroundColor: 'white'}}
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
              label="Name"
              mode="outlined"
              value={selectedEnquiry?.name || ''}
              onChangeText={(val) =>
                setSelectedEnquiry((prev) => ({ ...prev, name: val }))
              }
              style={styles.input}
            />
            <TextInput
              label="Phone"
              mode="outlined"
              value={selectedEnquiry?.phone || ''}
              onChangeText={(val) =>
                setSelectedEnquiry((prev) => ({ ...prev, phone: val }))
              }
              style={styles.input}
            />
            <TextInput
              label="DOB"
              mode="outlined"
              value={selectedEnquiry?.dob || ''}
              onChangeText={(val) =>
                setSelectedEnquiry((prev) => ({ ...prev, dob: val }))
              }
              style={styles.input}
            />
            <TextInput
              label="Gender"
              mode="outlined"
              value={selectedEnquiry?.gender || ''}
              onChangeText={(val) =>
                setSelectedEnquiry((prev) => ({ ...prev, gender: val }))
              }
              style={styles.input}
            />
            <TextInput
              label="Symptoms"
              mode="outlined"
              value={selectedEnquiry?.symptoms || ''}
              onChangeText={(val) =>
                setSelectedEnquiry((prev) => ({ ...prev, symptoms: val }))
              }
              style={styles.input}
            />
            <Button onPress={handleEditSubmit} style={styles.submitButton}>Save Changes</Button>
            <Button onPress={() => setEditModalVisible(false)}>Cancel</Button>
          </ScrollView>
        </Modal>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f9fafd', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 16 },
  input: { marginBottom: 12 },
  dropdown: { backgroundColor: '#fff', padding: 8, borderRadius: 4 },
  option: { paddingVertical: 8 },
  submitButton: { marginVertical: 16 },
  enquiryItem: { marginVertical: 8, padding: 12, backgroundColor: '#fff', borderRadius: 8 },
  enquiryActions: { flexDirection: 'row', justifyContent: 'space-between' },
  filters: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  filterWrapper: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dropdownButton: {
    backgroundColor: 'white',
  },
  
});