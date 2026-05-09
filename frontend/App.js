import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; // Ikony

import LoginScreen from './src/screens/LoginScreen';
import MapScreen from './src/screens/MapScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TicketScreen from './src/screens/TicketScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Główny pasek nawigacji widoczny po zalogowaniu
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = route.name === 'Mapa' ? 'map' : 'person';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2563eb',
    })}>
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ title: 'Moje Rezerwacje' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Ticket" component={TicketScreen} options={{ title: 'Rezerwacja' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}