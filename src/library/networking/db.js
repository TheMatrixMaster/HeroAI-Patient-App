import {SERVER} from 'react-native-dotenv';

export default class db {

  static get_beacons = (mrn) => new Promise((resolve, reject) => {
    const url = 'http://' + SERVER + 'api/get_beacons';
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mrn: mrn }),
    };

    fetch(url, options)
      .then(response => {
        response.json()
          .then(data => {
            if (response.status === 400) { reject(data.error) }
            else if (response.status === 200) { resolve(data) }
          })
      }).catch(err => reject(err.message))
  });

  static archive_message = (id_) => new Promise((resolve, reject) => {
    const url = 'http://' + SERVER + `api/archive_message/${id_}`;
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    };
    fetch(url, options)
      .then(res => {
        res.json().then(data => {
          if (res.status === 200) {resolve(data.message)}
          else if (res.status === 400) {reject(data.error)}
        })
      }).catch(err => reject(err.message))
  })

}
