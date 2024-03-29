// import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';

var querystring = require('querystring');
import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;

export function showCustomers(customers) {
//console.log(customers.data);
  return {
    type: ActionTypes.ADD_CUSTOMERS,
    payload : customers.data,

  };
}

export const customerFetch = (token) => {
  console.log('customers fetch is called');
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },

          };

  return (dispatch) => {
    axios.get(`${baseURL}/api/customers`,config)
    .then((res) => res).then(res => dispatch(showCustomers(res)));

  };
};
