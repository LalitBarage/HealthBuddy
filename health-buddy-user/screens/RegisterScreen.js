import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { TextInput, Button, Text, Provider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

export const RegisterScreen = () => {
  const [phone, setPhone] = useState('');
  const [patient, setPatient] = useState({
    name: '',
    aadhar: '',
    dob: '',
    address: '',
    gender: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});
  const [isExisting, setIsExisting] = useState(false);
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];

  const validatePhone = (value) => /^\d{10}$/.test(value);
  const validateAadhar = (value) => /^\d{12}$/.test(value);

  const fetchDetails = () => {
    if (!validatePhone(phone)) {
      setErrors({ phone: 'Phone number must be 10 digits' });
      return;
    }

    setErrors({});
    if (phone === '9999999999') {
      setPatient({
        name: 'John Doe',
        aadhar: '123456789012',
        dob: '1990-01-01',
        address: '123 Health Street',
        gender: 'Male',
        pincode: '123456',
      });
      setIsExisting(true);
    } else {
      setPatient({
        name: '',
        aadhar: '',
        dob: '',
        address: '',
        gender: '',
        pincode: '',
      });
      setIsExisting(false);
      Alert.alert('New Patient', 'No existing record found. Please fill in details.');
    }
  };

  const handleChange = (field, value) => {
    setPatient({ ...patient, [field]: value });

    if (field === 'aadhar') {
      if (!validateAadhar(value)) {
        setErrors((prev) => ({ ...prev, aadhar: 'Aadhar must be 12 digits' }));
      } else {
        setErrors((prev) => ({ ...prev, aadhar: '' }));
      }
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
    if (!validatePhone(phone) || !validateAadhar(patient.aadhar)) {
      Alert.alert('Validation Error', 'Please correct the highlighted fields.');
      return;
    }

    Alert.alert('Success', isExisting ? 'Patient updated.' : 'New patient registered.');
    // Submit logic here
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          label="Phone Number"
          mode="outlined"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(val) => {
            setPhone(val);
            if (!validatePhone(val)) {
              setErrors((prev) => ({ ...prev, phone: 'Phone number must be 10 digits' }));
            } else {
              setErrors((prev) => ({ ...prev, phone: '' }));
            }
          }}
          error={!!errors.phone}
          style={styles.input}
        />
        {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}

        <Button
          mode="contained"
          onPress={fetchDetails}
          style={styles.fetchButton}
          disabled={!validatePhone(phone)}
        >
          Fetch Details
        </Button>

        <TextInput
          label="Patient Name"
          mode="outlined"
          value={patient.name}
          onChangeText={(val) => handleChange('name', val)}
          style={styles.input}
        />

        <TextInput
          label="Aadhar Number"
          mode="outlined"
          keyboardType="numeric"
          value={patient.aadhar}
          onChangeText={(val) => handleChange('aadhar', val)}
          error={!!errors.aadhar}
          style={styles.input}
        />
        {errors.aadhar ? <Text style={styles.error}>{errors.aadhar}</Text> : null}

        <TouchableOpacity onPress={() => setDobPickerVisible(true)}>
          <TextInput
            label="Date of Birth"
            mode="outlined"
            value={patient.dob}
            editable={false}
            right={<TextInput.Icon icon="calendar" />}
            style={styles.input}
          />
        </TouchableOpacity>

        {dobPickerVisible && (
          <DateTimePicker
            value={patient.dob ? new Date(patient.dob) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <View style={styles.dropdownWrapper}>
          <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
            <TextInput
              label="Gender"
              mode="outlined"
              value={patient.gender}
              editable={false}
              right={<TextInput.Icon icon="chevron-down" />}
              style={styles.input}
            />
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdown}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.option}
                  onPress={() => {
                    handleChange('gender', option);
                    setDropdownVisible(false);
                  }}
                >
                  <Text>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TextInput
          label="Address"
          mode="outlined"
          value={patient.address}
          onChangeText={(val) => handleChange('address', val)}
          style={styles.input}
        />
        <TextInput
          label="Pincode"
          mode="outlined"
          keyboardType="numeric"
          value={patient.pincode}
          onChangeText={(val) => handleChange('pincode', val)}
          style={styles.input}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {isExisting ? 'Update Patient' : 'Register Patient'}
          </Text>
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
    justifyContent: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  fetchButton: {
    backgroundColor: '#0ba9bb',
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: '#0ba9bb',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 2,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 4,
  },
  dropdownWrapper: {
    marginBottom: 16,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 2,
    overflow: 'hidden',
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
