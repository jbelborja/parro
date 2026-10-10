import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { categories } from '../config/categories';
import CategoryToggle from '../components/CategoryToggle';

export default function SettingsScreen() {
  const openWebsite = async () => {
    await WebBrowser.openBrowserAsync('https://jbelborja.github.io/parro/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuración de Notificaciones</Text>
        <Text style={styles.subtitle}>
          Elige los temas sobre los que deseas recibir avisos en tu móvil cuando se publique nuevo contenido en la web.
        </Text>
      </View>

      <View style={styles.list}>
        {categories.map((cat) => (
          <CategoryToggle key={cat.id} category={cat} />
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Sobre las notificaciones</Text>
        <Text style={styles.infoText}>
          Las notificaciones se envían de forma automática cuando el sitio web de la parroquia se actualiza con nuevas noticias, lecturas o actividades.
        </Text>
      </View>

      <TouchableOpacity style={styles.footer} onPress={openWebsite}>
        <Text style={styles.footerText}>🌐 Visitar web de la Parroquia</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5B2C6F',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#4A235A',
    lineHeight: 20,
  },
  list: {
    marginBottom: 25,
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#8E44AD',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5B2C6F',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    backgroundColor: '#5B2C6F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
