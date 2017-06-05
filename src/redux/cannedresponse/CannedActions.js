//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var querystring = require('querystring');
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')

import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;

export function showResponses(cannedresponses) {
  //console.log(cannedresponses);
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
    .then((res) => res).then(res => dispatch(writeResponses(res.data)))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
          dispatch(readResponses());
        }
       }); 

      
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
    axios.post(`${baseURL}/api/shortcuts/`,querystring.stringify(data),config).then(res => {
      dispatch(cannedCreateSuccess(res))
      dispatch(cannedFetch(token))
    })
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
    axios.delete(`${baseURL}/api/shortcuts/${id}`,config).then(res => {
      dispatch(cannedDeleteSuccess(res));
      dispatch(cannedFetch(token));
      })
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

/*** sqlite actions ***/

export function callbackresponses(results) {
 var fteams = []
  var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);
    console.log('row');
    console.log(row);
    fteams.push(row);
  }
  console.log(fteams);
 
  return {
    type: ActionTypes.ADD_CANNED_RESPONSES,
    payload : fteams,
 
  };
}



export  function writeResponses(responses){
  var db = SqliteCalls.getConnection();
   var res = [];

  var CREATE_SHORTCUT_TABLE = "CREATE TABLE SHORTCUTS ("
                + "_id TEXT PRIMARY KEY,"
                + "shortcode TEXT,"
                + "message TEXT,"
                + "companyid TEXT" + ")";
  

 var rows = []
 for(var i=0;i<responses.length;i++){
  var record = []
  record.push(responses[i]._id)
  record.push(responses[i].shortcode);
  record.push(responses[i].message);
  record.push(responses[i].companyid);
 
  rows.push(record);
 // addItem(db,record);

  
 }
 console.log(rows);


return (dispatch) => {
    
    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS SHORTCUTS');
    tx.executeSql(CREATE_SHORTCUT_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO SHORTCUTS VALUES (?,?,?,?)',rows[j]);
   
    }
    tx.executeSql('SELECT * FROM SHORTCUTS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackresponses(res));
  }
  );
  
  }

}

export function readResponses(){
   var db = SqliteCalls.getConnection();
   return (dispatch) => {
    
    db.transaction(function(tx) {
   
    tx.executeSql('SELECT * FROM SHORTCUTS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackresponses(res));
  }
  );
  
  }
}

