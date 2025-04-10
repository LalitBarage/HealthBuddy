import React from 'react';
import { Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {HomeScreen} from './screens/HomeScreen';
import { PatientScreen } from './screens/PatientScreen';
import { EnquiryScreen } from './screens/EnquiryScreen';
import { SchemeScreen } from './screens/SchemeScreen';
import { RegisterScreen } from './screens/RegisterScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        onPress: () => {
          navigate('Login'); 
        },
        style: 'destructive',
      },
    ]);
  };

  const withHeader = (title) => ({
    headerTitle: title,
    headerRight: () => (
      <Icon.Button
        name="logout"
        size={22}
        backgroundColor="transparent"
        color="#0ba9bb"
        onPress={handleLogout}
      />
    ),
  });

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            switch (route.name) {
              case 'register':
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
        })}
      >
        <Tab.Screen name="Register" component={RegisterScreen}/>
        <Tab.Screen name="Patient" component={PatientScreen} options={withHeader('Patient')} />
        <Tab.Screen name="Enquiry" component={EnquiryScreen} options={withHeader('Enquiry')} />
        <Tab.Screen name="Scheme" component={SchemeScreen} options={withHeader('Scheme')} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
