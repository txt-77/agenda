import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function setupNotifications() {
  try {
    if (!Device.isDevice) {
      // Emulador pode não suportar push local perfeitamente
      console.warn('Notificações: recomendo testar em um dispositivo real.');
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permissão de notificações não concedida');
      return;
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  } catch (e) {
    console.warn('Erro ao configurar notificações', e);
  }
}

export async function scheduleReminder(dateString, timeString, title) {
  try {
    // Construir Date ISO local: yyyy-mm-dd + time hh:mm
    // Obs: assume horário em local timezone
    const [hh, mm] = timeString.split(':');
    const [yyyy, mm2, dd] = dateString.split('-');
    const d = new Date(
      parseInt(yyyy, 10),
      parseInt(mm2, 10) - 1,
      parseInt(dd, 10),
      parseInt(hh, 10),
      parseInt(mm, 10),
      0
    );

    if (isNaN(d.getTime())) return;

    // Se data no passado, não agende
    const now = new Date();
    if (d <= now) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Lembrete de compromisso',
        body: `${title} às ${timeString}`,
        sound: true,
      },
      trigger: d,
    });
  } catch (e) {
    console.warn('Erro ao agendar notificação', e);
  }
}
