// import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';

var querystring = require('querystring');

const baseURL = 'https://api.kibosupport.com';

// var baseURLKiboEngage = `http://localhost:8000`

export function showCustomers(customers) {
  //console.log(customers.data);
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

const sendEmailInAction = () => {
  return {
    type: ActionTypes.SEND_EMAIL,
  };
};

const sendEmailSuccess = (res) => {
  console.log('email sent');
  return {
    type: ActionTypes.SEND_EMAIL_SUCCESS,
    payload: res,
  };
};

const sendEmailFail = () => {
  return {
    type: ActionTypes.SEND_EMAIL_FAIL,
  };
};

export const emailCustomer = (emailMsg, token) => {
  console.log('Email customer is called.');
  console.log(emailMsg);
  console.log(emailMsg);
  const config = {
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
  };

  const data = {
    'to': emailMsg.to,
    'emailAdd': emailMsg.emailAdd,
    'subject': emailMsg.subject,
    'body': emailMsg.body,
    'from': emailMsg.from,
  };

  return (dispatch) => {
    dispatch(sendEmailInAction());
    console.log('calling api');
    axios.post('http://kiboengage.cloudapp.net/api/emailCustomer', querystring.stringify(data), config).then(res => dispatch(sendEmailSuccess(res)))
      .catch((error) => {
        console.log('Error occured');
        console.log(error);
        dispatch(sendEmailFail());
      });
  };
}
