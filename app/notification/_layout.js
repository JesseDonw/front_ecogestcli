import { useRouter, Stack, Link } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function NotifLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTitleStyle: {
          fontFamily: "AbhayaLibreExtraBold",
          fontSize: 25,
        },
        headerLeft: () => (
          <Link href="/home" style={styles.wrapperBack}>
            <Entypo
              name="chevron-left"
              size={26}
              color={Colors.orange_foncer}
              style={styles.iconBack}
            />
          </Link>
        ),
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="notif"
        options={{
          title: "Notification",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  wrapperBack: {
    backgroundColor: Colors.orange + "50",
    padding: 8,
    marginLeft: 8,
    borderRadius: 14,
  },
  iconBack: {
    alignSelf: "center",
  },
});
