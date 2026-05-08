import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Zaślepki ekranów (utwórz odpowiednie komponenty w folderze src/screens/)
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import MapScreen from './src/screens/MapScreen';
import TicketScreen from './src/screens/TicketScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AdminDashboard from './src/screens/AdminDashboard';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* Ekran powitalny [cite: 263] */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        
        {/* Ekran logowania/rejestracji [cite: 273] */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        
        {/* Interaktywna Mapa [cite: 289] */}
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Wyszukaj parking' }} />
        
        {/* Ekran aktywnego biletu [cite: 327] */}
        <Stack.Screen name="Ticket" component={TicketScreen} options={{ title: 'Aktualny Bilet' }} />
        
        {/* Profil i historia [cite: 351] */}
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil i Historia' }} />
        
        {/* Panel Administratora [cite: 398] */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Panel Administratora' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}