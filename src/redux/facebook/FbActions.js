//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var querystring = require('querystring');
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')




// create fbpage
export const createPage=(fbpage,token) => {
    var token = token;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
    
  return (dispatch) => {
    console.log('calling api');
    axios.post(`${baseURL}/api/fbpages/`,querystring.stringify(fbpage),config).then(res => dispatch(fbpageCreateSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(fbpageCreateFail());
      });
    
  };
};



// create fbpage
export const editPage=(fbpage,token) => {
    var token = token;
    var id = fbpage.pageid;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
    
  return (dispatch) => {
    console.log('calling api');
    axios.put(`${baseURL}/api/fbpages/${id}`,querystring.stringify(fbpage),config).then(res => dispatch(fbpageEditSuccess(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        dispatch(fbpageEditFail());
      });
    
  };
};


const fbpageCreateFail = () => {
  return{ type: ActionTypes.FBPAGE_FAIL };
};

const fbpageCreateSuccess = (res) => {
  //Actions.main();
  return{
    type: ActionTypes.FBPAGE_SUCCESS,
    payload: 'Page Information added successfully'
  };

  
};


const fbpageEditFail = () => {
  return{ type: ActionTypes.FBPAGE_FAIL };
};

const fbpageEditSuccess = (res) => {
  //Actions.main();
  return{
    type: ActionTypes.FBPAGE_SUCCESS,
    payload: 'Information updated successfully'
  };

  
};


//get fbcustomers list

export const fetchfbcustomers=(token) => {
    var token = token;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/x-www-form-urlencoded'
            },
      
          };
    
  return (dispatch) => {
    console.log('calling api');
    axios.get(`${baseURL}/api/fbCustomers/`,config).then(res => dispatch(showfbcustomers(res.data)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
      
      });
    
  };
};



const showfbcustomers = (fbCustomers) => {
  console.log(fbCustomers)
  return{
    type: ActionTypes.SHOW_FB_CUSTOMERS,
    payload: fbCustomers,
  };

  
};

