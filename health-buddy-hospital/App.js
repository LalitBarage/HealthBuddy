import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


// Screens
import { HomeScreen } from './screens/HomeScreen';
import { PatientScreen } from './screens/PatientScreen';
import { EnquiryScreen } from './screens/EnquiryScreen';
import { SchemeScreen } from './screens/SchemeScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { LoginScreen } from './screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = ({ handleLogout }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = 'home-outline';
            break;
          case 'Patient':
            iconName = 'account-outline';
            break;
          case 'Enquiry':
            iconName = 'magnify';
            break;
          case 'Scheme':
            iconName = 'file-document-outline';
            break;
          default:
            iconName = 'circle';
        }

        return <Icon name={iconName} color={color} size={size} />;
      },
      tabBarActiveTintColor: '#0ba9bb',
      tabBarInactiveTintColor: 'gray',
      headerRight: () => (
        <Icon.Button
          name="logout"
          size={22}
          backgroundColor="transparent"
          color="#0ba9bb"
          onPress={handleLogout}
        />
      ),
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Patient" component={PatientScreen} />
    <Tab.Screen name="Enquiry" component={EnquiryScreen} />
    <Tab.Screen name="Scheme" component={SchemeScreen} />
  </Tab.Navigator>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
      setIsLoading(false);
    };
    checkToken();
  }, []);

  const handleLoginSuccess = async (token) => {
    await AsyncStorage.setItem('userToken', token);
    setUserToken(token);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('id');
          const token = await AsyncStorage.getItem('userToken');

        if (token === null) {
          console.log('✅ Token successfully removed.');
        } else {
          console.log('❌ Token still exists:', token);
        }

          setUserToken(null);
        },
      },
    ]);
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
   
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? (
          <Stack.Screen name="Main">
            {() => <TabNavigator handleLogout={handleLogout} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login">
              {() => <LoginScreen onLoginSuccess={handleLoginSuccess} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Patient" component={PatientScreen} />
            <Stack.Screen name="Enquiry" component={EnquiryScreen} />
            <Stack.Screen name="Scheme" component={SchemeScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    
  );
};

export default App;
