import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { categories } from '../config/categories';
import CategoryToggle from '../components/CategoryToggle';
import { colors, shadows, radius, typography } from '../theme';

export default function SettingsScreen() {
  const openWebsite = async () => {
    await WebBrowser.openBrowserAsync('https://la-vid.org');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Cabecera — similar a .content-wrapper h2 en la web */}
      <View style={styles.header}>
        <Text style={styles.title}>Notificaciones</Text>
        <Text style={styles.subtitle}>
          Elige los temas sobre los que deseas recibir avisos cuando se publique nuevo contenido en la web.
        </Text>
      </View>

      {/* Lista de categorías — .module-card equivalente */}
      <View style={styles.list}>
        {categories.map((cat) => (
          <CategoryToggle key={cat.id} category={cat} />
        ))}
      </View>

      {/* Info box — equivalente al cuadro PDF con borde izquierdo azul */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Sobre las notificaciones</Text>
        <Text style={styles.infoText}>
          Las notificaciones se envían automáticamente cuando el sitio web de la parroquia publica nuevas noticias, lecturas o actividades.
        </Text>
      </View>

      {/* Botón de enlace a la web — .footer-col a / accent button */}
      <TouchableOpacity style={styles.webButton} onPress={openWebsite}>
        <Text style={styles.webButtonText}>Visitar web de la Parroquia →</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // Cabecera — color --primary, font-weight 700, igual que .module-card h2
  header: {
    marginBottom: 22,
    paddingTop: 4,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.text,
    lineHeight: typography.lineHeight.normal,
  },

  list: {
    marginBottom: 22,
  },

  // Info box — similar a PDF links: fondo azul tenue, borde izquierdo --accent
  infoBox: {
    backgroundColor: '#eff6ff',    // blue-50 — igual que el fondo PDF en la web
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 22,
  },
  infoTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginBottom: 6,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    lineHeight: typography.lineHeight.normal,
  },

  // Botón web — equivalente al botón primary de la web (--accent bg)
  webButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    alignItems: 'center',
    ...shadows.md,
  },
  webButtonText: {
    color: colors.white,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
});
