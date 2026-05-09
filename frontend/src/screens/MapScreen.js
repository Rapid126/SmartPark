import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import api from '../api/axiosConfig';

export default function MapScreen({ navigation }) {
  const [parkings, setParkings] = useState([]);
  const [viewMode, setViewMode] = useState('map'); // 'map' lub 'list'
  const [selectedParking, setSelectedParking] = useState(null);

  useEffect(() => {
    api.get('/parkings')
      .then(response => setParkings(response.data))
      .catch(error => console.error("Błąd pobierania parkingów:", error));
  }, []);

  const renderParkingList = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listTitle}>{item.nazwa}</Text>
      <Text style={styles.listAddress}>Adres: {item.adres}</Text>
      <Text style={styles.listPrice}>{item.cenaZaGodzine} PLN / h</Text>
      <TouchableOpacity 
        style={styles.reserveButton} 
        onPress={() => navigation.navigate('Ticket', { parking: item })}>
        <Text style={styles.reserveButtonText}>Rezerwuj</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Przełącznik widoku */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]} onPress={() => setViewMode('list')}>
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>Widok Listy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]} onPress={() => setViewMode('map')}>
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>Widok Mapy</Text>
        </TouchableOpacity>
      </View>

      {/* Kontent w zależności od trybu */}
      {viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          <MapView 
            style={styles.map}
            initialRegion={{ latitude: 50.0121, longitude: 20.9858, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
          >
            {parkings.filter(p => p.lat && p.lng).map((parking) => (
              <Marker
                key={parking._id}
                coordinate={{ latitude: parking.lat, longitude: parking.lng }}
                onPress={() => setSelectedParking(parking)}
              />
            ))}
          </MapView>
          
          {/* Dolna karta po kliknięciu markera */}
          {selectedParking && (
            <View style={styles.bottomCard}>
              <Text style={styles.cardTitle}>{selectedParking.nazwa}</Text>
              <Text style={styles.cardSubtitle}>Wolne miejsca: {selectedParking.liczbaMiejsc}</Text>
              <Text style={styles.cardPrice}>{selectedParking.cenaZaGodzine} PLN / h</Text>
              <TouchableOpacity 
                style={styles.reserveButton} 
                onPress={() => navigation.navigate('Ticket', { parking: selectedParking })}>
                <Text style={styles.reserveButtonText}>Rezerwuj</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <FlatList 
          data={parkings}
          keyExtractor={(item) => item._id}
          renderItem={renderParkingList}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  toggleContainer: { flexDirection: 'row', justifyContent: 'center', padding: 15, backgroundColor: '#fff', elevation: 2 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 25, marginHorizontal: 5, borderWidth: 1, borderColor: '#e5e7eb' },
  toggleBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  toggleText: { color: '#4b5563', fontWeight: 'bold' },
  toggleTextActive: { color: '#fff' },
  mapContainer: { flex: 1 },
  map: { width: '100%', height: '100%' },
  bottomCard: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  cardSubtitle: { color: '#10b981', marginTop: 5, fontWeight: 'bold' },
  cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#4b5563', marginVertical: 10 },
  reserveButton: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center' },
  reserveButtonText: { color: '#fff', fontWeight: 'bold' },
  listItem: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 2 },
  listTitle: { fontSize: 18, fontWeight: 'bold' },
  listAddress: { color: '#6b7280', marginVertical: 5 },
  listPrice: { fontWeight: 'bold', fontSize: 16, marginBottom: 15 }
});