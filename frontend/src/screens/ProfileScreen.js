import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import api from '../api/axiosConfig';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('rezerwacje');
  const [rezerwacje, setRezerwacje] = useState([]);
  const [pojazdy, setPojazdy] = useState([]);
  
  // Stany dla formularza nowego pojazdu
  const [marka, setMarka] = useState('');
  const [model, setModel] = useState('');
  const [rejestracja, setRejestracja] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'rezerwacje') {
        const res = await api.get('/rezerwacje/moje');
        setRezerwacje(res.data);
      } else {
        const res = await api.get('/pojazdy');
        setPojazdy(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDodajPojazd = async () => {
    try {
      await api.post('/pojazdy', { marka, model, rejestracja });
      Alert.alert('Sukces', 'Pojazd dodany!');
      setMarka(''); setModel(''); setRejestracja('');
      fetchData(); // Odśwież listę
    } catch (err) {
      Alert.alert('Błąd', err.response?.data?.message || 'Błąd dodawania pojazdu');
    }
  };

  const renderRezerwacja = ({ item }) => (
    <View style={styles.cardItem}>
      <Text style={styles.cardTitle}>{item.parkingId?.nazwa || 'Nieznany parking'}</Text>
      <Text style={styles.cardText}>Od: {new Date(item.dataOd).toLocaleDateString()} {new Date(item.dataOd).toLocaleTimeString()}</Text>
      <Text style={styles.cardText}>Do: {new Date(item.dataDo).toLocaleDateString()} {new Date(item.dataDo).toLocaleTimeString()}</Text>
      <Text style={[styles.status, item.status === 'aktywna' ? styles.statusActive : styles.statusInactive]}>Status: {item.status.toUpperCase()}</Text>
    </View>
  );

  const renderPojazd = ({ item }) => (
    <View style={styles.cardItem}>
      <Text style={styles.cardTitle}>{item.marka} {item.model}</Text>
      <Text style={styles.cardText}>Rejestracja: {item.numer_rejestracyjny}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Menu Zakładek */}
      <View style={styles.sidebar}>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'rezerwacje' && styles.tabBtnActive]} onPress={() => setActiveTab('rezerwacje')}>
          <Text style={[styles.tabText, activeTab === 'rezerwacje' && styles.tabTextActive]}>Moje Rezerwacje</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'pojazdy' && styles.tabBtnActive]} onPress={() => setActiveTab('pojazdy')}>
          <Text style={[styles.tabText, activeTab === 'pojazdy' && styles.tabTextActive]}>Moje Pojazdy</Text>
        </TouchableOpacity>
      </View>

      {/* Zawartość */}
      <View style={styles.content}>
        <Text style={styles.headerTitle}>{activeTab === 'rezerwacje' ? 'Twoje Rezerwacje' : 'Twoje Pojazdy'}</Text>
        
        {activeTab === 'pojazdy' && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Dodaj nowy pojazd</Text>
            <TextInput style={styles.input} placeholder="Marka (np. Toyota)" value={marka} onChangeText={setMarka} />
            <TextInput style={styles.input} placeholder="Model (np. Yaris)" value={model} onChangeText={setModel} />
            <TextInput style={styles.input} placeholder="Nr rej. (np. WA12345)" value={rejestracja} onChangeText={setRejestracja} autoCapitalize="characters" />
            <TouchableOpacity style={styles.addButton} onPress={handleDodajPojazd}>
              <Text style={styles.addButtonText}>Dodaj</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList 
          data={activeTab === 'rezerwacje' ? rezerwacje : pojazdy}
          keyExtractor={item => item._id}
          renderItem={activeTab === 'rezerwacje' ? renderRezerwacja : renderPojazd}
          ListEmptyComponent={<Text style={styles.emptyText}>Brak danych do wyświetlenia.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column', backgroundColor: '#f9fafb' },
  sidebar: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, elevation: 2 },
  tabBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  tabBtnActive: { backgroundColor: '#eff6ff' },
  tabText: { color: '#4b5563', fontWeight: 'bold' },
  tabTextActive: { color: '#2563eb' },
  content: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#111827' },
  formCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
  formTitle: { fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, marginBottom: 10 },
  addButton: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  cardItem: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  cardText: { color: '#6b7280', marginTop: 2 },
  status: { marginTop: 10, fontWeight: 'bold', fontSize: 12 },
  statusActive: { color: '#10b981' },
  statusInactive: { color: '#ef4444' },
  emptyText: { textAlign: 'center', color: '#6b7280', marginTop: 20 }
});