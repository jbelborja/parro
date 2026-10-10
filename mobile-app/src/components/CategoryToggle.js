import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subscribeToTopic, unsubscribeFromTopic } from '../services/notifications';
import { colors, shadows, radius, typography } from '../theme';

export default function CategoryToggle({ category }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const { id, label, description, icon, topic } = category;
  const storageKey = `@subscription_${id}`;

  useEffect(() => {
    const loadState = async () => {
      try {
        const value = await AsyncStorage.getItem(storageKey);
        if (value !== null) setIsEnabled(value === 'true');
      } catch (e) {
        console.error('Error cargando estado de AsyncStorage', e);
      }
    };
    loadState();
  }, [storageKey]);

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
      setIsEnabled(!newValue);
    }
  };

  return (
    // .module-card: white, border --border-color, shadow-md, radius --radius-lg
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          {/* .module-card h2: color --primary, font-weight 600 */}
          <Text style={styles.label}>{label}</Text>
          {/* cuerpo: color --text-color, font-size ~1rem */}
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      {/* Switch: colores --accent / --border-color */}
      <Switch
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.border}
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
    borderRadius: radius.lg,
    ...shadows.md,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 26,
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginBottom: 3,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    lineHeight: typography.lineHeight.normal,
  },
});
