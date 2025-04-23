import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { useEffect } from "react";
import { initDatabase } from "@/lib/database";

export default function RootLayout() {
  
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="books/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
