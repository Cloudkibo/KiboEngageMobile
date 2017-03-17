//import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import * as ActionTypes from '../types';
var querystring = require('querystring');
import SqliteCalls from '../../services/SqliteCalls';
var SQLite = require('react-native-sqlite-storage')
import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;




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
    axios.get(`${baseURL}/api/fbmessages/`,config).then(res => dispatch(showfbchatsupdated(res.data,selectedChat)))
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
  
     return{ type: ActionTypes.SHOW_FB_CHATS_UPDATED,
      payload: fbchats,
      fbchatSelected:selected,
    }
  }
  else{
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


export const uploadFbChatfile =(fileData,token)=>{
  console.log(fileData);
  
  /*const config = {
    rejectUnauthorized: false,
    headers: {
        'Authorization': token,
        'content-type': 'multipart/form-data'
        
    },
  };

  return (dispatch) => {
    console.log('calling api');
    axios.post(`${baseURLKiboEngage}/api/uploadchatfilefb/`, fileData,config).then(res => dispatch(fbchatmessageSent(res.data)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
      });
  };*/

/*return (dispatch) => {
  fetch(`${baseURLKiboEngage}/api/uploadchatfilefb/`, config
    ).then(res => dispatch(fbchatmessageSent(res)))
      .catch(function (error) {
        console.log('Error occured');
        console.log(error);
      });
  };*/


/*return (dispatch) => {
  fetch(`${baseURLKiboEngage}/api/uploadchatfilefb/`,{
  method: 'post',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': token,
  },
  body: fileData
  }).then(response => {
    console.log("image uploaded")
    console.log(response)
    dispatch(fbchatmessageSent(response))
  }).catch(err => {
    console.log(err)
  })  
  }*/

return (dispatch) => {
          var request = new XMLHttpRequest();
          request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
              return;
            }

            if (request.status === 200) {
              console.log('success', request.responseText);
            } else {
              console.log(request.status);
              console.warn('error');
            }
          };

            request.open('POST', `${baseURLKiboEngage}/api/uploadchatfilefb/` );
          
            request.send(fileData);
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


export function emojiToggle(val){
    return {
    type: ActionTypes.EMOJI_VISIBLE,
    payload : val,
  //  customerid,

  };
};