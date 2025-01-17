import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import logo from '../../assets/logo.png';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import person from '../../assets/pers.png';
import mail from '../../assets/mail.png';
import lock from '../../assets/lock.png';
import { Colors } from '../../constants/Colors';
import CustomError from '../../component/CustomError';
import axios from 'axios';

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState({
    nom: false,
    prenom: false,
    email: false,
    password: false,
  });

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  useEffect(() => {
    if (nom) {
      setError((e) => ({
        ...e,
        nom: false,
      }));
    }
  }, [nom]);

  useEffect(() => {
    if (prenom) {
      setError((e) => ({
        ...e,
        prenom: false,
      }));
    }
  }, [prenom]);

  useEffect(() => {
    if (email) {
      setError((e) => ({
        ...e,
        email: false,
      }));
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      setError((e) => ({
        ...e,
        password: false,
      }));
    }
  }, [password]);

  const verifiedForm = () => {
    const newErrors = {};

    if (!nom?.trim()) {
      newErrors.nom = true;
    }

    if (!prenom?.trim()) {
      newErrors.prenom = true;
    }

    if (email?.trim()) {
      if (!validateEmail(email.trim())) {
        newErrors.email = true;
      }
    } else {
      newErrors.email = true;
    }

    if (!password?.trim()) {
      newErrors.password = true;
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    try {
      if (verifiedForm()) {
        setLoading(true);
        const data = {
          nom_client: nom?.trim(),
          prenom_client: prenom?.trim(),
          mail_client: email?.trim(),
          mdp_client: password?.trim(),
        };

        console.log('data :>> ', data);

        // Assurez-vous d'utiliser l'URL correcte pour l'API
        const response = await axios.post('https://f8fe-197-234-223-210.ngrok-free.app/api/registercli', data);

        console.log('client créé avec succès :>> ', response.data);
        router.replace('/auth/location');
      }
    } catch (error) {
      console.log('Erreur :>> ', error.response ? error.response.data : error.message);
      if (error.response && error.response.data.errors) {
        // Gérez les erreurs spécifiques renvoyées par le back-end ici
        setError({
          nom: error.response.data.errors.nom_client || false,
          prenom: error.response.data.errors.prenom_client || false,
          email: error.response.data.errors.mail_client || false,
          password: error.response.data.errors.mdp_client || false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        
        <Image
          source={logo}
          style={styles.logo}
        />
         <Text style={styles.title}>Remplissez votre bio pour commencer</Text>

        {/* Champ Nom */}
        <View style={styles.viewInputError}>
          <View style={[styles.inputContainer, styles.shadow]}>
            
            <TextInput
              style={styles.input}
              selectionColor={Colors.vert}
              placeholder="Nom"
              value={nom}
              onChangeText={(text) => setNom(text)}
            />
          </View>
          {error.nom && <CustomError />}
        </View>

        {/* Champ Prénom */}
        <View style={styles.viewInputError}>
          <View style={[styles.inputContainer, styles.shadow]}>
            
            <TextInput
              style={styles.input}
              selectionColor={Colors.vert}
              placeholder="Prénom"
              value={prenom}
              onChangeText={(text) => setPrenom(text)}
            />
          </View>
          {error.prenom && <CustomError />}
        </View>

        {/* Champ Email */}
        <View style={styles.viewInputError}>
          <View style={[styles.inputContainer, styles.shadow]}>
            
            <TextInput
              style={styles.input}
              selectionColor={Colors.vert}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          {error.email && <CustomError />}
        </View>

        {/* Champ Password */}
        <View style={styles.viewInputError} >
          <View style={[styles.passwordContainer, styles.shadow]}>
           
            <TextInput
              style={styles.passwordInput}
              selectionColor={Colors.vert}
              placeholder="Password"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              {passwordVisible ? (
                <MaterialCommunityIcons name="eye-off" size={24} color="black" />
              ) : (
                <MaterialCommunityIcons name="eye" size={24} color="black" />
              )}
            </TouchableOpacity>
          </View>
          {error.password && <CustomError />}
        </View>

        <TouchableOpacity style={styles.createButton} onPress={() => loading ? null : handleSignup()}>
          {loading ? (
            <ActivityIndicator color={Colors.vert} />
          ) : (
            <Text style={styles.createButtonText}>Suivant</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/signin')}>
          <Text style={styles.linkText}>Avez-vous déjà un compte ?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 350,
    height: 180,
    marginBottom: 20,

  },
  title: {
    fontFamily: "AbhayaLibreExtraBold",
    fontSize: 25,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },

  person: {
    width: 40,
    height: 40,
    marginRight: -10,
  },

  mail: {
    width: 40,
    height: 40,
    marginRight: -10,
  },

  lock: {
    width: 40,
    height: 40,
    marginRight: -10,
  },

  input: {
    fontFamily: "AbhayaLibreExtraBold",
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,


  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 0.2,
    borderRadius: 15,
    width: '100%',
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 0.2,
    borderRadius: 15,

    width: '100%',
    backgroundColor: '#ffffff',
  },
  passwordInput: {
    fontFamily: "AbhayaLibreExtraBold",
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,

  },

  shadow: {
    // Shadow properties for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,

    // Shadow properties for Android
    elevation: 20,
  },

  eyeIcon: {
    paddingHorizontal: 10,
  },
  createButton: {
    backgroundColor: Colors.vert,
    width: 'auto',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingHorizontal: 25,
    marginTop: 20,
  },

  createButtonText: {
    fontFamily: "AbhayaLibreExtraBold",
    color: '#fff',
    fontSize: 18,
  },
  linkText: {
    fontFamily: "AbhayaLibreExtraBold",
    color: '#008000',
    textDecorationLine: 'underline',
    marginTop: 30,
    fontSize: 14,
  },
  viewInputError: {
    marginBottom: 5,

  },
});

