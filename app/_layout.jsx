import { Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from '../config/firebaseConfig';
import '../global.css';

export default function RootLayout() {

  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
    });

    return  unsubscribe
  }, []);

  if (user === undefined) {
    //  Showing spinner
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#2b2b2b' }}>
        <ActivityIndicator size="large" color="#f49b33" />
      </View>
    );
  }

  if (user) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    );
  }

  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" />
    {/* <Stack.Screen name="(tabs)" /> */}
  </Stack>;
}
