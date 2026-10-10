import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subscribeToTopic, unsubscribeFromTopic } from '../services/notifications';

export default function CategoryToggle({ category }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const { id, label, description, icon, topic } = category;
  
  const storageKey = `@subscription_${id}`;

  // Cargar estado inicial desde AsyncStorage
  useEffect(() => {
    const loadState = async () => {
      try {
        const value = await AsyncStorage.getItem(storageKey);
        if (value !== null) {
          setIsEnabled(value === 'true');
        }
      } catch (e) {
        console.error('Error cargando estado de AsyncStorage', e);
      }
    };
    loadState();
  }, [storageKey]);

  // Cambiar estado y suscribirse/desuscribirse
  const toggleSwitch = async (newValue) => {
    setIsEnabled(newValue);

    try {
      if (newValue) {
        await subscribeToTopic(topic);
        await AsyncStorage.setItem(storageKey, 'true');
      } else {
        await unsubscribeFromTopic(topic);
        await AsyncStorage.setItem(storageKey, 'false');
      }
    } catch (e) {
      console.error('Error cambiando el estado del topic', e);
      setIsEnabled(!newValue); // Revertir en caso de error
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      <Switch
        trackColor={{ false: '#D2B4DE', true: '#5B2C6F' }}
        thumbColor={isEnabled ? '#FFFFFF' : '#f4f3f4'}
        ios_backgroundColor="#D2B4DE"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 28,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5B2C6F',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});
