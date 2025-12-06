const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const subscribeToPush = async (registration, api) => {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
      ),
    });

    const subscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: btoa(
          String.fromCharCode.apply(
            null,
            new Uint8Array(subscription.getKey('p256dh'))
          )
        ),
        auth: btoa(
          String.fromCharCode.apply(
            null,
            new Uint8Array(subscription.getKey('auth'))
          )
        ),
      },
    };

    try {
      await api.post('/api/users/push-subscribe', subscriptionData);
      console.log('Push subscription saved');
      return true;
    } catch (error) {
      console.error('Error saving push subscription:', error);
      return false;
    }
  } catch (error) {
    console.error('Error subscribing to push:', error);
    return false;
  }
};

export const initializePushNotifications = async (api) => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications are not supported');
    return false;
  }

  const registration = await registerServiceWorker();
  if (!registration) {
    return false;
  }

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.warn('Notification permission denied');
    return false;
  }

  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    const subscriptionData = {
      endpoint: existingSubscription.endpoint,
      keys: {
        p256dh: btoa(
          String.fromCharCode.apply(
            null,
            new Uint8Array(existingSubscription.getKey('p256dh'))
          )
        ),
        auth: btoa(
          String.fromCharCode.apply(
            null,
            new Uint8Array(existingSubscription.getKey('auth'))
          )
        ),
      },
    };

    try {
      await api.post('/api/users/push-subscribe', subscriptionData);
    } catch (error) {
      console.error('Error updating push subscription:', error);
    }
    return true;
  }

  return await subscribeToPush(registration, api);
};

