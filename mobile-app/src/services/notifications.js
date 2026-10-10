import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import * as WebBrowser from 'expo-web-browser';

// Configuración sobre cómo se muestran las notificaciones en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Solicita permisos de notificación al usuario
 */
export async function requestPermissions() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

/**
 * Suscribe a un topic de FCM
 * @param {string} topic - Nombre del tema al que suscribirse
 */
export async function subscribeToTopic(topic) {
  try {
    await messaging().subscribeToTopic(topic);
    console.log(`Suscrito a ${topic}`);
    return true;
  } catch (error) {
    console.error(`Error al suscribirse a ${topic}:`, error);
    return false;
  }
}

/**
 * Cancela la suscripción a un topic de FCM
 * @param {string} topic - Nombre del tema del que desuscribirse
 */
export async function unsubscribeFromTopic(topic) {
  try {
    await messaging().unsubscribeFromTopic(topic);
    console.log(`Desuscrito de ${topic}`);
    return true;
  } catch (error) {
    console.error(`Error al desuscribirse de ${topic}:`, error);
    return false;
  }
}

/**
 * Configura los manejadores de notificaciones
 */
export function setupNotificationHandlers() {
  // Maneja notificaciones cuando la app está en background y el usuario la toca
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notificación abrió la app desde background:', remoteMessage.notification);
    abrirUrlDeNotificacion(remoteMessage);
  });

  // Maneja notificaciones cuando la app estaba completamente cerrada
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notificación abrió la app desde estado inactivo:', remoteMessage.notification);
        abrirUrlDeNotificacion(remoteMessage);
      }
    });

  // Escuchar notificaciones en primer plano
  const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
    console.log('Notificación en primer plano!', remoteMessage);
    
    // Mostramos la notificación localmente
    await Notifications.scheduleNotificationAsync({
      content: {
        title: remoteMessage.notification?.title || 'Nueva actualización',
        body: remoteMessage.notification?.body || '',
        data: remoteMessage.data,
      },
      trigger: null,
    });
  });
  
  // Escuchar taps en las notificaciones locales (mostradas en primer plano)
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data;
    if (data?.url) {
      WebBrowser.openBrowserAsync(data.url);
    }
  });

  return () => {
    unsubscribeForeground();
    subscription.remove();
  };
}

/**
 * Helper para abrir URL si viene en la data
 */
function abrirUrlDeNotificacion(remoteMessage) {
  if (remoteMessage?.data?.url) {
    WebBrowser.openBrowserAsync(remoteMessage.data.url);
  }
}
