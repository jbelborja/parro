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
import { colors, shadows, radius, typography } from './src/theme';

const { width } = Dimensions.get('window');

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'settings'

  useEffect(() => {
    requestPermissions().catch(err => console.warn('Error pidiendo permisos:', err));
    const cleanup = setupNotificationHandlers();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header — equivalente a .site-header de la web */}
      <View style={styles.topBar}>
        {/* Logo — mismo tratamiento que .logo-container img (height: 48px en web) */}
        <View style={styles.logoRow}>
          <Image
            source={require('./assets/logo.png')}
            style={styles.bigLogo}
            resizeMode="contain"
          />
        </View>

        {/* Nav tabs — equivalentes a .main-nav a de la web */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={[styles.navItem, currentScreen === 'home' && styles.navItemActive]}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={[styles.navItemText, currentScreen === 'home' && styles.navItemTextActive]}>
              Contenidos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentScreen === 'settings' && styles.navItemActive]}
            onPress={() => setCurrentScreen('settings')}
          >
            <Text style={[styles.navItemText, currentScreen === 'settings' && styles.navItemTextActive]}>
              Notificaciones
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentArea}>
        {currentScreen === 'home' ? <HomeScreen /> : <SettingsScreen />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  // .site-header: white bg, bottom border, shadow-sm, sticky
  topBar: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },

  // .logo-container: centered, padding equivalente al header-inner
  logoRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bigLogo: {
    width: Math.min(width - 40, 380),
    height: 48,   // igual que height: 48px de .logo-container img en la web
  },

  // .main-nav: barra de pestañas con estilo de nav links
  navBar: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingBottom: 0,
  },

  // equivalente a .main-nav a (padding 8px 13px, border-radius --radius-md)
  navItem: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginHorizontal: 2,
    borderRadius: 0,
  },
  navItemActive: {
    borderBottomColor: colors.accent,   // --accent: #3b82f6
  },

  // font-size: 0.92rem, font-weight: 500, color: --text-color
  navItemText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  navItemTextActive: {
    color: colors.accent,
    fontWeight: typography.weights.semibold,
  },

  // main { background: --bg-color }
  contentArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
