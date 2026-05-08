import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import api from '../api/axiosConfig';

export default function MapScreen({ navigation }) {
  const [parkings, setParkings] = useState([]);

  useEffect(() => {
    // Pobieranie danych z bazy
    api.get('/parkings')
      .then(response => {
        setParkings(response.data);
      })
      .catch(error => console.error("Błąd pobierania parkingów:", error));
  }, []);

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 50.0121, // Koordynaty Tarnowa
          longitude: 20.9858,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {parkings.map((parking) => (
          <Marker
            key={parking._id}
            coordinate={{ latitude: parking.lat, longitude: parking.lng }}
            title={parking.nazwa}
            description={`${parking.cenaZaGodzine} PLN/h`}
            onCalloutPress={() => navigation.navigate('Ticket', { parkingId: parking._id })}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  map: { 
    width: '100%', 
    height: '100%' 
  },
});