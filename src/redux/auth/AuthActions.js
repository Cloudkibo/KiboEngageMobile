//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
import * as SideMenuActionTypes from '../sidemenu/actions';
var querystring = require('querystring');
import { Actions } from 'react-native-router-flux';
import {
  AsyncStorage,
} from 'react-native'

var STORAGE_KEY = 'id_token';
import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;

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
    axios.post(`${baseURL}/auth/local`,querystring.stringify(data),config).then(user => 

      {dispatch(loginUserSuccess(user));
        dispatch(SideMenuActionTypes.close());
      }
      )
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
  console.log(user.data.token);
  AsyncStorage.setItem(STORAGE_KEY, user.data.token);
  console.log('setItem AsyncStorage ');
  //var value =  AsyncStorage.getItem(STORAGE_KEY).then();
  //console.log(value)
  Actions.app();
/*  return{
    type: ActionTypes.LOGIN_USER_SUCCESS,
    payload: user
  };*/

  
};


export const registerUpdate = ({ prop, value }) => {
  return {
    type: ActionTypes.REGISTER_UPDATE,
    payload: { prop, value }
  };
};
const signupFail = (err) => {
  return{ 
    type: ActionTypes.SIGNUP_USER_FAIL,
    payload: err 
  };
};

const signupSuccess = (user) => {
  console.log('signupSuccess');
  console.log(user);
  var errs = []
  errs.push('Your account is created successfully');
  /*return{
    type: ActionTypes.SIGNUP_USER_SUCCESS,
    payload: errs
  };
*/
  Actions.app();
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
    //dispatch(loginInAction());
    console.log('calling api');
    axios.post(`${baseURL}/api/users/kiboengage`,querystring.stringify(data),config).then(user => dispatch(signupSuccess(user)))
      .catch(function (error) {
        console.log('Error occured');
         if (error.response && error.response.status == 422 ) {
            console.log(error.response.data);
             var validationErr =[];
             var errs = error.response.data.errors;

             for(var err in errs)
             {

             validationErr.push(errs[err].message);
             }
             console.log(validationErr);
             dispatch(signupFail(validationErr));

          }
       
      });
    
  };
};
