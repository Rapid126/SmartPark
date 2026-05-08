import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Logowanie i Rejestracja</Text>
      <Button title="Zaloguj (Przejdź do Mapy)" onPress={() => navigation.replace('Map')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 }
});