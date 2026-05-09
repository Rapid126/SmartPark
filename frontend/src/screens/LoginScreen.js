import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import api from '../api/axiosConfig';

export default function LoginScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [haslo, setHaslo] = useState('');
  const [imie, setImie] = useState('');

  const handleAuth = async () => {
    if (!email || !haslo) {
      return Alert.alert('Błąd', 'Wpisz email i hasło.');
    }

    try {
      if (isLogin) {
        // --- LOGOWANIE ---
        const response = await api.post('/auth/login', { email, haslo });
        
        const token = response.data.token;
        
        // USTAWIANIE TOKENA - to usuwa błąd 401 na innych ekranach
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log("Zalogowano pomyślnie, token ustawiony.");
        navigation.replace('Main');
      } else {
        // --- REJESTRACJA ---
        if (!imie) return Alert.alert('Błąd', 'Wpisz swoje imię.');
        await api.post('/auth/register', { imie, email, haslo });
        Alert.alert('Sukces', 'Konto utworzone! Teraz możesz się zalogować.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Błąd autoryzacji:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || 'Błąd połączenia. Sprawdź IP w axiosConfig.';
      Alert.alert('Błąd', errorMsg);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{isLogin ? 'Zaloguj się' : 'Stwórz konto'}</Text>
        
        {!isLogin && (
          <TextInput style={styles.input} placeholder="Imię" value={imie} onChangeText={setImie} />
        )}
        
        <TextInput 
          style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} 
          keyboardType="email-address" autoCapitalize="none"
        />
        
        <TextInput 
          style={styles.input} placeholder="Hasło" value={haslo} onChangeText={setHaslo} 
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>{isLogin ? 'Wejdź' : 'Zarejestruj'}</Text>
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>{isLogin ? 'Nie masz konta? ' : 'Masz już konto? '}</Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchTextBold}>{isLogin ? 'Zarejestruj się' : 'Zaloguj się'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  card: { width: '85%', backgroundColor: '#fff', padding: 30, borderRadius: 15, elevation: 5 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 25 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, marginBottom: 15, backgroundColor: '#fff' },
  button: { backgroundColor: '#2563eb', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switchContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  switchText: { color: '#6b7280' },
  switchTextBold: { color: '#2563eb', fontWeight: 'bold' }
});