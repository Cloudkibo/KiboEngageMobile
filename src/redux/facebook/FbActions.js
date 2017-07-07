//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var querystring = require('querystring');
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')
import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;
import RNFetchBlob from 'react-native-fetch-blob';
var ReactNative = require('react-native');

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

export const getfbpages = (token) => {
  const config = {
    rejectUnauthorized: false,
    headers: {
        'Authorization': `Bearer ${token}`,
        'content-type' : 'application/x-www-form-urlencoded'
    },
  };

  return (dispatch) => {
    console.log('calling api');
    axios.get(`${baseURL}/api/fbpages/`, config).then(res => dispatch(showfbpages(res.data)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
      });
  };
};

// create fbpage
export const editPage = (fbpage, token, teams) => {
  const id = fbpage.pageid;
  const config = {
    rejectUnauthorized : false,
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type' : 'application/json'
    },
  };
  const data = {
    "fbpage": fbpage,
    "teamagents": teams,
  }

  return (dispatch) => {
    console.log('calling api');
    axios.put(`${baseURL}/api/fbpages/${id}`, data, config).then(res =>
    {
      dispatch(fbpageEditSuccess(res));
      dispatch(getfbpages(token));
    })
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

const updateFbSessions = (data) => {
  return{
    type: ActionTypes.FB_SESSIONS,
    payload: data,
  };


};

const updateFbSessionsStatus = (data) => {
  return{
    type: ActionTypes.FB_SESSIONS_STATUS,
    payload: data,
  };


};

const showfbpageteams = (teams) => {
  return {
    type: ActionTypes.ADD_FBPAGETEAMS,
    payload: teams,
  };
};

export const fetchfbpageteams = (token) => {
  const config = {
    rejectUnauthorized: false,
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type' : 'application/json',
    },
  };

  return (dispatch) => {
    axios.get(`${baseURL}/api/fbpageteams/`, config).then(res => dispatch(showfbpageteams(res.data)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
      });
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

export const updatedSelectedFbChats=(fbchatsSelected,fbCustomerSelected) => {
   return{
    type: ActionTypes.SHOW_FB_SELECTEDCHATS,
    payload: fbchatsSelected,
    fbCustomerSelected:fbCustomerSelected,
  };

}

const showfbcustomers = (fbCustomers) => {
  console.log(fbCustomers);
  return{
    type: ActionTypes.SHOW_FB_CUSTOMERS,
    payload: fbCustomers,
  };


};


export const getfbChats=(token) => {
    var token = token;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/x-www-form-urlencoded'
            },

          };

/*  return (dispatch) => {
    console.log('calling api');
    axios.get(`${baseURL}/api/fbmessages/`,config).then(res => dispatch(showfbchats(res.data)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);

      });

  };
};*/


 return (dispatch) => {
    axios.get(`${baseURL}/api/fbmessages/`,config)
    .then((res) => res).then(res => dispatch(writeFBChats(res.data)))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
          dispatch(readFBChats());
        }
       });

  };
};


const showfbchats = (fbchats) => {

  return{
    type: ActionTypes.SHOW_FB_CHATS,
    payload: fbchats,
  };


};

export const resetFbStatus = () => {
  console.log("Reseting facebook chat status");
  return{
    type: ActionTypes.RESET_FB_CHATS,
  };


};

export const updateFbSessionsAssignedStatus = (sessions) => {

  return{
    type: ActionTypes.UPDATE_FB_CHAT_ASSIGNED_STATUS,
    payload: sessions,
  };


};

export const getfbChatsUpdate=(token,selectedChat) => {
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
    axios.get(`${baseURL}/api/fbmessages/`,config).then((res) =>{

     console.log("THis is the chat received");
     console.log(res.data);
     dispatch(showfbchatsupdated(res.data,selectedChat));

    })
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);

      });

  };
};
const showfbchatsupdated = (fbchats,selectedChat) => {
  console.log('get fbchats selected');
  if(selectedChat){
     var currently_selectedId = selectedChat.user_id.user_id;
     var selected = fbchats.filter((c)=>c.senderid == currently_selectedId || c.recipientid == currently_selectedId).reverse();
     console.log("Found a selected chat");
     return{ type: ActionTypes.SHOW_FB_CHATS_UPDATED,
      payload: fbchats,
      fbchatSelected:selected,
    }
  }
  else{
    console.log("Cant find a selected chat");
  return{
    type: ActionTypes.SHOW_FB_CHATS_UPDATED,
    payload: fbchats,
    fbchatSelected:[],
  };

}


};



//send message to customer
export function getfbchatfromAgent(chat){
 var config = {
      rejectUnauthorized : false,
      headers: {
            'Content-Type': 'application/json',
            },

          };

 return (dispatch) => {
    axios.post(`${baseURLKiboEngage}/api/sendfbchat`,chat,config).then(res => dispatch(fbchatmessageSent(res)))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);

      });

  };
};

export function fbchatmessageSent(res){
  console.log(res);
    return {
    type: ActionTypes.FBCHAT_SENT_TO_AGENT,
    payload : 'success',
  //  customerid,

  };
};

export function showfbpages(res){
    return {
    type: ActionTypes.ADD_FB_PAGES,
    payload : res,

  };
};

export function updateAssignAgentStatus(data){
      return {
    type: ActionTypes.AGENT_ASSIGN_STATUS,
    payload : data.status,

  };
}

export function updateStateResolve(data){
      return {
    type: ActionTypes.UPDATE_STATE_RESOLVE,
    payload : data,

  };
}


export const uploadFbChatfile =(filedata,chatmsg)=>{
     return (dispatch) => {

                RNFetchBlob.fetch('POST', `${baseURLKiboEngage}/api/uploadchatfilefb/`, {

                                'Content-Type' : 'multipart/form-data',
                              }, [
                                // element with property `filename` will be transformed into `file` in form data
                                { name : 'file', type: filedata.type,filename : filedata.name, data: filedata.data},
                                { name : 'chatmsg', data : JSON.stringify(chatmsg)},

                              ])// listen to upload progress event
                                .uploadProgress((written, total) => {
                                    console.warn('uploaded', written / total)
                                })

                                .then((resp) => {
                                   if(resp.statusCode == 200){
                                      console.log('File uploaded')
                                  }
                                })
                                .catch((err) => {
                                  console.warn(err);
                                })
             }


  }



export const uploadFbChatDocfile = (filedata,chatmsg)=>{
     console.log("Asking for permission", filedata);
     return (dispatch) => {
                dispatch (update_upload_progress({
                                    message_id: filedata._id,
                                    progress: 1,
                                  }));
                RNFetchBlob.fetch('POST', `${baseURLKiboEngage}/api/uploadchatfilefb/`, {

                                'Content-Type' : 'multipart/form-data',
                              }, [
                                // element with property `filename` will be transformed into `file` in form data
                                { name : 'file', type: filedata.type,filename : filedata.name, data: RNFetchBlob.wrap(filedata.uri.replace("file://", ""))},
                                { name : 'chatmsg', data : JSON.stringify(chatmsg)},

                              ])// listen to upload progress event
                                .uploadProgress((written, total) => {
                                    console.log('uploaded', written / total)
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
                                  console.log("File Uploaded", resp);
                                     dispatch (update_upload_progress({
                                    message_id: filedata._id,
                                    progress: 100,
                                  }));
                                  if(resp.statusCode == 200){

                                      console.log('File uploaded')
                                  }

                                })
                                .catch((err) => {
                                  dispatch (update_upload_progress({
                                    message_id: filedata._id,
                                    progress: -1,
                                  }));
                                  console.warn(err);
                                })
             }


  }

// Fetch Chat from facebook
export const fetchChat=(token, request_id) => {
    var token = token;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            },

          };
      var data = {
        uniqueid: request_id,
      };

  return (dispatch) => {
    console.log('calling api');
    axios.post(`${baseURL}/api/userchats/fetchChat`,data,config).then(res => {
      console.log("Chat fetch from facebook");
      console.log(res);
    })
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        // dispatch(fbpageCreateFail());
      });

  };
};


export const fetchChatSessions=(token) => {
    var token = token;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            },

          };

  /*return (dispatch) => {
    axios.get(`${baseURL}/api/fbsessions/`,config).then(res => {
      console.log("Chat session from facebook", res);
      dispatch(updateFbSessions(res.data));
    })
      .catch(function (error) {
        console.log('Error occured, cannot fetch fb chat sessions');
        console.log(error);

      });

  };
};
*/


return (dispatch) => {
    axios.get(`${baseURL}/api/fbsessions/`,config)
    .then((res) => res).then(res => dispatch(writeFBSessions(res.data)))
    .catch(function (error) {
        console.log('Error occured');
        console.log(error);
        if(error = 'Network Error')
        {
          //Alert.alert('You are not connected with Internet');
          dispatch(readFBSessions());
        }
       });

  };
};



export const resolveChatSessions=(token, data, id) => {
    var token = token;
    var config = {
      headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
            },

          };


  return (dispatch) => {
    axios.post(`${baseURLKiboEngage}/api/resolvechatsessionfb`,data, config).then(res => {
      console.log("Facebook chat session was marked resolved", res);
      dispatch(updateAssignAgentStatus({status: "Marked Resolved"}));
      dispatch(updateStateResolve("resolved"));
      dispatch(updateFbSessionsStatus({_id: id, status: 'resolved'}));
    })
      .catch(function (error) {
        console.log('Error occured, cannot mark chat session resolved');
        console.log(error);
        dispatch(updateAssignAgentStatus({status: "Failed to marked resolved"}));

      });

  };
};


export const assignChatSession=(token, data, id) => {
    var token = token;
    var config = {
      headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
            },

          };

  return (dispatch) => {
    axios.post(`${baseURLKiboEngage}/api/assignToAgentFB`,data, config).then(res => {
      console.log("Facebook chat session was assigned", res);
      if(data.type == 'agent'){
      dispatch(updateAssignAgentStatus({status: 'Agent Assigned'}));
      }else{
        dispatch(updateAssignAgentStatus({status: 'Team Assigned'}));
      }
      dispatch(updateStateResolve("assigned"));
      dispatch(updateFbSessionsStatus({_id: id, status: 'assigned'}));
    })
      .catch(function (error) {
        console.log('Error occured, cannot assign chat session');
        console.log(error);
        if(data.type == 'agent'){
          dispatch(updateAssignAgentStatus({status: 'Failed cannot assign agent'}));
        }else{
          dispatch(updateAssignAgentStatus({status: 'Failed cannot assign team'}));
        }

      });

  };
};



export function emojiToggle(val){
    return {
    type: ActionTypes.EMOJI_VISIBLE,
    payload : val,
  //  customerid,

  };
};

export function gifToggle(val){
    return {
    type: ActionTypes.GIF_VISIBLE,
    payload : val,
  //  customerid,

  };
};
export function stickerToggle(val){
    return {
    type: ActionTypes.STICKER_VISIBLE,
    payload : val,
  //  customerid,

  };
};

export function updateGif(val){
    return {
    type: ActionTypes.GIF_UPDATE,
    payload : val,
  //  customerid,

  };
};

export function updateSticker(val){
    return {
    type: ActionTypes.STICKER_UPDATE,
    payload : val,
  //  customerid,

  };
};

export function fetchGif(){

  return (dispatch) => {
    axios.get(`http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC&limit=10`)
    .then(
      res => {
        // console.log(res);
        console.log("New Log");
        var gifs = [];
        for(i = 0; i < res.data.data.length; i++){
            gifs.push(res.data.data[i].images.fixed_height.url);
        }
        console.log(gifs);
        dispatch(updateGif(gifs));
      }
      ).catch(function (error) {
        console.log('Error occured');
        console.log(error);

      });
  };
};

export function fetchSticker(){

  return (dispatch) => {
    // axios.get(`http://api.giphy.com/v1/stickers/search?q=pusheen-the-cat&api_key=dc6zaTOxFJmzC`)
    // .then(
    //   res => {
    //     // console.log(res);
    //     console.log("New Log");
    //     var gifs = ['https://s-media-cache-ak0.pinimg.com/originals/43/fb/5e/43fb5e66257b295df39dc803bcd7236b.jpg'];
    //     // for(i = 0; i < res.data.data.length; i++){
    //     //     gifs.push(res.data.data[i].images.fixed_height.url);
    //     // }
    //     console.log(gifs);
    //     dispatch(updateSticker(gifs));
    //   }
    //   ).catch(function (error) {
    //     console.log('Error occured');
    //     console.log(error);

    //   });

        console.log("New Log");
        var gifs = ['https://s-media-cache-ak0.pinimg.com/originals/43/fb/5e/43fb5e66257b295df39dc803bcd7236b.jpg',
        'https://s-media-cache-ak0.pinimg.com/originals/ea/06/94/ea0694cbcbc97a7093e862c51179938f.png',
        'https://cdn1.tnwcdn.com/wp-content/blogs.dir/1/files/2016/03/tumblr_inline_o4t4uatJoR1qbp58u_250.png',
        'https://s-media-cache-ak0.pinimg.com/736x/b4/91/da/b491da3802228bac01e95d652c8da56c--followers-emoticon.jpg',
        'https://s-media-cache-ak0.pinimg.com/originals/2d/03/4d/2d034d5551608094d83ba060883473f2.jpg',
        'https://s-media-cache-ak0.pinimg.com/originals/9c/97/b8/9c97b8603e218c81e23a1b41589baa83.png',
        'https://s-media-cache-ak0.pinimg.com/236x/bc/62/ac/bc62ac65ecb74c0bd6569d09743ceab9--emoji-emoticons-french-bulldogs.jpg',
        'http://123emoji.com/wp-content/uploads/2016/04/22.png',
        'http://123emoji.com/wp-content/uploads/2016/04/8.png'];
        // for(i = 0; i < res.data.data.length; i++){
        //     gifs.push(res.data.data[i].images.fixed_height.url);
        // }
        console.log(gifs);
        dispatch(updateSticker(gifs));
  };
};


async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        'title': 'KiboEngage External Storage Permission',
        'message': 'Cool Photo App needs access to your external storage ' +
                   'so you can upload files.'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera")
    } else {
      console.log("Camera permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

export function downloadFile(url_file, name_file){
  let dirs = RNFetchBlob.fs.dirs;
  var fext = name_file.split('.');
  RNFetchBlob.fs.exists(dirs.DocumentDir + '/' + name)
  .then((exist) => {
      console.log(`file ${exist ? '' : 'not'} exists`)
      if(exist == true){
            RNFetchBlob.ios.openDocument(dirs.DocumentDir + '/' + name); // results in path/to/file.jpg

      }
      else{
        RNFetchBlob
          .config({
                fileCache : true,
                trusty : true,
                addAndroidDownloads : {
                    useDownloadManager : true, // <-- this is the only thing required
                    // Optional, but recommended since android DownloadManager will fail when
                    // the url does not contains a file extension, by default the mime type will be text/plain
                    description : 'File downloaded by download manager.',
                    mediaScannable : true,
                    mime : 'application/octet-stream',
                },
                 appendExt: fext[fext.length-1], // only append an extension if the res.path() does not return one
                 path : dirs.DocumentDir + '/' + name
            })
          .fetch('GET', url_file, {
            //some headers
          })
          // listen to download progress event
            .progress((received, total) => {
                console.log('progress', received / total)
            })
          .then((res) => {
                        console.log(res.path());
                        if(ReactNative.Platform.OS == 'ios'){
                             RNFetchBlob.ios.openDocument(res.path()); // results in path/to/file.jpg
                            //dispatch(filecomplete());
                        }


          })
      }
  })

 return{
    type: ActionTypes.DOWNLOAD_FILE,
    payload: 'File Downloaded Successfully'
  };

}

export function filecomplete(){
  return{
    type: ActionTypes.DOWNLOAD_FILE,
    payload: 'File Downloaded Successfully'
  };
}

export function update_upload_progress(data) {
  return {
    type: ActionTypes.UPLOAD_PROGRESS_FB,
    payload : data,
  };
}

export function setCurrentSession(val){
    return {
    type: ActionTypes.CURRENT_SESSION,
    payload : val,
  //  customerid,

  };
};



/******* sqlite tables for Facebook ****/

export function callbackfbsessions(results) {
 var fsessions = []
 console.log('inside callbackfbsessions')
 var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);

    var obj = {
          _id: row._id,
          companyid:row.companyid,
          pageid: JSON.parse(row.pageid),
          picktime:row.picktime,
          requesttime:row.requesttime,
          user_id:JSON.parse(row.user_id),
          deleteStatus: row.deleteStatus,
          status:row.status,
          agent_ids: [row.agent_ids && row.agent_ids != ''?JSON.parse(row.agent_ids):''],

      }

    console.log('row');
    fsessions.push(obj);
  }
  console.log('callbacksessions');
  console.log(fsessions);

  return{
    type: ActionTypes.FB_SESSIONS,
    payload: fsessions,
  };
}

export  function writeFBSessions(sessions){
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_Sessions_TABLE = "CREATE TABLE FBCHATSESSIONS ("
                + "_id TEXT PRIMARY KEY,"
                + "companyid TEXT,"
                + "pageid TEXT,"
                + "user_id TEXT,"
                + "picktime DATETIME,"
                + "requesttime DATETIME,"
                + "deleteStatus TEXT,"
                + "status TEXT,"
                + "agent_ids TEXT"
                + ")";

 var rows = []
 console.log('inside fbwriteSessions');
 for(var i=0;i<sessions.length;i++){
  var record = []
  record.push(sessions[i]._id)
  record.push(sessions[i].companyid);
  record.push(JSON.stringify(sessions[i].pageid));
  record.push(JSON.stringify(sessions[i].user_id));
  record.push(sessions[i].picktime?sessions[i].picktime:"null");
  record.push(sessions[i].requesttime);
  record.push(sessions[i].deleteStatus);
  record.push(sessions[i].status);
  record.push(sessions[i].agent_ids.length>0?JSON.stringify(sessions[i].agent_ids[sessions[i].agent_ids.length-1]):'');

  rows.push(record);
  // addItem(db,record);


 }


return (dispatch) => {

    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS FBCHATSESSIONS');
    tx.executeSql(CREATE_Sessions_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO FBCHATSESSIONS VALUES (?,?,?,?,?,?,?,?,?)',rows[j]);

    }
    tx.executeSql('SELECT * FROM FBCHATSESSIONS', [], (tx,results) => {
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
          dispatch(callbackfbsessions(res));
  }
  );

  }

}

const fbpageDeleteSuccess = (res) => {
  // console.log('group deleted');
  //Actions.main();
  return{
    type: ActionTypes.DELETE_FBPAGE_SUCCESS,
    payload: res
  };


};

const fbpageDeleteFail = (res) => {
  // console.log('group deleted fail');
  //Actions.main();
  return{
    type: ActionTypes.DELETE_FBPAGE_FAIL,
    payload: res
  };


};

// delete group
export const deletefbpage = (page) => {
    var token = page.token;
    var id =  page.id;
    var config = {
      rejectUnauthorized : false,
      headers: {
            'Authorization': `Bearer ${token}`,
            'content-type' : 'application/x-www-form-urlencoded'
            },

          };
  return (dispatch) => {
  //  console.log('calling api');
    axios.delete(`${baseURL}/api/fbpages/${id}`,config).then(res =>
    {
      dispatch(fbpageDeleteSuccess(res));
      dispatch(getfbpages(token));

    })
      .catch(function (error) {
        // console.log('Error occured');
        // console.log(error);
        dispatch(fbpageDeleteFail());
      });

  };
};

export function readFBSessions(){
   var db = SqliteCalls.getConnection();
   return (dispatch) => {

    db.transaction(function(tx) {

    tx.executeSql('SELECT * FROM FBCHATSESSIONS', [], (tx,results) => {
          console.log("Query completed");
          console.log(results);
          res = results;

        });
  }
    , function(error) {
             console.log('Transaction ERROR: ' + error.message);
  }, function() {
          console.log('Populated database OK');
           dispatch(callbackfbsessions(res));
  }
  );

  }

}


// Chat Messages


export function callbackfbchats(results) {
 var fchats = []
 console.log('inside callbackfbchats')
 var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let row = results.rows.item(i);

    var obj = {
          _id: row._id,
          senderid:row.senderid,
          recipientid:row.recipientid,
          timestamp:row.timestamp,
          message:JSON.parse(row.message),
          companyid:row.companyid,
      }

    console.log('row');
    fchats.push(obj);
  }
 return{
    type: ActionTypes.SHOW_FB_CHATS,
    payload: fchats,
  };
}

export  function writeFBChats(chats){
  var db = SqliteCalls.getConnection();
   var res = [];
  var CREATE_FBChats_TABLE = "CREATE TABLE FBCHATS ("
                + "_id TEXT PRIMARY KEY,"
                + "senderid TEXT,"
                + "recipientid TEXT,"
                + "timestamp TEXT,"
                + "message TEXT,"
                + "companyid TEXT" + ")";

 var rows = []
 console.log('inside writeFBChats');
 for(var i=0;i<chats.length;i++){
  var record = []
  record.push(chats[i]._id)
  record.push(chats[i].senderid);
  record.push(chats[i].recipientid);
  record.push(chats[i].timestamp);
  record.push(JSON.stringify(chats[i].message));
  record.push(chats[i].companyid);
  rows.push(record);
  // addItem(db,record);


 }


return (dispatch) => {

    db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS FBCHATS');
    tx.executeSql(CREATE_FBChats_TABLE);

    for(var j=0;j<rows.length;j++){
       tx.executeSql('INSERT INTO FBCHATS VALUES (?,?,?,?,?,?)',rows[j]);

    }
    tx.executeSql('SELECT * FROM FBCHATS', [], (tx,results) => {
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
          dispatch(callbackfbchats(res));
  }
  );

  }

}

export function readFBChats(){
   var db = SqliteCalls.getConnection();
   return (dispatch) => {

    db.transaction(function(tx) {

    tx.executeSql('SELECT * FROM FBCHATS', [], (tx,results) => {
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
           dispatch(callbackfbchats(res));
  }
  );

  }

}
