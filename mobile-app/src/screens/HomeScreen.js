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

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('noticias'); // 'noticias' | 'toma-y-lee'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (tab) => {
    setLoading(true);
    const data = await fetchLatestContent(tab);
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await fetchLatestContent(activeTab);
    setItems(data);
    setRefreshing(false);
  };

  const handleOpenItem = async (item) => {
    const targetUrl = item.pdf || item.permalink;
    if (targetUrl) {
      await WebBrowser.openBrowserAsync(targetUrl);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => handleOpenItem(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardCategory}>
          {activeTab === 'noticias' ? '📰 NOTICIA' : '📖 TOMA Y LEE'}
        </Text>
        {item.date ? <Text style={styles.cardDate}>{item.date}</Text> : null}
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      {item.summary ? (
        <Text style={styles.cardSummary} numberOfLines={3}>
          {item.summary.replace(/<[^>]*>?/gm, '').trim()}
        </Text>
      ) : null}
      <View style={styles.cardFooter}>
        <Text style={styles.readMoreText}>
          {item.pdf ? '📄 Ver lectura (PDF) →' : 'Leer en la web →'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Selector de pestañas */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'noticias' && styles.tabButtonActive]}
          onPress={() => setActiveTab('noticias')}
        >
          <Text
            style={[styles.tabButtonText, activeTab === 'noticias' && styles.tabButtonTextActive]}
          >
            📰 Últimas Noticias
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'toma-y-lee' && styles.tabButtonActive]}
          onPress={() => setActiveTab('toma-y-lee')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'toma-y-lee' && styles.tabButtonTextActive,
            ]}
          >
            📖 Toma y Lee
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de contenidos */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5B2C6F" />
          <Text style={styles.loadingText}>Cargando publicaciones...</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>{activeTab === 'noticias' ? '📰' : '📖'}</Text>
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
              colors={['#5B2C6F']}
              tintColor="#5B2C6F"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 6,
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 8,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#5B2C6F',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 14,
    paddingBottom: 25,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#5B2C6F',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5B2C6F',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#777',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardCategory: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8E44AD',
    letterSpacing: 0.5,
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    lineHeight: 22,
    marginBottom: 6,
  },
  cardSummary: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F0E6F4',
    paddingTop: 8,
    marginTop: 4,
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B2C6F',
  },
});
