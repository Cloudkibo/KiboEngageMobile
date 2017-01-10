import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var querystring = require('querystring');

export function showAgents(agents) {
  console.log('show agents');
  console.log(agents);
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

