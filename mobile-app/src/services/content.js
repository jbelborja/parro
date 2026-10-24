import AsyncStorage from '@react-native-async-storage/async-storage';
import initialContent from '../data/initialContent';


const BASE_URL = 'https://la-vid.org';

/**
 * Obtiene las publicaciones de una seccion ('noticias' o 'toma-y-lee').
 * 
 * Estrategia de carga robusta (Offline-first / Stale-while-revalidate):
 * 1. Primero intenta descargar el index.json actualizado desde la web de GitHub Pages.
 * 2. Si tiene exito, actualiza la cache en AsyncStorage y devuelve los datos frescos.
 * 3. Si falla la red o devuelve error, lee la cache guardada previamente.
 * 4. Si es la primera vez que se abre la app y no hay red, carga inmediatamente
 *    los datos empaquetados en initialContent.json (¡siempre habra contenidos visibles!).
 * 
 * @param {'noticias' | 'toma-y-lee'} section 
 * @param {number} limit 
 */
export async function fetchLatestContent(section = 'noticias', limit = 25) {
  const cacheKey = `@content_cache_${section}`;

  try {
    const url = `${BASE_URL}/${section}/index.json`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      const items = (data.items || []).filter(item => item && item.title);
      if (items.length > 0) {
        await AsyncStorage.setItem(cacheKey, JSON.stringify(items));
        return items.slice(0, limit);
      }
    }
  } catch (error) {
    console.log(`Fallo descarga remota de ${section}:`, error?.message || error);
  }


  // Fallback 1: Buscar en cache de AsyncStorage
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, limit);
      }
    }
  } catch (e) {
    console.warn('Error leyendo cache local:', e);
  }

  // Fallback 2: Usar el archivo empaquetado por defecto (garantiza que NUNCA este vacia)
  const bundledItems = initialContent[section] || [];
  return bundledItems.slice(0, limit);
}
