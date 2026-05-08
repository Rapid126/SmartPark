import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TicketScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Aktualny Bilet i Płatność</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 }
});