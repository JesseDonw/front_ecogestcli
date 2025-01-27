import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, FlatList, Pressable, KeyboardAvoidingView, Platform, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserCard from '../../component/UserCard';
import RenderItemchat from "../../component/RenderItemchat";
import Feather from '@expo/vector-icons/Feather';
import { Colors } from "../../constants/Colors";
import { fetchMessages, sendMessageToAPI, startConversation } from '../../component/chatService';

export default function Discussion() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [loading, setLoading] = useState(true);
  

  // Fonction pour récupérer l'ID du client depuis AsyncStorage
  const getClientIdFromStorage = async () => {
    try {
      const storedClientId = await AsyncStorage.getItem('clientId');
      if (storedClientId) {
        setClientId(parseInt(storedClientId, 10));
      } else {
        console.warn("Client ID non trouvé dans le stockage.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du client ID :", error);
    }
  };

  // Fonction pour charger les messages
  const loadMessages = async (convId) => {
    try {
      const chatMessages = await fetchMessages(convId);
      const formattedMessages = chatMessages
        .filter(msg => msg && msg.message && msg.sender_type)
        .map(msg => ({
          id: msg.id?.toString() || Math.random().toString(),
          text: msg.message || 'Message non disponible',
          sender: msg.sender_type === 'client' ? 'Client' : 'Admin',
        }));

      // Trier les messages du plus ancien au plus récent
      setMessages(formattedMessages.sort((a, b) => parseInt(a.id) - parseInt(b.id)));
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initConversation = async () => {
      try {
        await getClientIdFromStorage(); // Récupérer clientId

        if (clientId) {
          const conversation = await startConversation(clientId);
          setConversationId(conversation.id);
          await loadMessages(conversation.id);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de la conversation :", error);
      } finally {
        setLoading(false);
      }
    };

    initConversation();

    // Met en place un intervalle pour vérifier les nouveaux messages toutes les 5 secondes
    const intervalId = setInterval(() => {
      if (conversationId) {
        loadMessages(conversationId);
      }
    }, 5000);

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(intervalId);
  }, [conversationId, clientId]);

  const sendMessage = async () => {
    if (message.trim() && conversationId && clientId) {
      const newMessage = {
        id: Math.random().toString(),
        text: message,
        sender: 'Client',
      };

      // Ajouter localement le message en attendant la réponse de l'API
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      try {
        await sendMessageToAPI(conversationId, clientId, 'client', message);
        setMessage('');
        loadMessages(conversationId); // Recharge immédiatement après envoi
      } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
      }
    } else {
      console.warn("Message vide ou client ID/conversation ID non défini.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 100}
    >
      <View style={styles.innerContainer}>
        <UserCard imageUrl={undefined} name="Bruno" isOnline={true} />
        
        <View style={styles.chatWrapper}>
          {loading ? (
            <Text style={styles.loadingText}>Chargement des messages...</Text>
          ) : messages.length === 0 ? (
            <Text style={styles.noMessageText}>Aucun message pour l'instant.</Text>
          ) : (
            <FlatList
              data={messages}
              renderItem={({ item }) => item && <RenderItemchat item={item} />}
              keyExtractor={(item) => item?.id || Math.random().toString()}
            />
          )}

          <View style={[styles.inputContainer, styles.shadow]}>
            <TextInput
              autoFocus={true}
              multiline
              numberOfLines={4}
              selectionColor={Colors.vert}
              value={message}
              onChangeText={setMessage}
              placeholder="Écrire un message..."
              style={styles.input}
            />
            <Pressable 
              android_ripple={{ color: Colors.vert + "50", foreground: true }} 
              onPress={sendMessage} 
              style={styles.sender}
            >
              <Feather name="send" size={24} color={Colors.vert} />
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  chatWrapper: {
    flex: 1,
    padding: 10,
    width: "100%",
    overflow: "hidden",
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 22,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontFamily: "AbhayaLibreRegular",
    fontSize: 16,
    borderColor: "transparent",
  },
  sender: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 50,
    overflow: "hidden",
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: Colors.vert,
  },
  noMessageText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Colors.rouge,
  },
});
