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

export const updatedSelectedFbChats=(fbchatsSelected) => {
   return{
    type: ActionTypes.SHOW_FB_SELECTEDCHATS,
    payload: fbchatsSelected,
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

  return (dispatch) => {
    console.log('calling api');
    axios.get(`${baseURL}/api/fbmessages/`,config).then(res => dispatch(showfbchats(res.data)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);

      });

  };
};


const showfbchats = (fbchats) => {

  return{
    type: ActionTypes.SHOW_FB_CHATS,
    payload: fbchats,
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
  
  if(selectedChat.length > 0){
     var currently_selectedId = selectedChat[selectedChat.length-1].senderid;
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

  return (dispatch) => {
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
    axios.get(`http://api.giphy.com/v1/stickers/search?q=happy&api_key=dc6zaTOxFJmzC`)
    .then(
      res => {
        // console.log(res);
        console.log("New Log");
        var gifs = [];
        for(i = 0; i < res.data.data.length; i++){
            gifs.push(res.data.data[i].images.fixed_height.url);
        }
        console.log(gifs);
        dispatch(updateSticker(gifs));
      }
      ).catch(function (error) {
        console.log('Error occured');
        console.log(error);

      });
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
  var fext = name.split('.');
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