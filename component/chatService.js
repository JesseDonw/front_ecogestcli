import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'https://ecogest-e4b9c843b0a7.herokuapp.com/api';
const ADMIN_ID = 1;  
const ADMIN_TYPE = 'App\\Models\\Administrateur';
const CLIENT_TYPE = 'App\\Models\\Client';

// Fonction pour envoyer un message du client vers l'administrateur
export const sendMessageToAPI = async (clientId, content) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('Token non trouvé dans AsyncStorage');


    console.log("Token récupéré :", token);


    const response = await axios.post(`${API_URL}/send-message`, {
      sender_id: clientId,
      sender_type: CLIENT_TYPE,
      receiver_id: ADMIN_ID,
      receiver_type: ADMIN_TYPE,
      content: content,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },

      
    });


    console.log("Envoi du message avec headers :", {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    });

    console.log("Message envoyé avec succès:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error.response ? error.response.data : error.message);
    throw error;
  }
};


// Fonction pour récupérer les messages entre le client et l'administrateur

export const fetchMessages = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');  // Récupération du token
    if (!token) {
      throw new Error('Token non trouvé dans AsyncStorage');
    }

    console.log("Token utilisé pour l'authentification:", token);  // Vérification du token

    const response = await axios.get(`${API_URL}/fetch-messages`, {
      params: {
        with_id: 1,
        with_type: 'App\\Models\\Administrateur',
      },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,  // Assurez-vous que le token est bien dans l'en-tête
      },
    });

    console.log("Messages récupérés:", response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error.response ? error.response.data : error.message);
    return [];
  }
};