import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { setupNotificationHandlers, requestPermissions } from './src/services/notifications';

const { width } = Dimensions.get('window');

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'settings'

  useEffect(() => {
    // Pedir permisos de notificaciones al inicio
    requestPermissions().catch(err => console.warn('Error pidiendo permisos:', err));

    // Configurar listeners de notificaciones push
    const cleanup = setupNotificationHandlers();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Cabecera común con logo grande y título */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <Image
            source={require('./assets/logo.png')}
            style={styles.bigLogo}
            resizeMode="contain"
          />
        </View>

        {/* Barra de navegación superior / tabs principales */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={[styles.navItem, currentScreen === 'home' && styles.navItemActive]}
            onPress={() => setCurrentScreen('home')}
          >
            <Text
              style={[
                styles.navItemText,
                currentScreen === 'home' && styles.navItemTextActive,
              ]}
            >
              📰 Contenidos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentScreen === 'settings' && styles.navItemActive]}
            onPress={() => setCurrentScreen('settings')}
          >
            <Text
              style={[
                styles.navItemText,
                currentScreen === 'settings' && styles.navItemTextActive,
              ]}
            >
              🔔 Notificaciones
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vista de pantalla activa */}
      <View style={styles.contentArea}>
        {currentScreen === 'home' ? <HomeScreen /> : <SettingsScreen />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8DAEF',
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  logoRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  bigLogo: {
    width: Math.min(width - 32, 420),
    height: 75,
  },
  navBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  navItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  navItemActive: {
    borderBottomColor: '#5B2C6F',
  },
  navItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#888',
  },
  navItemTextActive: {
    color: '#5B2C6F',
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
});
