import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import logo from '../../assets/logo.png';
import facebook from '../../assets/facebook.png';
import google from '../../assets/google.png';
import { Colors } from '../../constants/Colors'
import CustomError from '../../component/CustomError';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Pour le stockage du token

export default function Signin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({
        email: false,
        password: false,
    });

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    useEffect(() => {
        if(email){
            setError((e) => ({
                ...e,
                email: false
            }))
        }
    }, [email]);

    useEffect(() => {
        if(password){
            setError((e) => ({
                ...e,
                password: false
            }))
        }
    }, [password]);

    const verifiedForm = () => {
        const newErrors = {};
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

    const handleSignin = async () => {
        try {
            if (verifiedForm()) {
                setLoading(true);
                const data = {
                    mail_client: email?.trim(),
                    mdp_client: password?.trim(),
                };
                console.log('data :>> ', data);

                // Envoi de la requête à l'API
                const response = await axios.post('https://f8fe-197-234-223-210.ngrok-free.app/api/logincli', data);

                console.log('connecté :>> ', response.data);

                // Si la connexion est réussie, on sauvegarde le token
                if (response.data.token) {
                    await AsyncStorage.setItem('userToken', response.data.token); // Stockage du token
                    router.replace("/home");
                } else {
                    Alert.alert('Erreur', 'Token non trouvé');
                }
            }
        } catch (error) {
            console.log('error :>> ', error);
            Alert.alert('Erreur', 'Identifiants incorrects ou problème avec le serveur');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={logo}
                style={styles.logo}
            />

            <Text style={styles.title}>Connectez-vous à votre compte</Text>

            <View
                style={[styles.inputContainer, styles.shadow]}
            >
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    selectionColor={Colors.vert}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                {error.email && <CustomError />}
            </View>
            <View
                style={[styles.inputContainer, styles.shadow]}
            >
                <TextInput
                    selectionColor={Colors.vert}
                    style={[styles.input]}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                {error.password && <CustomError />}
            </View>
            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => loading ? null : handleSignin()}
            >
                {loading ?
                    <ActivityIndicator color={Colors.vert} />
                    :
                    <Text style={styles.loginButtonText}>Se connecter</Text>
                }
            </TouchableOpacity>
            <Text style={styles.orText}>Ou continuer avec </Text>
            <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton}>
                    <Image
                        source={facebook}
                        style={styles.facebook}
                    />
                    <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Image
                        source={google}
                        style={styles.google}
                    />
                    <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                <Text style={styles.linkText}>Créer un compte</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.linkText}>Mot de passe oublié</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    facebook: {
        width: 25,
        height: 25,
    },

    google: {
        width: 25,
        height: 25,
    },

    logo: {
        width: 350,
        height: 190,
        marginBottom: 0,
    },
    title: {
        fontFamily: "AbhayaLibreExtraBold",
        fontSize: 20,
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        height: 50,
        borderRadius: 15,
        marginBottom: 20,
    },
    input: {
        fontFamily: "AbhayaLibreExtraBold",
        backgroundColor: '#ffffff',
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 0.2,
        borderRadius: 15,
        paddingHorizontal: 20,
    },

    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 20,
    },

    loginButton: {
        backgroundColor: Colors.vert,
        width: 'auto',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        paddingHorizontal: 25,
        marginTop: 10
    },
    loginButtonText: {
        fontFamily: "AbhayaLibreExtraBold",
        color: '#fff',
        fontSize: 18,
    },
    orText: {
        fontFamily: "AbhayaLibreExtraBold",
        fontSize: 14,
        marginVertical: 30,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    socialButton: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        width: '45%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: 15,
        borderColor: 'grey',
        borderWidth: 0.2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    socialButtonText: {
        fontFamily: "AbhayaLibreExtraBold",
        color: '#000',
        fontSize: 16,
    },
    linkText: {
        fontFamily: "AbhayaLibreExtraBold",
        color: '#008000',
        textDecorationLine: 'underline',
        marginTop: 10,
        fontSize: 14,
    },
});
