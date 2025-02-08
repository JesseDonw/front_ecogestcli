import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ordure from '../../assets/ordure.jpg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ProfilCard from '../../component/ProfilCard';
import { Colors } from '../../constants/Colors';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
        <ProfilCard
          welText="Bienvenue!"
        />
       
      <ScrollView contentContainerStyle= {styles.ScrollViews} showsVerticalScrollIndicator = {false} >
        {/* Header Section */}
      

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" />
          <Text style={styles.searchText}>Que voulez-vous savoir ?</Text>
          <TouchableOpacity onPress={() => router.push('/notification/notif')} style={styles.notificationIcon}>
            <Ionicons name="notifications" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Banner Section */}
        <View style={styles.bannerContainer}>
           <Image
                    source={ordure}
                    style={styles. ordures}
                  />
        </View>

        {/* Information Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Pourquoi trier les déchets ?</Text>
            <Text style={styles.infoDescription}>
              Trier les déchets aide à recycler, réduire la pollution et économiser des ressources naturelles.
            </Text>
            <TouchableOpacity style={styles.learnMoreButton}>
              <Text style={styles.learnMoreText}>En savoir plus</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Limiter les déchets</Text>
            <Text style={styles.infoDescription}>
              Réduisez les déchets en adoptant des pratiques éco-responsables comme le compostage.
            </Text>
            <TouchableOpacity style={styles.learnMoreButton}>
              <Text style={styles.learnMoreText}>En savoir plus</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Progrès de la communauté</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '75%' }]}></View>
          </View>
          <Text style={styles.progressText}>75% des objectifs atteints</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 20,
    backgroundColor: '#F5F5F5',
  },

  ScrollViews:{
  
    alignItems:"center",
  },

  ordures:{
    resizeMode:"contain"
  },

 
  welcomeText: {
    fontSize: 18,
    color: '#2E8B57',
    fontWeight: '600',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  notificationIcon: {
    marginLeft: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 20,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    justifyContent: 'space-between',  // Ensures space between the elements inside the search bar
  },
  searchText: {
    marginLeft: 10,
    color: '#888',
    fontSize: 16,
    flex: 1,  // Ensures the search text takes up available space
  },
  bannerContainer: {
    //marginHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gris_foncer,
    aspectRatio:1/1,
    width:350,
    
  },
  infoSection: {
    margin: 10,
  },
  infoCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  learnMoreButton: {
    alignSelf: 'flex-start',
    padding: 10,
    backgroundColor: '#2E8B57',
    borderRadius: 5,
  },
  learnMoreText: {
    color: '#FFF',
    fontSize: 14,
  },
  progressSection: {
    margin: 10,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignSelf:"stretch"
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#EEE',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2E8B57',
  },
  progressText: {
    fontSize: 14,
    color: '#555',
  },
});

export default HomeScreen;
