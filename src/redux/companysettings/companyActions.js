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


export const settingsSave =  (token, companyObj) => {

   var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/json',
            },

          };


      
  console.log("THis is the token in action " + token);
  return (dispatch) => {
    axios.post(`https://api.kibosupport.com/api/companyprofiles/updatecompanyprofile`, companyObj,config)
      .then((res) => dispatch(confirmSave(res)))
      .catch(function (error) {
        console.log('Error occured');
        // console.log(error);
        dispatch(confirmSave(error));
      });
  };
};

export function confirmSave(res) {
  console.log('In confirm save');
  console.log(res);
  var status = 'Save button was pressed';
  // if(invite.data.msg){
  //   status = invite.data.msg;
  // }else{
  //   status = 'Something went wrong'
  // }
  return {
    type: ActionTypes.UPDATE_SETTINGS,
    payload : status,

  };
}

