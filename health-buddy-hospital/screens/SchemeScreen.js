import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Provider,
  Portal,
} from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const healthSchemes = [
  { id: '1', name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana' },
  { id: '2', name: 'Central Government Health Scheme (CGHS)' },
  { id: '3', name: 'National Health Mission (NHM)' },
  { id: '4', name: 'Rashtriya Swasthya Bima Yojana (RSBY)' },
  { id: '5', name: 'EHS - Employee Health Scheme' },
];

const genderOptions = ['Male', 'Female', 'Other'];

export const SchemeScreen = () => {
  const [schemeMenuVisible, setSchemeMenuVisible] = useState(false);
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [document, setDocument] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    incomeCertificate: '',
    bill: '',
  });

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled) {
        setDocument(result.assets[0]);
      }
    } catch (err) {
      console.error('Document pick error:', err);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });

    // Validation
    if (field === 'phone') {
      setErrors((prev) => ({
        ...prev,
        phone: /^\d{10}$/.test(value) ? '' : 'Phone number must be 10 digits',
      }));
    }
  };

  const handleDateChange = (_, selectedDate) => {
    setDobPickerVisible(false);
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      handleChange('dob', dateStr);
    }
  };

  const handleSubmit = () => {
    const phoneValid = /^\d{10}$/.test(form.phone);
    const aadharValid = /^\d{12}$/.test(aadhar);
    if (!selectedScheme || !aadharValid || !phoneValid || otp.length !== 6) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly.');
      return;
    }
    Alert.alert('Success', 'Scheme application submitted successfully!');
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Scheme Dropdown */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => setSchemeMenuVisible(!schemeMenuVisible)}>
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
          label="Aadhar Number"
          mode="outlined"
          keyboardType="numeric"
          value={aadhar}
          onChangeText={(val) => {
            setAadhar(val);
            setErrors((prev) => ({
              ...prev,
              aadhar: /^\d{12}$/.test(val) ? '' : 'Aadhar must be 12 digits',
            }));
          }}
          error={!!errors.aadhar}
          style={styles.input}
        />
        {errors.aadhar ? <Text style={styles.error}>{errors.aadhar}</Text> : null}

        <Button mode="contained" onPress={() => setOtpModalVisible(true)} style={styles.fetchButton}>
          Send OTP
        </Button>

        {/* OTP Modal */}
        <Portal>
          <Modal visible={otpModalVisible} onRequestClose={() => setOtpModalVisible(false)} transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={{ fontSize: 18, marginBottom: 16 }}>Enter OTP</Text>
                <TextInput
                  label="6-digit OTP"
                  mode="outlined"
                  keyboardType="numeric"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={6}
                  style={styles.input}
                />
                <View style={styles.otpButtonGroup}>
                  <Button mode="contained" onPress={() => setOtpModalVisible(false)}>Cancel</Button>
                  <Button
                    mode="contained"
                    onPress={() => {
                      if (otp.length === 6) {
                        setOtpModalVisible(false);
                        Alert.alert('OTP Verified');
                      } else {
                        Alert.alert('Invalid OTP', 'Please enter 6 digits');
                      }
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    Submit
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </Portal>

        <TextInput
          label="Full Name"
          mode="outlined"
          value={form.name}
          onChangeText={(val) => handleChange('name', val)}
          style={styles.input}
        />

        <TextInput
          label="Phone Number"
          mode="outlined"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(val) => handleChange('phone', val)}
          error={!!errors.phone}
          style={styles.input}
        />
        {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}

        {/* Date Picker */}
        <TouchableOpacity onPress={() => setDobPickerVisible(true)}>
          <TextInput
            label="Date of Birth"
            mode="outlined"
            value={form.dob}
            editable={false}
            right={<TextInput.Icon icon="calendar" />}
            style={styles.input}
          />
        </TouchableOpacity>
        {dobPickerVisible && (
          <DateTimePicker
            value={form.dob ? new Date(form.dob) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Gender Dropdown */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => setGenderMenuVisible(!genderMenuVisible)}>
            <TextInput
              label="Gender"
              mode="outlined"
              value={form.gender}
              editable={false}
              right={<TextInput.Icon icon="chevron-down" />}
              style={styles.input}
            />
          </TouchableOpacity>

          {genderMenuVisible && (
            <View style={styles.dropdownList}>
              {genderOptions.map((gender) => (
                <TouchableOpacity
                  key={gender}
                  onPress={() => {
                    handleChange('gender', gender);
                    setGenderMenuVisible(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text>{gender}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TextInput
          label="Permanent Address"
          mode="outlined"
          value={form.address}
          onChangeText={(val) => handleChange('address', val)}
          style={styles.input}
        />

        {/* Document Pickers */}
        <TouchableOpacity style={styles.fileButton} onPress={pickDocument}>
          <Text style={styles.fileButtonText}>
            {document ? document.name : '📄 Income Certificate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fileButton} onPress={pickDocument}>
          <Text style={styles.fileButtonText}>
            {document ? document.name : '📄 Bill'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Application</Text>
        </TouchableOpacity>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9fafd',
    flexGrow: 1,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  fetchButton: {
    backgroundColor: '#0ba9bb',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#0ba9bb',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  otpButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  fileButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#e8f8fa',
    marginBottom: 20,
    alignItems: 'center',
  },
  fileButtonText: {
    color: '#007a87',
    fontSize: 15,
  },
  dropdownContainer: {
    marginBottom: 16,
    zIndex: 10,
  },
  dropdownList: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 4,
  },
});
