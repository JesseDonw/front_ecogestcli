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

const GOOGLE_MAPS_API_KEY = "AIzaSyBTTAnxDhoifYOBsxW_C7ZyfmpU8LJMbT4";

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
          console.log('✅ ID client récupéré:', storedClientId);
        } else {
          console.warn("⚠️ Client ID non trouvé dans le stockage.");
        }
      } catch (error) {
        console.error("❌ Erreur lors de la récupération du client ID :", error);
      }
    };

    fetchClientId();
  }, []);

  // 📍 Fonction pour récupérer la localisation avec précision
  const handleSetLocation = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à la localisation');
        setLoading(false);
        return;
      }
  
      // Demande de localisation avec la meilleure précision possible
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,  // Utilisation d'une précision plus fine
      });
  
      // Vérification de la précision, si elle est insuffisante (par exemple, supérieure à 10m)
      if (coords.accuracy > 10) {
        console.log('Précision approximative (supérieure à 10m). La localisation continue malgré tout.');
      }
  
      const { latitude, longitude } = coords;
      setCoordinates({ latitude, longitude });
      await fetchLocationData(latitude, longitude);
  
    } catch (error) {
      console.error('❌ Erreur de localisation:', error);
      Alert.alert('Erreur', "Impossible d'obtenir votre localisation.");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  // 🔍 Fonction pour récupérer les détails de localisation via Google Maps et OpenStreetMap
  const fetchLocationData = async (latitude, longitude) => {
    try {
      console.log(`📡 Récupération des données pour lat:${latitude}, lon:${longitude}`);
    
      const googleResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const googleData = await googleResponse.json();
    
      const osmResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`, {
        headers: { 'User-Agent': 'ReactNativeApp' }
      });
      const osmData = await osmResponse.json();
    
      if (!osmData || !osmData.address) {
        throw new Error("Erreur avec OpenStreetMap API");
      }
    
      const quartierGoogle = googleData.results[0]?.address_components.find(comp => comp.types.includes('sublocality'))?.long_name || '';
      const quartierOSM = osmData.address?.neighbourhood || osmData.address?.suburb || 'Quartier inconnu';
      const finalQuartier = quartierGoogle || quartierOSM;
    
      const villeGoogle = googleData.results[0]?.address_components.find(comp => comp.types.includes('locality'))?.long_name || '';
      const villeOSM = osmData.address?.city || osmData.address?.town || 'Ville inconnue';
      const finalVille = villeGoogle || villeOSM;
    
      const paysGoogle = googleData.results[0]?.address_components.find(comp => comp.types.includes('country'))?.long_name || '';
      const paysOSM = osmData.address?.country || '';
      const finalPays = paysGoogle || paysOSM || 'Pays inconnu';
    
      const fullLocation = `${finalQuartier}, ${finalVille}, ${finalPays}`;
      setLocation(fullLocation);
    
      console.log(`📍 Localisation ultra-précise : ${fullLocation}`);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données de localisation:', error);
      Alert.alert("Erreur", error.message);
    }
  };
  

  // 🗖️ Enregistrement de la localisation
  const handleSaveLocation = async () => {
    if (!coordinates || !clientId) {
      Alert.alert('Erreur', 'Aucune localisation disponible ou client ID non trouvé');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://ecogest1-69586dbc1b71.herokuapp.com/api/storelocation', {
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
        console.log(data);
        router.push('/auth/check');
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
      {/* Bouton de retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialCommunityIcons name="chevron-left" size={30} color="black" />
      </TouchableOpacity>

      {/* Titre et description */}
      <Text style={styles.title}>Définissez votre localisation</Text>
      

      {/* Affichage de la localisation */}
      <View style={[styles.locationBox, styles.shadow]}>
        <View style={styles.locationRow}>
          <Image source={mapsIcon} style={styles.icon} />
          <Text style={styles.locationText}>{location || 'Votre localisation'}</Text>
        </View>

        {/* Bouton pour définir la localisation */}
        <TouchableOpacity style={styles.setLocationButton} onPress={handleSetLocation} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.vert} /> : <Text style={styles.setLocationText}>Définissez votre localisation</Text>}
        </TouchableOpacity>
      </View>

      {/* Bouton Enregistrer */}
      <TouchableOpacity style={[styles.nextButton, (!location || loading) && styles.nextButtonDisabled]} onPress={handleSaveLocation} disabled={!location || loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.nextButtonText}>Enregistrer</Text>}
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
    padding: 10,
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