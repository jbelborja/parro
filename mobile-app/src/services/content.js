const BASE_URL = 'https://jbelborja.github.io/parro';

/**
 * Obtiene las ultimas publicaciones de una seccion ('noticias' o 'toma-y-lee').
 * El sitio Hugo genera automaticamente index.json en cada seccion.
 * 
 * @param {'noticias' | 'toma-y-lee'} section 
 * @param {number} limit 
 */
export async function fetchLatestContent(section = 'noticias', limit = 15) {
  try {
    const url = `${BASE_URL}/${section}/index.json`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    const items = data.items || [];
    return items.slice(0, limit);
  } catch (error) {
    console.warn(`Error cargando contenido de ${section}:`, error);
    return [];
  }
}
