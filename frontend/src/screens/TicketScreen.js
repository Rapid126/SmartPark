import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../api/axiosConfig';

export default function TicketScreen({ route, navigation }) {
  const { parking } = route.params || {};
  const [pojazdy, setPojazdy] = useState([]);
  const [wybranyPojazdId, setWybranyPojazdId] = useState('');
  
  // Stany dla dat rezerwacji
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().getTime() + 3600000)); // Domyślnie +1h
  
  // Sterowanie kalendarzem
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState('date'); 
  const [target, setTarget] = useState('start'); 

  useEffect(() => {
    // Pobieranie pojazdów zalogowanego użytkownika
    api.get('/pojazdy')
      .then(res => {
        setPojazdy(res.data);
        if (res.data.length > 0) setWybranyPojazdId(res.data[0]._id);
      })
      .catch(err => console.error("Błąd pobierania pojazdów:", err));
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || (target === 'start' ? startDate : endDate);
    setShowPicker(Platform.OS === 'ios'); 
    
    if (target === 'start') {
      setStartDate(currentDate);
    } else {
      setEndDate(currentDate);
    }
  };

  const showMode = (currentMode, currentTarget) => {
    setMode(currentMode);
    setTarget(currentTarget);
    setShowPicker(true);
  };

  const handleZarezerwuj = async () => {
    if (!wybranyPojazdId) return Alert.alert('Błąd', 'Wybierz pojazd z listy.');
    if (startDate >= endDate) return Alert.alert('Błąd', 'Data wyjazdu musi być późniejsza niż przyjazdu.');

    try {
      // Wysłanie rezerwacji do bazy danych
      await api.post('/rezerwacje', {
        parkingId: parking._id,
        pojazdId: wybranyPojazdId,
        dataOd: startDate.toISOString(),
        dataDo: endDate.toISOString()
      });
      Alert.alert('Sukces', 'Miejsce zostało zarezerwowane!');
      navigation.navigate('Main', { screen: 'Profil' }); 
    } catch (error) {
      Alert.alert('Błąd', error.response?.data?.message || 'Błąd rezerwacji');
    }
  };

  if (!parking) return <View style={styles.container}><Text>Brak danych parkingu</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.header}>
        <Text style={styles.title}>{parking.nazwa}</Text>
        <Text style={styles.subtitle}>Cena: {parking.cenaZaGodzine} PLN / godz.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Zarezerwuj to miejsce</Text>
        
        <Text style={styles.label}>Wybierz swój pojazd:</Text>
        {pojazdy.length === 0 ? (
          <Text style={styles.errorText}>Nie masz dodanych pojazdów! Przejdź do Profilu.</Text>
        ) : (
          <View style={styles.pickerWrapper}>
            {pojazdy.map((p) => (
              <TouchableOpacity 
                key={p._id} 
                style={[styles.vehicleOption, wybranyPojazdId === p._id && styles.vehicleOptionActive]}
                onPress={() => setWybranyPojazdId(p._id)}
              >
                <Text style={wybranyPojazdId === p._id ? styles.vehicleTextActive : styles.vehicleText}>
                  {p.marka} {p.model} ({p.numer_rejestracyjny})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Data i czas przyjazdu:</Text>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity style={styles.dateTimeBtn} onPress={() => showMode('date', 'start')}>
            <Text>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateTimeBtn} onPress={() => showMode('time', 'start')}>
            <Text>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Data i czas wyjazdu:</Text>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity style={styles.dateTimeBtn} onPress={() => showMode('date', 'end')}>
            <Text>{endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateTimeBtn} onPress={() => showMode('time', 'end')}>
            <Text>{endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={target === 'start' ? startDate : endDate}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}

        <TouchableOpacity 
          style={[styles.button, (pojazdy.length === 0) && styles.buttonDisabled]} 
          onPress={handleZarezerwuj}
          disabled={pojazdy.length === 0}
        >
          <Text style={styles.buttonText}>Potwierdź i Rezerwuj</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 16, color: '#2563eb', fontWeight: 'bold', marginTop: 5 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, color: '#4b5563', marginBottom: 8, marginTop: 15, fontWeight: '600' },
  pickerWrapper: { marginBottom: 10 },
  vehicleOption: { padding: 12, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, marginBottom: 8 },
  vehicleOptionActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  vehicleText: { color: '#4b5563' },
  vehicleTextActive: { color: '#2563eb', fontWeight: 'bold' },
  dateTimeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dateTimeBtn: { flex: 0.48, padding: 12, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 5 },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 30, elevation: 2 },
  buttonDisabled: { backgroundColor: '#9ca3af' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});