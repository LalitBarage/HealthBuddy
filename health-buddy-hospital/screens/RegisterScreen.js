import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { TextInput } from 'react-native-paper';

export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  
  const [document, setDocument] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [pincode, setPincode] = useState('');

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled) {
        setDocument(result.assets[0]);
        console.log('Picked file:', result.assets[0]);
      }
    } catch (err) {
      console.error('Document pick error:', err);
    }
  };

  const handleRegister = () => {
    console.log({
      email,
      password,
      hospitalName,
      document,
      pincode,
    });
   
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
