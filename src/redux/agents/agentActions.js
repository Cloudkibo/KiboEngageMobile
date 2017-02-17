import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var querystring = require('querystring');

export function showAgents(agents) {
  // console.log('show agents');
  // console.log(agents);
  return {
    type: ActionTypes.ADD_AGENTS,
    payload : agents.data.agents,

  };
}


export const agentFetch =  (token) => {

   var config = {
      rejectUnauthorized : false,
      headers: {
          'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
      
  return (dispatch) => {
    axios.get(`${baseURL}/api/users/allagents`,config)
    .then((res) => res).then(res => dispatch(showAgents(res)));
      
  };
};

export const agentInvite =  (token, inviteEmail) => {

   var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/json',
            },

          };
       var data =  {
          email: inviteEmail
      }

      
  // console.log("THis is the token in action " + token);
  return (dispatch) => {
    axios.post(`https://api.kibosupport.com/api/tempaccounts/kiboengage`, data,config)
      .then((res) => dispatch(confirmInvite(res)))
      .catch(function (error) {
        // console.log('Error occured');
        // console.log(error);
        dispatch(confirmInvite(error));
      });
  };
};

export function confirmInvite(invite) {
  // console.log('Success');
  // console.log(invite);
  var status = '';
  if(invite.data.msg){
    status = invite.data.msg;
  }else{
    status = 'Something went wrong'
  }
  return {
    type: ActionTypes.INVITE_AGENTS,
    payload : status,

  };
}

