import {SERVER} from 'react-native-dotenv';
import AsyncStorage from "@react-native-community/async-storage";


export default class auth {

  static async setKey(key, keyVal) { await AsyncStorage.setItem(key, keyVal) }
  static async removeKey(key) { await AsyncStorage.removeItem(key) }
  static async getKeyVal(key) { return await AsyncStorage.getItem(key) }

  static signIn(mrn) {
    const url = "http://" + SERVER + "api/patient_auth";
    const options = {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ mrn: mrn })
    };

    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(res => {
          res.json().then(data => {
            if (res.status === 400) { reject(data.error) }
            else if (res.status === 200) { resolve(data.two_factor) }
          })
        }).catch(err => alert(err))
    });
  }

  static isSignedIn = (key) => new Promise((resolve, reject) => {
    AsyncStorage.getItem(key)
      .then(res => {
        if (res !== null) { resolve(true)}
        else { resolve(false) }
      }).catch(err => reject(err));
  })

}
