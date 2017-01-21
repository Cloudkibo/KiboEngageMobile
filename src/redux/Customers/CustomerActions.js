// import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';

const baseURL = 'https://api.kibosupport.com';

// var baseURLKiboEngage = `http://localhost:8000`

export function showCustomers(customers) {
  console.log(customers.data);
  return {
    type: ActionTypes.ADD_CUSTOMERS,
    payload: customers.data,

  };
}

export const getCustomers = (token) => {
  console.log('Get Customers is called');
  const config = {
    rejectUnauthorized: false,
    headers: {
        'Authorization': `Bearer ${token}`,
    },
  };

  return (dispatch) => {
    console.log('Calling API');
    axios.get(`${baseURL}/api/customers`, config)
    .then((res) => res).then(res => dispatch(showCustomers(res)));
  };
};
