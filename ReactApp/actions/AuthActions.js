import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from './types';
var baseURL = `https://api.kibosupport.com`
var querystring = require('querystring');

import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER
} from './types';

export const emailChanged = (text) => {
  return {
    type: ActionTypes.EMAIL_CHANGED,
    payload: text
  };
};

export const domainChanged = (text) => {
  return {
    type: ActionTypes.DOMAIN_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: ActionTypes.PASSWORD_CHANGED,
    payload: text
  };
};


export const loginUser = (creds) => {
    var config = {
      rejectUnauthorized : false,
      headers: {
           'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
           'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
           'kibo-client-id': 'cd89f71715f2014725163952',
           'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
      var data =  {
        email : creds.email,
        password   : creds.password,
        website : creds.domain
      }
    console.log(data);
  return (dispatch) => {
    dispatch(loginInAction());
    console.log('calling api');
    axios.post('https://api.kibosupport.com/auth/local',querystring.stringify(data),config).then(user => dispatch(loginUserSuccess(user)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(loginUserFail());
      });
    
  };
};

const loginInAction = () => {
  return {
    type: ActionTypes.LOGIN_USER,
   
  };
};



const loginUserFail = () => {
  return{ type: ActionTypes.LOGIN_USER_FAIL };
};

const loginUserSuccess = (user) => {
  console.log('loginUserSuccess');
  console.log(user);
  Actions.main();
  return{
    type: ActionTypes.LOGIN_USER_SUCCESS,
    payload: user
  };

  
};


export const registerUpdate = ({ prop, value }) => {
  return {
    type: ActionTypes.REGISTER_UPDATE,
    payload: { prop, value }
  };
};
const signupFail = () => {
  return{ type: ActionTypes.SIGNUP_USER_FAIL };
};

const signupSuccess = (user) => {
  console.log('signupSuccess');
  console.log(user);
  return{
    type: ActionTypes.SIGNUP_USER_SUCCESS,
    payload: user
  };

  Actions.main();
};



export const signupuser = (user) => {
    var config = {
      rejectUnauthorized : false,
      headers: {
           'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
           'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
           'kibo-client-id': 'cd89f71715f2014725163952',
           'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
      var data =  {
        firstname :user.firstname,
        lastname  :user.lastname,
        email    :user.email,
        phone     :user.phone,
        password   : user.password,
        companyName:user.companyName,
        website : user.website,
       
      }
    console.log(data);
  return (dispatch) => {
    dispatch(loginInAction());
    console.log('calling api');
    axios.post('https://api.kibosupport.com/api/users/kiboengage',querystring.stringify(data),config).then(user => dispatch(signupSuccess(user)))
      .catch(function (error,user) {
        console.log('Error occured');
        console.log(user);
        console.log(error);
        dispatch(signupFail());
      });
    
  };
};
