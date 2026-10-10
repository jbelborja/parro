import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { categories } from '../config/categories';
import CategoryToggle from '../components/CategoryToggle';
import { requestPermissions } from '../services/notifications';

export default function HomeScreen() {
  useEffect(() => {
    // Pedir permisos de notificaciones al abrir la app
    requestPermissions().then(granted => {
      if (!granted) {
        console.warn('Permisos de notificación denegados');
      }
    });
  }, []);

  const openWebsite = async () => {
    await WebBrowser.openBrowserAsync('https://jbelborja.github.io/parro/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        <Text style={styles.title}>Parroquia Ntra. Sra. de la Vid</Text>
        <Text style={styles.subtitle}>Notificaciones</Text>
        
        <Text style={styles.explanation}>
          Selecciona qué contenidos quieres recibir en tu móvil. Te enviaremos una notificación cuando haya novedades.
        </Text>
      </View>

      <View style={styles.list}>
        {categories.map((cat) => (
          <CategoryToggle key={cat.id} category={cat} />
        ))}
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
    backgroundColor: '#F5EEF8', // Tono violeta claro (background)
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
    borderRadius: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5B2C6F', // Púrpura principal
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#8E44AD',
    marginBottom: 16,
  },
  explanation: {
    fontSize: 15,
    textAlign: 'center',
    color: '#4A235A',
    lineHeight: 22,
  },
  list: {
    marginBottom: 30,
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
  }
});
