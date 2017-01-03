/**
 * Sidemenu Actions
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
'use strict';

export function toggle() {
  return {
    type: 'SIDEMENU_TOGGLE'
  }
}

export function open() {
  return {
    type: 'SIDEMENU_OPEN'
  }
}

export function close() {
  return {
    type: 'SIDEMENU_CLOSE'
  }
}



export function loginUser() {
  let config = {
    method: 'post',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({
      'email' :    'jekram@hotmail.com',
      'password'  : 'jawaid',
      'website' :  'cloudkibo'
    })
}

return dispatch => {
  // We dispatch requestLogin to kickoff the call to the API
  return fetch(`https://www.kiboengage.cloudapp.net/api/getlogin`, config)
      .then(response =>
    response.json()
      .then(user => ({ user, response }))
).then(({ user, response }) =>  {
    // If there was a problem, we want to
    // dispatch the error condition
    dispatch(close())
    return Promise.reject(user)

}).catch(err => console.log("Error: ", err))
}
}
