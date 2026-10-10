import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import { setupNotificationHandlers } from './src/services/notifications';

export default function App() {
  useEffect(() => {
    // Configurar el comportamiento de notificaciones al montar la app
    const cleanup = setupNotificationHandlers();
    
    return () => {
      // Limpiar listeners al desmontar
      cleanup();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5EEF8" />
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
});
