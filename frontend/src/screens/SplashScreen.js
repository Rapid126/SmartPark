import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>SmartPark - Ekran Powitalny</Text>
      <Button title="Przejdź do Logowania" onPress={() => navigation.replace('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0f7fa' },
  text: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 }
});