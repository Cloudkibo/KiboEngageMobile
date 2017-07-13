// import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';

var querystring = require('querystring');
import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;

export function showCustomers(customers) {
  console.log('show customers');
console.log(customers.data);
  return {
    type: ActionTypes.ADD_CUSTOMERS,
    payload : customers.data,

  };
}

/*
companyid
:
"cd89f71715f2014725163952"
country
:
"United States"
customerID
:
"Test5"
email
:
"Test5"
isMobileClient
:
"false"
name
:
"Test5"
phone
:
""
__v
:
0
_id
:
"58cf22b25e4c8cfa69652d28"
*/

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
    .then((res) => res).then(res => 

      {
        console.log('customers');
console.log(res.data);
        dispatch(showCustomers(res));}

      );

  };
};
