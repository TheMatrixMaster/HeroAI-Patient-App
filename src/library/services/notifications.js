import {SERVER} from 'react-native-dotenv';
import firebase, { Notification } from "react-native-firebase";
import AsyncStorage from "@react-native-community/async-storage";

var messaging = firebase.messaging();
var notifications = firebase.notifications();

export default class message {
  constructor() {
  }

  static createNotificationListeners = () => {
    this.onUnsubscribeNotificaitonListener = notifications
      .onNotification((notif: Notification) => {
        notifications.displayNotification(notif)
        // fetch data again
      });
  };

  static createTokenListener = () => {
    this.onTokenRefreshListener = messaging.onTokenRefresh(fcmToken => { this.setToken() })
  };

  static removeListeners = () => {
    this.onUnsubscribeNotificaitonListener();
    this.onTokenRefreshListener();
  };

  static setToken = () => {
    messaging.getToken().then(async fcm => {
      if (fcm) {
        await AsyncStorage.setItem('fcmToken', fcm);
        this.sendTokenToServer(fcm);
      }
    })
  };

  static getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log(fcmToken);
    if (!fcmToken) { this.setToken() }
  };

  static removeToken = async () => {
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    this.removeTokenFromServer(fcmToken).then(() => {
      AsyncStorage.removeItem('fcmToken')
    })
  };

  static sendTokenToServer = async (fcmToken) => {
    const uid = await AsyncStorage.getItem('mrn');
    const url = 'http://' + SERVER + 'api/store_token';
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin: "patient",
        token: fcmToken,
        uid: uid
      })
    };

    fetch(url, options)
      .then(res => {
        res.json().then(data => {
          if (res.status === 400) { console.log(data.error) }
          else if (res.status === 200) { console.log(data.message) }
        })
      }).catch(err => alert(err.message))
  };

  static removeTokenFromServer = async () => {
    const uid = await AsyncStorage.getItem('mrn');
    const url = 'http://' + SERVER + `api/delete_token/patient/${uid}`;
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch(url, options)
      .then(res => {
        res.json().then(data => {
          if (res.status === 400) {console.log(data.error)}
          else if (res.status === 200) {console.log(data.message)}
        })
      }).catch(err => alert(err.message))
  };

  static checkPermission = async () => {
    const enabled = await messaging.hasPermission();
    if (enabled) { this.getToken() }
    else { this.requestPermission() }
  };

  static requestPermission = async () => {
    try {
      await messaging.requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  };

}
