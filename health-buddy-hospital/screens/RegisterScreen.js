import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { TextInput } from 'react-native-paper';
import { API_URL, CLOUDINARY_URL, UPLOAD_PRESET } from '@env';


export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [document, setDocument] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [pincode, setPincode] = useState('');


  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (res.canceled) return;

      const file = {
        uri: res.assets[0].uri,
        type: 'application/pdf',
        name: res.assets[0].name || 'document.pdf',
      };

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset',UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        setDocument(file);
        setDocumentUrl(data.secure_url);
        Alert.alert('Upload Success!', `URL: ${data.secure_url}`);
      } else {
        Alert.alert('Upload failed', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Error', err.message);
    }
  };

  const handleRegister = async () => {
    console.log("You have clicked");
    if (!documentUrl) {
      Alert.alert('Please upload the required document before registering.');
      return;
    }

    const payload = {
      email,
      password,
      hospitalName,
      mobileNo,
      pincode,
      document_url: documentUrl,
    };
    console.log(payload);
    try {
      const response = await fetch(`${API_URL}/api/auth/registerHospital`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        
      });
      console.log("Payload: ", payload);
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Registered successfully!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Registration Failed', result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to register. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
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
            icon={passwordVisible ? 'eye-off' : 'eye'}
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        }
      />
      <TextInput
        mode="outlined"
        label="Hospital Name"
        value={hospitalName}
        onChangeText={setHospitalName}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Pincode"
        value={pincode}
        onChangeText={setPincode}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Phone Number"
        value={mobileNo}
        onChangeText={setMobileNo}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TouchableOpacity style={styles.fileButton} onPress={pickDocument}>
        <Text style={styles.fileButtonText}>
          {document ? document.name : '📄 Select Document'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}> Login here</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9fafd',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#0ba9bb',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  fileButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#e8f8fa',
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fileButtonText: {
    color: '#007a87',
    fontSize: 15,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginLink: {
    color: '#0ba9bb',
    marginLeft: 6,
    fontWeight: '600',
  },
});
