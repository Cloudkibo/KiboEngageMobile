import axios from 'axios';
import * as ActionTypes from '../types';
var querystring = require('querystring');
import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')

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
      
 /* return (dispatch) => {
    axios.get(`${baseURL}/api/companyprofiles/fetch`,config)
    .then(res => dispatch(showSettings(res)));   
  };
};

*/

 return (dispatch) => {
    axios.get(`${baseURL}/api/companyprofiles/fetch`,config)
    .then((res) => res).then(res => dispatch(writeCompanySettings(res.data)))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
          dispatch(readCompanySettings());
        }
       }); 
      
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


      
  console.log("THis is the token in action along with some new data", token, companyObj);
  return (dispatch) => {
    axios.post(`${baseURL}/api/companyprofiles/updatecompanyprofile`, companyObj,config)
      .then((res) => dispatch(confirmSave('Settings Saved Successfully')))
      .catch(function (error) {
        console.log('Error occured');
        // console.log(error);
        dispatch(confirmSave('Something went wrong'));
      });
  };
};

export function confirmSave(res) {
  console.log('In confirm save');
  // console.log(res);
  var status = res;
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

export function resetStatus() {
  return {
    type: ActionTypes.RESET_STATUS,
  };
}



/***** sqlite table for company settings *****/
export function callbackcompanysettings(results) {
 var resultS = []
  var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);
    console.log('row');
    console.log(row);
    resultS.push(row);
  }
  console.log(resultS);
 
 return {
    type: ActionTypes.FETCH_SETTINGS,
    payload : resultS[0],
  };
}



export  function writeCompanySettings(settings){
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_Agents_TABLE = "CREATE TABLE COMPANYSETTINGS ("
                + "_id TEXT PRIMARY KEY,"
                + "abandonedscheduleemail1 TEXT,"
                + "abandonedscheduleemail2 TEXT,"
                + "abandonedscheduleemail3 TEXT,"
                + "companyid TEXT,"
                + "completedscheduleemail1 TEXT,"
                + "completedscheduleemail2 TEXT,"
                + "completedscheduleemail3 TEXT,"
                + "invitedscheduleemail1 TEXT,"
                + "invitedscheduleemail2 TEXT,"
                + "invitedscheduleemail3 TEXT,"
                + "notificationemailaddress TEXT,"
                + "widgetlogoURL TEXT,"
                + "widgetwindowtab TEXT,"
                + "showsummary TEXT,"
                + "maxnumberofchannels TEXT,"
                + "maxnumberofdepartment TEXT,"
                + "enableFacebook TEXT,"
                + "smsphonenumber TEXT,"
                + "allowemailnotification TEXT,"
                + "allowsmsnotification TEXT,"
                + "isdomainemail TEXT,"
                + "allowChat TEXT" + ")";

  var rows = []
  var record = []
  record.push(settings._id)
  record.push(settings.abandonedscheduleemail1);
  record.push(settings.abandonedscheduleemail2);
  record.push(settings.abandonedscheduleemail3);
  record.push(settings.companyid);
  record.push(settings.completedscheduleemail1);
  record.push(settings.completedscheduleemail2);
  record.push(settings.completedscheduleemail3);
  record.push(settings.invitedscheduleemail1);
  record.push(settings.invitedscheduleemail2);
  record.push(settings.invitedscheduleemail3);
  record.push(settings.notificationemailaddress);
  record.push(settings.widgetlogoURL);
  record.push(settings.widgetwindowtab);
  record.push(settings.showsummary);
  record.push(settings.maxnumberofchannels);
  record.push(settings.maxnumberofdepartment);
  record.push(settings.enableFacebook);
  record.push(settings.smsphonenumber);
  record.push(settings.allowemailnotification);
  record.push(settings.allowsmsnotification);
  record.push(settings.isdomainemail);
  record.push(settings.allowChat);
  
  rows.push(record);
// addItem(db,record);
  console.log(rows);


return (dispatch) => {
    
    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS COMPANYSETTINGS');
    tx.executeSql(CREATE_Agents_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO COMPANYSETTINGS VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',rows[j]);
   
    }
    tx.executeSql('SELECT * FROM COMPANYSETTINGS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackcompanysettings(res));
  }
  );
  
  }

}

export function readCompanySettings(){
   var db = SqliteCalls.getConnection();
   return (dispatch) => {
    
    db.transaction(function(tx) {
   
    tx.executeSql('SELECT * FROM COMPANYSETTINGS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackcompanysettings(res));
  }
  );
  
  }

}


