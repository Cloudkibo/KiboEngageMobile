import axios from 'axios';
import * as ActionTypes from '../types';
import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;
var querystring = require('querystring');
import RNFetchBlob from 'react-native-fetch-blob';
var ReactNative = require('react-native');
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')

export function showChats(data) {
  // console.log('show chat messages data');
  // console.log(data);
  return {
    type: ActionTypes.FETCH_CHATS,
    payload : data,
  };
}

export function showSessions(data) {
  // console.log('show data');
  // console.log(data);
  var final = data.data.filter(function (el) {
    return el.platform == "mobile";
});
// console.log('Final', final);
  return {
    type: ActionTypes.FETCH_SESSIONS,
    payload : final,
  };
}


export const sessionsFetch =  (token) => {

   var config = {
      headers: {
          'Authorization': `Bearer ${token}`,
      },
    };
      
  return (dispatch) => {
    axios.get(`${baseURL}/api/visitorcalls/kiboengagesessions`,config)
    .then(res => dispatch(showSessions(res)));   
  };
};



/* return (dispatch) => {
    axios.get(`${baseURL}/api/visitorcalls/kiboengagesessions`,config)
    .then((res) => res).then(res => dispatch(writeSessions(res.data.filter((s) => s.platform == "mobile"))))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
          dispatch(readSessions());
        }
       }); 
      
  };
};
*/
export const chatsFetch =  (token) => {

   var config = {
      headers: {
          'Authorization': `Bearer ${token}`,
      },
    };
      
  return (dispatch) => {
    axios.get(`${baseURL}/api/userchats/`,config)
    .then(res => dispatch(showChats(res)));   
  };
};

export function singleChats(data) {
  // console.log('show single chat messages data');
  // console.log(data);
  return {
    type: ActionTypes.SINGLE_CHATS,
    payload : data,
  };
}


// Assign Agent
export const assignAgent = (token, input,session) => {
    var config = {
      rejectUnauthorized : false,
      headers: {
            'authorization': token,
            'content-type': 'application/json',
            },

          };
    var configKS = {
      rejectUnauthorized : false,
      headers: {
            'authorization': `Bearer ${token}`,
            'content-type': 'application/json',
            },

          };
      var data =  {
           companyid : input.companyid,
           sessionid : input.requestid,
           agentemail: input.email,
           type: input.type,
           agentAssignment : {
            assignedto : input.agentidTo,
            assignedby : input.agentidBy,
            sessionid  : input.requestid,
            companyid  : input.companyid ,
            datetime   : Date.now(),
            type : input.type,
          },
          
      };
 // console.log(data);
    return (dispatch) => {
    axios.post(`${baseURLKiboEngage}/api/assignToAgent`, data,config)
    .then(()=>{
      axios.post(`${baseURL}/api/visitorcalls/pickSession`, session,configKS)
    })
      .then((res) => {
        dispatch(assign_agent_status('Successfully Assigned'));
        console.log("Agent Successfully Assigned");
      })
      .catch(function (error) {
        console.log('Error occured');
        dispatch(assign_agent_status('Error Occurred'));
        console.log(error);
        // dispatch(confirmInvite(error));
      });
  };
};


export function assign_agent_status(data) {
  return {
    type: ActionTypes.ASSIGN_AGENT,
    payload : data,
  };
}

export function update_upload_progress(data) {
  return {
    type: ActionTypes.UPLOAD_PROGRESS,
    payload : data,
  };
}

// Send Chat to server
export const sendChat  = (token, input) => {
    console.log("In send chat");
    var config = {
      rejectUnauthorized : false,
      headers: {
          'Content-Type': 'application/json',
          'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
          'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
          'kibo-client-id': 'cd89f71715f2014725163952',
          'authorization': token,
            },

          };
    return (dispatch) => {
    axios.post(`${baseURL}/api/userchats/create`, input,config)
      .then((res) => {
        // dispatch(assign_agent_status('Successfully Assigned'));
        console.log("Chat Message Sent Successfully");

              axios.post(`${baseURLKiboEngage}/api/getchatfromagent`, input,config)
                  .then((res) => {
                    // dispatch(assign_agent_status('Successfully Assigned'));
                    console.log("Chat Message Sent Successfully to get chat from agent");
                  })
                  .catch(function (error) {
                    console.log('Error occured in get chat from agent');
                    // dispatch(assign_agent_status('Error Occurred'));
                    console.log(error);
                    // dispatch(confirmInvite(error));
                  });

      })
      .catch(function (error) {
        console.log('Error occured');
        // dispatch(assign_agent_status('Error Occurred'));
        console.log(error);
        // dispatch(confirmInvite(error));
      });
  };
};


export const resolveChatSession =  (token, sessionid) => {

   var config = {
           headers:{
          'Content-Type': 'application/json',
          'Authorization': token,
      },
    };
      

    data = {
        request_id : sessionid,
     };
  return (dispatch) => {

    axios.post(`${baseURLKiboEngage}/api/resolvechatsession`, data, config)
    .then(res => {
      console.log(res);
      console.log("Chat marked as resolved");
      // dispatch(showSessions(res))
        dispatch(assign_agent_status('Chat Marked As Resolved'));
      }).catch(function (error) {
        console.log('Unable to mark chat as resolved');
        // dispatch(assign_agent_status('Error Occurred'));
        console.log(error);
        // dispatch(confirmInvite(error));
        dispatch(assign_agent_status('Unable to mark chat as resolved'));
      });   
  };
};

export const uploadChatDocfile =(filedata,chatmsg)=>{
     return (dispatch) => {
               console.log("Sending file.....");
               dispatch (update_upload_progress({
                                    message_id: filedata._id,
                                    progress: 1, 
                                  }));
                RNFetchBlob.fetch('POST', `https://kiboengage.kibosupport.com/api/uploadchatfile`, {
                               
                                'Content-Type' : 'multipart/form-data'},[
                                { name : 'file', type: filedata.type,filename : filedata.name, data: RNFetchBlob.wrap(filedata.uri.replace("file://", ""))},
                                { name : 'chatmsg', data : JSON.stringify(chatmsg)}]
                              )// listen to upload progress event
                                .uploadProgress((written, total) => {
                                    console.log('uploaded', written / total * 100)
                                    if(written / total == 1){
                                      console.warn('uploaded');
                                      dispatch (update_upload_progress({
                                    message_id: filedata._id,
                                    progress: 100, 
                                  }));  
                                    }
                                   dispatch (update_upload_progress({
                                    message_id: filedata._id,
                                    progress: Math.round(written/total * 100), 
                                  }));
                                })
                               
                                .then((resp) => {
                                  console.log("Me in then of sending.. fine", resp);
                                  dispatch (update_upload_progress({
                                    message_id: filedata._id,
                                    progress: 100, 
                                  }));
                                  if(resp.statusCode == 201){
                                      console.log('File uploaded');
                                      dispatch ({
                                    message_id: filedata._id,
                                    progress: 100, 
                                  });
                                  }

                                })
                                .catch((err) => {
                                  update_upload_progress({
                                    message_id: filedata._id,
                                    progress: -1, 
                                  });
                                  console.log("Me in log of response", err);
                                  console.warn(err);
                                })
             }


  }


  export const fetchChat =  (token, data) => {

   var config = {
      headers: {
          'Authorization': `Bearer ${token}`,      
      },
      
    };
    var data = {
        'uniqueid': data.uniqueid,
        'request_id': data.request_id,
      };
  return (dispatch) => {
    axios.post(`${baseURL}/api/userchats/fetchChat`,data,config)
    .then(res => {
      console.log("Response of fetchChat api", res.data);
    }).catch((err) => {
      
      console.log("Printing the err", err)});   
  };
};





/******* SQLite actions for Chat Sessions and chat message*/
export function callbacksessions(results) {
 var fsessions = []
 console.log('inside callbacksessions')
 var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);
    console.log('row.customerid');
    console.log(JSON.parse(row.customerid));
    console.log('request_id is ------ ***');
    console.log(row.requestid);
    var obj = {
          _id: row._id,
          companyid:row.companyid,
          customerid: JSON.parse(row.customerid),
          customerID:row.customerIDmod,
          departmentid: row.departmentid,
          picktime: row.picktime,
          requesttime:row.requesttime,
          deleteStatus:row.deleteStatus,
          platform:row.platform,
          is_rescheduled:row.is_rescheduled,
          agent_ids: [],//row.agent_ids && row.agent_ids != ''?JSON.parse(row.agent_ids):''],
          messagechannel: [row.messagechannel],
          request_id:row.requestid,


      }
    
    console.log('row');
    fsessions.push(obj);
  }
  console.log('callbacksessions');
  console.log(fsessions);
 
  return {
    type: ActionTypes.FETCH_SESSIONS,
    payload : fsessions,
  };
}

export  function writeSessions(sessions){
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_Sessions_TABLE = "CREATE TABLE CHATSESSIONS ("
                + "_id TEXT PRIMARY KEY,"
                + "companyid TEXT,"
                + "customerIDmod TEXT,"
                + "customerid TEXT,"
                + "departmentid TEXT,"
                + "picktime DATETIME,"
                + "requesttime DATETIME,"
                + "deleteStatus TEXT,"
                + "platform TEXT,"
                + "is_rescheduled TEXT,"
                + "status TEXT,"
                + "agent_ids TEXT,"
                + "messagechannel TEXT,"
                + "requestid TEXT" + ")";

 var rows = []
 console.log('inside writeSessions');
 for(var i=0;i<sessions.length;i++){
  var record = []
  record.push(sessions[i]._id)
  record.push(sessions[i].companyid);
  record.push(sessions[i].customerID);
  record.push(JSON.stringify(sessions[i].customerid));
  record.push(sessions[i].departmentid);
  record.push(sessions[i].picktime?sessions[i].picktime:"null");
  record.push(sessions[i].requesttime);
  record.push(sessions[i].deleteStatus);
  record.push(sessions[i].platform);
  record.push(sessions[i].is_rescheduled);
  record.push(sessions[i].agent_ids.length>0?JSON.stringify(sessions[i].agent_ids[sessions[i].agent_ids.length-1]):'');
  record.push(sessions[i].messagechannel[sessions[i].messagechannel.length-1]);
  console.log('Request_id is ------ ')
  console.log(sessions[i].request_id)
  record.push(sessions[i].request_id);
  rows.push(record);
  // addItem(db,record);

  
 }
 

return (dispatch) => {
    
    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS CHATSESSIONS');
    tx.executeSql(CREATE_Sessions_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO CHATSESSIONS VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',rows[j]);
   
    }
    tx.executeSql('SELECT * FROM CHATSESSIONS', [], (tx,results) => {
          console.log("Query completed");
          console.log("convert query result into desired format");
          console.log(results);
    
          res = results;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
          console.log('res is:')
          console.log(res);
          dispatch(callbacksessions(res));
  }
  );
  
  }

}

export function readSessions(){
   var db = SqliteCalls.getConnection();
   return (dispatch) => {
    
    db.transaction(function(tx) {
   
    tx.executeSql('SELECT * FROM CHATSESSIONS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);

           var newrow = []
          //convert query result into desired format
          for(var j=0;j<results.length;j++){

            var obj = {
                _id: results[i]._id,
                companyid:result[i].companyid,
                customerid:result[i].customeridmod,
                customerID:JSON.parse(result[i].customerid),
                departmentid: result[i].departmentid,
                picktime: result[i].picktime,
                requesttime:result[i].requesttime,
                deleteStatus:result[i].deleteStatus,
                platform:result[i].platform,
                is_rescheduled:result[i].is_rescheduled,
                agent_ids: [result[i].agent_ids != ''?JSON.parse(result[i].agent_ids):''],
                messagechannel: [result[i].messagechannel],
                request_id:result[i].request_id,


            }
            newrow.push(obj);

          }

          res = newrow;
          
        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbacksessions(res));
  }
  );
  
  }

}

