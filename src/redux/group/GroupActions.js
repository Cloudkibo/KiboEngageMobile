import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var baseURLKiboEngage = `http://kiboengage.cloudapp.net`
var querystring = require('querystring');
//var baseURLKiboEngage = `http://localhost:8000`
export function showGroups(groups) {
  console.log(groups.data);
    return {
      type: ActionTypes.ADD_GROUPS,
      payload : groups.data,

    };
}

export const groupFetch = (token) => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },

          };

  return (dispatch) => {
    axios.get(`${baseURL}/api/groups`,config)
    .then((res) => res).then(res => dispatch(showGroups(res)));

  };
};

// create group
export const creategroup = (group) => {
    var token = group.token;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
      var data =  {
          groupname: group.groupname,
          groupdescription: group.groupdescription,
          status : group.status,

      
      }
  console.log(data);
  return (dispatch) => {
   console.log('calling api');
    axios.post(`${baseURL}/api/groups`,querystring.stringify(data),config).then(res => dispatch(groupCreateSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(groupCreateFail());
      });
    
  };
};



const groupCreateFail = () => {
  return{ type: ActionTypes.CREATE_GROUP_FAIL };
};

const groupCreateSuccess = (res) => {
  //Actions.main();
  return{
    type: ActionTypes.CREATE_GROUP_SUCCESS,
    payload: res
  };

  
};
