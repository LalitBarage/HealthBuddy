import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { InfoScreen } from './screens/InfoScreen';
import { AschemeScreen } from './screens/AschemeScreen';
import BillScreen from './screens/BillScreen'
import { NotificationScreen } from './screens/NotificationScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation, handleLogout }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = 'home-outline';
            break;
          case 'History':
            iconName = 'information-outline';
            break;
          case 'Applied Scheme':
            iconName = 'file-document-outline';
            break;
          case 'Bill':
            iconName = 'file-invoice-outline';
            break;
          default:
            iconName = 'circle-outline';
        }

        return <Icon name={iconName} color={color} size={size} />;
      },
      tabBarActiveTintColor: '#0ba9bb',
      tabBarInactiveTintColor: 'gray',
      headerRight: () => (
        <>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notification')}
            style={{ marginRight: 15 }}
          >
            <Icon name="bell-outline" size={22} color="#0ba9bb" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
            <Icon name="logout" size={22} color="#0ba9bb" />
          </TouchableOpacity>
        </>
      ),
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="History" component={InfoScreen} />
    <Tab.Screen name="Applied Scheme" component={AschemeScreen} />
    <Tab.Screen name="Bill" component={BillScreen} />
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
      <Stack.Navigator>
        {userToken ? (
          <>
            <Stack.Screen name="Main" options={{ headerShown: false }}>
              {({ navigation }) => (
                <TabNavigator navigation={navigation} handleLogout={handleLogout} />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Notification"
              component={NotificationScreen}
              options={{ title: 'Notifications' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login">
              {() => <LoginScreen onLoginSuccess={handleLoginSuccess} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="Info" component={InfoScreen} />
            <Stack.Screen name="Ascheme" component={AschemeScreen} />
            <Stack.Screen name="Bill" component={BillScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
