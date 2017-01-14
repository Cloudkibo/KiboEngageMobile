//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var querystring = require('querystring');

export function showResponses(cannedresponses) {
  console.log(cannedresponses);
  return {
    type: ActionTypes.ADD_CANNED_RESPONSES,
    payload : cannedresponses.data,

  };
}

export const cannedFetch = (token) => {
   var config = {
      rejectUnauthorized : false,
      headers: {
           'Authorization': `Bearer ${token}`,
           'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
      
  return (dispatch) => {
    axios.get(`${baseURL}/api/shortcuts`,config)
    .then((res) => res).then(res => dispatch(showResponses(res)));
      
  };
};


// create canned responses
export const createcanned = (canned) => {
    var token = canned.token;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
      var data =  {
        shortcode : canned.shortcode,
        message: canned.message,
        companyid : canned.companyid
      
      }
  console.log(data);
  return (dispatch) => {
    dispatch(cannedCreateInAction());
    console.log('calling api');
    axios.post(`${baseURL}/api/shortcuts/`,querystring.stringify(data),config).then(res => dispatch(cannedCreateSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(cannedCreateFail());
      });
    
  };
};


export const editcanned = (canned) => {
    console.log('editcanned is called');
    var token = canned.token;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/json'
            },
      
          };
      var data =  {
        'shortcode' : canned.shortcode,
        'message': canned.message,
        'companyid' : canned.companyid,
        '_id':canned._id,
      
      }
  console.log(data);
  var id = data._id;
  console.log(data);
  return (dispatch) => {
    dispatch(cannedEditInAction());
    console.log('calling api');
    axios.put(`${baseURL}/api/shortcuts/${id}`,data,config).then(res => dispatch(cannedEditSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(cannedEditFail());
      });
    
  };
};



const cannedCreateInAction = () => {
  return {
    type: ActionTypes.CREATE_CANNED,
   
  };
};



const cannedCreateFail = () => {
  return{ type: ActionTypes.CREATE_CANNED_FAIL };
};

const cannedCreateSuccess = (res) => {
  //Actions.main();
  return{
    type: ActionTypes.CREATE_CANNED_SUCCESS,
    payload: res
  };

  
};




/**** Edit ***/

const cannedEditInAction = () => {
  return {
    type: ActionTypes.EDIT_CANNED,
   
  };
};



const cannedEditFail = () => {
  return{ type: ActionTypes.EDIT_CANNED_FAIL };
};

const cannedEditSuccess = (res) => {
  //Actions.main();
  return{
    type: ActionTypes.EDIT_CANNED_SUCCESS,
    payload: res
  };

  
};

/**** Delete Team ***/
export const deletecanned = (canned) => {
    var token = canned.token;
    var id =  canned.id;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/x-www-form-urlencoded'
            },

          };
  return (dispatch) => {
   console.log('calling api');
    axios.delete(`${baseURL}/api/shortcuts/${id}`,config).then(res => dispatch(cannedDeleteSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(cannedDeleteFail());
      });

  };
};

const cannedDeleteSuccess = (res) => {
  console.log('canned respose deleted');
  //Actions.main();
  return{
    type: ActionTypes.DELETE_CANNED_SUCCESS,
    payload: res
  };


};

const cannedDeleteFail = (res) => {
  console.log('canned deleted fail');
  //Actions.main();
  return{
    type: ActionTypes.DELETE_CANNED_FAIL,
    payload: res
  };


};
