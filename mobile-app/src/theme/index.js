/**
 * Tema visual alineado con la web Hugo (themes/parroquia/static/css/main.css)
 *
 * Paleta idéntica a las variables CSS:
 *   --primary:       #0f172a   (dark navy)
 *   --primary-light: #1e293b
 *   --accent:        #3b82f6   (blue-500)
 *   --accent-hover:  #2563eb   (blue-600)
 *   --bg-color:      #f8fafc   (slate-50)
 *   --text-color:    #334155   (slate-700)
 *   --text-light:    #94a3b8   (slate-400)
 *   --white:         #ffffff
 *   --border-color:  #e2e8f0   (slate-200)
 */

export const colors = {
  primary: '#0f172a',
  primaryLight: '#1e293b',
  accent: '#3b82f6',
  accentHover: '#2563eb',
  bg: '#f8fafc',
  text: '#334155',
  textLight: '#94a3b8',
  white: '#ffffff',
  border: '#e2e8f0',
};

/**
 * Sombras equivalentes a --shadow-sm / --shadow-md / --shadow-lg
 * en React Native (iOS + Android).
 */
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.10,
    shadowRadius: 15,
    elevation: 6,
  },
};

/** Border radii equivalentes a --radius-md / --radius-lg */
export const radius = {
  sm: 6,
  md: 8,   // --radius-md: 0.5rem
  lg: 16,  // --radius-lg: 1rem
};

/**
 * Tipografía — Inter en React Native.
 * Inter se incluye vía expo-google-fonts o como sistema en Android/iOS.
 * Usamos fontFamily: 'Inter' y si no está disponible cae en el sistema sans-serif.
 *
 * Tamaños equivalentes a los de la web:
 *   nav links    → 0.92rem ≈ 14.7px  → 15
 *   body         → 1rem    = 16px    → 16
 *   small / meta → 0.9rem  ≈ 14.4px  → 14
 *   card title   → equivale a h3 web → 18
 *   section h2   → 1.5rem  = 24px    → 22
 */
export const typography = {
  fontFamily: 'Inter',           // Inter si disponible, system sans-serif si no
  sizes: {
    xs: 11,    // labels / badges
    sm: 13,    // meta, fecha, subtítulos pequeños (0.9rem web)
    base: 15,  // texto base (0.92rem links web)
    md: 16,    // cuerpo de texto (1rem web)
    lg: 18,    // título de tarjeta (h4 web)
    xl: 22,    // título de sección (h2 1.5rem web)
    xxl: 28,   // título de página grande
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 22,   // títulos
    normal: 24,  // cuerpo (line-height 1.6 del web)
    loose: 26,
  },
};
