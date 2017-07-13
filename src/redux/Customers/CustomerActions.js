// import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
import { Alert } from 'react-native';
var querystring = require('querystring');

import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;

import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')
// var baseURLKiboEngage = `http://localhost:8000`

export function showCustomers(customers) {
  console.log('show customers in sendemail page');
  console.log(customers.data);
  return {
    type: ActionTypes.ADD_CUSTOMERS,
    payload: customers.data,

  };
}

export const getCustomers = (token) => {
  console.log('Get Customers is called');
  const config = {
    rejectUnauthorized: false,
    headers: {
        'Authorization': `Bearer ${token}`,
    },
  };

  return (dispatch) => {
    console.log('Calling API');
    axios.get(`${baseURL}/api/customers`, config)
    .then((res) => res).then(res => {
         dispatch(writeCustomers(res.data));
      
    })
      .catch(function (error) {
        //console.log(error.response)
        // console.log('Error occured');
        // console.log(error);
        dispatch(readCustomers());
      });

  };
};

/////////////////
 /*   .then(res => dispatch(
//writeCustomers
      showCustomers(res))

    );
  };
};
*/
////////////
const sendEmailInAction = () => {
  return {
    type: ActionTypes.SEND_EMAIL,
  };
};

const sendEmailSuccess = (res) => {
  console.log('email sent');
  return {
    type: ActionTypes.SEND_EMAIL_SUCCESS,
    payload: res,
  };
};

const sendEmailFail = () => {
  return {
    type: ActionTypes.SEND_EMAIL_FAIL,
  };
};

/*
companyid
:
"cd89f71715f2014725163952"
country
:
"United States"
customerID
:
"Test5"
email
:
"Test5"
isMobileClient
:
"false"
name
:
"Test5"
phone
:
""
__v
:
0
_id
:
"58cf22b25e4c8cfa69652d28"
*/

export  function writeCustomers(customers){
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_Customers_TABLE = "CREATE TABLE CUSTOMERS ("
                + "_id TEXT PRIMARY KEY,"
                + "companyid TEXT,"
                + "country TEXT,"
                + "email TEXT,"
                + "isMobileClient TEXT,"
                + "name TEXT,"
                + "phone TEXT" + ")";

 var rows = []
 for(var i=0;i<customers.length;i++){
  var record = []
  record.push(customers[i]._id)
  record.push(customers[i].companyid);
  record.push(customers[i].country);
  record.push(customers[i].email);
  record.push(customers[i].isMobileClient);
  record.push(customers[i].name);
  record.push(customers[i].phone);
  rows.push(record);
 // addItem(db,record);


 }
 console.log(rows);


return (dispatch) => {

    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS CUSTOMERS');
    tx.executeSql(CREATE_Customers_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO CUSTOMERS VALUES (?,?,?,?,?,?,?)',rows[j]);

    }
    tx.executeSql('SELECT * FROM CUSTOMERS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;

        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackcustomers(res));
  }
  );

  }

}



//
export function callbackcustomers(results) {
 var customers = []
  var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);
    console.log('row');
    console.log(row);
    customers.push(row);
  }
  console.log(customers);

  return {
    type: ActionTypes.ADD_CUSTOMERS,
    payload : customers,

  };
}


//
export function readCustomers(){
   var db = SqliteCalls.getConnection();
   return (dispatch) => {

    db.transaction(function(tx) {

    tx.executeSql('SELECT * FROM CUSTOMERS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;

        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackcustomers(res));
  }
  );

  }

}

/////
export const emailCustomer = (emailMsg, token) => {
  console.log('Email customer is called.');
  console.log(emailMsg);
  console.log(emailMsg);
  const config = {
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
  };
  var data = {
    'to': emailMsg.to,
    'emailAdd': emailMsg.emailAdd,
    'subject': emailMsg.subject,
    'body': emailMsg.body,
    'from': emailMsg.from,
  };
  console.log(data);
  return (dispatch) => {
    dispatch(sendEmailInAction());
    console.log('calling api');
    axios.post(`${baseURLKiboEngage}/api/emailCustomer`, data, config).then(res => dispatch(sendEmailSuccess(res)))
      .catch((error) => {
        console.log('Error occured');
        console.log(error);
        dispatch(sendEmailFail());
      });
  };
}
