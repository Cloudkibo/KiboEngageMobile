import {
  AsyncStorage,
} from 'react-native'
var STORAGE_KEY = 'id_token';

module.exports = {
/* getToken() {
  var token =  AsyncStorage.getItem(STORAGE_KEY).then();
  return token
},
*/

async getToken() {
    var token = await AsyncStorage.getItem(STORAGE_KEY);
    console.log('gettoken callled ' + token)
    return token;
  },

logout(cb) {
  AsyncStorage.removeItem(STORAGE_KEY);
  if (cb) cb()
  this.onChange(false)
},

loggedIn() {
  var token = AsyncStorage.getItem(STORAGE_KEY)
  //var s = JSON.parse(token);
   console.log(token)
  
  if(typeof token === 'undefined' || token === '') {
    console.log('token' + token);
    return false

  }
  else{
    console.log('calling in loggedIn() service')
    console.log(token);
    return true

  }

},

onChange() {}
}

