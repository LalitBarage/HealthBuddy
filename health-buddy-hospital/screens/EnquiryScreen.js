import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Menu,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [aadhar, setAadhar] = useState('');
  const [enquiry, setEnquiry] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: '',
    symptoms: '',
  });

  const [errors, setErrors] = useState({});
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);
  const genderOptions = ['Male', 'Female', 'Other'];
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const validateAadhar = (value) => /^\d{12}$/.test(value);

  const fetchDetails = () => {
    if (!validateAadhar(aadhar)) {
      setErrors({ aadhar: 'Aadhar must be 12 digits' });
      return;
    }

    setErrors({});
    if (aadhar === '123456789012') {
      setEnquiry({
        name: 'Alice Sharma',
        phone: '9876543210',
        dob: '1985-07-21',
        gender: 'Female',
        symptoms: 'Cough, Fever',
      });
    } else {
      setEnquiry({
        name: '',
        phone: '',
        dob: '',
        gender: '',
        symptoms: '',
      });
      Alert.alert('New Entry', 'No record found. Please fill in details.');
    }
  };

  const handleChange = (field, value) => {
    setEnquiry({ ...enquiry, [field]: value });

    if (field === 'phone' && value.length > 0 && !/^\d{10}$/.test(value)) {
      setErrors((prev) => ({ ...prev, phone: 'Phone must be 10 digits' }));
    } else if (field === 'phone') {
      setErrors((prev) => ({ ...prev, phone: '' }));
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
    if (!validateAadhar(aadhar)) {
      Alert.alert('Validation Error', 'Please enter valid Aadhar number.');
      return;
    }

    Alert.alert('Submitted', 'Enquiry submitted successfully.');
    // submit logic here
  };

  return (
    <PaperProvider theme={theme}>
      <ScrollView contentContainerStyle={styles.container}>
        

        <TextInput
          label="Aadhar Number"
          mode="outlined"
          keyboardType="numeric"
          value={aadhar}
          onChangeText={(val) => {
            setAadhar(val);
            if (!validateAadhar(val)) {
              setErrors((prev) => ({ ...prev, aadhar: 'Aadhar must be 12 digits' }));
            } else {
              setErrors((prev) => ({ ...prev, aadhar: '' }));
            }
          }}
          error={!!errors.aadhar}
          style={styles.input}
        />
        {errors.aadhar ? <Text style={styles.error}>{errors.aadhar}</Text> : null}

        <Button
          mode="contained"
          onPress={fetchDetails}
          style={styles.fetchButton}
          disabled={!validateAadhar(aadhar)}
        >
          Fetch Details
        </Button>

        <TextInput
          label="Name"
          mode="outlined"
          value={enquiry.name}
          onChangeText={(val) => handleChange('name', val)}
          style={styles.input}
        />

        <TextInput
          label="Phone"
          mode="outlined"
          keyboardType="phone-pad"
          value={enquiry.phone}
          onChangeText={(val) => handleChange('phone', val)}
          error={!!errors.phone}
          style={styles.input}
        />
        {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}

        <TouchableOpacity onPress={() => setDobPickerVisible(true)}>
          <TextInput
            label="Date of Birth"
            mode="outlined"
            value={enquiry.dob}
            editable={false}
            right={<TextInput.Icon icon="calendar" />}
            style={styles.input}
          />
        </TouchableOpacity>

        {dobPickerVisible && (
          <DateTimePicker
            value={enquiry.dob ? new Date(enquiry.dob) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

<View style={styles.wrapper}>
  <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
    <TextInput
      label="Gender"
      mode="outlined"
      value={enquiry.gender}
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
          label="Symptoms"
          mode="outlined"
          multiline
          numberOfLines={3}
          value={enquiry.symptoms}
          onChangeText={(val) => handleChange('symptoms', val)}
          style={styles.input}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Enquiry</Text>
        </TouchableOpacity>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
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
  container: {
    padding: 24,
    backgroundColor: '#f9fafd',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#0ba9bb',
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
  menuWrapper: {
    marginBottom: 16,
  },
});
