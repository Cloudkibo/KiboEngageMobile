import axios from 'axios';
import RNFetchBlob from 'react-native-fetch-blob';
import SqliteCalls from '../../services/SqliteCalls';
import * as ActionTypes from '../types';
import * as Config from '../config';

const baseURL = Config.baseURLKiboSupport;
const baseURLKiboEngage = Config.baseURLKiboEngage;
const querystring = require('querystring');
const ReactNative = require('react-native');
const SQLite = require('react-native-sqlite-storage')

export function showChats(data) {
  return {
    type: ActionTypes.FETCH_CHATS,
    payload: data,
  };
}

export function showSessions(data) {

  return {
    type: ActionTypes.FETCH_SESSIONS,
    payload: data,
  };
}

export function updateChannelInfo(data, singleChat) {
  return {
    type: ActionTypes.UPDATE_CHANNEL_INFO,
    payload: {
      sessions: data,
      currentSession: singleChat,
    },
  };
}

export const sessionsFetch = (token) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  return (dispatch) => {
    axios.get(`${baseURL}/api/visitorcalls/kiboengagesessions`, config)
    .then((res) => res).then(res =>
     dispatch(writeSessions(res.data.filter((s) => s.platform == "mobile")))
 )
    .catch(function (error) {
      console.log('Error occured');
      console.log(error);
      dispatch(readSessions());
    });
  };
};

const showUnreadCount = (res) => {
  console.log(res);
  return {
    type: ActionTypes.ADD_UNREAD_COUNT,
    payload: res,
  };
};

export const getunreadsessionscount = (token, agentid) => {
  const config = {
    rejectUnauthorized: false,
    headers: {
        'Authorization': `Bearer ${token}`,
        'content-type' : 'application/json'
    },
  };
  const data = {
    "agent_id": agentid,
  };

  return (dispatch) => {
    console.log('calling api');
    axios.post(`${baseURL}/api/readstatus/getunreadsessionscount`, data, config).then(res => dispatch(showUnreadCount(res.data)))
      .catch(function (error) {
        console.log('Error occured in getting unread count');
        console.log(error);
      });
  };
};

export const deleteunreadcountforAgent = (token, details) => {
  const config = {
    rejectUnauthorized: false,
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type' : 'application/json'
    },
  };
  const data = {
    "agent_id": details.agent_id,
    "request_id": details.request_id,
  };

  return (dispatch) => {
    console.log('calling api');
    axios.post(`${baseURL}/api/readstatus/deleteforagent`, data, config).then(res => {
      console.log('Messages seen by agent');
      console.log(res);
      dispatch(getunreadsessionscount(token, details.agent_id));
    })
      .catch(function (error) {
        console.log('Error occured in delete unread count for agent');
        console.log(error);
      });
  };
};

export const deleteunreadcountResoleSession = (token, requestid, agent_id) => {
  const config = {
    rejectUnauthorized: false,
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
  };
  const data = {
    "request_id": requestid,
  };

  return (dispatch) => {
    console.log('calling api');
    axios.post(`${baseURL}/api/readstatus/deleteforsession`, data, config).then(res => {
      console.log('Unseen messages records for resolved session deleted.');
      console.log(res);
      dispatch(getunreadsessionscount(token, agent_id));
    })
      .catch(function (error) {
        console.log('Error occured in delete unread count for resolved session');
        console.log(error);
      });
  };
};

export const getAllSessions = (token, companyid) => {
  const config = {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
  };
  const data = {
    "companyid": companyid
  };

  console.log('inside get all session fetch');
  return (dispatch) => {
    console.log("Calling api for get all")
    axios.post(`${baseURLKiboEngage}/api/getallsessions`, data, config)
    .then(res =>{
      console.log('Get All session response', res);
      dispatch(writeSessions(res.data));
    }
 )
    .catch(function (error) {
      console.log('Error Get All');
      console.log(error);
      dispatch(readSessions());
    });
  };
};

export const chatsFetch = (token) => {
  console.log('chats fetch called');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  return (dispatch) => {
    axios.get(`${baseURL}/api/userchats/`, config)
    .then((res) => res).then(res =>
     dispatch(writeChats(res.data))
    )
    .catch(function (error) {
      console.log('Error occured');
      console.log(error);
      dispatch(readChats());
    });
  };
};

export function singleChats(data) {
  return {
    type: ActionTypes.SINGLE_CHATS,
    payload: data,
  };
}

export function singleChatFetch(data) {
  return {
    type: ActionTypes.SINGLE_CHAT_FETCH,
    payload: data,
  };
}

export function singleSessionFetch(data) {
  return {
    type: ActionTypes.SINGLE_SESSION_FETCH,
    payload: data,
  };
}

export const fetchSingleChat = (token, chat) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
  };
  const data = {
    "uniqueid": chat.uniqueid,
    "request_id": chat.request_id,
  };

  return (dispatch) => {
    axios.post(`${baseURL}/api/userchats/fetchchat`, data, config)
    .then((res) => res).then(res => dispatch(singleChatFetch(res.data)))
    .catch(function (error) {
      console.log('Error occured');
      console.log(error);
    });
  };
};

export const fetchSingleSession = (token, chat) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
  };
  const data = {
    "request_id": chat.request_id,
  };

  return (dispatch) => {
    axios.post(`${baseURL}/api/visitorcalls/getSession`, data, config)
    .then((res) => res).then(res => dispatch(singleSessionFetch(res.data)))
    .catch(function (error) {
      console.log('Error occured');
      console.log(error);
    });
  };
};

function orderByDate(arr, dateProp, order = 0) {
  return arr.slice().sort(function (a, b) {
    if (order == 0) {
      return new Date(b['lastmessage'][dateProp]) - new Date(a['lastmessage'][dateProp]);
    } else {
      return new Date(a['lastmessage'][dateProp]) - new Date(b['lastmessage'][dateProp]);
    }
  });
}

function orderByDateFbChats(arr, dateProp) {
  return arr.slice().sort(function (a, b) {
    return new Date(a[dateProp]) - new Date(b[dateProp]);
  });
}

export const appendlastmessage = (sessions, chats) => {
  console.log(sessions);
  const newchats = orderByDateFbChats(chats, 'datetime');
  console.log(newchats);
  let newSessions = [];
  for (let i = 0; i < sessions.length; i++) {
    if (sessions[i].customerid) {
      const selectedchat = newchats.filter((c) => c.from == sessions[i].customerID || c.to == sessions[i].customerID || c.from == sessions[i].customerid.name || c.to == sessions[i].customerid.name);
      const lastmessage = selectedchat[selectedchat.length - 1];
      const newsession = sessions[i];
      if (lastmessage && newsession) {
        newsession.lastmessage = lastmessage;
        newSessions.push(newsession);
      }
    }
  }
  const chatSessions = newSessions.filter((c) => c.status !== 'resolved');
  const sorted = orderByDate(chatSessions, 'datetime');
  console.log(sorted);
  return {
    type: ActionTypes.ADD_LASTMESSAGE_CHAT_SESSION,
    payload: sorted,
  };
}

export const assignAgent = (token, input, session, allsessions, stringvaluestatus) => {
  const config = {
    rejectUnauthorized: false,
    headers: {
      'authorization': token,
      'content-type': 'application/json',
    },
  };
  const configKS = {
    rejectUnauthorized: false,
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
  };
  const data = {
    companyid: input.companyid,
    sessionid: input.requestid,
    agentemail: input.email,
    type: input.type,
    agentAssignment: {
      assignedto: input.agentidTo,
      assignedby: input.agentidBy,
      sessionid: input.requestid,
      companyid: input.companyid,
      datetime: Date.now(),
      type: input.type,
    },
  };

  return (dispatch) => {
    axios.post(`${baseURLKiboEngage}/api/assignToAgent`, data, config)
    .then(() => {
      axios.post(`${baseURL}/api/visitorcalls/pickSession`, session, configKS);
    })
      .then((res) => {
        dispatch(assign_agent_status('Successfully Assigned'));
        dispatch(sessionsFetch(token));
      })
      .catch(function (error) {
        dispatch(assign_agent_status('Error Occurred'));
      });
  };
};

export function assign_agent_update_states(reqid, stringvaluestatus, updatedsessions, agentids) {
  for (let i = 0; i < updatedsessions.length; i++) {
    if (updatedsessions[i].request_id == reqid) {
      updatedsessions[i].status = stringvaluestatus;
      if (agentids) {
        updatedsessions[i].agent_ids.push({ id: agentids, type: stringvaluestatus });
      }
      break;
    }
  }

  return {
    type: ActionTypes.ASSIGN_AGENT_UPDATE_STATUS,
    payload: updatedsessions,
  };
}

export function assign_agent_status(data, chats, requestid) {
  return {
    type: ActionTypes.ASSIGN_AGENT,
    payload: data,
  };
}

export function update_upload_progress(data) {
  return {
    type: ActionTypes.UPLOAD_PROGRESS,
    payload: data,
  };
}

export function updateChat(chat) {
  return {
    type: ActionTypes.UPDATE_CHAT,
    payload: chat,
  };
}

export function addChat(chat) {
  return {
    type: ActionTypes.ADD_CHAT,
    payload: chat,
  };
}

// Send Chat to server
export const sendChat = (token, input) => {
  const config = {
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
      'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
      'kibo-client-id': 'cd89f71715f2014725163952',
      'authorization': `Bearer ${token}`,
    },
  };

  return (dispatch) => {
    axios.post(`${baseURL}/api/userchats/create`, input, config)
      .then((res) => {
        axios.post(`${baseURLKiboEngage}/api/getchatfromagent`, input, config)
        .then((res) => {
          console.log("Chat Message Sent Successfully to get chat from agent");
          console.log(res);
          dispatch(chatsFetch(token));
        })
        .catch(function (error) {
          console.log('Error occured in get chat from agent');
          console.log(error);
        });
      })
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
      });
  };
};

export const resolveChatSession = (token, sessionid, agentid) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
  };

  const data = {
    request_id: sessionid,
  };

  return (dispatch) => {
    axios.post(`${baseURLKiboEngage}/api/resolvechatsession`, data, config)
    .then(res => {
      dispatch(chatsFetch(token));
      dispatch(assign_agent_status('Chat Marked As Resolved'));
      dispatch(deleteunreadcountResoleSession(token, sessionid, agentid));
    }).catch(function (error) {
      dispatch(assign_agent_status('Unable to mark chat as resolved'));
    });
  };
};

export const uploadChatDocfile = (filedata, chatmsg) => {
  return (dispatch) => {
    dispatch(update_upload_progress({
      message_id: filedata._id,
      progress: 1,
    }));
    RNFetchBlob.fetch('POST', `https://kiboengage.kibosupport.com/api/uploadchatfile`, {
      'Content-Type' : 'multipart/form-data' },
      [
        { name: 'file', type: filedata.type, filename: filedata.name, data: RNFetchBlob.wrap(filedata.uri.replace('file://', '')) },
        { name: 'chatmsg', data: JSON.stringify(chatmsg) }
      ]
    )// listen to upload progress event
    .uploadProgress((written, total) => {
      if (written / total == 1) {
        console.warn('uploaded');
        dispatch(update_upload_progress({
          message_id: filedata._id,
          progress: 100,
        }));
      }
      dispatch(update_upload_progress({
        message_id: filedata._id,
        progress: Math.round((written / total) * 100),
      }));
    })
    .then((resp) => {
      dispatch(update_upload_progress({
        message_id: filedata._id,
        progress: 100,
      }));
      if (resp.statusCode == 201) {
        dispatch({
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
      console.warn(err);
    });
  };
};

export const fetchChat = (token, chatData) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  const data = {
    'uniqueid': chatData.uniqueid,
    'request_id': chatData.request_id,
  };
  return (dispatch) => {
    axios.post(`${baseURL}/api/userchats/fetchChat`, data, config)
    .then(res => {
      dispatch(addChat(res.data[0]));
    }).catch((err) => {

    });
  };
};

/******* SQLite actions for Chat Sessions and chat message*/
export function callbacksessions(results) {
  //console.log('callback chat sessions called');
 var fsessions = []
 //console.log('inside callbacksessions')
 var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);
    //console.log('row.customerid');
    //console.log(JSON.parse(row.customerid));
    //console.log('request_id is ------ ***');
    //console.log(row.request_id);
    var obj = {
          _id: row._id,
          companyid:row.companyid,
          customerid: JSON.parse(row.customerid),
          customerID:row.customerIDmod,
          departmentid: row.departmentid,
          picktime: row.picktime,
          requesttime:row.requesttime,
          deleteStatus:row.deleteStatus,
          status:row.status,
          platform:row.platform,
          is_rescheduled:row.is_rescheduled,
          agent_ids: [row.agent_ids && row.agent_ids != ''?JSON.parse(row.agent_ids):''],
          messagechannel: [row.messagechannel],
          request_id:row.request_id,


      }

    //console.log('row');
    fsessions.push(obj);
  }
  //console.log('callbacksessions');
  //console.log(fsessions);

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
                + "customerid TEXT,"
                + "departmentid TEXT,"
                + "picktime DATETIME,"
                + "requesttime DATETIME,"
                + "deleteStatus TEXT,"
                + "platform TEXT,"
                + "status TEXT,"
                + "agent_ids TEXT,"
                + "request_id TEXT,"
                + "messagechannel TEXT,"
                + "customerIDmod TEXT,"
                + "is_rescheduled TEXT"
                + ")";

 var rows = []
 //console.log('inside writeSessions');
 for(var i=0;i<sessions.length;i++){
  var record = []
  record.push(sessions[i]._id)
  record.push(sessions[i].companyid);
  record.push(JSON.stringify(sessions[i].customerid));
  record.push(sessions[i].departmentid);
  record.push(sessions[i].picktime?sessions[i].picktime:"null");
  record.push(sessions[i].requesttime);
  record.push(sessions[i].deleteStatus);
  record.push(sessions[i].platform);
  record.push(sessions[i].status);
  record.push(sessions[i].agent_ids.length>0?JSON.stringify(sessions[i].agent_ids[sessions[i].agent_ids.length-1]):'');
  //console.log('Request_id is ------ ')
  //console.log(sessions[i].request_id)
  record.push(sessions[i].request_id);
  record.push(sessions[i].messagechannel[sessions[i].messagechannel.length-1]);
  record.push(sessions[i].customerID);
  record.push(sessions[i].is_rescheduled);

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
          //console.log("Query completed");
          //console.log("convert query result into desired format");
         // //console.log(results);

          res = results;

        });
  }
    , function(error) {
             //console.log('Transaction ERROR: ' + error.message);
  }, function() {
          //console.log('Populated database OK');
         // //console.log('res is:')
         // //console.log(res);
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
          //console.log("Query completed");
        //  //console.log(results);
          res = results;

        });
  }
    , function(error) {
             //console.log('Transaction ERROR: ' + error.message);
  }, function() {
          //console.log('Populated database OK');
           dispatch(callbacksessions(res));
  }
  );

  }

}


// Chat Messages


export function callbackchats(results) {
 var fsessions = []
 //console.log('inside callbackchats')
 var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);
    //console.log('row.request_id');
    //console.log(row.request_id);
    var obj = {
          _id: row._id,
          to:row.receiver,
          from:row.sender,
          visitoremail:row.visitoremail,
          status:row.status,
          datetime:row.datetime,
          type:row.type,
          uniqueid:row.uniqueid,
          msg:row.msg,
          request_id: row.request_id,
          messagechannel:row.messagechannel,
          companyid:row.companyid,
          is_seen:row.is_seen,
          agentid:JSON.parse(row.agentid),
          agentemail:JSON.parse(row.agentemail)

      }

    //console.log('row');
    fsessions.push(obj);
  }
  //console.log('callbackchats');
  //console.log(fsessions);

  return {
    type: ActionTypes.FETCH_CHATS,
    payload : fsessions,
  };
}

export  function writeChats(chats){
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_Chats_TABLE = "CREATE TABLE CHATS ("
                + "_id TEXT PRIMARY KEY,"
                + "receiver TEXT,"
                + "sender TEXT,"
                + "visitoremail TEXT,"
                + "status TEXT,"
                + "datetime DATETIME,"
                + "type TEXT,"
                + "uniqueid TEXT,"
                + "msg TEXT,"
                + "request_id TEXT,"
                + "messagechannel TEXT,"
                + "companyid TEXT,"
                + "is_seen TEXT,"
                + "agentid TEXT,"
                + "agentemail TEXT" + ")";

 var rows = []
 //console.log('inside writeChats');
 for(var i=0;i<chats.length;i++){
  var record = []
  record.push(chats[i]._id)
  record.push(chats[i].to);
  record.push(chats[i].from);
  record.push(chats[i].visitoremail);
  record.push(chats[i].status);
  record.push(chats[i].datetime);
  record.push(chats[i].type);
  record.push(chats[i].uniqueid);
  record.push(chats[i].msg);
  record.push(chats[i].request_id);
  record.push(chats[i].messagechannel);
  record.push(chats[i].companyid);
  record.push(chats[i].is_seen);
  record.push(JSON.stringify(chats[i].agentid));
  record.push(JSON.stringify(chats[i].agentemail));
  rows.push(record);
 // //console.log(record)
  // addItem(db,record);


 }


return (dispatch) => {

    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS CHATS');
    tx.executeSql(CREATE_Chats_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO CHATS VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',rows[j]);

    }
    tx.executeSql('SELECT * FROM CHATS', [], (tx,results) => {
          //console.log("Query completed");
          //console.log("convert query result into desired format");
         // //console.log(results);

          res = results;

        });
  }
    , function(error) {
             //console.log('Transaction ERROR: ' + error.message);
  }, function() {
          //console.log('Populated database OK');
       //   //console.log('res is:')
         // //console.log(res);
          dispatch(callbackchats(res));
  }
  );

  }

}

export function readChats(){
   var db = SqliteCalls.getConnection();
   return (dispatch) => {

    db.transaction(function(tx) {

    tx.executeSql('SELECT * FROM CHATS', [], (tx,results) => {
          //console.log("Query completed");
          //console.log("convert query result into desired format");
         // //console.log(results);

          res = results;

        });
  }
    , function(error) {
             //console.log('Transaction ERROR: ' + error.message);
  }, function() {
          //console.log('Populated database OK');
           dispatch(callbackchats(res));
  }
  );

  }

}
