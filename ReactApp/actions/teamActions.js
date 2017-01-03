//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from './types';
var baseURL = `https://api.kibosupport.com`

export function showTeams(teams) {
  console.log('show teams');
  console.log(teams);
  return {
    type: ActionTypes.ADD_TEAMS,
    payload : teams.data,

  };
}


export const teamFetch = () => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
           'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
           'kibo-client-id': 'cd89f71715f2014725163952',
           'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
      
  return (dispatch) => {
    axios.get(`${baseURL}/api/departments`,config)
    .then((res) => res).then(res => dispatch(showTeams(res)));
      
  };
};

