import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location';
import mapsIcon from '../../assets/maps.png';
import { Colors } from '../../constants/Colors';

export default function SetLocation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const storedClientId = await AsyncStorage.getItem('clientId');
        if (storedClientId) {
          setClientId(parseInt(storedClientId, 10));
          console.log('ID client récupéré:', storedClientId);
        } else {
          console.warn("Client ID non trouvé dans le stockage.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du client ID :", error);
      }
    };

    fetchClientId();
  }, []);

  const handleSetLocation = async () => {
    try {
      setLoading(true);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'Nous avons besoin de votre permission pour accéder à la localisation',
          [{ text: 'OK' }]
        );
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      let geocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocode[0]) {
        const address = `${geocode[0].city || ''}, ${geocode[0].country || ''}`;
        setLocation(address);
        setCoordinates({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      }
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'obtenir votre localisation");
      console.error('Erreur de localisation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!coordinates || !clientId) {
      Alert.alert('Erreur', 'Aucune localisation disponible ou client ID non trouvé');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('https://c63c-197-234-219-41.ngrok-free.app/api/storelocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          location: location,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          client_id: clientId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Succès', 'Localisation enregistrée avec succès !');
        console.log(data);
        router.push('/auth/check'); // Redirection après le succès
      } else {
        Alert.alert('Erreur', data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', "Impossible d'enregistrer la localisation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialCommunityIcons name="chevron-left" size={30} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Définissez votre localisation</Text>
      <Text style={styles.subtitle}>
        Ces données seront affichées dans le profil de votre compte pour des raisons de sécurité
      </Text>

      <View style={[styles.locationBox, styles.shadow]}>
        <View style={styles.locationRow}>
          <Image source={mapsIcon} style={styles.icon} />
          <Text style={styles.locationText}>{location || 'Votre localisation'}</Text>
        </View>

        <TouchableOpacity
          style={styles.setLocationButton}
          onPress={handleSetLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.vert} />
          ) : (
            <Text style={styles.setLocationText}>Définissez votre localisation</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.nextButton, (!location || loading) && styles.nextButtonDisabled]}
        onPress={handleSaveLocation}
        disabled={!location || loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.nextButtonText}>Enregistrer</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    marginTop: 20,
  },
  title: {
    fontFamily: "AbhayaLibreExtraBold",
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  subtitle: {
    fontFamily: "AbhayaLibreExtraBold",
    fontSize: 17,
    color: '#666',
    marginBottom: 30,
  },
  locationBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    width: 60,
    height: 60,
  },
  locationText: {
    fontFamily: "AbhayaLibreExtraBold",
    fontSize: 20,
    color: '#333',
  },
  setLocationButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.vert,
    padding: 10,
    alignItems: 'center',
  },
  setLocationText: {
    fontFamily: "AbhayaLibreExtraBold",
    color: Colors.vert,
    fontSize: 18,
  },
  nextButton: {
    backgroundColor: Colors.vert,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 20,
  },
});
