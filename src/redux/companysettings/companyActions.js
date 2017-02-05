import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var querystring = require('querystring');

export function showSettings(data) {
  console.log('show data');
//   console.log(data.data);
  return {
    type: ActionTypes.FETCH_SETTINGS,
    payload : data.data,
  };
}


export const settingsFetch =  (token) => {

   var config = {
      headers: {
          'Authorization': `Bearer ${token}`,
      },
    };
      
  return (dispatch) => {
    axios.get(`${baseURL}/api/companyprofiles/fetch`,config)
    .then(res => dispatch(showSettings(res)));   
  };
};

