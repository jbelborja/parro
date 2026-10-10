import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { fetchLatestContent } from '../services/content';
import { colors, shadows, radius, typography } from '../theme';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('noticias');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (tab, isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    const data = await fetchLatestContent(tab);
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(activeTab, true);
    setRefreshing(false);
  };

  const handleOpenItem = async (item) => {
    const targetUrl = item.pdf || item.permalink;
    if (targetUrl) await WebBrowser.openBrowserAsync(targetUrl);
  };

  const cleanSummary = (text) => {
    if (!text) return '';
    let cleaned = text.replace(/!\[.*?\]\(.*?\)/g, '');
    cleaned = cleaned.replace(/\[(.*?)\]\(.*?\)/g, '$1');
    cleaned = cleaned.replace(/<[^>]*>?/gm, '');
    return cleaned.trim();
  };

  const renderItem = ({ item }) => {
    const summary = cleanSummary(item.summary);
    const isNoticias = activeTab === 'noticias';
    return (
      // .module-card equivalente: white bg, border, shadow-md, border-radius --radius-lg
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.75}
        onPress={() => handleOpenItem(item)}
      >
        {/* Cabecera de tarjeta: badge de categoría + fecha */}
        <View style={styles.cardHeader}>
          <View style={[styles.badge, isNoticias ? styles.badgeNoticias : styles.badgeToma]}>
            <Text style={styles.badgeText}>
              {isNoticias ? 'NOTICIA' : 'TOMA Y LEE'}
            </Text>
          </View>
          {item.date ? (
            <Text style={styles.cardDate}>{item.date}</Text>
          ) : null}
        </View>

        {/* Título — .module-card h2: color --primary, font-weight 700 */}
        <Text style={styles.cardTitle}>{item.title}</Text>

        {/* Resumen — color --text-color, font-size ~1rem */}
        {summary ? (
          <Text style={styles.cardSummary} numberOfLines={3}>
            {summary}
          </Text>
        ) : null}

        {/* Pie: enlace de acción — color --accent */}
        <View style={styles.cardFooter}>
          <Text style={styles.readMoreText}>
            {item.pdf ? 'Abrir lectura (PDF)' : 'Leer en la web'} →
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab selector — inspirado en el menú principal de la web */}
      <View style={styles.tabBar}>
        {[
          { id: 'noticias',    label: 'Noticias' },
          { id: 'toma-y-lee',  label: 'Toma y lee' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabButtonText, activeTab === tab.id && styles.tabButtonTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Cargando publicaciones...</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>No hay contenidos disponibles</Text>
          <Text style={styles.emptySubtitle}>Desliza hacia abajo para actualizar.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => item.permalink || String(index)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.accent]}
              tintColor={colors.accent}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // main { background: --bg-color }
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // Tab bar: equivalente a .main-nav en móvil (blanco, borde inferior, shadow-sm)
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },

  // Cada tab — .main-nav a: padding 8px 13px, font-size 0.92rem, font-weight 500
  tabButton: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: colors.accent,
  },
  tabButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.textLight,
  },
  tabButtonTextActive: {
    color: colors.accent,
    fontWeight: typography.weights.semibold,
  },

  listContent: {
    padding: 16,
    paddingBottom: 28,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: typography.sizes.sm,
    color: colors.textLight,
  },
  emptyTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textLight,
    textAlign: 'center',
  },

  // .module-card: white bg, border --border-color, shadow-md, radius --radius-lg
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 14,
    ...shadows.md,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  // Badge de categoría — estilo pill con el color --accent
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  badgeNoticias: {
    backgroundColor: '#eff6ff',   // blue-50
  },
  badgeToma: {
    backgroundColor: '#f0fdf4',   // green-50
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.accent,
    letterSpacing: 0.6,
  },

  // Fecha — --text-light, font-size 0.9rem
  cardDate: {
    fontSize: typography.sizes.sm,
    color: colors.textLight,
  },

  // Título — .module-card h2: color --primary, font-size 1.5rem web → lg en móvil
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    lineHeight: typography.lineHeight.tight,
    marginBottom: 6,
  },

  // Resumen — color --text-color, font-size ~1rem, line-height 1.6
  cardSummary: {
    fontSize: typography.sizes.md,
    color: colors.text,
    lineHeight: typography.lineHeight.normal,
    marginBottom: 12,
  },

  // Pie — separador igual que el borde-bottom de la web
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 4,
  },
  readMoreText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.accent,   // --accent: #3b82f6
  },
});
